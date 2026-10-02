import express from 'express';
import { 
    loginAdmin, 
    appointmentsAdmin, 
    appointmentCancel, 
    addDoctor, 
    allDoctors, 
    adminDashboard, 
    ordersAdmin, 
    resetPasswordAdmin,
    forgotPasswordAdmin,
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
  updateDoctor,
  getSingleDoctor,
    getUserProfileAdmin,
    getAllOrders,

    
} from '../controllers/adminController.js';

import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);

adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);

adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

adminRouter.get("/admin-dashboard", authAdmin, adminDashboard);
adminRouter.get('/orders', authAdmin, ordersAdmin);
adminRouter.post('/update-order-status', authAdmin, updateOrderStatus);
adminRouter.post('/delete-order', authAdmin, deleteOrder);

adminRouter.post("/forgot-password", forgotPasswordAdmin);
adminRouter.post("/reset-password", resetPasswordAdmin);

adminRouter.get("/comments", authAdmin, getAllCommentsAdmin);
adminRouter.delete("/comment", authAdmin, deleteCommentAdmin);

adminRouter.post("/block-user", authAdmin, blockUser);
adminRouter.post("/unblock-user", authAdmin, unblockUser);

adminRouter.get("/all", getAllOrders);
adminRouter.post("/order-status", authAdmin, updateOrderStatus);
adminRouter.post("/delete-order", authAdmin, deleteOrder);



adminRouter.get("/users", getAllUsersAdmin);
adminRouter.get("/user/:userId", getUserProfileAdmin);
adminRouter.post("/create-user", createUser);
adminRouter.get("/user/:id", getSingleUser);
adminRouter.put("/update-user/:id", updateUser);
adminRouter.get("/doctor/:id", getSingleDoctor);
adminRouter.put("/update-doctor/:id", updateDoctor);



export default adminRouter;