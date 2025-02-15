import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList } from 'react-window';

import { BankStatement } from '../../../../../../shared/bank';
import { VirtualizedListProps } from '../../../../../../shared/virtualized';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useStatements } from '../bank.atom';
import { HistoryRow } from '../components/HistoryRow';

export const HistoryList = (): any => {
    const { t } = useTranslation();
    const theme = useThemeConfig();

    const statements = useStatements();

    return (
        <AppWrapper>
            <AppContent>
                <AppTitle title={t('BANK.NAVBAR_HISTORY')} />

                {statements && statements.length > 0 ? (
                    <FixedSizeList
                        height={710}
                        width={410}
                        itemSize={60}
                        itemCount={statements.length}
                        itemData={statements}
                        className={clsx(
                            'mt-2 rounded-xl scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                            {
                                'scrollbar-thumb-white/80': theme === 'dark',
                                'scrollbar-thumb-black/20': theme === 'light',
                            }
                        )}
                    >
                        {StatementItem}
                    </FixedSizeList>
                ) : (
                    <div
                        className={clsx('flex flex-col justify-center items-center h-full', {
                            'text-white': theme === 'dark',
                            'text-dark': theme === 'light',
                        })}
                    >
                        {t('HISTORY.NO_HISTORY')}
                    </div>
                )}
            </AppContent>
        </AppWrapper>
    );
};

const StatementItem: FunctionComponent<VirtualizedListProps<BankStatement>> = ({ index, style, data }) => {
    const statement = data[index];
    if (!statement) return null;

    return (
        <div key={statement.id} style={style}>
            <HistoryRow statement={statement} />
        </div>
    );
};
