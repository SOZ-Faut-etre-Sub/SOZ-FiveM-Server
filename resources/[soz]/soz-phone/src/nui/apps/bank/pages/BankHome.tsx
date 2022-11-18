import { CogIcon, EyeIcon, LockClosedIcon } from '@heroicons/react/outline';
import cn from 'classnames';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';

import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { AppContent } from '../../../ui/components/AppContent';
import { BankCard } from '../components/BankCard';
import { Checkbox } from '../components/Checkbox';

export const BankHome = memo(() => {
    const credentials = useSelector((state: RootState) => state.appBank);
    const config = useConfig();

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

    return (
        <AppContent>
            <div className="m-auto pt-1 pb-3 flex flex-col w-5/6">
                <h2
                    className={cn('text-3xl', {
                        'text-red-500': credentials.balance <= 0,
                        'text-emerald-500': credentials.balance > 0,
                    })}
                >
                    {credentials.balance.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                    })}
                </h2>
                <h5
                    className={cn('text-xs uppercase font-light', {
                        'text-white': config.theme.value === 'dark',
                        'text-black': config.theme.value === 'light',
                    })}
                >
                    Solde actuel
                </h5>
            </div>
            <BankCard name={credentials.name} account={credentials.account} />
            <div className="flex pt-10 p-6 justify-around">
                <div
                    className={cn('p-3 rounded-full text-dark/50 border border-opacity-50', {
                        'text-white border-white': config.theme.value === 'dark',
                        'text-black border-black': config.theme.value === 'light',
                    })}
                >
                    <EyeIcon className="h-7 w-7" />
                </div>
                <div
                    className={cn('p-3 rounded-full text-dark/50 border border-opacity-50', {
                        'text-white border-white': config.theme.value === 'dark',
                        'text-black border-black': config.theme.value === 'light',
                    })}
                >
                    <LockClosedIcon className="h-7 w-7" />
                </div>
                <div
                    className={cn('p-3 rounded-full text-dark/50 border border-opacity-50', {
                        'text-white border-white': config.theme.value === 'dark',
                        'text-black border-black': config.theme.value === 'light',
                    })}
                >
                    <CogIcon className="h-7 w-7" />
                </div>
            </div>
            <div className="p-6">
                <h2
                    className={cn('text-2xl', {
                        'text-white': config.theme.value === 'dark',
                        'text-black': config.theme.value === 'light',
                    })}
                >
                    Paramètre de la carte
                </h2>

                <Checkbox title="Activer les retraits distributeurs" enabled={true} />
                <Checkbox title="Paiement en ligne" enabled={false} />
                <Checkbox title="Stonks Gold+" enabled={false} />
            </div>
        </AppContent>
    );
});
