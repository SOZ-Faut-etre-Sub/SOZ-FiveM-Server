interface Debug {
    level: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
    enabled: boolean;
}

interface General {
    useDashNumber: boolean;
    toggleKey: string;
    toggleCommand: string;
}

interface NotificationConfig {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'bottom' | 'top';
}

interface BankConfig {
    showNotifications: boolean;
}

interface DatabaseConfig {
    playerTable: string;
    identifierColumn: string;
    identifierType: string;
    useIdentifierPrefix: boolean;
    profileQueries: boolean;
    phoneNumberColumn: string;
}

interface ImageConfig {
    imageEncoding: 'png' | 'jpg' | 'webp';
    returnedDataIndexes: Array<any>;
}

interface PhoneAsItemConfig {
    enabled: boolean;
    exportResource: string;
    exportFunction: string;
}

export interface ResourceConfig {
    database: DatabaseConfig;
    Locale: string;
    PhoneAsItem: PhoneAsItemConfig;
    RunRate: number;
    bank: BankConfig;
    notificationPosition: NotificationConfig;
    general: General;
    debug: Debug;
    images: ImageConfig;
}
