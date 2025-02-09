import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { NewNoteItem, NoteItem } from '../../../../../../shared/phone/apps/notes';
import { fetchNui } from '../../../../../fetch';
import { useDynamicIsland } from '../../../system/dynamic-island/hooks/useDynamicIsland';

interface NotesAPIValue {
    addNewNote: (data: NewNoteItem) => Promise<void>;
    updateNote: (note: NoteItem) => Promise<void>;
    deleteNote: (id: NoteItem['id']) => Promise<void>;
}

export const useNotesAPI = (): NotesAPIValue => {
    const { t } = useTranslation();
    const { sendIsland } = useDynamicIsland();

    const addNewNote = useCallback(
        async ({ title, content }: NewNoteItem) => {
            try {
                await fetchNui(NuiEvent.PhoneAppNotesAdd, {
                    title,
                    content,
                });

                sendIsland('success');
            } catch (e) {
                sendIsland('error');
            }
        },
        [sendIsland, t]
    );

    const updateNote = useCallback(
        async ({ id, content, title }: NoteItem) => {
            try {
                await fetchNui(NuiEvent.PhoneAppNotesUpdate, {
                    id,
                    content,
                    title,
                });

                sendIsland('success');
            } catch (e) {
                sendIsland('error');
            }
        },
        [sendIsland, t]
    );

    const deleteNote = useCallback(
        async (note: NoteItem['id']) => {
            try {
                await fetchNui(NuiEvent.PhoneAppNotesDelete, note);

                sendIsland('success');
            } catch (e) {
                sendIsland('error');
            }
        },
        [sendIsland, t]
    );

    return { addNewNote, deleteNote, updateNote };
};
