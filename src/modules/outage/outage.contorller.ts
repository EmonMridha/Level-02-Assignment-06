import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { outageService } from "./outage.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from 'http-status'
import { OutageStatus, OutageType } from "../../../generated/prisma/enums";

const createOutage = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await outageService.createOutage(payload, req.user?.userId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Created outage successfully",
        data: result,
    });
})

const getAllOutages = catchAsync(async (req: Request, res: Response) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const sortBy = req.query.sortBy as string || "createdAt";
    const sortOrder = req.query.sortOrder as "asc" | "desc" || "desc";

    const status = req.query.status as OutageStatus | undefined;
    const type = req.query.type as OutageType | undefined;
    const priority = req.query.priority as string | undefined;
    const zoneId = req.query.zoneId as string | undefined;
    const search = req.query.search as string | undefined;


    const result = await outageService.getAllOutages(page,
    limit,
    status,
    type,
    priority,
    zoneId,
    sortBy,
    sortOrder,
    search
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Fetched all outage successfully",
        data: result,
    });
})

export const outageController = {
    createOutage,
    getAllOutages
}