import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary';
import sendEmail from "../sendEmail.js";
import commentModel from "../models/commentModel.js";



const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        const existingUser = await userModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let imageURL = "";
        if (imageFile) {
            const uploadRes = await cloudinary.uploader.upload(imageFile.path);
            imageURL = uploadRes.secure_url;
        }

        const verifyToken = jwt.sign(
            { email: email.toLowerCase() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const userData = {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            image: imageURL || "",
            isVerified: false,
            verifyToken
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const verificationLink = `${process.env.BACKEND_URL}/api/user/verify/${verifyToken}`;

        const emailContent = `
            <h2>Verify your account</h2>
            <p>Click below to activate your account:</p>
            <a href="${verificationLink}">Verify Account</a>
        `;

        await sendEmail(user.email, "Verify your account", emailContent);

        res.json({
            success: true,
            message: "Registration successful. Check your email to verify."
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        if (user.isBlocked) {
            return res.json({
                success: false,
                message: "Your account has been blocked by admin"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.json({
                success: false,
                message: "Please verify your email first"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            success: true,
            token,
            message: "Login successful"
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) return res.send("User not found");

        user.isVerified = true;
        user.verifyToken = "";
        await user.save();

        res.send("Email verified successfully");
    } catch (error) {
        res.send("Invalid or expired link");
    }
};





const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        const updateData = { name, phone, dob, gender };
        if (address) updateData.address = JSON.parse(address);

        await userModel.findByIdAndUpdate(userId, updateData);

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            await userModel.findByIdAndUpdate(userId, { image: imageUpload.secure_url });
        }

        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData || !docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    const blockedSlot = await appointmentModel.findOne({
      docId,
      slotDate,
      slotTime,
      type: "blocked"
    });

    if (blockedSlot) {
      return res.json({
        success: false,
        message: "This slot is blocked by doctor"
      });
    }

    const existing = await appointmentModel.findOne({
      docId,
      slotDate,
      slotTime,
      type: "appointment",
      cancelled: false
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Slot already booked"
      });
    }

    const userData = await userModel.findById(userId).select("-password");

    await appointmentModel.create({
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
      type: "appointment"
    });

    res.json({
      success: true,
      message: "Appointment Booked"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true
    });

    res.json({
      success: true,
      message: "Appointment Cancelled"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) return res.json({ success: false, message: "User not found" });

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Password Reset Request",
            `<p>Click to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`
        );

        res.json({ success: true, message: "Password reset link sent to email" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.json({ success: false, message: "Missing data" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(decoded.id, {
            password: hashedPassword
        });

        res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        res.json({ success: false, message: "Invalid or expired token" });
    }
};




const addDoctorComment = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { doctorId, rating, comment } = req.body;

        if (!doctorId || !rating || !comment) {
            return res.json({ success: false, message: "Missing fields" });
        }

        const user = await userModel.findById(userId);

        const newComment = await commentModel.create({
            doctorId,
            userId,
            userName: user.name,
            rating,
            comment
        });

        res.json({ success: true, message: "Comment added", newComment });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getDoctorComments = async (req, res) => {
    try {
        const { docId } = req.params;

        const comments = await commentModel.find({ doctorId: docId })
            .sort({ createdAt: -1 });

        res.json({ success: true, comments });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId, userId } = req.body;

        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.json({ success: false, message: "Comment not found" });
        }

        if (comment.userId !== userId) {
            return res.json({ success: false, message: "Not allowed" });
        }

        await commentModel.findByIdAndDelete(commentId);

        res.json({ success: true, message: "Comment deleted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export {
    loginUser,
    registerUser,
    verifyEmail,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    
    forgotPassword,
    resetPassword,
    addDoctorComment,
    deleteComment,
    getDoctorComments
};