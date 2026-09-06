export interface IZone {
    id: string;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateZone {
    name: string;
    code: string;
    description?: string;
}

export interface IUpdateZone {
    name?: string;
    code?: string;
    description?: string;
    isActive?: boolean;
}