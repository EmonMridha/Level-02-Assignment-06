import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import complaintService from "./complaint.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from 'http-status'

const createComplaint = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const payload = req.body;
    const result = await complaintService.createComplaint(payload, userId)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Complaint posted successfully",
        data: result,
    });
})

const getAllComplaints = catchAsync(async (req: Request, res: Response) => {

    const result = await complaintService.getAllComplaints()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Complaints fetched successfully",
        data: result,
    });
})

const getComplaintById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await complaintService.getComplaintById(id as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Complaint fetched successfully",
        data: result
    });
})

const updateComplaint = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await complaintService.updateComplaint(id as string, payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Complaint updated successfully",
        data: result
    });
})

export const complaintController = {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaint
}