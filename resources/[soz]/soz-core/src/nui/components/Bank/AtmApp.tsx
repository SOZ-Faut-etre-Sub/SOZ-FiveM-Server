import { Transition } from '@headlessui/react';
import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { MemoryRouter } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event/nui';
import { NuiMethodMap } from '../../../shared/nui';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { AppContent } from './component/AppContent';
import { ApplicationContainer } from './component/Application';
import { Card } from './component/Card';
import { Header } from './component/Header';
import { Input } from './component/Input';
import { MenuLink } from './component/MenuLink';

type AtmAppInputs = {
    withdraw: number;
};

export const AtmApp: FunctionComponent = () => {
    const [showApp, setShowApp] = useState<boolean>(false);
    const [account, setAccount] = useState<NuiMethodMap['bank_atm']['ShowAtm']>();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AtmAppInputs>({ mode: 'onChange' });

    const resetApp = () => {
        reset();
        setShowApp(false);
    };

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key === 'Escape') resetApp();
    };

    useNuiFocus(showApp, showApp, false);

    useNuiEvent('bank_atm', 'ShowAtm', data => {
        setAccount(data);
        setShowApp(true);
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

                        <form onSubmit={handleSubmit(submitForm)} className="flex-grow">
                            <Card className="flex flex-col justify-between h-full">
                                <h2 className="uppercase text-sm font-light text-gray-300">Retirer de l'argent</h2>

                                <Input
                                    type="number"
                                    prefix="$"
                                    {...register('withdraw', {
                                        min: 1,
                                        max: account?.atm?.config?.maxMoney,
                                        required: true,
                                    })}
                                    placeholder="1000"
                                    error={errors.withdraw}
                                />

                                <button className="border-2 border-green-500/50 w-full p-2 rounded-md">Retirer</button>
                            </Card>
                        </form>

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
