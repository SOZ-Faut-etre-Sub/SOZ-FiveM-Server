import { CheckIcon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList } from 'react-window';

import { Invoice } from '../../../../../../shared/bank';
import { VirtualizedListProps } from '../../../../../../shared/virtualized';
import { DayAgo } from '../../../components/DayAgo';
import { ListButton } from '../../../components/List';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useInvoices } from '../bank.atom';
import { useInvoicesAPI } from '../hooks/useInvoicesAPI';

export const InvoiceList = (): any => {
    const theme = useThemeConfig();
    const { t } = useTranslation();

    const invoices = useInvoices();

    return (
        <AppWrapper>
            <AppContent>
                <AppTitle title={t('BANK.NAVBAR_INVOICES')} />

                {invoices && invoices.length > 0 ? (
                    <FixedSizeList
                        height={710}
                        width={410}
                        itemSize={60}
                        itemCount={invoices.length}
                        itemData={invoices}
                        className="mt-2 rounded-xl"
                    >
                        {InvoiceItem}
                    </FixedSizeList>
                ) : (
                    <div
                        className={clsx('flex flex-col justify-center items-center h-full', {
                            'text-white': theme === 'dark',
                            'text-dark': theme === 'light',
                        })}
                    >
                        {t('INVOICES.NO_INVOICES')}
                    </div>
                )}
            </AppContent>
        </AppWrapper>
    );
};

const InvoiceItem: FunctionComponent<VirtualizedListProps<Invoice>> = ({ index, style, data }) => {
    const theme = useThemeConfig();

    const { payInvoice, refuseInvoice } = useInvoicesAPI();

    const invoice = data[index];
    if (!invoice) return null;

    return (
        <ListButton
            key={invoice.id}
            style={style}
            actions={[
                {
                    label: 'Refuser',
                    color: 'bg-red-500 text-white',
                    icon: XIcon,
                    onClick: () => refuseInvoice(invoice.id),
                },
                {
                    label: 'Payer',
                    color: 'bg-green-500 text-white',
                    icon: CheckIcon,
                    onClick: () => payInvoice(invoice.id),
                },
            ]}
        >
            <div className="px-6 py-2 flex-1 min-w-0 cursor-pointer">
                <span className="absolute inset-0" aria-hidden="true" />
                <div
                    className={clsx('text-left text-sm font-medium', {
                        'text-gray-100': theme === 'dark',
                        'text-gray-600': theme === 'light',
                    })}
                >
                    <div
                        className="float-left"
                        style={{
                            width: '70%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {invoice.emitterName}
                        <br />
                        {invoice.label}
                    </div>
                    <div className="float-right text-right">
                        <span>${invoice.amount}</span>
                        <br />
                        <span className="text-gray-400" style={{ fontSize: '0.67rem', lineHeight: '1rem' }}>
                            <DayAgo timestamp={invoice.createdAt} />
                        </span>
                    </div>
                </div>
            </div>
        </ListButton>
    );
};
