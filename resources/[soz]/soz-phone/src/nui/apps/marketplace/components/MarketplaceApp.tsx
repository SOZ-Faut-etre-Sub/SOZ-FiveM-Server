import { useApp } from '@os/apps/hooks/useApps';
import { AppWrapper } from '@ui/old_components';
import { AppContent } from '@ui/old_components/AppContent';
import { AppTitle } from '@ui/old_components/AppTitle';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ListingFormContainer } from './form/ListingFormContainer';
import { MarketplaceListContainer } from './MarketplaceList/MarketplaceListContainer';
import { NavigationBar } from './navigation/NavigationBar';

export const MarketplaceApp: React.FC = () => {
    const marketplaceApp = useApp('marketplace');

    return (
        <AppWrapper id="marketplace-app">
            <AppTitle app={marketplaceApp} />
            <AppContent>
                <Routes>
                    <Route path="/marketplace" element={<MarketplaceListContainer />} />
                    <Route path="/marketplace/new" element={<ListingFormContainer />} />
                </Routes>
            </AppContent>
            <NavigationBar />
        </AppWrapper>
    );
};
