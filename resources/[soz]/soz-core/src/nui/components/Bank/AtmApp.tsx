import { Transition } from '@headlessui/react';
import classnames from 'classnames';
import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { MemoryRouter } from 'react-router-dom';

import { AtmUiData } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event/nui';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { AppContent } from './component/AppContent';
import { ApplicationContainer } from './component/Application';
import { Card } from './component/Card';
import { Header } from './component/Header';
import { MenuLink } from './component/MenuLink';
import { inputErrorMessage } from './utils/format';

type AtmAppInputs = {
    deposit: number;
    withdraw: number;
};

export const AtmApp: FunctionComponent = () => {
    const player = usePlayer();

    const [showApp, setShowApp] = useState<boolean>(false);
    const [account, setAccount] = useState<AtmUiData>();

    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AtmAppInputs>();

    const resetApp = () => {
        reset();
        setShowApp(false);
    };

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key === 'Escape') resetApp();
    };

    useNuiFocus(showApp, showApp, false);

    useNuiEvent('bank_atm', 'ShowAtm', (data: AtmUiData) => {
        setAccount(data);
        setShowApp(true);
    });

    const depositIsEnabled = player?.money?.money === 0 || !!watch('withdraw');

    const submitForm: SubmitHandler<AtmAppInputs> = async data => {
        if (data.deposit === 0 && data.withdraw === 0) return;

        const type = data.deposit > 0 ? 'deposit' : 'withdraw';

        const result = await fetchNui(NuiEvent.BankAtmAction, {
            atmIdentifier: account.atmAccountId,
            bankAccount: account.atm.id,
            type: type,
            amount: Number(type === 'deposit' ? data.deposit : data.withdraw),
        });
        if (result) {
            resetApp();
        }
    };

    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    if (!showApp) return null;

    return (
        <ApplicationContainer size="large" onClickOutside={() => resetApp()}>
            <Transition
                as={AppContent}
                show={showApp}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-full opacity-0"
                enterTo="translate-y-0 opacity-1"
                leave="transform ease-in duration-300 transition"
                leaveFrom="translate-y-0 opacity-1"
                leaveTo="translate-y-full opacity-0"
            >
                <MemoryRouter>
                    <div className="flex flex-col w-full gap-4 m-4">
                        <Header
                            title={<img className="h-20" src="/public/images/bank/logo.webp" alt="Fleeca Logo" />}
                            bankMoney={account?.account?.money}
                        />

                        <div className="flex-grow">
                            <form onSubmit={handleSubmit(submitForm)} className="h-full grid grid-cols-2 gap-4">
                                <Card
                                    className={classnames('flex flex-col justify-between h-full', {
                                        'opacity-50': !!watch('deposit'),
                                    })}
                                >
                                    <h2 className="uppercase text-sm font-light text-gray-300">Retirer de l'argent</h2>

                                    <div>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-white sm:text-sm">$</span>
                                            </div>
                                            <input
                                                {...register('withdraw', {
                                                    min: 0,
                                                    max: account?.atm?.config?.maxMoney,
                                                })}
                                                type="number"
                                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 bg-white/5 text-white ring-1 ring-inset ring-gray-400/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500/50 sm:text-sm sm:leading-6"
                                                placeholder="1000"
                                                disabled={!!watch('deposit')}
                                            />
                                        </div>
                                        {errors.withdraw && (
                                            <span className="text-red-400 text-sm">
                                                {inputErrorMessage(errors.withdraw.type)}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        className="border-2 border-green-500/50 w-full p-2 rounded-md"
                                        disabled={!!watch('deposit')}
                                    >
                                        Retirer
                                    </button>
                                </Card>
                                <Card
                                    className={classnames('flex flex-col justify-between h-full', {
                                        'opacity-50': depositIsEnabled,
                                    })}
                                >
                                    <h2 className="uppercase text-sm font-light text-gray-300">Déposer de l'argent</h2>

                                    <div>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-white sm:text-sm">$</span>
                                            </div>
                                            <input
                                                {...register('deposit', {
                                                    min: 0,
                                                    max: player?.money?.money,
                                                })}
                                                type="number"
                                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 bg-white/5 text-white ring-1 ring-inset ring-gray-400/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500/50 sm:text-sm sm:leading-6"
                                                placeholder="1000"
                                                disabled={depositIsEnabled}
                                            />
                                        </div>
                                        {errors.deposit && (
                                            <span className="text-red-400 text-sm">
                                                {inputErrorMessage(errors.deposit.type)}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        className="border-2 border-green-500/50 w-full p-2 rounded-md"
                                        disabled={depositIsEnabled}
                                    >
                                        Déposer
                                    </button>
                                </Card>
                            </form>
                        </div>

                        <footer className="flex justify-end">
                            <MenuLink
                                title="Se déconnecter"
                                onClick={() => resetApp()}
                                icon={<FaArrowRightFromBracket className="h-4 w-4" />}
                                className="hover:bg-red-500/50"
                            />
                        </footer>
                    </div>
                </MemoryRouter>
            </Transition>
        </ApplicationContainer>
    );
};
