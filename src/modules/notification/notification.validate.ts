import { z } from "zod";

export const createNotificationSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    type: z.string().min(1, "Notification type is required"),
    metadata: z.record(z.string(), z.any()).optional(),
});

export const updateNotificationSchema = z.object({
    userId: z.string().min(1, "User ID is required").optional(),
    title: z.string().min(1, "Title is required").optional(),
    message: z.string().min(1, "Message is required").optional(),
    type: z.string().min(1, "Notification type is required").optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});