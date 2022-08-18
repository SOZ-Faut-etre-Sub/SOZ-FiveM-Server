import { FunctionComponent, PropsWithChildren } from 'react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

import { MenuType } from '../../../shared/nui/menu';
import { useMenuNuiEvent } from '../Nui/hooks/useNuiEvent';
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

    useMenuNuiEvent('SetMenuType', menutype => {
        navigate(menutype ? `/${menutype}` : '/');
    });

    useMenuNuiEvent('CloseMenu', () => {
        navigate('/');
    });

    return <Routes>{children}</Routes>;
};
