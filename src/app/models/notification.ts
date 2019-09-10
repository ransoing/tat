
export enum NotificationType {
    OUTREACH_LOCATION = 'outreach_location'
}

export interface INotificationData {
    type: NotificationType;
    salesforceId: string;
}
