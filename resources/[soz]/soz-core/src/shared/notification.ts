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
