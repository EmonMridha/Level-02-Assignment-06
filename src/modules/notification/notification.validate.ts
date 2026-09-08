import { z } from "zod";

export const createNotificationSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    type: z.string().min(1, "Notification type is required"),
    metadata: z.record(z.string(), z.any()).optional(),
});