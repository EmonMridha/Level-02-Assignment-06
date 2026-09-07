import { ComplaintStatus } from "../../../generated/prisma/enums";

export interface ICreateComplaint {
    outageId?: string;
    title: string;
    description: string;
}

export interface IUpdateComplaint {
    status?: ComplaintStatus;
    resolution?: string;
}