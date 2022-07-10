import { MarketplaceListing } from '@typings/marketplace';
import { ListItem } from '@ui/components/ListItem';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { PictureReveal } from '@ui/components/PictureReveal';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ListingActions } from './ListingActions';

export const MarketplaceItem: React.FC<MarketplaceListing> = ({ children, ...listing }) => {
    const [t] = useTranslation();

    return (
        <ListItem>
            <div>
                <div>
                    <div style={{ margin: 10 }}>
                        <div style={{ margin: 5 }}>{listing.name}</div>
                        <div style={{ padding: 5 }}>{listing.title}</div>
                    </div>

                    {listing.url ? (
                        <PictureReveal>
                            <PictureResponsive src={listing.url} alt={`${listing.name}`} />
                        </PictureReveal>
                    ) : (
                        <div style={{ margin: 10 }}>
                            {t('MARKETPLACE.NO_IMAGE')}
                            <span role="img" aria-label="emoji">
                                🙁
                            </span>
                        </div>
                    )}

                    <div>{listing.description}</div>
                    <ListingActions {...listing} />
                </div>
            </div>
        </ListItem>
    );
};
