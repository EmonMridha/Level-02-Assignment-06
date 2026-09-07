import { z } from "zod";

export const createComplaintSchema = z.object({
    outageId: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});