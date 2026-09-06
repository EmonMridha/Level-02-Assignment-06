import { prisma } from "../../lib/prisma"
import { ICreateZone } from "./zone.interface"

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
    const result = await prisma.zone.findMany();

    return result;
}

const getZoneById = async (zoneId: string) => {
    const result = await prisma.zone.findUnique({
        where: {
            id: zoneId
        }
    })
    return result;
}


export const zoneService = {
    createZone,
    getAllZones,
    getZoneById
}