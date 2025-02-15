import { fetchNui } from '@public/nui/fetch';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { ContactDTO } from '../../../../../../shared/phone/simcard';
import { useDynamicIsland } from '../../../system/dynamic-island/hooks/useDynamicIsland';

export const useContactsAPI = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { sendIsland } = useDynamicIsland();

    const addNewContact = useCallback(
        async (contact: ContactDTO, referral: string) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardAddContact, contact);

                sendIsland('success');
                navigate(referral, { replace: true });
            } catch (e) {
                sendIsland('error');
            }
        },
        [sendIsland, navigate, t]
    );

    const updateContact = useCallback(
        async (id: number, contact: ContactDTO) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardUpdateContact, { id, ...contact });

                sendIsland('success');
                navigate(-1);
            } catch (e) {
                sendIsland('error');
            }
        },
        [sendIsland, navigate, t]
    );

    const deleteContact = useCallback(
        async (id: number) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardDeleteContact, id);

                sendIsland('success');
                navigate(-1);
            } catch (e) {
                sendIsland('error');
            }
        },
        [sendIsland, navigate, t]
    );

    const addFavoriteContact = useCallback(
        async (id: number) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardUpdateContact, { id, favorite: true });

                sendIsland('success');
            } catch (e) {
                sendIsland('error');
            }
        },
        [sendIsland, t]
    );

    const removeFavoriteContact = useCallback(
        async (id: number) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardUpdateContact, { id, favorite: false });

                sendIsland('success');
            } catch (e) {
                sendIsland('error');
            }
        },
        [sendIsland, t]
    );

    return { addNewContact, updateContact, deleteContact, addFavoriteContact, removeFavoriteContact };
};
