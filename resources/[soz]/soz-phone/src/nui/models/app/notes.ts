import { createModel } from '@rematch/core';
import { INotes } from '@typings/app/notes';

import { RootModel } from '..';

export const appNotes = createModel<RootModel>()({
    state: [] as INotes[],
    reducers: {
        set: (state, payload) => {
            return [...payload];
        },
        add: (state, payload) => {
            return [payload, ...state];
        },
        update: (state, payload) => {
            return state.map(note => (note.id === payload.id ? payload : note));
        },
        remove: (state, payload) => {
            return state.filter(note => note.id !== payload);
        },
    },
    effects: dispatch => ({
        async setNotes(payload: INotes[]) {
            dispatch.appNotes.set(payload);
        },
        async addNote(payload: INotes) {
            dispatch.appNotes.add(payload);
        },
        async updateNote(payload: INotes) {
            dispatch.appNotes.update(payload);
        },
        async deleteNote(payload: INotes) {
            dispatch.appNotes.remove(payload);
        },
    }),
});
