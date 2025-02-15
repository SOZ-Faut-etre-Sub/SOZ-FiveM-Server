import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { NoteForm } from './pages/NoteForm';
import { NoteList } from './pages/NoteList';

export const NotesApp: React.FC = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<NoteList />} />
                <Route path=":id" element={<NoteForm />} />
            </Routes>
        </AppContainer>
    );
};
