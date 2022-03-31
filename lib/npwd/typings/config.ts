interface Debug {
  level: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
  enabled: boolean;
  sentryEnabled: true;
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
  url: string;
  type: string;
  imageEncoding: 'png' | 'jpg' | 'webp';
  contentType: string;
  authorizationPrefix: string;
  useAuthorization: boolean;
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
