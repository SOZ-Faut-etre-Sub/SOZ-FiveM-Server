import cn from 'classnames';
import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { BankStatementItem } from '../../../../../typings/app/bank_statements';
import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { DayAgo } from '../../../ui/components/DayAgo';

interface HistoryRowProps {
    statement: BankStatementItem;
}

export const HistoryRow: FunctionComponent<HistoryRowProps> = ({ statement }) => {
    const config = useConfig();

    const personalAccount = useSelector((state: RootState) => state.appBank?.account);
    const contacts = useSelector((state: RootState) => state.appBankContacts);

    const isSource = (statement: BankStatementItem) => statement.source_accountid === personalAccount;

    const title = isSource(statement) ? 'Paiement à' : 'Virement de';

    const targetWithLabel = (statement: BankStatementItem) => {
        const accountId = isSource(statement) ? statement.target_accountid : statement.source_accountid;

        const contact = contacts?.find(c => c.accountid === accountId);
        if (contact) {
            return `${contact.label} (${contact.accountid})`;
        }

        return isSource(statement) ? statement.target_label : statement.source_label;
    };

    return (
        <div
            key={statement.id}
            className={cn('relative px-6 py-2 rounded-md flex items-center space-x-3', {
                'bg-ios-700': config.theme.value === 'dark',
                'bg-white': config.theme.value === 'light',
            })}
        >
            <div
                className={cn('flex gap-2 text-left text-sm font-medium w-full overflow-hidden', {
                    'text-gray-100': config.theme.value === 'dark',
                    'text-gray-600': config.theme.value === 'light',
                })}
            >
                <div className="grow min-w-0 overflow-hidden">
                    {statement.source_accountid === '' || statement.target_accountid === '' ? (
                        <span>Action effectuée sur votre compte</span>
                    ) : (
                        <>
                            {title} <span>{targetWithLabel(statement)}</span>
                        </>
                    )}
                    {statement.reason && <p className="text-gray-400 text-ellipsis">{statement.reason}</p>}
                </div>

                <div className="shrink text-right">
                    <span
                        className={cn({
                            'text-red-500': isSource(statement),
                            'text-emerald-500': !isSource(statement),
                        })}
                    >
                        {statement.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                        })}
                    </span>
                    <br />
                    <span className="text-gray-400" style={{ fontSize: '0.67rem', lineHeight: '1rem' }}>
                        <DayAgo timestamp={statement.date} />
                    </span>
                </div>
            </div>
        </div>
    );
};
