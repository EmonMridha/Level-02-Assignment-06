import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {

})

export const paymentController = {
    createCheckoutSession
}