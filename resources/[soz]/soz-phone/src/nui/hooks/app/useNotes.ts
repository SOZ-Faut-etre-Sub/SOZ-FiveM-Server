import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';

export const useNotes = () => {
    const notes = useSelector((state: RootState) => state.appNotes);

    const getNotes = useCallback(() => {
        return notes;
    }, [notes]);

    const getNote = useCallback(
        id => {
            return notes.find(note => note.id === id);
        },
        [notes]
    );

    return {
        getNotes,
        getNote,
    };
};
