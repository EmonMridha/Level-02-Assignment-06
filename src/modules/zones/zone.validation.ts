import { z } from "zod";

export const createZoneSchema = z.object({
    name: z.string(),
    code: z.string(),
    description: z.string().optional(),
});

export const updateZoneSchema = z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});
