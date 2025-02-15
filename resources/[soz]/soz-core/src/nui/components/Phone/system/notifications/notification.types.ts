import { FunctionComponent } from 'react';

import { IconComponentProps } from '../phone.types';

export interface INotification {
    id: string;
    app: string;
    group?: string;
    icon?: FunctionComponent<IconComponentProps>;
    title: string;
    content?: string;
    onClick?: (notification: INotification) => void;

    // tobe checked
    notificationIcon?: FunctionComponent<IconComponentProps>;
    sound?: boolean;
    cantClose?: boolean;
    keepWhenPhoneClosed?: boolean;
    onClose?: (notification: INotification) => void;
}

export type NewNotification = Omit<INotification, 'id'>;
