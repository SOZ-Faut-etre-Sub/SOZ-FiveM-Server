import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import React, { FunctionComponent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BankAccount, BankMoneyType } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';

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
    } = useForm<QuickActionInputs>({ mode: 'onChange' });

    const submitForm: SubmitHandler<QuickActionInputs> = async data => {
        await fetchNui(NuiEvent.BankSafeTransferAction, {
            type: quickAction === 0 ? 'withdraw' : 'deposit',
            accountId: account.id,
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
                <Input
                    type="number"
                    prefix="$"
                    {...register('amount', {
                        min: 1,
                        max: quickAction === 0 ? account[moneyType] : player.money[moneyType],
                        required: true,
                    })}
                    placeholder="1000"
                    error={errors.amount}
                />

                <Button>{quickAction === 0 ? 'Retirer' : 'Déposer'}</Button>
            </form>
        </Card>
    );
};
