import { prisma } from "../../lib/prisma";
import { ICreateComplaint, IUpdateComplaint } from "./complaint.interface";

const createComplaint = async (payload: ICreateComplaint, userId: string
) => {
    const { outageId, title, description } = payload;

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

    const result = await prisma.complaint.findMany();

    return result
}

const getComplaintById = async (id: string) => {
    const result = await prisma.complaint.findUnique({
        where: {
            id
        }
    })

    return result
}

const updateComplaint = async (
    id: string,
    payload: IUpdateComplaint
) => {
    const result = await prisma.complaint.update({
        where: {
            id,
        },
        data: {
            ...payload,
            ...(payload.status === "RESOLVED" && {
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
    updateComplaint
};

export default complaintService;