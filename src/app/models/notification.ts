
export enum NotificationType {
    OUTREACH_LOCATION = 'outreach_location'
}

export interface INotificationData {
    type: NotificationType;
    salesforceId: string; // the ID of an entity in salesforce, i.e. an outreach location
}
