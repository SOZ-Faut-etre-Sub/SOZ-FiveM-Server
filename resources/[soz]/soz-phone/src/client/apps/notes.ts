import { NotesEvents } from '../../../typings/app/notes';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(NotesEvents.FETCH_ALL_NOTES);
RegisterNuiProxy(NotesEvents.ADD_NOTE);
RegisterNuiProxy(NotesEvents.UPDATE_NOTE);
RegisterNuiProxy(NotesEvents.DELETE_NOTE);
