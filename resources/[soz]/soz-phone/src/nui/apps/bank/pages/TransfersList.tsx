import { AppContent } from '@ui/components/AppContent';
import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { TransferCard } from '../components/TransferCard';

const TransfersList = (): any => {
    const transfersList = useSelector((state: RootState) => state.appBankTransfersList);

    return (
        <AppContent scrollable={true}>
            <ul className={`p-2`}>
                {transfersList.map(transfer => (
                    <TransferCard key={transfer.id} {...transfer} />
                ))}
            </ul>
        </AppContent>
    );
};

export default TransfersList;
