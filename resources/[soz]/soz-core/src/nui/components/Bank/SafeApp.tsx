import { Tab, Transition } from '@headlessui/react';
import classnames from 'classnames';
import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BankAccount } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event/nui';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { AppContent } from './component/AppContent';
import { ApplicationContainer } from './component/Application';
import { Button } from './component/Button';
import { Card } from './component/Card';
import { Input } from './component/Input';
import { moneyFormat } from './utils/format';

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
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SafeAppInputs>({ mode: 'onChange' });

    const resetApp = async () => {
        reset();
        setShowApp(false);

        await fetchNui(NuiEvent.BankAnimation, { type: 'exit' });
    };

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (!showApp) return;

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

        reset();
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
        <ApplicationContainer size="small" onClickOutside={resetApp}>
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
                        <img
                            className="h-32 w-32"
                            src={`/public/images/society/${account.id?.replace(/safe_/, '')}.webp`}
                            alt={account?.label}
                            onError={e => (e.currentTarget.style.display = 'none')}
                        ></img>
                        <div className="flex flex-col items-center">
                            <span className="text-white font-semibold text-lg">{account?.label}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Tab.Group
                            selectedIndex={action}
                            onChange={index => {
                                setAction(index);
                                reset();
                            }}
                        >
                            <Tab.List className="grid grid-cols-2 gap-3 p-1 bg-white/5 text-gray-200 rounded-md">
                                <Tab className={tabClass}>Retirer</Tab>
                                <Tab className={tabClass}>Déposer</Tab>
                            </Tab.List>
                        </Tab.Group>

                        {account?.type !== 'housestorages' && account?.type !== 'gang' && (
                            <Card
                                className={classnames({
                                    'opacity-50': !!watch('markedMoney'),
                                })}
                            >
                                <div className="flex justify-between mb-4">
                                    <span className="text-white font-semibold">Argent</span>
                                    <span className="text-sm text-green-500/70">{moneyFormat(account?.money)}</span>
                                </div>

                                <Input
                                    type="number"
                                    {...register('money', {
                                        min: 1,
                                        max: action === 0 ? account?.money : player.money.money,
                                        onBlur: e => setValue('money', parseInt(e.target.value) || undefined),
                                    })}
                                    placeholder="1000"
                                    disabled={!!watch('markedMoney')}
                                    error={errors.money}
                                    autofill={
                                        action === 1 && player.money.money > 0
                                            ? () => setValue('money', player.money.money ?? 0)
                                            : undefined
                                    }
                                />
                            </Card>
                        )}

                        <Card
                            className={classnames({
                                'opacity-50': !!watch('money'),
                            })}
                        >
                            <div className="flex justify-between mb-4">
                                <span className="text-white font-semibold">Argent marqué</span>
                                <span className="text-sm text-red-400/70">
                                    {moneyFormat(account?.marked_money)}
                                    {['housestorages', 'gang'].includes(account?.type) && (
                                        <span> / {moneyFormat(account?.maxCapacity)}</span>
                                    )}
                                </span>
                            </div>

                            <Input
                                type="number"
                                {...register('markedMoney', {
                                    min: 1,
                                    max: action === 0 ? account?.marked_money : player.money.marked_money,
                                    onBlur: e => setValue('markedMoney', parseInt(e.target.value) || undefined),
                                })}
                                placeholder="1000"
                                disabled={!!watch('money')}
                                error={errors.markedMoney}
                                autofill={
                                    action === 1 && player.money.marked_money > 0
                                        ? () => setValue('markedMoney', player.money.marked_money ?? 0)
                                        : undefined
                                }
                            />
                        </Card>
                    </div>

                    <Button disabled={isSubmitting}>{action === 0 ? 'Retirer' : 'Déposer'} l'argent</Button>
                </form>
            </Transition>
        </ApplicationContainer>
    );
};
