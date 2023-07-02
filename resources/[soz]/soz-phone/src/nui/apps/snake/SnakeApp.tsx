import { Transition } from '@headlessui/react';
import { AppTitle } from '@ui/components/AppTitle';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import { t } from 'i18next';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { useBackground } from '../../ui/hooks/useBackground';
import { SnakeHome } from './pages/SnakeHome';

export const SnakeApp: React.FC = () => {
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-center duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-center duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <AppTitle title={t('APPS_SNAKE')} isBigHeader={true} />
                    <Routes>
                        <Route index element={<SnakeHome />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
