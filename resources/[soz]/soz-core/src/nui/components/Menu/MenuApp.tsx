import { FunctionComponent, useState } from 'react';

import { MenuType } from '../../../shared/menu';
import { useSozCoreNuiEvent } from '../Nui/hooks/useNuiEvent';
import { MenuSetHealthState } from './MenuSetHealthState';

export const MenuApp: FunctionComponent = () => {
    const [currentMenu, setCurrentMenu] = useState<MenuType | null>(MenuType.SetHealthState);

    useSozCoreNuiEvent<MenuType | null>('SetMenuType', menutype => {
        setCurrentMenu(menutype);
    });

    useSozCoreNuiEvent<never>('CloseMenu', () => {
        setCurrentMenu(null);
    });

    if (currentMenu === MenuType.SetHealthState) {
        return <MenuSetHealthState />;
    }

    return null;
};
