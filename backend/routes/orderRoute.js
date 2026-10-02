import express from 'express';
import { placeOrderCash, allOrders, userOrders, cancelOrder } from '../controllers/orderController.js';
import authUser from '../middleware/authUser.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const orderRouter = express.Router();

orderRouter.post('/place', upload.single('prescription'), authUser, placeOrderCash);
orderRouter.get('/list', authAdmin, allOrders);
orderRouter.get('/user-orders', authUser, userOrders);
orderRouter.post('/cancel', authUser, cancelOrder);

export default orderRouter;