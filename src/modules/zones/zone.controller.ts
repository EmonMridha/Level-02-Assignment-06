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

const getAllZones = catchAsync(async (req: Request, res: Response) => {
    const result = await zoneService.getAllZones();

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Fetched all zones successfully",
        data: result,
    });
})

const getZoneById = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id; // getting id from url
    const result = await zoneService.getZoneById(id as string)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Zone retrieved successfully",
        data: result,
    });
})

const updateZone = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id;

    const result = await zoneService.updateZone(id as string, payload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Zone updated successfully",
        data: result,
    });
})

const deleteZone = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await zoneService.deleteZone(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Zone deleted successfully",
        data: result,
    });
});



export const zoneController = {
    createZone,
    getAllZones,
    getZoneById,
    updateZone,
    deleteZone
}