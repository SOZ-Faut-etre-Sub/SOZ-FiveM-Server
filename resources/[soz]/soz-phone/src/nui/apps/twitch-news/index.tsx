import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { useBackground } from '@ui/hooks/useBackground';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import { LoadingSpinner } from '@ui/old_components/LoadingSpinner';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import NewsList from './pages/NewsList';

export const TwitchNewsApp = () => {
    const messages = useApp('twitch-news');
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[10%_20%] duration-500"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[10%_20%] duration-500"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <AppTitle app={messages} />
                    <AppContent>
                        <React.Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                                <Route index element={<NewsList />} />
                            </Routes>
                        </React.Suspense>
                    </AppContent>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
