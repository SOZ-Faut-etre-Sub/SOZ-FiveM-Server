import { useEffect } from 'react';

import { NoteItem, NotesEvents } from '../../../../typings/app/notes';
import { ServerPromiseResp } from '../../../../typings/common';
import { useNuiEvent } from '../../../libs/nui/hooks/useNuiEvent';
import { BrowserNotesData } from '../../apps/notes/utils/constants';
import { store } from '../../store';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';

export const useAppNotesService = () => {
    useEffect(() => {
        fetchNui<ServerPromiseResp<NoteItem[]>>(
            NotesEvents.FETCH_ALL_NOTES,
            undefined,
            buildRespObj(BrowserNotesData)
        ).then(messages => {
            store.dispatch.appNotes.setNotes(messages.data);
        });
    }, []);

    useNuiEvent('NOTES', NotesEvents.ADD_NOTE, store.dispatch.appNotes.addNote);
    useNuiEvent('NOTES', NotesEvents.UPDATE_NOTE, store.dispatch.appNotes.updateNote);
    useNuiEvent('NOTES', NotesEvents.DELETE_NOTE, store.dispatch.appNotes.deleteNote);
};
