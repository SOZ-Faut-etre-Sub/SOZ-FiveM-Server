import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { BeforeDBNote, DeleteNoteDTO, NoteItem, NotesEvents } from '@typings/app/notes';
import { ServerPromiseResp } from '@typings/common';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchNui } from '../../../utils/fetchNui';

interface NotesAPIValue {
    addNewNote: (data: BeforeDBNote) => Promise<void>;
    deleteNote: (id: DeleteNoteDTO) => Promise<void>;
    updateNote: (note: NoteItem) => Promise<void>;
}

export const useNotesAPI = (): NotesAPIValue => {
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();

    const addNewNote = useCallback(
        async ({ title, content }: BeforeDBNote) => {
            const resp = await fetchNui<ServerPromiseResp<NoteItem>>(NotesEvents.ADD_NOTE, {
                title,
                content,
            });

            if (resp.status !== 'ok') {
                return addAlert({
                    message: t('NOTES.FEEDBACK.ADD_FAILED'),
                    type: 'error',
                });
            }

            addAlert({
                message: t('NOTES.FEEDBACK.ADD_SUCCESS'),
                type: 'success',
            });
        },
        [addAlert, t]
    );

    const deleteNote = useCallback(
        async (note: DeleteNoteDTO) => {
            const resp = await fetchNui<ServerPromiseResp<DeleteNoteDTO>>(NotesEvents.DELETE_NOTE, note);

            if (resp.status !== 'ok') {
                return addAlert({
                    message: t('NOTES.FEEDBACK.DELETE_FAILED'),
                    type: 'error',
                });
            }

            addAlert({
                message: t('NOTES.FEEDBACK.DELETE_SUCCESS'),
                type: 'success',
            });
        },
        [addAlert, t]
    );

    const updateNote = useCallback(
        async ({ id, content, title }: NoteItem) => {
            const resp = await fetchNui<ServerPromiseResp>(NotesEvents.UPDATE_NOTE, {
                id,
                content,
                title,
            });
            if (resp.status !== 'ok') {
                return addAlert({
                    message: t('NOTES.FEEDBACK.UPDATE_FAILED'),
                    type: 'error',
                });
            }

            addAlert({
                message: t('NOTES.FEEDBACK.UPDATE_SUCCESS'),
                type: 'success',
            });
        },
        [addAlert, t]
    );

    return { addNewNote, deleteNote, updateNote };
};
