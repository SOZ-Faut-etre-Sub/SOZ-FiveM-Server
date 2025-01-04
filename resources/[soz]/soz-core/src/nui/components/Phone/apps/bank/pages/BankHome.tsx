import { CreditCardIcon, DotsHorizontalIcon, MenuIcon, PlusIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAssetPath } from '../../../../../hook/assets';
import { TextWithCopy } from '../../../../Bank/component/TextWithCopy';
import { FORMAT_CURRENCY } from '../../../../Bank/utils/format';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useAccountId, useBalance, useHomeStatements } from '../bank.atom';
import { HistoryRow } from '../components/HistoryRow';

export const BankHome = memo(() => {
    const { getPath } = useAssetPath();

    const navigate = useNavigate();

    const theme = useThemeConfig();

    const accountId = useAccountId();
    const balance = useBalance();
    const statements = useHomeStatements();

    const fakeIconList = [
        { title: 'Virement', icon: PlusIcon },
        { title: 'Mes cartes', icon: CreditCardIcon },
        { title: 'Détails', icon: MenuIcon },
        { title: 'Plus', icon: DotsHorizontalIcon },
    ];

    return (
        <AppWrapper>
            <div className="absolute h-[54%] -top-5 inset-x-0 -z-10">
                <div
                    className="h-full w-full bg-cover bg-center object-cover"
                    style={{
                        backgroundImage: `url(${getPath('images/bank/cover.webp')})`,
                    }}
                />
                <div className="absolute inset-0 bg-gray-500 mix-blend-multiply" aria-hidden="true" />
            </div>

            <div className="absolute -top-12 inset-x-0 bg-gradient-to-b from-black/50 text-white w-full h-[20%] pt-14 z-10 p-3" />

            <div className="relative h-[50%]">
                <div className="absolute flex items-end justify-around w-full h-[10%] mt-12">
                    <img src={getPath('images/bank/logo.webp')} alt="Logo" className="h-14" />
                </div>

                <div className="absolute flex items-end w-full h-[95%]">
                    <div className="grid grid-cols-4 w-full">
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

                <div className="absolute text-white flex flex-col items-center justify-center w-full h-full">
                    <span className="font-light">Compte principal</span>
                    <h2
                        className={clsx('text-6xl', {
                            'text-red-500': balance <= 0,
                            'text-emerald-500': balance > 0,
                        })}
                    >
                        {balance?.toLocaleString('en-US', FORMAT_CURRENCY)}
                    </h2>
                    <TextWithCopy text={accountId}>
                        IBAN: <span className="font-bold">{accountId}</span>
                    </TextWithCopy>
                </div>
            </div>

            <ul className="relative space-y-2 h-[49%] w-full px-4 overflow-auto">
                {statements.map(statement => (
                    <HistoryRow key={statement.id} statement={statement} />
                ))}

                <button
                    onClick={() => navigate('/bank/history')}
                    className={clsx('flex justify-center py-2 w-full text-sm', {
                        'text-white': theme === 'dark',
                        'text-dark': theme === 'light',
                    })}
                >
                    Voir plus d'historique &rarr;
                </button>
            </ul>
        </AppWrapper>
    );
});
