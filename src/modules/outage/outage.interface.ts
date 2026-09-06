import { OutageStatus, OutageType } from "../../../generated/prisma/enums";

export interface ICreateOutage {
    type: OutageType;
    title: string;
    description?: string;
    cause?: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    priority?: string;
    zoneId: string;
}

export interface IUpdateOutage {
    type?: OutageType;
    title?: string;
    description?: string;
    cause?: string;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    status?: OutageStatus;
    priority?: string;
    zoneId?: string;
}