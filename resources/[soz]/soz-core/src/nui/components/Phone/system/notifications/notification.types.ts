import { FunctionComponent } from 'react';

import { IconComponentProps } from '../phone.types';

export interface INotification {
    // tobe checked
    app: string;
    id?: string;
    title: string;
    content?: string;
    icon?: FunctionComponent<IconComponentProps>;
    notificationIcon?: FunctionComponent<IconComponentProps>;
    sound?: boolean;
    cantClose?: boolean;
    keepWhenPhoneClosed?: boolean;
    onClose?: (notification: INotification) => void;
    onClick?: (notification: INotification) => void;
}
