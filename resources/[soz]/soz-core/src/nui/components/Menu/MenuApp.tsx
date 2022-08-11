import { FunctionComponent, useState } from 'react';

import { MenuType } from '../../../shared/menu';
import { useNuiEvent } from '../Nui/hooks/useNuiEvent';
import { MenuSetHealthState } from './MenuSetHealthState';

export const MenuApp: FunctionComponent = () => {
    const [currentMenu, setCurrentMenu] = useState<MenuType | null>(null);

    useNuiEvent<MenuType | null>('soz-core', 'setMenuType', menutype => {
        setCurrentMenu(menutype);
    });

    if (currentMenu === MenuType.SetHealthState) {
        return <MenuSetHealthState />;
    }

    return null;
};
