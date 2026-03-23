// =============================================================================
// src/nui/components/Phone/apps/ia-legal/IaLegalApp.tsx
// Composant racine de l'app IA Legal — même pattern que TcgApp
// =============================================================================

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { IaLegalChat } from './pages/IaLegalChat';

const IaLegalApp: React.FC = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<IaLegalChat />} />
            </Routes>
        </AppContainer>
    );
};

export default IaLegalApp;
