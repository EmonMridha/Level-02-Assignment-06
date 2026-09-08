import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { verifyPaymentSchema } from "./payment.validation";

const router = Router();

router.post('/checkout', auth('CUSTOMER', 'ADMIN', 'TECHNICIAN'), paymentController.createCheckoutSession)

router.post('/verify', validateRequest(verifyPaymentSchema), auth('CUSTOMER', 'ADMIN', 'TECHNICIAN'), paymentController.verifyPayment)

export const paymentRoutes = router