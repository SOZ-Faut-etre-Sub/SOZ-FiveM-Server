import { useEffect } from 'react';

import { NotesEvents } from '../../../../typings/app/notes';
import { useNuiEvent } from '../../../libs/nui/hooks/useNuiEvent';
import { store } from '../../store';

export const useAppNotesService = () => {
    useEffect(() => {
        store.dispatch.appNotes.loadNotes();
    }, []);

    useNuiEvent('NOTES', NotesEvents.ADD_NOTE, store.dispatch.appNotes.addNote);
    useNuiEvent('NOTES', NotesEvents.UPDATE_NOTE, store.dispatch.appNotes.updateNote);
    useNuiEvent('NOTES', NotesEvents.DELETE_NOTE, store.dispatch.appNotes.deleteNote);
};
