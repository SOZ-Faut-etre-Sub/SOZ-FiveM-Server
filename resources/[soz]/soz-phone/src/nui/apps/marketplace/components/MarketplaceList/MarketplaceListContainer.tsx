import { LoadingSpinner } from '@ui/old_components/LoadingSpinner';
import React from 'react';

import { MarketplaceList } from './MarketplaceList';

export const MarketplaceListContainer: React.FC = () => {
    return (
        <React.Suspense fallback={<LoadingSpinner />}>
            <MarketplaceList />
        </React.Suspense>
    );
};
