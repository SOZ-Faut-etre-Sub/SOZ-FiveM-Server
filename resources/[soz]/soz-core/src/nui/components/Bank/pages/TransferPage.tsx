import { FunctionComponent } from 'react';

import { BankAppPayload } from '../BankApp';
import { Header } from '../component/Header';

export const TransferPage: FunctionComponent<BankAppPayload> = () => {
    return (
        <>
            <Header title="Transfert" />
        </>
    );
};
