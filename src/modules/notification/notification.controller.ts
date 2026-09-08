import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { notificationService } from "./notification.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from 'http-status'

const getNotification = catchAsync(async (req: Request, res:
    Response) => {

    const result = await notificationService.getNotification();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Complaint updated successfully",
        data: result
    });
})

const markAsRead = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    const result = await notificationService.markAsRead(id as string, userId as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Notification marked as read successfully",
        data: result
    });
})

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const result = await notificationService.markAllAsRead(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All notifications marked as read successfully",
        data: result
    });
});

export const notificationController = {
    getNotification,
    markAsRead,
    markAllAsRead
}