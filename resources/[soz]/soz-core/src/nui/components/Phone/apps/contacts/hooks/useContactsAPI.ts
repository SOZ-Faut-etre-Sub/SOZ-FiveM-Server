import { fetchNui } from '@public/nui/fetch';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { ContactDTO } from '../../../../../../shared/phone/simcard';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';

export const useContactsAPI = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const addNewContact = useCallback(
        async (contact: ContactDTO, referral: string) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardAddContact, contact);

                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.ADD_SUCCESS'),
                });
                navigate(referral, { replace: true });
            } catch (e) {
                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.ADD_FAILED'),
                });
            }
        },
        [addNotification, navigate, t]
    );

    const updateContact = useCallback(
        async (id: number, contact: ContactDTO) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardUpdateContact, { id, ...contact });

                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.UPDATE_SUCCESS'),
                });
                navigate(-1);
            } catch (e) {
                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.UPDATE_FAILED'),
                });
            }
        },
        [addNotification, navigate, t]
    );

    const deleteContact = useCallback(
        async (id: number) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardDeleteContact, id);

                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.DELETE_SUCCESS'),
                });
                navigate(-1);
            } catch (e) {
                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.DELETE_FAILED'),
                });
            }
        },
        [addNotification, navigate, t]
    );

    const addFavoriteContact = useCallback(
        async (id: number) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardUpdateContact, { id, favorite: true });

                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.ADD_FAVORITE_SUCCESS'),
                });
            } catch (e) {
                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.ADD_FAVORITE_FAILED'),
                });
            }
        },
        [addNotification, t]
    );

    const removeFavoriteContact = useCallback(
        async (id: number) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardUpdateContact, { id, favorite: false });

                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.DELETE_FAVORITE_SUCCESS'),
                });
            } catch (e) {
                addNotification({
                    app: 'contacts',
                    title: t('CONTACTS.FEEDBACK.DELETE_FAVORITE_FAILED'),
                });
            }
        },
        [addNotification, t]
    );

    return { addNewContact, updateContact, deleteContact, addFavoriteContact, removeFavoriteContact };
};
