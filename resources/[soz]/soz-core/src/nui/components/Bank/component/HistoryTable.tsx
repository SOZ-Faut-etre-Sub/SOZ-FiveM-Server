import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { FunctionComponent } from 'react';

import { BankAccount, BankContact, BankStatement } from '../../../../shared/bank';
import { HistoryRow } from './HistoryRow';

interface HistoryTableProps {
    account: BankAccount;
    history: BankStatement[];
    contacts?: BankContact[];
}

export const HistoryTable: FunctionComponent<HistoryTableProps> = ({ account, contacts, history = [] }) => {
    const historyByDays: Record<string, BankStatement[]> = history.reduce((acc, row) => {
        const date = format(row.date, 'eeee dd MMMMMM yyyy', { locale: fr });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(row);
        return acc;
    }, {});

    return (
        <>
            {Object.entries(historyByDays).map(([day, history]) => (
                <div key={day} className="p-3 space-y-4">
                    <div className="font-semibold capitalize">
                        {day}
                        <div className="bg-gradient-to-r from-white/10 via-70% via-transparent h-0.5"></div>
                    </div>

                    {history.map((row, id) => (
                        <HistoryRow key={id} account={account} history={row} contacts={contacts} />
                    ))}
                </div>
            ))}

            {history.length === 0 && <div className="p-3 text-center">Aucun historique pour ce compte</div>}
        </>
    );
};
