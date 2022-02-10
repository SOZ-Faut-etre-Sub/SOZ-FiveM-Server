import React, {useCallback, useEffect} from 'react';
import {
    ListingTypeResp,
    MarketplaceDatabaseLimits,
    MarketplaceEvents,
} from '@typings/marketplace';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';
import {useQueryParams} from '@common/hooks/useQueryParams';
import {deleteQueryFromLocation} from '@common/utils/deleteQueryFromLocation';
import {TextField} from '@ui/components/Input';
import {fetchNui} from '../../../../utils/fetchNui';
import {ServerPromiseResp} from '@typings/common';
import {useForm} from '../../hooks/state';
import {Button} from '@ui/components/Button';


export const ListingForm: React.FC = () => {
    const [t] = useTranslation();
    const {addAlert} = useSnackbar();
    const history = useHistory();
    const {pathname, search} = useLocation();
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

        fetchNui<ServerPromiseResp<ListingTypeResp>>(MarketplaceEvents.ADD_LISTING, formState).then(
            (resp) => {
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
                history.push('/marketplace');
                setFormState({
                    title: '',
                    description: '',
                    url: '',
                });
            },
        );
    };

    const handleChooseImage = useCallback(() => {
        history.push(
            `/photo?${qs.stringify({
                referal: encodeURIComponent(pathname + search),
            })}`,
        );
    }, [history, pathname, search]);

    const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === MarketplaceDatabaseLimits.title) return;
        setFormState({
            ...formState,
            title: e.currentTarget.value,
        });
    };

    const handleUrlChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === MarketplaceDatabaseLimits.url) return;
        setFormState({
            ...formState,
            url: e.currentTarget.value,
        });
    };

    const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
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
        history.replace(deleteQueryFromLocation({pathname, search}, 'image'));
    }, [query?.image, history, pathname, search, setFormState, formState]);

    return (
        <div>
            <h1>{t('MARKETPLACE.NEW_LISTING')}</h1>
            <TextField
                value={formState.title}
                onChange={handleTitleChange}
                label={t('GENERIC.REQUIRED')}
                placeholder={t('MARKETPLACE.FORM_TITLE')}
                style={{width: '80%'}}
                size="medium"
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <div>
                <div>
                    {/*<ImageIcon />*/}
                </div>
                <div>
                    <Button onClick={handleChooseImage}>{t('MARKETPLACE.CHOOSE_IMAGE')}</Button>
                </div>
            </div>
            <TextField
                placeholder={t('MARKETPLACE.FORM_IMAGE')}
                value={formState.url}
                onChange={handleUrlChange}
                style={{width: '80%'}}
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
