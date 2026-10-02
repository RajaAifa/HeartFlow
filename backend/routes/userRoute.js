import express from 'express';
import { 
    loginUser, 
    registerUser, 
    getProfile, 
    updateProfile, 
    bookAppointment, 
    listAppointment, 
    cancelAppointment, 
    
    forgotPassword, 
    resetPassword,  
    verifyEmail,
    addDoctorComment,
    getDoctorComments,
    deleteComment    
} from '../controllers/userController.js';

import { 
    placeOrderCash, 
    userOrders, 
    cancelOrder 
    
} from '../controllers/orderController.js'; 

import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';

const userRouter = express.Router();

userRouter.post("/register", upload.single('image'), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/verify/:token", verifyEmail); // The link clicked in the email

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

userRouter.post('/place-order', authUser, placeOrderCash); 
userRouter.get('/orders', authUser, userOrders);           
userRouter.post('/cancel-order', authUser, cancelOrder);   

userRouter.post('/doctor/comment', authUser, addDoctorComment);
userRouter.get('/doctor/comments/:docId', getDoctorComments);
userRouter.delete('/doctor/comment', authUser, deleteComment);


export default userRouter;