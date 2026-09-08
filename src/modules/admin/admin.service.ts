
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from 'http-status';

const updateUserStatus = async (
    id: string,
    isActive: boolean,
    adminId: string
) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "User not found"
        );
    }

    const result = await prisma.user.update({
        where: { id },
        data: {
            isActive
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            updatedAt: true
        }
    });

    await prisma.auditLog.create({
        data: {
            adminId: adminId,
            action: isActive ? "ACTIVATE_USER" : "BLOCK_USER",
            resource: "USER",
            resourceId: id,
            details: {
                previousStatus: user.isActive,
                newStatus: isActive,
            },
        },
    });

    return result;
};

const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

export const adminService = {
    updateUserStatus,
    getAllUsers
};