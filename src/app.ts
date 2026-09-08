import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from 'cors'
import { prisma } from "./lib/prisma";

import { userRoutes } from "./modules/users/user.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { zoneRoutes } from "./modules/zones/zone.route";
import { outageRoutes } from "./modules/outage/outage.route";
import { complaintRoutes } from "./modules/complaint/complaint.route";
import { paymentRoutes } from "./modules/payment/payment.route"; import { notificationRoutes } from "./modules/notification/notification.route";
import { adminRoutes } from "./modules/admin/admin.route";

const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
        console.log("NO user found");
    }

    res.send("Prisma Press Backend is running");
});

app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/zone', zoneRoutes)
app.use('/api/v1/outage', outageRoutes)
app.use('/api/v1/complaint', complaintRoutes)
app.use('/api/v1/payment', paymentRoutes)
app.use('/api/v1/notification', notificationRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use(globalErrorHandler)

export default app;