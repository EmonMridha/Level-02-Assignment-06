import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError";
import httpStatus from 'http-status'
import { ICreateNotification } from "./notification.interface";

const createNotification = async (payload: ICreateNotification) => {
    const { userId, title, message, type, metadata } = payload;

    const result = await prisma.notification.create({
        data: {
            userId,
            title,
            message,
            type,
            metadata,
        }
    });

    return result;
};

const getNotification = async () => {

    const result = await prisma.notification.findMany();

    return result;
}

const markAsRead = async (id: string, userId: string) => {
    const notification = await prisma.notification.findFirst({
        where: {
            id,
            userId
        }
    });

    if (!notification) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Notification not found"
        );
    }

    const result = await prisma.notification.update({
        where: {
            id
        },
        data: {
            isRead: true
        }
    });

    return result;
};

const markAllAsRead = async (userId: string) => {
    const result = await prisma.notification.updateMany({
        where: {
            userId,
            isRead: false
        },
        data: {
            isRead: true
        }
    });

    if (result.count === 0) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "No unread notifications found"
        );
    }

    return result;
};

export const notificationService = {
    createNotification,
    getNotification,
    markAsRead,
    markAllAsRead

}