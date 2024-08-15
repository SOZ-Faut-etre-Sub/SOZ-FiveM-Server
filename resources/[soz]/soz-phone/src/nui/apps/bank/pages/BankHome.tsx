import { CreditCardIcon, DotsHorizontalIcon, MenuIcon, PlusIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { HistoryRow } from '../components/HistoryRow';
import { TextWithCopy } from '../components/TextWithCopy';

export const BankHome = memo(() => {
    const credentials = useSelector((state: RootState) => state.appBank);
    const config = useConfig();
    const navigate = useNavigate();

    const statements = useSelector((state: RootState) => state.appBankStatements);
    const limitedStatements = statements.sort((a, b) => b.date - a.date).slice(0, 5);

    const fakeIconList = [
        { title: 'Virement', icon: PlusIcon },
        { title: 'Mes cartes', icon: CreditCardIcon },
        { title: 'Détails', icon: MenuIcon },
        { title: 'Plus', icon: DotsHorizontalIcon },
    ];

    if (!credentials) {
        return (
            <div
                className={cn('flex justify-center items-center', {
                    'text-white': config.theme.value === 'dark',
                    'text-dark': config.theme.value === 'light',
                })}
            >
                Information non disponible
            </div>
        );
    }

    return (
        <>
            <div className="absolute h-[59%] -top-12 inset-x-0">
                <div
                    className="h-full w-full bg-cover bg-center object-cover"
                    style={{
                        backgroundImage: `url(media/bank/cover.webp)`,
                    }}
                />
                <div className="absolute inset-0 bg-gray-500 mix-blend-multiply" aria-hidden="true" />
            </div>

            <div className="absolute -top-12 inset-x-0 bg-gradient-to-b from-black/50 text-white w-full h-[20%] pt-14 z-10 p-3" />

            <div className="relative h-[60%]">
                <div className="absolute flex items-end justify-around w-full h-[10%] mt-12">
                    <img src="media/bank/logo.webp" alt="Logo" className="h-14" />
                </div>

                <div className="absolute text-white flex flex-col items-center justify-center w-full h-full">
                    <span className="font-light">Compte principal</span>
                    <h2
                        className={cn('text-6xl', {
                            'text-red-500': credentials.balance <= 0,
                            'text-emerald-500': credentials.balance > 0,
                        })}
                    >
                        {credentials.balance?.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                        })}
                    </h2>
                    <TextWithCopy text={credentials.account}>
                        IBAN: <span className="font-bold">{credentials.account}</span>
                    </TextWithCopy>
                </div>

                <div className="absolute flex items-end justify-around w-full h-[95%]">
                    {fakeIconList.map(({ title, icon: Icon }, index) => (
                        <div key={index} className="flex flex-col items-center text-white">
                            <div className="p-3 h-fit w-fit rounded-full text-white bg-neutral-500">
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-light pt-1">{title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <ul className="relative space-y-2 h-[49%] w-full overflow-auto">
                {limitedStatements.map(statement => (
                    <HistoryRow key={statement.id} statement={statement} />
                ))}

                <button
                    onClick={() => navigate('/bank/history')}
                    className={cn('flex justify-center py-2 w-full', {
                        'text-white': config.theme.value === 'dark',
                        'text-dark': config.theme.value === 'light',
                    })}
                >
                    Voir plus d'historique &rarr;
                </button>
            </ul>
        </>
    );
});
