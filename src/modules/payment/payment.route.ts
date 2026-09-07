import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.post('/checkout', auth('CUSTOMER','ADMIN','OPERATOR'), paymentController.createCheckoutSession)

export const paymentRoutes = router