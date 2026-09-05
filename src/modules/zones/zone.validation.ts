import { z } from "zod";

export const createZoneSchema = z.object({
    name: z.string(),
    code: z.string(),
    description: z.string().optional(),
});