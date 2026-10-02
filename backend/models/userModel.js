import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name: { type: String, required: true },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: { type: String, required: true },

    image: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },

    phone: { type: String, default: "000000000" },

    address: {
        type: Object,
        default: { line1: "", line2: "" }
    },

    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },

    isBlocked: {
        type: Boolean,
        default: false
    },

    // ✅ EMAIL VERIFICATION
    isVerified: {
        type: Boolean,
        default: false
    },

    verifyToken: {
        type: String,
        default: ""
    },

    resetToken: {
        type: String,
        default: ""
    },

    resetTokenExpire: {
        type: Date,
        default: null
    }

},
{ timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;