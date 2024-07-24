import { FunctionComponent } from 'react';

import { BankAppPayload } from '../BankApp';
import { Header } from '../component/Header';

export const SettingsPage: FunctionComponent<BankAppPayload> = () => {
    return (
        <>
            <Header title="Paramètres" />
        </>
    );
};
