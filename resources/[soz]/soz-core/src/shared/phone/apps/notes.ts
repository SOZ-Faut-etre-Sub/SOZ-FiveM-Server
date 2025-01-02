export type NoteItem = {
    id: number;
    title: string;
    content: string;
};

export type NewNoteItem = Omit<NoteItem, 'id'>;
