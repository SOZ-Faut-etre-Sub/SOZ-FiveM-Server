import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { TcgCollection } from './pages/TcgCollection';
import { TcgHome } from './pages/TcgHome';
import { TcgViewer } from './pages/TcgViewer';

const TcgApp: React.FC = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<TcgHome />} />
                <Route path="collection" element={<TcgCollection />} />
                <Route path="view/:userCardId" element={<TcgViewer />} />
            </Routes>
        </AppContainer>
    );
};

export default TcgApp;
