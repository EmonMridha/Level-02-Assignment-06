import { OutageStatus, OutageType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { ICreateOutage } from "./outage.interface"

const createOutage = async (payload: ICreateOutage, createdById: string) => {
    const { type, title, description, cause, startTime, endTime, duration, priority, zoneId, } = payload;

    const result = await prisma.outage.create({
        data: {
            type,
            title,
            description,
            cause,
            startTime,
            endTime,
            duration,
            priority,
            zoneId,
            createdById, // <- add this
        },
    });

    return result;
};

const getAllOutages = async (
    page: number,
    limit: number,
    status?: OutageStatus,
    type?: OutageType,
    priority?: string,
    zoneId?: string
) => {
    const skip = (page - 1) * limit;

    const where = {
        ...(status && { status }),
        ...(type && { type }),
        ...(priority && { priority }),
        ...(zoneId && { zoneId }),
    };

    const result = await prisma.outage.findMany({
        where,
        skip,
        take: limit,
        include: {
            zone: true,
            createdBy: true,
        },
    });

    return result;
};

export const outageService = {
    createOutage,
    getAllOutages
}