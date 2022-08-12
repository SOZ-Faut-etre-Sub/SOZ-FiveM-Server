import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { Contact, ContactEvents, PreDBContact } from '@typings/contact';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { fetchNui } from '../../../utils/fetchNui';

export const useContactsAPI = () => {
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();
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

                addAlert({
                    message: t('CONTACTS.FEEDBACK.ADD_SUCCESS'),
                    type: 'success',
                });
                navigate(referral, { replace: true });
            });
        },
        [addAlert, navigate, t]
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

                addAlert({
                    message: t('CONTACTS.FEEDBACK.UPDATE_SUCCESS'),
                    type: 'success',
                });

                navigate(-1);
            });
        },
        [addAlert, navigate, t]
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

                addAlert({
                    message: t('CONTACTS.FEEDBACK.DELETE_SUCCESS'),
                    type: 'success',
                });
            });
        },
        [addAlert, navigate, t]
    );

    return { addNewContact, updateContact, deleteContact };
};
