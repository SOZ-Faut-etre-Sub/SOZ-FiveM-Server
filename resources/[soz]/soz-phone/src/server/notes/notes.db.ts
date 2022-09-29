import { BeforeDBNote, NoteItem } from '../../../typings/app/notes';

export class _NotesDB {
    async addNote(identifier: string, note: BeforeDBNote): Promise<number> {
        return exports.oxmysql.insert_async('INSERT INTO phone_notes (identifier, title, content) VALUES (?, ?, ?)', [
            identifier,
            note.title,
            note.content,
        ]);
    }

    async fetchNotes(identifier: string): Promise<NoteItem[]> {
        return exports.oxmysql.query_async('SELECT * FROM phone_notes WHERE identifier = ? ORDER BY id DESC', [
            identifier,
        ]);
    }

    async deleteNote(noteId: number, identifier: string): Promise<void> {
        exports.oxmysql.query_async('DELETE FROM phone_notes WHERE id = ? AND identifier = ?', [noteId, identifier]);
    }

    async updateNote(note: NoteItem, identifier: string): Promise<void> {
        exports.oxmysql.query_async('UPDATE phone_notes SET title = ?, content = ? WHERE id = ? AND identifier = ?', [
            note.title,
            note.content,
            note.id,
            identifier,
        ]);
    }
}

const NotesDB = new _NotesDB();

export default NotesDB;
