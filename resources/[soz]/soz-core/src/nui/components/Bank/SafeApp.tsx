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
import { Tabs } from './component/Tabs';
import { Title } from './component/Title';
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

        if (!showApp) return;
        await fetchNui(NuiEvent.BankAnimation, { type: 'exit' });
    };

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        resetApp();
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

    if (!showApp) return null;

    return (
        <ApplicationContainer size="small" onClickOutside={resetApp}>
            <AppContent open={showApp}>
                <form onSubmit={handleSubmit(submitForm)} className="flex flex-col w-full justify-around">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <img
                            className="h-32 w-32"
                            src={`https://soz.zerator.com/static/game/images/society/${account.id?.replace(/safe_/, '')}.webp`}
                            alt={account?.label}
                            onError={e => (e.currentTarget.style.display = 'none')}
                        ></img>
                        <div className="flex flex-col items-center">
                            <span className="text-white font-semibold text-lg">{account?.label}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Tabs
                            selected={action}
                            onChange={index => {
                                setAction(index);
                                reset();
                            }}
                            tabs={['Retirer', 'Déposer']}
                        />

                        {account?.type !== 'housestorages' && account?.type !== 'gang' && (
                            <Card
                                className={classnames({
                                    'opacity-50': !!watch('markedMoney'),
                                })}
                            >
                                <div className="flex justify-between mb-4">
                                    <Title size="xsmall">Argent</Title>
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
                                <Title size="xsmall">Argent marqué</Title>

                                <span className="text-sm text-red-400/70">
                                    {moneyFormat(account?.marked_money, false)}
                                    {['housestorages', 'gang'].includes(account?.type) && (
                                        <span> / {moneyFormat(account?.maxCapacity, false)}</span>
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
                                        ? () =>
                                              setValue(
                                                  'markedMoney',
                                                  player.money.marked_money > account?.maxCapacity
                                                      ? account?.maxCapacity
                                                      : player.money.marked_money ?? 0
                                              )
                                        : undefined
                                }
                            />
                        </Card>
                    </div>

                    <Button disabled={isSubmitting}>{action === 0 ? 'Retirer' : 'Déposer'} l'argent</Button>
                </form>
            </AppContent>
        </ApplicationContainer>
    );
};
