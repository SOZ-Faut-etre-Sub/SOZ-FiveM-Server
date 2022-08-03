import { useQueryParams } from '@common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { ListingTypeResp, MarketplaceDatabaseLimits, MarketplaceEvents } from '@typings/marketplace';
import { Button } from '@ui/old_components/Button';
import { TextField } from '@ui/old_components/Input';
import qs from 'qs';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { fetchNui } from '../../../../utils/fetchNui';
import { useForm } from '../../hooks/state';

export const ListingForm: React.FC = () => {
    const [t] = useTranslation();
    const { addAlert } = useSnackbar();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    const query = useQueryParams();
    const [formState, setFormState] = useForm();

    const areFieldsFilled = formState.title.trim() !== '' && formState.description.trim() !== '';

    const addListing = () => {
        if (!areFieldsFilled) {
            return addAlert({
                message: t('MARKETPLACE.FEEDBACK.REQUIRED_FIELDS'),
                type: 'error',
            });
        }

        fetchNui<ServerPromiseResp<ListingTypeResp>>(MarketplaceEvents.ADD_LISTING, formState).then(resp => {
            if (resp.status !== 'ok') {
                if (resp.data === ListingTypeResp.DUPLICATE) {
                    return addAlert({
                        message: t('MARKETPLACE.FEEDBACK.DUPLICATE_LISTING'),
                        type: 'error',
                    });
                }

                return addAlert({
                    message: t('MARKETPLACE.FEEDBACK.CREATE_LISTING_FAILED'),
                    type: 'error',
                });
            }

            addAlert({
                message: t('MARKETPLACE.FEEDBACK.CREATE_LISTING_SUCCESS'),
                type: 'success',
            });
            navigate('/marketplace');
            setFormState({
                title: '',
                description: '',
                url: '',
            });
        });
    };

    const handleChooseImage = useCallback(() => {
        navigate(
            `/photo?${qs.stringify({
                referral: encodeURIComponent(pathname + search),
            })}`
        );
    }, [history, pathname, search]);

    const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === MarketplaceDatabaseLimits.title) return;
        setFormState({
            ...formState,
            title: e.currentTarget.value,
        });
    };

    const handleUrlChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === MarketplaceDatabaseLimits.url) return;
        setFormState({
            ...formState,
            url: e.currentTarget.value,
        });
    };

    const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === MarketplaceDatabaseLimits.description) return;
        setFormState({
            ...formState,
            description: e.currentTarget.value,
        });
    };

    useEffect(() => {
        if (!query?.image) return;
        setFormState({
            ...formState,
            url: query.image,
        });
        navigate(deleteQueryFromLocation({ pathname, search }, 'image'), { replace: true });
    }, [query?.image, history, pathname, search, setFormState, formState]);

    return (
        <div>
            <h1>{t('MARKETPLACE.NEW_LISTING')}</h1>
            <TextField
                value={formState.title}
                onChange={handleTitleChange}
                label={t('GENERIC.REQUIRED')}
                placeholder={t('MARKETPLACE.FORM_TITLE')}
                style={{ width: '80%' }}
                size="medium"
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <div>
                <div>{/*<ImageIcon />*/}</div>
                <div>
                    <Button onClick={handleChooseImage}>{t('MARKETPLACE.CHOOSE_IMAGE')}</Button>
                </div>
            </div>
            <TextField
                placeholder={t('MARKETPLACE.FORM_IMAGE')}
                value={formState.url}
                onChange={handleUrlChange}
                style={{ width: '80%' }}
                size="medium"
                variant="outlined"
            />

            <TextField
                onChange={handleDescriptionChange}
                label={t('GENERIC.REQUIRED')}
                value={formState.description}
                placeholder={t('MARKETPLACE.FORM_DESCRIPTION')}
            />
            <Button onClick={addListing} disabled={!areFieldsFilled}>
                {t('MARKETPLACE.POST_LISTING')}
            </Button>
        </div>
    );
};
