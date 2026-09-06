import { z } from "zod";
import { OutageType } from "../../../generated/prisma/enums";

export const createOutageSchema = z.object({
    type: z.nativeEnum(OutageType),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    cause: z.string().optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date().optional(),
    duration: z.number().optional(),
    priority: z.string().optional(),
    zoneId: z.string().min(1, "Zone ID is required"),
});

export const updateOutageSchema = z.object({
    type: z.nativeEnum(OutageType).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    cause: z.string().optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    duration: z.number().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    zoneId: z.string().min(1).optional(),
});