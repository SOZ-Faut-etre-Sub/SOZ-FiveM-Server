import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BankAccount, BankMoneyType } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { Tabs } from './Tabs';
import { Title } from './Title';

type QuickActionInputs = {
    amount: number;
};

interface QuickActionFormProps {
    account: BankAccount;
    moneyType?: BankMoneyType;
    bankType: string;
}

export const QuickActionForm: FunctionComponent<QuickActionFormProps> = ({
    account,
    bankType,
    moneyType = 'money',
}) => {
    const player = usePlayer();

    // 0 => withdraw, 1 => deposit
    const [quickAction, setQuickAction] = useState<number>(0);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<QuickActionInputs>({ mode: 'onChange' });

    const submitForm: SubmitHandler<QuickActionInputs> = async data => {
        await fetchNui(NuiEvent.BankSafeTransferAction, {
            type: quickAction === 0 ? 'withdraw' : 'deposit',
            accountId: account.id,
            moneyType,
            bankType,
            amount: Number(data.amount),
            refreshNui: 'bank',
        });

        reset();
    };

    useEffect(() => {
        reset();
    }, [account.id]);

    return (
        <Card className="space-y-2.5">
            <Title size="xsmall">Actions rapides</Title>

            <Tabs
                selected={quickAction}
                onChange={index => {
                    setQuickAction(index);
                    reset();
                }}
                tabs={['Retirer', 'Déposer']}
            />

            <form onSubmit={handleSubmit(submitForm)}>
                <Input
                    type="number"
                    prefix="$"
                    {...register('amount', {
                        min: 1,
                        max: quickAction === 0 ? account[moneyType] : player.money[moneyType],
                        required: true,
                        onBlur: e => setValue('amount', parseInt(e.target.value) || undefined),
                    })}
                    placeholder="1000"
                    error={errors.amount}
                    autofill={
                        quickAction === 1 && player.money[moneyType] > 0
                            ? () => setValue('amount', player.money[moneyType] ?? 0)
                            : undefined
                    }
                />

                <Button disabled={isSubmitting}>{quickAction === 0 ? 'Retirer' : 'Déposer'}</Button>
            </form>
        </Card>
    );
};
