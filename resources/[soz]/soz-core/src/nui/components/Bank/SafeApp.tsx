import { Tab, Transition } from '@headlessui/react';
import classnames from 'classnames';
import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsSafe } from 'react-icons/bs';

import { BankAccount } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event/nui';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { AppContent } from './component/AppContent';
import { ApplicationContainer } from './component/Application';
import { Card } from './component/Card';
import { FORMAT_CURRENCY, inputErrorMessage } from './utils/format';

type SafeAppInputs = {
    money: number;
    markedMoney: number;
};

export const SafeApp: FunctionComponent = () => {
    const player = usePlayer();

    const [showApp, setShowApp] = useState<boolean>(false);

    // 0 => withdraw, 1 => deposit
    const [action, setAction] = useState<number>(0);
    const [account, setAccount] = useState<BankAccount>();

    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SafeAppInputs>();

    const resetApp = () => {
        reset();
        setShowApp(false);
    };

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key === 'Escape') resetApp();
    };

    useNuiFocus(showApp, showApp, false);

    useNuiEvent('bank_safe', 'ShowSafe', (data: boolean) => {
        setShowApp(data);
    });

    useNuiEvent('bank_safe', 'UpdateAccountData', (data: BankAccount) => {
        setAccount(data);
    });

    useNuiEvent('bank', 'CloseInterface', resetApp);

    const submitForm: SubmitHandler<SafeAppInputs> = async data => {
        if (!account) return;

        const moneyType = data.money > 0 ? 'money' : 'marked_money';
        const amount = moneyType === 'money' ? data.money : data.markedMoney;

        const result = await fetchNui(NuiEvent.BankSafeTransferAction, {
            type: action === 0 ? 'withdraw' : 'deposit',
            accountId: account?.id,
            moneyType,
            amount: Number(amount),
            refreshNui: account?.type,
        });
        if (!result) {
            return;
        }

        resetApp();
    };

    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    const tabClass = (tab: any) => {
        return classnames('font-lighter uppercase text-sm p-1 rounded-md focus:outline-none', {
            'bg-green-300/5': tab.selected,
        });
    };

    if (!showApp) return null;

    return (
        <ApplicationContainer size="small" onClickOutside={() => resetApp()}>
            <Transition
                as={AppContent}
                show={showApp}
                appear={true}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-full opacity-0"
                enterTo="translate-y-0 opacity-1"
                leave="transform ease-in duration-300 transition"
                leaveFrom="translate-y-0 opacity-1"
                leaveTo="translate-y-full opacity-0"
            >
                <form onSubmit={handleSubmit(submitForm)} className="flex flex-col w-full justify-around">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <BsSafe className="h-32 w-32 text-white/50" />
                        <div className="flex flex-col items-center">
                            <span className="text-white font-semibold text-lg">{account?.label}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Tab.Group selectedIndex={action} onChange={index => setAction(index)}>
                            <Tab.List className="grid grid-cols-2 gap-3 p-1 bg-white/5 text-gray-200 rounded-md">
                                <Tab className={tabClass}>Retirer</Tab>
                                <Tab className={tabClass}>Déposer</Tab>
                            </Tab.List>
                        </Tab.Group>

                        {account?.type !== 'housestorages' && (
                            <Card>
                                <div className="flex justify-between mb-4">
                                    <span className="text-white font-semibold">Argent</span>
                                    <span className="text-sm text-green-500/70">
                                        {account?.money.toLocaleString('en-US', FORMAT_CURRENCY)}
                                    </span>
                                </div>
                                <input
                                    {...register('money', {
                                        min: 1,
                                        max: action === 0 ? account?.money : player.money.money,
                                    })}
                                    type="number"
                                    className="bg-white/5 ring-1 ring-inset ring-white/10 w-full rounded-md py-1.5 px-2 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500/20"
                                    placeholder="42"
                                    disabled={!!watch('markedMoney')}
                                />
                                {errors.money && (
                                    <span className="text-red-400 text-sm">{inputErrorMessage(errors.money.type)}</span>
                                )}
                            </Card>
                        )}

                        <Card>
                            <div className="flex justify-between mb-4">
                                <span className="text-white font-semibold">Argent marqué</span>
                                <span className="text-sm text-red-400/70">
                                    {account?.marked_money.toLocaleString('en-US', FORMAT_CURRENCY)}
                                    {account?.type === 'housestorages' && (
                                        <span> / {account?.maxCapacity.toLocaleString('en-US', FORMAT_CURRENCY)}</span>
                                    )}
                                </span>
                            </div>
                            <input
                                {...register('markedMoney', {
                                    min: 1,
                                    max: action === 0 ? account?.marked_money : player.money.marked_money,
                                })}
                                type="number"
                                className="bg-white/5 ring-1 ring-inset ring-white/10 w-full rounded-md py-1.5 px-2 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500/20"
                                placeholder="42"
                                disabled={!!watch('money')}
                            />
                            {errors.markedMoney && (
                                <span className="text-red-400 text-sm">
                                    {inputErrorMessage(errors.markedMoney.type)}
                                </span>
                            )}
                        </Card>
                    </div>

                    <button className="bg-green-500/40 hover:bg-green-500/35 font-semibold py-3 px-4 rounded-lg">
                        {action === 0 ? 'Retirer' : 'Déposer'} l'argent
                    </button>
                </form>
            </Transition>
        </ApplicationContainer>
    );
};
