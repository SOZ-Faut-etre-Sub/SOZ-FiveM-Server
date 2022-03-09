import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppContent} from '@ui/components/AppContent';
import {GalleryGrid} from './grid/GalleryGrid';
import {GalleryModal} from './modal/GalleryModal';
import {Route, Switch} from 'react-router-dom';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';
import {AppTitle} from "@ui/components/AppTitle";

const PhotoApp: React.FC = () => (
    <AppWrapper>
        <AppTitle title=" " />
        <AppContent>
            <Switch>
                <React.Suspense fallback={<LoadingSpinner/>}>
                    <Route path="/photo" exact component={GalleryGrid}/>
                    <Route path="/photo/image" exact component={GalleryModal}/>
                </React.Suspense>
            </Switch>
        </AppContent>
    </AppWrapper>
);

export default PhotoApp;
