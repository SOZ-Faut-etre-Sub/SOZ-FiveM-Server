import { NoteItem, NotesEvents } from '../../../typings/app/notes';
import { sendNotesEvent } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(NotesEvents.FETCH_ALL_NOTES);
RegisterNuiProxy(NotesEvents.ADD_NOTE);
RegisterNuiProxy(NotesEvents.UPDATE_NOTE);
RegisterNuiProxy(NotesEvents.DELETE_NOTE);

onNet(NotesEvents.ADD_NOTE, (result: NoteItem) => {
    sendNotesEvent(NotesEvents.ADD_NOTE, result);
});

onNet(NotesEvents.UPDATE_NOTE, (result: NoteItem) => {
    sendNotesEvent(NotesEvents.UPDATE_NOTE, result);
});

onNet(NotesEvents.DELETE_NOTE, (result: number) => {
    sendNotesEvent(NotesEvents.DELETE_NOTE, result);
});
