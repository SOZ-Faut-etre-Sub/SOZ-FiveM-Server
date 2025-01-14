import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { ContactEdit } from './components/ContactEdit';
import { ContactList } from './components/ContactList';

export const ContactsApp: FunctionComponent = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<ContactList />} />
                <Route path=":id" element={<ContactEdit />} />
            </Routes>
        </AppContainer>
    );
};
