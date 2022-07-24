import { NoteItem, NotesEvents } from '@typings/app/notes';
import { ServerPromiseResp } from '@typings/common';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { fetchNui } from '../../../utils/fetchNui';
import { isEnvBrowser } from '../../../utils/misc';
import { BrowserNotesData } from '../utils/constants';

export const noteStates = {
    noteItems: atom({
        key: 'noteItem',
        default: selector<NoteItem[]>({
            key: 'defaultNoteItems',
            get: async () => {
                try {
                    const resp = await fetchNui<ServerPromiseResp<NoteItem[]>>(NotesEvents.FETCH_ALL_NOTES);
                    LogDebugEvent({ action: 'FetchNotes', data: resp.data });
                    return resp.data;
                } catch (e) {
                    if (isEnvBrowser()) {
                        return BrowserNotesData;
                    }
                    console.error(e);
                    return [];
                }
            },
        }),
    }),
    selectedNote: atom<Partial<NoteItem> | null>({
        key: 'selectedNote',
        default: null,
    }),
    modalVisibile: atom({
        key: 'noteModalVisible',
        default: false,
    }),
};

export const useSetSelectedNote = () => useSetRecoilState(noteStates.selectedNote);
export const useSelectedNoteValue = () => useRecoilValue(noteStates.selectedNote);
export const useSelectedNote = () => useRecoilState(noteStates.selectedNote);

export const useSetModalVisible = () => useSetRecoilState(noteStates.modalVisibile);
export const useModalVisible = () => useRecoilState(noteStates.modalVisibile);

export const useNotesValue = () => useRecoilValue(noteStates.noteItems);
export const useSetNotes = () => useSetRecoilState(noteStates.noteItems);
