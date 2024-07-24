import { FunctionComponent } from 'react';

import { BankAppPayload } from '../BankApp';
import { Header } from '../component/Header';

export const HistoryPage: FunctionComponent<BankAppPayload> = () => {
    return (
        <>
            <Header title="Historique" />
        </>
    );
};
