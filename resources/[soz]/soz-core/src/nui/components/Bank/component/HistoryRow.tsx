import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import classnames from 'classnames';
import React, { FunctionComponent } from 'react';

import { BankActionType } from '../../../../shared/bank';
import { FORMAT_CURRENCY } from '../utils/format';

export interface HistoryRowProps {
    type: BankActionType;
    accountId: string;
    accountName: string;
    description: string;
    amount: number;
}

export const HistoryRow: FunctionComponent<HistoryRowProps> = ({ type, accountName, description, amount }) => {
    const Icon = type === 'deposit' ? PlusIcon : MinusIcon;
    const title = type === 'deposit' ? 'Virement de' : 'Paiement à';

    return (
        <div className="flex items-center gap-4">
            <Icon
                className={classnames('text-gray-300 border shadow-xl rounded-xl h-10 w-10 p-3', {
                    'bg-red-300/5 border-red-500/50': type === 'withdraw',
                    'bg-green-300/5 border-green-500/50': type === 'deposit',
                })}
            />
            <div className="flex flex-col grow">
                <span>
                    {title} <strong className="font-semibold">{accountName}</strong>
                </span>
                <span className="text-sm">{description}</span>
            </div>

            <span>$ {Number(amount).toLocaleString('en-US', FORMAT_CURRENCY)}</span>
        </div>
    );
};
