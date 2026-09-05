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


export const zoneService = {
    createZone
}