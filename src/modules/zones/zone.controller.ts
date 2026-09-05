import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { zoneService } from "./zone.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status"

const createZone = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await zoneService.createZone(payload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User logged out successfully",
        data: result,
    });
})

export const zoneController = {
    createZone
}