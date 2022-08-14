import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

import { MenuType } from '../../../shared/menu';
import { useSozCoreNuiEvent } from '../Nui/hooks/useNuiEvent';
import { MenuSetHealthState } from './MenuSetHealthState';

export const MenuApp: FunctionComponent = () => {
    return (
        <MemoryRouter>
            <MenuRouteControl>
                <Routes>
                    <Route path="/" element={null} />
                    <Route path={`/${MenuType.SetHealthState}`} element={<MenuSetHealthState />} />
                </Routes>
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

    return <>{children}</>;
};
