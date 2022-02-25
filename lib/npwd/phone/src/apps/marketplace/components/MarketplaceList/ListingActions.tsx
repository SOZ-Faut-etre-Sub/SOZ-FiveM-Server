import React from 'react';
import {MarketplaceEvents, MarketplaceListing} from '@typings/marketplace';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {fetchNui} from '../../../../utils/fetchNui';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';
import {ServerPromiseResp} from '@typings/common';
import {useMyPhoneNumber} from '@os/simcard/hooks/useMyPhoneNumber';
import {useCall} from '@os/call/hooks/useCall';
import {Tooltip} from '@ui/components/Tooltip';
import {Button} from '@ui/components/Button';


export const ListingActions: React.FC<MarketplaceListing> = ({children, ...listing}) => {
    const myNumber = useMyPhoneNumber();
    const [t] = useTranslation();
    const history = useHistory();
    const {initializeCall} = useCall();
    const {addAlert} = useSnackbar();

    const handleDeleteListing = () => {
        fetchNui<ServerPromiseResp>(MarketplaceEvents.DELETE_LISTING, {
            id: listing.id,
        }).then((resp) => {
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
        }).then((resp) => {
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
        history.push(`/messages/new?phoneNumber=${listing.number}`);
    };

    return (
        <div>
            <div style={{float: 'left'}}>
                {listing.number !== myNumber && (
                    <>
                        <Tooltip title={t('GENERIC.MESSAGE')}>
                            <Button onClick={handleMessage}>
                                {/*<ChatIcon />*/}
                            </Button>
                        </Tooltip>
                        <Tooltip title={`${t('GENERIC.CALL')}: ${listing.number}`}>
                            <Button onClick={handleCall}>
                                {/*<PhoneIcon  />*/}
                            </Button>
                        </Tooltip>
                    </>
                )}
            </div>

            <div style={{float: 'right'}}>
                {listing.number === myNumber ? (
                    <Tooltip title={t('GENERIC.DELETE')}>
                        <Button onClick={handleDeleteListing}>
                            {/*<DeleteIcon />*/}
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip title={t('GENERIC.REPORT')}>
                        <Button onClick={handleReportListing}>
                            {/*<ReportIcon />*/}
                        </Button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};
