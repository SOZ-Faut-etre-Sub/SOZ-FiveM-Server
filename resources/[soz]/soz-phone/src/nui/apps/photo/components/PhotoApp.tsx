import { Transition } from '@headlessui/react';
import { AppWrapper } from '@ui/old_components';
import { AppContent } from '@ui/old_components/AppContent';
import { AppTitle } from '@ui/old_components/AppTitle';
import { LoadingSpinner } from '@ui/old_components/LoadingSpinner';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';

const PhotoApp: React.FC = () => (
    <Transition
        appear={true}
        show={true}
        className="mt-4 h-full flex flex-col"
        enter="transition-all origin-[80%_10%] duration-500"
        enterFrom="scale-[0.0] opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition-all origin-[80%_10%] duration-500"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-[0.0] opacity-0"
    >
        <AppWrapper>
            <AppTitle title=" " />
            <AppContent>
                <Switch>
                    <React.Suspense fallback={<LoadingSpinner />}>
                        <Route path="/photo" exact component={GalleryGrid} />
                        <Route path="/photo/image" exact component={GalleryModal} />
                    </React.Suspense>
                </Switch>
            </AppContent>
        </AppWrapper>
    </Transition>
);

export default PhotoApp;
