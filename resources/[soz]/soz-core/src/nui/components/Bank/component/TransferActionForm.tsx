import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/solid';
import classnames from 'classnames';
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BankAccount, BankContact } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { useHudColor } from '../../Hud/hooks/useHudColor';
import MoveIcon from '../assets/move.svg';
import { inputErrorMessage } from '../utils/format';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { Title } from './Title';

type TransferActionInputs = {
    account: string;
    amount: number;
    reason: string;
};

interface TransferActionFormProps {
    account: BankAccount;
    contacts: BankContact[];
}

export const TransferActionForm: FunctionComponent<TransferActionFormProps> = ({ account, contacts }) => {
    const [selected, setSelected] = useState<BankContact>();
    const [query, setQuery] = useState<string>('');

    const { glassmorphismColors, button, color } = useHudColor();

    const filteredContacts =
        query === ''
            ? contacts
            : contacts.filter(
                  contact =>
                      contact.label.toLowerCase().includes(query.toLowerCase()) ||
                      contact.accountid.toLowerCase().includes(query.toLowerCase())
              );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TransferActionInputs>({ mode: 'onChange' });

    const submitForm: SubmitHandler<TransferActionInputs> = async data => {
        if (!selected) return;

        await fetchNui(NuiEvent.BankTransferAction, {
            accountSource: account.id,
            accountTarget: selected.accountid,
            moneyType: 'money',
            amount: Number(data.amount),
            reason: data.reason,
        });

        setSelected(undefined);
        setQuery('');
        reset();
    };

    useEffect(() => {
        reset();
    }, [account.id]);

    return (
        <Card>
            <form onSubmit={handleSubmit(submitForm)} className="space-y-2.5">
                <Title size="xsmall">Transfert d'argent</Title>

                <div className="relative rounded-md shadow-sm">
                    <Combobox
                        onChange={(v: BankContact) => {
                            setValue('account', v.accountid);
                            setSelected(v);
                        }}
                    >
                        <div className="relative w-full cursor-default overflow-hidden rounded-md ring-0 text-left focus:outline-none">
                            <Combobox.Input
                                placeholder="Rechercher un bénéficiaire"
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0 placeholder:text-inherit placeholder:opacity-50"
                                displayValue={(contact: BankContact) => contact.label}
                                onChange={event => setQuery(event.target.value)}
                                style={{
                                    backgroundColor: glassmorphismColors.background,
                                    color,
                                }}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <MoveIcon className="size-5" aria-hidden="true" />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Combobox.Options
                                {...register('account', {
                                    required: true,
                                })}
                                className="absolute z-10 mt-1 max-h-60 w-full rounded-md py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-black/20 backdrop-blur-xl"
                                style={{
                                    backgroundColor: button.secondary.background,
                                    color: button.secondary.color,
                                }}
                            >
                                {filteredContacts.length === 0 && query !== '' ? (
                                    <Combobox.Option
                                        className="relative cursor-pointer select-none py-2 pl-10 pr-4"
                                        value={{ accountid: query, label: query }}
                                    >
                                        {query}
                                    </Combobox.Option>
                                ) : (
                                    filteredContacts.map(contact => (
                                        <Combobox.Option key={contact.id} value={contact}>
                                            {({ selected, active }) => (
                                                <div
                                                    className="relative cursor-pointer select-none py-2 pl-10 pr-4"
                                                    style={{
                                                        backgroundColor: active && button.primary.background,
                                                        color: active && button.primary.color,
                                                    }}
                                                >
                                                    <span
                                                        className={classnames(`block truncate`, {
                                                            'font-medium': selected,
                                                            'font-normal': !selected,
                                                        })}
                                                    >
                                                        {contact.label}
                                                    </span>
                                                    {selected ? (
                                                        <span
                                                            className="absolute inset-y-0 left-0 flex items-center pl-3"
                                                            style={{
                                                                color: active
                                                                    ? button.primary.color
                                                                    : button.secondary.color,
                                                            }}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </div>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </Combobox>
                    {errors.account && (
                        <span className="text-red-400 text-sm pt-1 px-2">{inputErrorMessage(errors.account.type)}</span>
                    )}
                </div>

                <Input
                    type="number"
                    prefix="$"
                    {...register('amount', {
                        min: 1,
                        max: account.money,
                        required: true,
                        onBlur: e => setValue('amount', parseInt(e.target.value) || undefined),
                    })}
                    placeholder="1000"
                    error={errors.amount}
                />

                <Input
                    type="text"
                    {...register('reason', {
                        maxLength: 90,
                    })}
                    placeholder="Libellé du transfert (optionel)"
                    error={errors.reason}
                />

                <Button disabled={isSubmitting}>Transférer</Button>
            </form>
        </Card>
    );
};
