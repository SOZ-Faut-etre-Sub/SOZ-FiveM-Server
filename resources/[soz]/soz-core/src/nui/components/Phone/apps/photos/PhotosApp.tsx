import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { GalleryGrid } from './pages/GalleryGrid';
import { GalleryModal } from './pages/GalleryModal';

export const PhotosApp = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<GalleryGrid />} />
                <Route path="image" element={<GalleryModal />} />
            </Routes>
        </AppContainer>
    );
};
