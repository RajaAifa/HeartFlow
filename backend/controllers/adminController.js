import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import orderModel from "../models/OrderModel.js";
import sendEmail from "../sendEmail.js";
import commentModel from "../models/commentModel.js";
import adminModel from "../models/adminModel.js";
import axios from "axios";

 const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dob } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      dob,
    });

    await newUser.save();

    res.json({ success: true, message: "User created", user: newUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



 const getSingleUser = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone, gender, dob, isBlocked } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        gender,
        dob,
        isBlocked,
      },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const getUserProfileAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel
            .findById(userId)
            .select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const appointments = await appointmentModel.find({ userId });
        const orders = await orderModel.find({ userId });
        const comments = await commentModel.find({ userId });

        res.json({
            success: true,
            user,
            stats: {
                appointments: appointments.length,
                orders: orders.length,
                comments: comments.length
            },
            appointments,
            orders,
            comments
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await userModel
            .find({})
            .select("-password") // never expose passwords
            .sort({ createdAt: -1 });

        res.json({ success: true, users });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
 const getSingleDoctor = async (req, res) => {
  const doctor = await doctorModel.findById(req.params.id);
  res.json({ success: true, doctor });
};

  const updateDoctor = async (req, res) => {
  const updated = await doctorModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, doctor: updated });
};



const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



const ordersAdmin = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("userId", "name image address phone");

        res.json({ success: true, orders: orders.reverse() });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


const updateMedicationStock = async (req, res) => {
  try {
    const { id, stock } = req.body;

    const updated = await MedicationModel.findByIdAndUpdate(
      id,
      {
        stock,
        isAvailable: stock > 0
      },
      { new: true }
    );

    res.json({ success: true, medication: updated });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

 const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
import OrderModel from "../models/OrderModel.js";

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await OrderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await OrderModel.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order deleted" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true
        });

        res.json({ success: true, message: "Appointment cancelled" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



const addDoctor = async (req, res) => {
    try {
        const {
            name, email, password,
            speciality, degree, experience,
            about, fees, address
        } = req.body;

        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Weak password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const upload = await cloudinary.uploader.upload(imageFile.path);
        const imageUrl = upload.secure_url;

        const doctor = new doctorModel({
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            image: imageUrl,
            date: Date.now()
        });

        await doctor.save();

        res.json({ success: true, message: "Doctor added" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password");
        res.json({ success: true, doctors });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});
        const orders = await orderModel.find({});

        const dashData = {
            doctors: doctors.length,
            patients: users.length,
            appointments: appointments.length,
            orders: orders.length,
            latestAppointments: appointments.slice(-5).reverse(), // 🔥 ADD THIS
            latestOrders: orders.slice(-5).reverse()
        };

        res.json({ success: true, dashData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


const getAllCommentsAdmin = async (req, res) => {
    try {
        const comments = await commentModel.find().sort({ createdAt: -1 });

        const enriched = await Promise.all(
            comments.map(async (c) => {
                const user = await userModel.findById(c.userId);

                return {
                    ...c._doc,
                    isBlocked: user?.isBlocked || false
                };
            })
        );

        res.json({ success: true, comments: enriched });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const deleteCommentAdmin = async (req, res) => {
    try {
        const { commentId } = req.body;

        await commentModel.findByIdAndDelete(commentId);

        res.json({ success: true, message: "Comment deleted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const blockUser = async (req, res) => {
    try {
        const { userId } = req.body;

        await userModel.findByIdAndUpdate(userId, {
            isBlocked: true
        });

        res.json({ success: true, message: "User blocked" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { userId } = req.body;

        await userModel.findByIdAndUpdate(userId, {
            isBlocked: false
        });

        res.json({ success: true, message: "User unblocked" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


const forgotPasswordAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        if (email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not admin email" });
        }

        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const link = `${process.env.ADMIN_URL || "http://localhost:5174"}/reset-password/admin/${token}`;

        await sendEmail(email, "Admin Reset", `Click: ${link}`);

        res.json({ success: true, message: "Email sent" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const resetPasswordAdmin = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await adminModel.findOneAndUpdate(
            { email: process.env.ADMIN_EMAIL },
            { password: hashedPassword }
        );

        res.json({ success: true, message: "Password updated" });

    } catch (error) {
        res.json({ success: false, message: "Invalid token" });
    }
};


export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    forgotPasswordAdmin,
    resetPasswordAdmin,
    adminDashboard,
    ordersAdmin,
    updateOrderStatus,
    deleteOrder,
    getAllCommentsAdmin,
    deleteCommentAdmin,
    blockUser,
    unblockUser,
      createUser,
  getAllUsersAdmin,
  getSingleUser,
  updateUser,
    getUserProfileAdmin,
    getSingleDoctor,
    updateDoctor,
    getAllOrders,
    updateMedicationStock,
  
    
};