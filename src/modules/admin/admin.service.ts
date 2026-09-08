import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

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

    if (user.id === adminId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You cannot change your own account status"
        );
    }

    if (user.isActive === isActive) {
        throw new AppError(
            httpStatus.CONFLICT,
            isActive
                ? "User is already active"
                : "User is already blocked"
        );
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
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

        await tx.auditLog.create({
            data: {
                adminId,
                action: isActive ? "ACTIVATE_USER" : "BLOCK_USER",
                resource: "USER",
                resourceId: id,
                details: {
                    previousStatus: user.isActive,
                    newStatus: isActive,
                },
            },
        });

        return updatedUser;
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