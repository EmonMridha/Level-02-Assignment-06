import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import { ICreateZone, IUpdateZone } from "./zone.interface"
import httpStatus from 'http-status'

const createZone = async (payload: ICreateZone) => {

    const { name, code, description } = payload

    const result = await prisma.zone.create({
        data: {
            name,
            code,
            description
        }
    })

    return result
}

const getAllZones = async () => {

    const result = await prisma.zone.findMany({
        where: {
            deletedAt: null
        }
    });

    return result;

};

const getZoneById = async (zoneId: string) => {
    const result = await prisma.zone.findUnique({
        where: {
            id: zoneId
        }
    })
    return result;
}

const updateZone = async (id: string, payload: IUpdateZone) => {
    const result = await prisma.zone.update({
        where: { id },
        data: payload,
    });

    return result;
};

// Soft Delete the zone
const deleteZone = async (id: string) => {
    const zone = await prisma.zone.findUnique({
        where: { id },
    });

    if (!zone) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Zone not found"
        );
    }

    const result = await prisma.zone.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });

    return result;
};

export const zoneService = {
    createZone,
    getAllZones,
    getZoneById,
    updateZone,
    deleteZone
}