
export enum NotificationType {
    UNFINISHED_ACTIVITY = 'unfinished_activity'
}

export interface INotificationData {
    type: NotificationType,
    salesforceId: string
}
