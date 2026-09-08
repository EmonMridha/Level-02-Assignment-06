import { prisma } from "../../lib/prisma";

const getAuditLogs = async () => {
    const result = await prisma.auditLog.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

export const auditLogService = {
    getAuditLogs,
};