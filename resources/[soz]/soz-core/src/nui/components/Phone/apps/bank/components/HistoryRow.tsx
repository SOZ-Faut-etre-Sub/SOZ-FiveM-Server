import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import { BankStatement } from '../../../../../../shared/bank';
import { DayAgo } from '../../../components/DayAgo';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useAccountId, useContacts } from '../bank.atom';

interface HistoryRowProps {
    statement: BankStatement;
}

export const PlayerAccountRegExp = /^[0-9]{3}Z[0-9]{4}T[0-9]{3}$/;

export const HistoryRow: FunctionComponent<HistoryRowProps> = ({ statement }) => {
    const theme = useThemeConfig();

    const accountId = useAccountId();
    const contacts = useContacts();

    const isSource = (statement: BankStatement) => statement.source_accountid === accountId;

    const title = isSource(statement) ? 'Paiement à' : 'Virement de';

    const targetWithLabel = (statement: BankStatement) => {
        const accountId = isSource(statement) ? statement.target_accountid : statement.source_accountid;

        const contact = contacts?.find(c => c.accountid === accountId);
        if (contact) {
            return `${contact.label} (${contact.accountid})`;
        }

        if (accountId.match(PlayerAccountRegExp)) {
            return accountId;
        }

        return isSource(statement) ? statement.target_label : statement.source_label;
    };

    return (
        <div
            key={statement.id}
            className={clsx('relative px-6 py-2 rounded-md flex items-center space-x-3', {
                'bg-ios-700': theme === 'dark',
                'bg-white': theme === 'light',
            })}
        >
            <div
                className={clsx('flex gap-2 text-left text-sm font-medium w-full overflow-hidden', {
                    'text-gray-100': theme === 'dark',
                    'text-gray-600': theme === 'light',
                })}
            >
                <div className="grow min-w-0 truncate overflow-hidden">
                    {statement.source_accountid === '' || statement.target_accountid === '' ? (
                        <span>Action effectuée sur votre compte</span>
                    ) : (
                        <>
                            {title} <span>{targetWithLabel(statement)}</span>
                        </>
                    )}
                    {statement.reason && <p className="text-gray-400 text-ellipsis">{statement.reason}</p>}
                </div>

                <div className="shrink-0 text-right">
                    <span
                        className={clsx({
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
