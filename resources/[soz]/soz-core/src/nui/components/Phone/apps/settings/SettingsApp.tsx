import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { SettingsHome } from './pages/SettingsHome';
import { SettingsWallpaper } from './pages/SettingsWallpaper';

export const SettingsApp = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<SettingsHome />} />
                <Route path="wallpaper" element={<SettingsWallpaper />} />
            </Routes>
        </AppContainer>
    );
};
