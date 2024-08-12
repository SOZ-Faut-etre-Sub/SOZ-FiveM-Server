import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import classnames from 'classnames';
import React, { FunctionComponent } from 'react';

import { BankAccount, BankStatement } from '../../../../shared/bank';
import { moneyFormat } from '../utils/format';

interface HistoryRowProps {
    account: BankAccount;
    history: BankStatement;
}

export const HistoryRow: FunctionComponent<HistoryRowProps> = ({ account, history }) => {
    const isSource = history.source_accountid === account.id || history.source_accountid === '';

    const Icon = isSource ? MinusIcon : PlusIcon;
    const title = isSource ? 'Paiement à' : 'Virement de';
    const target = isSource ? history.target_label : history.source_label;
    const targetImage = (isSource ? history.target_accountid : history.source_accountid).replace('offshore_', '');

    return (
        <div className="flex items-center gap-4">
            <Icon
                className={classnames('flex-none text-gray-300 border shadow-xl rounded-xl h-10 w-10 p-3', {
                    'bg-red-300/5 border-red-500/50': isSource,
                    'bg-green-300/5 border-green-500/50': !isSource,
                })}
            />
            <div className="flex flex-col min-w-0 grow">
                {history.source_accountid === '' ? (
                    <span>Retrait éffectué depuis un ATM</span>
                ) : (
                    <span className="flex items-center gap-1.5">
                        {title}
                        <img
                            className="w-5 h-5"
                            src={`/public/images/society/${targetImage}.webp`}
                            alt={target}
                            onError={e => (e.currentTarget.style.display = 'none')}
                        ></img>
                        <strong className="font-semibold">{target}</strong>
                    </span>
                )}
                <span className="text-sm truncate">{history.reason}</span>
            </div>

            <span>{moneyFormat(history.amount)}</span>
        </div>
    );
};
