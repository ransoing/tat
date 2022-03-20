
export enum AppMode {
    /** An app with reference and volunteer features */
    TAT = 'tat-app',
    /** An app with only reference features and no network features, meant for truck dashboard computers */
    ELD = 'eld-app',
}

export enum BuildTarget {
    /** Building for a native mobile app */
    MOBILE = 'mobile',
    /** Building to host as a website */
    WEB = 'web'
}
