import { Transition } from '@headlessui/react';
import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { MemoryRouter } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event/nui';
import { NuiMethodMap } from '../../../shared/nui';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { AppContent } from './component/AppContent';
import { ApplicationContainer } from './component/Application';
import { Button } from './component/Button';
import { Card } from './component/Card';
import { Header } from './component/Header';
import { Input } from './component/Input';
import { MenuLink } from './component/MenuLink';
import { Title } from './component/Title';
import { moneyFormat } from './utils/format';

type AtmAppInputs = {
    withdraw: number;
};

export const AtmApp: FunctionComponent = () => {
    const player = usePlayer();

    const [showApp, setShowApp] = useState<boolean>(false);
    const [keepFocus, setKeepFocus] = useState<boolean>(false);

    const [account, setAccount] = useState<NuiMethodMap['bank_atm']['ShowAtm']>();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<AtmAppInputs>({ mode: 'onChange' });

    const resetApp = async () => {
        reset();
        setShowApp(false);

        if (!showApp) return;
        await fetchNui(NuiEvent.BankAnimation, { type: 'exit' });
        setKeepFocus(false);
    };

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        resetApp();
    };

    useNuiFocus(keepFocus, keepFocus, false);

    useNuiEvent('bank_atm', 'ShowAtm', data => {
        setAccount(data);
        setShowApp(true);
        setKeepFocus(true);
    });

    useNuiEvent('bank', 'CloseInterface', resetApp);

    const submitForm: SubmitHandler<AtmAppInputs> = async data => {
        if (data.withdraw === 0) return;

        const result = await fetchNui(NuiEvent.BankAtmAction, {
            atmIdentifier: account.atmAccountId,
            bankAccount: account.atm.id,
            type: 'withdraw',
            amount: Number(data.withdraw),
            atmType: account.atmType,
            atmCoords: account.atmCoords,
        });
        if (result) {
            reset();
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
        <ApplicationContainer size="large" onClickOutside={resetApp}>
            <AppContent open={showApp}>
                <MemoryRouter>
                    <div className="flex flex-col w-full gap-2.5">
                        <Header
                            category={
                                <img className="h-14 ml-6" src="https://soz.zerator.com/static/game/images/bank/logo.webp" alt="Fleeca Logo" />
                            }
                        />

                        <div className="flex gap-2.5">
                            <Card className="w-1/2">
                                <Title size="xsmall">Solde bancaire</Title>

                                <div className="flex flex-col justify-center items-center">
                                    <Title size="medium">{moneyFormat(account?.account?.money)}</Title>
                                </div>
                            </Card>

                            <Card className="w-1/2">
                                <Title size="xsmall">Portefeuille</Title>

                                <div className="flex flex-col justify-center items-center">
                                    <Title size="medium">{moneyFormat(Number(player.money.money))}</Title>
                                </div>
                            </Card>
                        </div>

                        <form onSubmit={handleSubmit(submitForm)} className="flex-grow">
                            <Card className="flex flex-col justify-between h-full gap-2.5">
                                <Title size="xsmall">Retirer de l'argent</Title>

                                <Input
                                    type="number"
                                    prefix="$"
                                    {...register('withdraw', {
                                        min: 1,
                                        max: {
                                            value: account?.atm?.config?.maxMoney,
                                            message: `La capacité de cet ATM est de ${moneyFormat(account?.atm?.config?.maxMoney)}`,
                                        },
                                        required: true,
                                        onBlur: e => setValue('withdraw', parseInt(e.target.value) || undefined),
                                    })}
                                    placeholder="1000"
                                    error={errors.withdraw}
                                />

                                <div className="flex gap-2.5">
                                    <Button type="reset" variant="secondary" onClick={() => resetApp()}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        Retirer
                                    </Button>
                                </div>
                            </Card>
                        </form>
                    </div>
                </MemoryRouter>
            </AppContent>
        </ApplicationContainer>
    );
};
