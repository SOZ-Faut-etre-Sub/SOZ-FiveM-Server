import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { SettingsAvatar } from './pages/SettingsAvatar';
import { SettingsHome } from './pages/SettingsHome';
import { SettingsWallpaper } from './pages/SettingsWallpaper';

export const SettingsApp = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<SettingsHome />} />
                <Route path="avatar" element={<SettingsAvatar />} />
                <Route path="wallpaper" element={<SettingsWallpaper />} />
            </Routes>
        </AppContainer>
    );
};
