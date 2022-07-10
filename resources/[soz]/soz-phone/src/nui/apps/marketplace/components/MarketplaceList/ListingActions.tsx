import { useCall } from '@os/call/hooks/useCall';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { MarketplaceEvents, MarketplaceListing } from '@typings/marketplace';
import { Button } from '@ui/old_components/Button';
import { Tooltip } from '@ui/old_components/Tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { fetchNui } from '../../../../utils/fetchNui';

export const ListingActions: React.FC<MarketplaceListing> = ({ ...listing }) => {
    const myNumber = useMyPhoneNumber();
    const [t] = useTranslation();
    const navigate = useNavigate();
    const { initializeCall } = useCall();
    const { addAlert } = useSnackbar();

    const handleDeleteListing = () => {
        fetchNui<ServerPromiseResp>(MarketplaceEvents.DELETE_LISTING, {
            id: listing.id,
        }).then(resp => {
            if (resp.status !== 'ok') {
                return addAlert({
                    message: t('MARKETPLACE.FEEDBACK.DELETE_LISTING_FAILED'),
                    type: 'error',
                });
            }

            addAlert({
                message: t('MARKETPLACE.FEEDBACK.DELETE_LISTING_SUCCESS'),
                type: 'success',
            });
        });
    };

    const handleReportListing = () => {
        fetchNui<ServerPromiseResp>(MarketplaceEvents.REPORT_LISTING, {
            id: listing.id,
        }).then(resp => {
            if (resp.status !== 'ok') {
                return addAlert({
                    message: t('MARKETPLACE.FEEDBACK.REPORT_LISTING_FAILED'),
                    type: 'error',
                });
            }

            addAlert({
                message: t('MARKETPLACE.FEEDBACK.REPORT_LISTING_SUCCESS'),
                type: 'success',
            });
        });
    };

    const handleCall = () => {
        initializeCall(listing.number);
    };

    const handleMessage = () => {
        navigate(`/messages/new?phoneNumber=${listing.number}`);
    };

    return (
        <div>
            <div style={{ float: 'left' }}>
                {listing.number !== myNumber && (
                    <>
                        <Tooltip title={t('GENERIC.MESSAGE')}>
                            <Button onClick={handleMessage}>{/*<ChatIcon />*/}</Button>
                        </Tooltip>
                        <Tooltip title={`${t('GENERIC.CALL')}: ${listing.number}`}>
                            <Button onClick={handleCall}>{/*<PhoneIcon  />*/}</Button>
                        </Tooltip>
                    </>
                )}
            </div>

            <div style={{ float: 'right' }}>
                {listing.number === myNumber ? (
                    <Tooltip title={t('GENERIC.DELETE')}>
                        <Button onClick={handleDeleteListing}>{/*<DeleteIcon />*/}</Button>
                    </Tooltip>
                ) : (
                    <Tooltip title={t('GENERIC.REPORT')}>
                        <Button onClick={handleReportListing}>{/*<ReportIcon />*/}</Button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};
