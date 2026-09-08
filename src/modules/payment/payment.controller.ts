import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from 'http-status'

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await paymentService.createCheckOutSession(userId as string)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Checkout completed successfully successfully",
        data: result,
    });

})

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const { sessionId,month} = req.body;
    const { userId } = req.user as { userId: string }
    const result = await paymentService.verifyPayment(userId,sessionId,month)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Payment verified successfully",
        data: result,
    });
});
export const paymentController = {
    createCheckoutSession,
    verifyPayment
}