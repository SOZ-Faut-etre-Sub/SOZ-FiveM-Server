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

export enum NotesEvents {
    ADD_NOTE = 'npwd:addNote',
    FETCH_ALL_NOTES = 'npwd:fetchAllNotes',
    DELETE_NOTE = 'npwd:deleteNote',
    UPDATE_NOTE = 'npwd:updateNote',
    ADD_NOTE_EXPORT = 'npwd:addNoteExport',
}

export interface AddNoteExportData {
    title?: string;
    content?: string;
}
