import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { NewNoteItem, NoteItem } from '../../../../../../shared/phone/apps/notes';
import { fetchNui } from '../../../../../fetch';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';

interface NotesAPIValue {
    addNewNote: (data: NewNoteItem) => Promise<void>;
    updateNote: (note: NoteItem) => Promise<void>;
    deleteNote: (id: NoteItem['id']) => Promise<void>;
}

export const useNotesAPI = (): NotesAPIValue => {
    const { t } = useTranslation();
    const { addNotification } = useNotifications();

    const addNewNote = useCallback(
        async ({ title, content }: NewNoteItem) => {
            try {
                await fetchNui(NuiEvent.PhoneAppNotesAdd, {
                    title,
                    content,
                });

                addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.ADD_SUCCESS'),
                });
            } catch (e) {
                addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.ADD_FAILED'),
                });
            }
        },
        [addNotification, t]
    );

    const updateNote = useCallback(
        async ({ id, content, title }: NoteItem) => {
            try {
                await fetchNui(NuiEvent.PhoneAppNotesUpdate, {
                    id,
                    content,
                    title,
                });

                addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.UPDATE_SUCCESS'),
                });
            } catch (e) {
                addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.UPDATE_FAILED'),
                });
            }
        },
        [addNotification, t]
    );

    const deleteNote = useCallback(
        async (note: NoteItem['id']) => {
            try {
                await fetchNui(NuiEvent.PhoneAppNotesDelete, note);

                addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.DELETE_SUCCESS'),
                });
            } catch (e) {
                addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.DELETE_FAILED'),
                });
            }
        },
        [addNotification, t]
    );

    return { addNewNote, deleteNote, updateNote };
};
