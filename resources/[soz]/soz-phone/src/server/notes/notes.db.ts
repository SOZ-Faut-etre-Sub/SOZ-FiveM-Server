import { ResultSetHeader } from 'mysql2';

import { BeforeDBNote, NoteItem } from '../../../typings/app/notes';
import DbInterface from '../db/db_wrapper';

export class _NotesDB {
    async addNote(identifier: string, note: BeforeDBNote): Promise<number> {
        const query = 'INSERT INTO phone_notes (identifier, title, content) VALUES (?, ?, ?)';
        const [result] = await DbInterface._rawExec(query, [identifier, note.title, note.content]);
        return (<ResultSetHeader>result).insertId;
    }

    async fetchNotes(identifier: string): Promise<NoteItem[]> {
        const query = 'SELECT * FROM phone_notes WHERE identifier = ? ORDER BY id DESC';
        const [result] = await DbInterface._rawExec(query, [identifier]);
        return <NoteItem[]>result;
    }

    async deleteNote(noteId: number, identifier: string): Promise<void> {
        const query = 'DELETE FROM phone_notes WHERE id = ? AND identifier = ?';
        await DbInterface._rawExec(query, [noteId, identifier]);
    }

    async updateNote(note: NoteItem, identifier: string): Promise<void> {
        const query = 'UPDATE phone_notes SET title = ?, content = ? WHERE id = ? AND identifier = ?';
        await DbInterface._rawExec(query, [note.title, note.content, note.id, identifier]);
    }
}

const NotesDB = new _NotesDB();

export default NotesDB;
