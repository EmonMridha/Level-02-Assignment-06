import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status"
import { auditLogService } from "./audit.service";

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const result = await auditLogService.getAuditLogs();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Audit logs fetched successfully",
        data: result,
    });
});

export const auditLogController = {
    getAuditLogs,
};