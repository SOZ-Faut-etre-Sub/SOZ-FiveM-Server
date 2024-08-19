import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import classnames from 'classnames';
import React, { FunctionComponent } from 'react';

import { BankAccount, BankContact, BankStatement } from '../../../../shared/bank';
import { moneyFormat } from '../utils/format';
import { TextWithCopy } from './TextWithCopy';

interface HistoryRowProps {
    account: BankAccount;
    history: BankStatement;
    contacts?: BankContact[];
}

export const HistoryRow: FunctionComponent<HistoryRowProps> = ({ account, contacts, history }) => {
    const isSource = history.source_accountid === account.id;

    const Icon = isSource ? MinusIcon : PlusIcon;
    const title = isSource ? 'Paiement à' : 'Virement de';
    const targetAccount = isSource ? history.target_accountid : history.source_accountid;
    const targetLabel = isSource ? history.target_label : history.source_label;
    const targetImage = (isSource ? history.target_accountid : history.source_accountid).replace('offshore_', '');

    const targetWithLabel = () => {
        const contact = contacts?.find(c => c.accountid === targetAccount);
        if (contact) {
            return `${contact.label} (${contact.accountid})`;
        }

        return targetLabel;
    };

    return (
        <div className="flex items-center gap-4">
            <Icon
                className={classnames('flex-none text-gray-300 border shadow-xl rounded-xl h-10 w-10 p-3', {
                    'bg-red-300/5 border-red-500/50': isSource,
                    'bg-green-300/5 border-green-500/50': !isSource,
                })}
            />
            <div className="flex flex-col min-w-0 grow">
                {history.source_accountid === '' || history.target_accountid === '' ? (
                    <span>Action effectuée sur votre compte</span>
                ) : (
                    <span className="flex items-center gap-1.5">
                        {title}
                        <img
                            className="w-5 h-5"
                            src={`/public/images/society/${targetImage}.webp`}
                            alt={targetLabel}
                            onError={e => (e.currentTarget.style.display = 'none')}
                        ></img>
                        <TextWithCopy text={targetAccount} className="font-semibold">
                            {targetWithLabel()}
                        </TextWithCopy>
                    </span>
                )}
                <span className="text-sm truncate">{history.reason}</span>
            </div>

            <span>{moneyFormat(history.amount)}</span>
        </div>
    );
};
