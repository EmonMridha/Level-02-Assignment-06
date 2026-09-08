import { z } from "zod";

export const updateUserStatusSchema = z.object({
    isActive: z.boolean({
        message: "isActive must be a boolean"
    })
});