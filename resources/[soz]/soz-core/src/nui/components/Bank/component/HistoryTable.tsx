import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { FunctionComponent } from 'react';

import { HistoryRow, HistoryRowProps } from './HistoryRow';

interface HistoryTableProps {
    rows: Array<HistoryRowProps & { date: Date }>;
}

export const HistoryTable: FunctionComponent<HistoryTableProps> = ({ rows }) => {
    const historyByDays: Record<string, HistoryRowProps[]> = rows.reduce((acc, row) => {
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
                <div className="p-3 space-y-4">
                    <div className="font-semibold capitalize">
                        {day}
                        <div className="bg-gradient-to-r from-white/10 via-70% via-transparent h-0.5"></div>
                    </div>

                    {history.map(row => (
                        <HistoryRow
                            type={row.type}
                            accountId={row.accountId}
                            accountName={row.accountName}
                            description={row.description}
                            amount={row.amount}
                        />
                    ))}
                </div>
            ))}
        </>
    );
};
