import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
            const resp = await fetchNui<ServerPromiseResp<NoteItem>>(NotesEvents.ADD_NOTE, {
                title,
                content,
            });

            if (resp.status !== 'ok') {
                return addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.ADD_FAILED'),
                });
            }

            addNotification({
                app: 'notes',
                title: t('NOTES.FEEDBACK.ADD_SUCCESS'),
            });
        },
        [addNotification, t]
    );

    const deleteNote = useCallback(
        async (note: NoteItem['id']) => {
            const resp = await fetchNui<ServerPromiseResp<DeleteNoteDTO>>(NotesEvents.DELETE_NOTE, note);

            if (resp.status !== 'ok') {
                return addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.DELETE_FAILED'),
                });
            }

            addNotification({
                app: 'notes',
                title: t('NOTES.FEEDBACK.DELETE_SUCCESS'),
            });
        },
        [addNotification, t]
    );

    const updateNote = useCallback(
        async ({ id, content, title }: NoteItem) => {
            const resp = await fetchNui<ServerPromiseResp>(NotesEvents.UPDATE_NOTE, {
                id,
                content,
                title,
            });
            if (resp.status !== 'ok') {
                return addNotification({
                    app: 'notes',
                    title: t('NOTES.FEEDBACK.UPDATE_FAILED'),
                });
            }

            addNotification({
                app: 'notes',
                title: t('NOTES.FEEDBACK.UPDATE_SUCCESS'),
            });
        },
        [addNotification, t]
    );

    return { addNewNote, deleteNote, updateNote };
};
