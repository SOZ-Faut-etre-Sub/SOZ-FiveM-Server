import { FunctionComponent, PropsWithChildren } from 'react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

import { MenuType } from '../../../shared/menu';
import { useSozCoreNuiEvent } from '../Nui/hooks/useNuiEvent';
import { MenuDemo } from './MenuDemo';
import { MenuSetHealthState } from './MenuSetHealthState';

export const MenuApp: FunctionComponent = () => {
    return (
        <MemoryRouter>
            <MenuRouteControl>
                <Route path={`/${MenuType.SetHealthState}/*`} element={<MenuSetHealthState />} />
                <Route path={`/${MenuType.Demo}/*`} element={<MenuDemo />} />
            </MenuRouteControl>
        </MemoryRouter>
    );
};

const MenuRouteControl: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();

    useSozCoreNuiEvent<MenuType | null>('SetMenuType', menutype => {
        navigate(menutype ? `/${menutype}` : '/');
    });

    useSozCoreNuiEvent<never>('CloseMenu', () => {
        navigate('/');
    });

    return <Routes>{children}</Routes>;
};
