import Router from 'express';
import { sendPayment, getPayments } from '../controllers/payment.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router=Router();

// router.route("/sendPayment").post(verifyJWT,sendPayment);
router.route("/sendPayment").post(sendPayment);
router.route("/getPayments").get(getPayments);


export default router;