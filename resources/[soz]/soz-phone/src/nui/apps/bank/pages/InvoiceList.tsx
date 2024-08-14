import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import cn from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { DayAgo } from '../../../ui/components/DayAgo';
import { Button } from '../../../ui/old_components/Button';
import { useInvoicesAPI } from '../hooks/useInvoicesAPI';

const InvoiceList = (): any => {
    const config = useConfig();

    const invoices = useSelector((state: RootState) => state.appInvoices);
    const { payInvoice, refuseInvoice } = useInvoicesAPI();

    if (!invoices || invoices.length == 0) return <NoInvoice />;

    return (
        <ul
            className={cn('relative space-y-2 h-full w-full', {
                'divide-gray-700': config.theme.value === 'dark',
                'divide-gray-200': config.theme.value === 'light',
            })}
        >
            {invoices
                .sort((a, b) => b.createdAt - a.createdAt)
                .map(invoice => (
                    <Menu
                        key={invoice.id}
                        as="li"
                        className={cn('w-full rounded-md cursor-pointer', {
                            'bg-ios-700': config.theme.value === 'dark',
                            'bg-white': config.theme.value === 'light',
                        })}
                    >
                        <Menu.Button className="w-full">
                            <div
                                className={cn('relative px-6 py-2 rounded-md flex items-center space-x-3', {
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
                                            <span
                                                className="text-gray-400"
                                                style={{ fontSize: '0.67rem', lineHeight: '1rem' }}
                                            >
                                                <DayAgo timestamp={invoice.createdAt} />
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
    );
};

const NoInvoice = () => {
    const config = useConfig();
    const [t] = useTranslation();

    return (
        <div
            className={cn('flex flex-col justify-center items-center h-full', {
                'text-white': config.theme.value === 'dark',
                'text-dark': config.theme.value === 'light',
            })}
        >
            {t('INVOICES.NO_INVOICES')}
        </div>
    );
};

export default InvoiceList;
