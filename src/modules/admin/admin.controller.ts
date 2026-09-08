import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from 'http-status'


const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const result = await adminService.updateUserStatus(
        id as string,
        isActive
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: isActive
            ? "User activated successfully"
            : "User blocked successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
});

export const adminController = {
    updateUserStatus,
    getAllUsers
};