import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { Contact, ContactEvents, PreDBContact } from '@typings/contact';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { fetchNui } from '../../../utils/fetchNui';
import { useContactActions } from './useContactActions';

export const useContactsAPI = () => {
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();
    const { addLocalContact, updateLocalContact, deleteLocalContact } = useContactActions();
    const navigate = useNavigate();

    const addNewContact = useCallback(
        ({ display, number, avatar }: PreDBContact, referral: string) => {
            fetchNui<ServerPromiseResp<Contact>>(ContactEvents.ADD_CONTACT, {
                display,
                number,
                avatar,
            }).then(serverResp => {
                if (serverResp.status !== 'ok') {
                    return addAlert({
                        message: t('CONTACTS.FEEDBACK.ADD_FAILED'),
                        type: 'error',
                    });
                }

                // Sanity checks maybe?
                addLocalContact(serverResp.data);
                addAlert({
                    message: t('CONTACTS.FEEDBACK.ADD_SUCCESS'),
                    type: 'success',
                });
                navigate(referral, { replace: true });
            });
        },
        [addAlert, addLocalContact, history, t]
    );

    const updateContact = useCallback(
        ({ id, display, number, avatar }: Contact) => {
            fetchNui<ServerPromiseResp>(ContactEvents.UPDATE_CONTACT, {
                id,
                display,
                number,
                avatar,
            }).then(resp => {
                if (resp.status !== 'ok') {
                    return addAlert({
                        message: t('CONTACTS.FEEDBACK.UPDATE_FAILED'),
                        type: 'error',
                    });
                }

                updateLocalContact({
                    id,
                    display,
                    number,
                    avatar,
                });

                addAlert({
                    message: t('CONTACTS.FEEDBACK.UPDATE_SUCCESS'),
                    type: 'success',
                });

                navigate(-1);
            });
        },
        [addAlert, history, t, updateLocalContact]
    );

    const deleteContact = useCallback(
        ({ id }) => {
            fetchNui<ServerPromiseResp>(ContactEvents.DELETE_CONTACT, { id }).then(resp => {
                if (resp.status !== 'ok') {
                    return addAlert({
                        message: t('CONTACTS.FEEDBACK.DELETE_FAILED'),
                        type: 'error',
                    });
                }
                navigate(-1);

                deleteLocalContact(id);

                addAlert({
                    message: t('CONTACTS.FEEDBACK.DELETE_SUCCESS'),
                    type: 'success',
                });
            });
        },
        [addAlert, deleteLocalContact, history, t]
    );

    return { addNewContact, updateContact, deleteContact };
};
