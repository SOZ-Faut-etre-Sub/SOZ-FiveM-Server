import { FunctionComponent, ReactNode } from 'react';

import { IconComponentProps } from '../../nui/components/Phone/system/phone.types';

export interface IAppConfig {
    id: string;
    nameLocale: string;
    path: string;
    icon: FunctionComponent<IconComponentProps>;
    component: ReactNode;
    condition?: () => boolean;

    // should be removed and be customizable
    position?: number;
    home?: boolean;
}

export interface NavBarOption {
    path: string;
    icon: FunctionComponent<IconComponentProps>;
    label: string;
}

export interface DynamicIslandData {
    type: 'success' | 'error';
}
