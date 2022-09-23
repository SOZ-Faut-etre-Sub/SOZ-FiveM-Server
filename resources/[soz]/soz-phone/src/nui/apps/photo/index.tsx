import { Transition } from '@headlessui/react';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useBackground } from '../../ui/hooks/useBackground';
import { GalleryGrid } from './pages/GalleryGrid';
import { GalleryModal } from './pages/GalleryModal';

const PhotoApp: React.FC = () => {
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                className="mt-4 h-full flex flex-col"
                enter="transition-all origin-[80%_10%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[80%_10%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <Routes>
                        <Route index element={<GalleryGrid />} />
                        <Route path="image" element={<GalleryModal />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};

export default PhotoApp;
