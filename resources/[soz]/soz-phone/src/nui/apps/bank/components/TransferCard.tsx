import { AppContent } from '@ui/components/AppContent';
import cn from 'classnames';
import dayjs from 'dayjs';
import React, { FunctionComponent, memo } from 'react';
import { useSelector } from 'react-redux';

import { BankTransfer } from '../../../../../typings/banktransfer';
import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';

export const TransferCard: FunctionComponent<BankTransfer> = memo(
    ({ amount, transmitterName, receiverName, transmitterAccount, createdAt }: BankTransfer) => {
        const config = useConfig();

        const credentials = useSelector((state: RootState) => state.appBank);

        if (!credentials) {
            return (
                <AppContent
                    className={cn('flex justify-center items-center', {
                        'text-white': config.theme.value === 'dark',
                        'text-dark': config.theme.value === 'light',
                    })}
                >
                    Information non disponible
                </AppContent>
            );
        }

        const account = credentials.account;
        const isTransmitter = transmitterAccount == account;
        let operation;
        let type;
        let contactName;
        if (isTransmitter) {
            operation =
                '-' +
                amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                });
            type = 'Emission';
            contactName = receiverName;
        } else {
            operation =
                '+' +
                amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                });
            type = 'Réception';
            contactName = transmitterName;
        }

        return (
            <li
                className={cn('w-full my-3 rounded shadow border-l-4', {
                    'bg-ios-700': config.theme.value === 'dark',
                    'bg-white': config.theme.value === 'light',
                })}
            >
                <div className={`relative p-3 flex items-center space-x-3`}>
                    <div className="flex-1 min-w-0">
                        <p
                            className={cn('text-left text-sm font-medium', {
                                'text-gray-100': config.theme.value === 'dark',
                                'text-gray-700': config.theme.value === 'light',
                            })}
                        >
                            <div className={cn('float-left')}>{contactName}</div>
                            <div className={cn('float-right')}>{dayjs().to(createdAt)}</div>
                        </p>
                        <br />
                        <p
                            className={cn('text-left text-sm font-medium', {
                                'text-red-500': isTransmitter,
                                'text-emerald-500': !isTransmitter,
                            })}
                        >
                            <div className={cn('float-left')}>{type}</div>
                            <div className={cn('float-right')}>{operation}</div>
                        </p>
                    </div>
                </div>
            </li>
        );
    }
);
