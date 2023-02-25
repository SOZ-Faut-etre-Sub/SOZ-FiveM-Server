import { RootState } from '../../../store';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useConfig } from '../../../hooks/usePhone';
import { useApp } from '../../../os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import cn from 'classnames';
import { fetchNui } from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Button } from '@ui/old_components/Button';
import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { DayAgo } from '../../../ui/components/DayAgo';
import { InvoicesEvents } from '@typings/app/invoices';
import { useInvoicesAPI } from '../hooks/useInvoicesAPI';
// TODO: add search bar later
const InvoiceList = (): any => {
    const invoicesApp = useApp('invoices');
    const invoices = useSelector((state: RootState) => state.appInvoices);
    const { payInvoice, refuseInvoice } = useInvoicesAPI();
    const [t] = useTranslation();
    const config = useConfig();

    if (invoices && invoices.length)
        return (
            <AppContent className="flex flex-col" scrollable={false}>
                <AppTitle app={invoicesApp} />
                <div className="relative">
                    <ul
                        className={cn('relative divide-y', {
                            'divide-gray-700': config.theme.value === 'dark',
                            'divide-gray-200': config.theme.value === 'light',
                        })}
                    >
                        {invoices.sort((a, b) => b.created_at - a.created_at).map(invoice => (
                            <Menu
                                key={invoice.id}
                                as="li"
                                className={cn('w-full cursor-pointer', {
                                    'bg-ios-800': config.theme.value === 'dark',
                                    'bg-ios-50': config.theme.value === 'light',
                                })}
                            >
                                <Menu.Button className="w-full">
                                    <div
                                        className={cn('relative px-6 py-2 flex items-center space-x-3', {
                                            'hover:bg-ios-600': config.theme.value === 'dark',
                                            'hover:bg-gray-200': config.theme.value === 'light',
                                        })}
                                    >
                                        <div className="flex-1 min-w-0 cursor-pointer">
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            <div
                                                className={cn('text-left text-sm font-medium', {
                                                    'text-gray-100': config.theme.value === 'dark',
                                                    'text-gray-600': config.theme.value === 'light',
                                                })}
                                            >
                                                <div className="float-left" style={{ width: "70%", overflow: "hidden", textOverflow: 'ellipsis' }}>
                                                    {invoice.emitterName}<br />
                                                    {invoice.label}
                                                </div>
                                                <div className="float-right text-right">
                                                    <span>
                                                        ${invoice.amount}
                                                    </span><br />
                                                    <span className="text-gray-400" style={{ fontSize: '0.67rem', lineHeight: '1rem' }}>
                                                        <DayAgo timestamp={invoice.created_at} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Menu.Button>
                                <Transition
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                    className="absolute z-50 right-0 w-56"
                                >
                                    <Menu.Items className="mt-2 origin-top-right bg-ios-800 bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                                        <Menu.Item>
                                            <Button
                                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                onClick={() => payInvoice(invoice.id)}
                                            >
                                                <CheckIcon className="mx-3 h-5 w-5" /> Payer
                                            </Button>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Button
                                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                onClick={() => refuseInvoice(invoice.id)}
                                            >
                                                <XIcon className="mx-3 h-5 w-5" /> Refuser
                                            </Button>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ))}
                    </ul>
                </div>
            </AppContent>
        );

    return (
        <AppContent className="flex flex-col" scrollable={false}>
            <AppTitle app={invoicesApp} />
            <div
                className={cn('flex flex-col justify-center items-center h-full', {
                    'text-white': config.theme.value === 'dark',
                    'text-dark': config.theme.value === 'light',
                })}
            >
                {t('INVOICES.NO_INVOICES')}
            </div>
        </AppContent>
    );
};

export default InvoiceList;
