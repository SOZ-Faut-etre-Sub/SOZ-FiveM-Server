import { useAssetPath } from '@public/nui/hook/assets';
import { JobType } from '@public/shared/job';
import classnames from 'classnames';
import cn from 'classnames';
import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BankAccount } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event/nui';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useHudColor } from '../Hud/hooks/useHudColor';
import { ApplicationContainer, ApplicationContent } from '../Styleguide/Application';
import { Button } from './component/Button';
import { Card } from './component/Card';
import { Input } from './component/Input';
import { Money } from './component/Money';
import { Tabs } from './component/Tabs';
import { Title } from './component/Title';
import { autoFillAmount } from './utils/autoFill';

type SafeAppInputs = {
    money: number;
    markedMoney: number;
};

export const SafeApp: FunctionComponent = () => {
    const player = usePlayer();
    const { isDaltonism } = useHudColor();
    const { getPath } = useAssetPath();

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
        setAccount(account => ({
            ...account,
            ...data,
        }));
    });

    useNuiEvent('bank', 'CloseInterface', resetApp);

    const submitForm: SubmitHandler<SafeAppInputs> = async data => {
        if (!account) return;

        if (action === 0) {
            if (isSafeStorage && !isCashTransfer) {
                return;
            }
        } else if (action === 1) {
            if (isSafeStorage && isCashTransfer && !isOwnAccount) {
                return;
            }
        }

        const moneyType = data.money > 0 ? 'money' : 'marked_money';
        const amount = moneyType === 'money' ? data.money : data.markedMoney;

        const result = await fetchNui(NuiEvent.BankSafeTransferAction, {
            type: action === 0 ? 'withdraw' : 'deposit',
            accountId: account?.id,
            moneyType,
            amount: Number(amount),
            refreshNui: account?.type,
        });

        if (!result) return;

        reset();
    };

    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    const isCashTransfer = player?.job?.id === JobType.CashTransfer;
    const isOwnAccount = account?.owner.includes(player?.job?.id);
    const isSafeStorage = account?.type === 'safestorages';

    if (!showApp) return null;

    return (
        <ApplicationContainer size="small" onClickOutside={resetApp}>
            <ApplicationContent open={showApp}>
                <form onSubmit={handleSubmit(submitForm)} className="flex flex-col w-full justify-around">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <img
                            className="h-32 w-32"
                            src={getPath(`images/society/${account.id?.replace(/safe_/, '')}.webp`)}
                            alt={account?.label}
                            onError={e => (e.currentTarget.style.display = 'none')}
                        ></img>
                        <div className="flex flex-col items-center">
                            <span className="text-white font-semibold text-lg">{account?.label}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="h-14">
                            <Tabs
                                selected={action}
                                onChange={index => {
                                    setAction(index);
                                    reset();
                                }}
                                tabs={['Retirer', 'Déposer']}
                            />
                        </div>

                        {account?.type !== 'housestorages' && account?.type !== 'gang' && (
                            <Card
                                className={classnames({
                                    'opacity-50': !!watch('markedMoney'),
                                })}
                            >
                                <div className="flex justify-between mb-4">
                                    <Title size="xsmall">Argent</Title>
                                    <span
                                        className={cn('text-sm', {
                                            'text-[#268116]': !isDaltonism,
                                            'text-[#00FFFF]': isDaltonism,
                                        })}
                                    >
                                        <Money amount={account?.money} useColor={false} />
                                    </span>
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

                                <span
                                    className={cn('text-sm', {
                                        'text-[#AD1F1F]': !isDaltonism,
                                        'text-[#B314E8]': isDaltonism,
                                    })}
                                >
                                    <Money amount={account?.marked_money} useColor={false} />
                                    {['housestorages', 'gang'].includes(account?.type) && (
                                        <span>
                                            {' '}
                                            / <Money amount={account?.maxCapacity} useColor={false} />
                                        </span>
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
                                                  autoFillAmount(
                                                      player.money.marked_money,
                                                      account?.marked_money ?? 0,
                                                      account?.maxCapacity ?? 0
                                                  )
                                              )
                                        : undefined
                                }
                            />
                        </Card>
                    </div>
                    {action === 0 && (
                        <>
                            {isSafeStorage ? (
                                isCashTransfer ? (
                                    <Button disabled={isSubmitting}>Retirer l'argent</Button>
                                ) : (
                                    <div className="py-[15px]">
                                        Seul un agent STONK Security peut accéder à ce coffre
                                    </div>
                                )
                            ) : (
                                <Button disabled={isSubmitting}>Retirer l'argent</Button>
                            )}
                        </>
                    )}

                    {action === 1 && (
                        <>
                            {isSafeStorage ? (
                                isCashTransfer && !isOwnAccount ? (
                                    <div className="py-[15px]">
                                        Vous n'avez pas l'autorisation de déposer sur ce compte.
                                    </div>
                                ) : (
                                    <Button disabled={isSubmitting}>Déposer l'argent</Button>
                                )
                            ) : (
                                <Button disabled={isSubmitting}>Déposer l'argent</Button>
                            )}
                        </>
                    )}
                </form>
            </ApplicationContent>
        </ApplicationContainer>
    );
};
