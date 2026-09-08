import { z } from "zod";

export const createComplaintSchema = z.object({
    outageId: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});

export const updateComplaintSchema = z.object({
    outageId: z.string().optional(),
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
});