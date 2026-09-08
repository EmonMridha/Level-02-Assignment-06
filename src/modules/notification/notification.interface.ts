export interface ICreateNotification {
    userId: string;
    title: string;
    message: string;
    type: string;
    metadata?: object;
}