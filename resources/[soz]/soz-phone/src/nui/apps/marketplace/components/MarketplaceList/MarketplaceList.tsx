import { List } from '@ui/old_components/List';
import React from 'react';

import { useListingValue } from '../../hooks/state';
import { MarketplaceItem } from './MarketplaceItem';

export const MarketplaceList: React.FC = () => {
    const listings = useListingValue();

    return (
        <List>
            {listings.map(listing => (
                <MarketplaceItem key={listing.id} {...listing} />
            ))}
        </List>
    );
};
