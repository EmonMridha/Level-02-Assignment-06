import { OutageType } from "../../../generated/prisma/enums";

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