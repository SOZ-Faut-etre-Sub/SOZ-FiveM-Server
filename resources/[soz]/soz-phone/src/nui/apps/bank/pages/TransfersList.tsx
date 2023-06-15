import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { TransferCard } from '../components/TransferCard';

const TransfersList = (): any => {
    const transfersList = useSelector((state: RootState) => state.appBankTransfersList);

    return (
        <ul className={`p-2`}>
            {transfersList.map(transfer => (
                <TransferCard key={transfer.id} {...transfer} />
            ))}
        </ul>
    );
};

export default TransfersList;
