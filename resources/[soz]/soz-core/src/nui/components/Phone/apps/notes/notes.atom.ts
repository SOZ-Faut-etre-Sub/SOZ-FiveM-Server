import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { NoteItem } from '../../../../../shared/phone/apps/notes';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

const notesAtom = atom<Array<NoteItem>>([]);
export const searchQueryAtom = atom<string>('');
const filteredNotesAtom = atom<Array<NoteItem>>(get => {
    const notes = get(notesAtom);
    const searchQuery = get(searchQueryAtom);

    return notes.filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()));
});

export const useNotes = () => useAtomValue(filteredNotesAtom);

export const useAppNotesStateHandlers = () => {
    const setNodes = useSetAtom(notesAtom);

    useInjectDebugData(() => {
        const notes: NoteItem[] = [];

        for (let i = 0; i < 60; i++) {
            notes.push({
                id: i,
                title: `Note ${i}`,
                content: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem. Quisquam, quidem.',
            });
        }

        setNodes(notes);
    });
};
