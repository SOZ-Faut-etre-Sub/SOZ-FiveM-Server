export interface INotes {
    id: number;
    title: string;
    content: string;
}

export enum NotesEvents {
    FETCH_ALL_NOTES = 'phone:app:notes:fetchAllNotes',

    //
    ADD_NOTE = 'phone:app:notes:addNote',
    DELETE_NOTE = 'phone:app:notes:deleteNote',
    UPDATE_NOTE = 'phone:app:notes:updateNote',
    ADD_NOTE_EXPORT = 'phone:app:notes:addNoteExport',
}

//
export interface BeforeDBNote {
    title: string;
    content: string;
}

export interface NoteItem extends BeforeDBNote {
    id: number;
    title: string;
    content: string;
}

export interface DeleteNoteDTO {
    id: number;
}

export interface AddNoteExportData {
    title?: string;
    content?: string;
}
