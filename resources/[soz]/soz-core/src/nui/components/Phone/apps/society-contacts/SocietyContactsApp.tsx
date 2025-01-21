import { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { ContactList } from './pages/ContactList';

export const SocietyContactsApp: FunctionComponent = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<ContactList />} />
                {/*<Route path=":id" element={<ContactsShow />} />*/}
            </Routes>
        </AppContainer>
    );
};
