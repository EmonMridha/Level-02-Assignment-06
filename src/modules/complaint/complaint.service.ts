import { prisma } from "../../lib/prisma";
import { ICreateComplaint } from "./complaint.interface";

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

const complaintService = {
    createComplaint,
    getAllComplaints
};

export default complaintService;