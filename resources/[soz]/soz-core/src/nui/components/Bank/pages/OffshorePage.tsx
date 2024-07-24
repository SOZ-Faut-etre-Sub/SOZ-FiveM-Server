import { FunctionComponent } from 'react';

import { BankAppPayload } from '../BankApp';
import { Header } from '../component/Header';

export const OffshorePage: FunctionComponent<BankAppPayload> = () => {
    return (
        <>
            <Header title="Compte des îles" />
        </>
    );
};
