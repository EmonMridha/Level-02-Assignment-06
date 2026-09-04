import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./users.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status"

const createUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await userService.createUser(payload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created successfully",
        data: result
    })
})

export const userController = {
    createUser
}