import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import React, { FunctionComponent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BankAccount, BankMoneyType } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import { inputErrorMessage } from '../utils/format';
import { Card } from './Card';

type QuickActionInputs = {
    amount: number;
};

interface QuickActionFormProps {
    account: BankAccount;
    moneyType?: BankMoneyType;
}

export const QuickActionForm: FunctionComponent<QuickActionFormProps> = ({ account, moneyType = 'money' }) => {
    const player = usePlayer();

    // 0 => withdraw, 1 => deposit
    const [quickAction, setQuickAction] = useState<number>(0);
    const tabClass = (tab: any) => {
        return classnames('p-1 rounded-md focus:ring-0 ', { 'bg-white/10': tab.selected });
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<QuickActionInputs>();

    const submitForm: SubmitHandler<QuickActionInputs> = async data => {
        await fetchNui(NuiEvent.BankSafeTransferAction, {
            type: quickAction === 0 ? 'withdraw' : 'deposit',
            safe: account.id,
            moneyType,
            amount: Number(data.amount),
            refreshNui: 'bank',
        });

        reset();
    };

    return (
        <Card>
            <h2 className="uppercase text-sm font-light text-gray-300">Actions rapides</h2>
            <Tab.Group selectedIndex={quickAction} onChange={index => setQuickAction(index)}>
                <Tab.List className="grid grid-cols-2 gap-3 p-1 my-3 bg-white/5 text-gray-200 rounded-md">
                    <Tab className={tabClass}>Retirer</Tab>
                    <Tab className={tabClass}>Déposer</Tab>
                </Tab.List>
            </Tab.Group>

            <form onSubmit={handleSubmit(submitForm)}>
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-white sm:text-sm">$</span>
                    </div>
                    <input
                        {...register('amount', {
                            min: 0,
                            max: quickAction === 0 ? account[moneyType] : player.money[moneyType],
                        })}
                        type="number"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 bg-white/5 text-white ring-1 ring-inset ring-gray-400/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500/50 sm:text-sm sm:leading-6"
                        placeholder="1000"
                    />
                </div>
                {errors.amount && <span className="text-red-400 text-sm">{inputErrorMessage(errors.amount.type)}</span>}

                <button className="border-2 mt-3 border-green-500/50 w-full p-2 rounded-md">
                    {quickAction === 0 ? 'Retirer' : 'Déposer'}
                </button>
            </form>
        </Card>
    );
};
