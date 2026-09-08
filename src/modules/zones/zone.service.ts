import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateZone, IUpdateZone } from "./zone.interface";

const createZone = async (payload: ICreateZone) => {
    const { name, code, description } = payload;

    const existingZone = await prisma.zone.findFirst({
        where: {
            OR: [
                { name },
                { code },
            ],
        },
    });

    if (existingZone) {
        if (existingZone.name === name) {
            throw new AppError(
                httpStatus.CONFLICT,
                "A zone with this name already exists"
            );
        }

        if (existingZone.code === code) {
            throw new AppError(
                httpStatus.CONFLICT,
                "A zone with this code already exists"
            );
        }
    }

    const result = await prisma.zone.create({
        data: {
            name,
            code,
            description,
        },
    });

    return result;
};

const getAllZones = async () => {
    const result = await prisma.zone.findMany({
        where: {
            deletedAt: null,
        },
    });

    return result;
};

const getZoneById = async (zoneId: string) => {
    const result = await prisma.zone.findFirst({
        where: {
            id: zoneId,
            deletedAt: null,
        },
    });

    if (!result) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Zone not found"
        );
    }

    return result;
};

const updateZone = async (
    id: string,
    payload: IUpdateZone
) => {
    const zone = await prisma.zone.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!zone) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Zone not found or has been deleted"
        );
    }

    const result = await prisma.zone.update({
        where: {
            id,
        },
        data: payload,
    });

    return result;
};

// Soft Delete the zone
const deleteZone = async (id: string) => {
    const zone = await prisma.zone.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!zone) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Zone not found or has already been deleted"
        );
    }

    const result = await prisma.zone.update({
        where: {
            id,
        },
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
    deleteZone,
};