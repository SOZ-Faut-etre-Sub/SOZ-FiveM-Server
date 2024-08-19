import cn from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { HistoryRow } from '../components/HistoryRow';

const HistoryList = (): any => {
    const statements = useSelector((state: RootState) => state.appBankStatements);

    if (!statements || statements.length == 0) return <NoHistory />;

    return (
        <ul className="relative space-y-2 h-full w-full overflow-y-auto">
            {statements
                .sort((a, b) => b.date - a.date)
                .map(statement => (
                    <HistoryRow key={statement.id} statement={statement} />
                ))}
        </ul>
    );
};

export const NoHistory = () => {
    const config = useConfig();
    const [t] = useTranslation();

    return (
        <div
            className={cn('flex flex-col justify-center items-center h-full', {
                'text-white': config.theme.value === 'dark',
                'text-dark': config.theme.value === 'light',
            })}
        >
            {t('HISTORY.NO_HISTORY')}
        </div>
    );
};

export default HistoryList;
