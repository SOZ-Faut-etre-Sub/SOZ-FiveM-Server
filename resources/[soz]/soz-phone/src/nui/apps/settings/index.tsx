import { Transition } from '@headlessui/react';
import { AppWrapper } from '@ui/components/AppWrapper';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useBackground } from '../../ui/hooks/useBackground';
import { FullPageWithHeader } from '../../ui/layout/FullPageWithHeader';
import { SettingsHome } from './pages/SettingsHome';
import { SettingsWallpaper } from './pages/SettingsWallpaper';

export const SettingsApp = () => {
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                className="h-full flex flex-col"
                enter="transition-all origin-[20%_20%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[20%_20%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <Routes>
                        <Route index element={<SettingsHome />} />
                        <Route path="wallpaper" element={<SettingsWallpaper />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
