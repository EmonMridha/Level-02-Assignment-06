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

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await userService.loginUser(payload);
    const { accessToken, refreshToken } = result;
    console.log(accessToken,refreshToken);

    // setting the accessToken in the cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });

    // setting the refreshToken in the cookies
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken,
        },
    });
});

export const userController = {
    createUser,
    loginUser
}