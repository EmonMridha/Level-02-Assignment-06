import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError";
import httpStatus from 'http-status'

const createNotification = async (userId: string, message: string) => {
    const result = await prisma.notification.create({
        data: {
            userId,
            message,
            isRead: false
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

    return result;
};

export const notificationService = {
    createNotification,
    getNotification,
    markAsRead,
    markAllAsRead

}