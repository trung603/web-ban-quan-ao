import express from 'express'
import { allOrders, countOrders, getTotalRevenue, placeOrder, placeOrderStripe, updateStatus, userOrders, verifyStripe, getTotalImportCost  } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'


const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth, allOrders)
orderRouter.post('/status',adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe',authUser, placeOrderStripe)


// User Features
orderRouter.get('/userorders/:userId', authUser, userOrders)

// verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)

orderRouter.get('/count', countOrders)
orderRouter.get('/total-revenue', getTotalRevenue)
// Route lấy tổng giá nhập
orderRouter.get("/total-import-cost", getTotalImportCost);

export default orderRouter;