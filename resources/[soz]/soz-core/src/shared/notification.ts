export type BasicNotification = {
    id: string;
    message: string;
    style: NotificationType;
    delay: number;
};

export type AdvancedNotification = BasicNotification & {
    title: string;
    subtitle: string;
    image: string;
};

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

export type TPoliceNotification = BasicNotification & {
    title: string | null;
    policeStyle: NotificationPoliceType;
    hour: string;
    logo: NotificationPoliceLogoType;
    notificationId: number;
};

export type NotificationPoliceType =
    | 'default'
    | 'red-alert'
    | 'robbery'
    | 'vandalism'
    | 'racket'
    | 'shooting'
    | 'explosion'
    | 'auto-theft';

export type NotificationPoliceLogoType = 'lspd' | 'bcso' | 'police';
