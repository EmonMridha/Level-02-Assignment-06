import z from "zod";

export const verifyPaymentSchema = z.object({
    sessionId: z.string().min(1, "Session ID is required"),
    month: z.string().regex(
        /^\d{4}-(0[1-9]|1[0-2])$/,
        "Month must be in YYYY-MM format"
    ),
});