import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateComplaint, IUpdateComplaint } from "./complaint.interface";

const createComplaint = async (
    payload: ICreateComplaint,
    userId: string
) => {
    const { outageId, title, description } = payload;

    // If complaint is related to an outage, verify that the outage exists
    if (outageId) {
        const outage = await prisma.outage.findUnique({
            where: {
                id: outageId,
            },
        });

        if (!outage) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                "Outage not found"
            );
        }
    }

    const result = await prisma.complaint.create({
        data: {
            userId,
            outageId,
            title,
            description,
        },
    });

    return result;
};

const getAllComplaints = async () => {
    const result = await prisma.complaint.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

const getComplaintById = async (id: string) => {
    const result = await prisma.complaint.findUnique({
        where: {
            id,
        },
    });

    if (!result) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Complaint not found"
        );
    }

    return result;
};

const updateComplaint = async (
    id: string,
    payload: IUpdateComplaint
) => {
    const complaint = await prisma.complaint.findUnique({
        where: {
            id,
        },
    });

    if (!complaint) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Complaint not found"
        );
    }

    const result = await prisma.complaint.update({
        where: {
            id,
        },
        data: {
            ...payload,
            ...(payload.status === "RESOLVED" &&
                complaint.status !== "RESOLVED" && {
                    resolvedAt: new Date(),
                }),
        },
    });

    return result;
};

const complaintService = {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaint,
};

export default complaintService;