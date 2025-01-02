import { FunctionComponent, ReactNode } from 'react';

import { IconComponentProps } from '../../nui/components/Phone/system/phone.types';

export interface IAppConfig {
    id: string;
    nameLocale: string;
    path: string;
    icon: FunctionComponent<IconComponentProps>;
    component: ReactNode;
    requiredItems?: string[];

    // should be removed and be customizable
    home?: boolean;
}
