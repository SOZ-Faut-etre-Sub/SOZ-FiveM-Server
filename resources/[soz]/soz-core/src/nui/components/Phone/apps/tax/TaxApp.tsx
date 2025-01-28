import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { AboutTax } from './pages/AboutTax';
import { TaxHome } from './pages/TaxHome';
import { TaxPage } from './pages/TaxPage';

export const TaxApp: FunctionComponent = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<TaxHome />} />
                <Route path="tax/:id" element={<TaxPage />} />
                <Route path="about" element={<AboutTax />} />
            </Routes>
        </AppContainer>
    );
};
