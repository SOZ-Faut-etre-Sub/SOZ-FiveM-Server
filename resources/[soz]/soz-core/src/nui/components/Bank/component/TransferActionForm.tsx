import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/solid';
import classnames from 'classnames';
import React, { Fragment, FunctionComponent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiChevronUpDown } from 'react-icons/hi2';

import { BankAccount, BankContact } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { inputErrorMessage } from '../utils/format';
import { Card } from './Card';

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
        formState: { errors },
    } = useForm<TransferActionInputs>({ mode: 'onBlur' });

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

    return (
        <Card>
            <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                <h2 className="uppercase text-sm font-light text-gray-300">Transfert d'argent</h2>

                <div className="relative rounded-md shadow-sm">
                    <Combobox value={selected} onChange={setSelected}>
                        <div className="relative w-full cursor-default overflow-hidden rounded-md ring-1 ring-inset ring-gray-400/50 text-left focus:outline-none">
                            <Combobox.Input
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-white/5 text-gray-100 focus:ring-0"
                                displayValue={(contact: BankContact) => contact.label}
                                onChange={event => setQuery(event.target.value)}
                                placeholder="Rechercher un bénéficiaire"
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                        >
                            <Combobox.Options
                                {...register('account', {
                                    required: true,
                                })}
                                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#3d4547] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
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
                                        <Combobox.Option
                                            key={contact.id}
                                            className={({ active }) =>
                                                classnames(`relative cursor-pointer select-none py-2 pl-10 pr-4`, {
                                                    'bg-teal-600 text-white': active,
                                                    'text-gray-100': !active,
                                                })
                                            }
                                            value={contact}
                                        >
                                            {({ selected, active }) => (
                                                <>
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
                                                            className={classnames(
                                                                `absolute inset-y-0 left-0 flex items-center pl-3`,
                                                                {
                                                                    'text-white': active,
                                                                    'text-teal-600': !active,
                                                                }
                                                            )}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </Combobox>
                    {errors.account && (
                        <span className="text-red-400 text-sm">{inputErrorMessage(errors.account.type)}</span>
                    )}
                </div>

                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-white sm:text-sm">$</span>
                    </div>
                    <input
                        {...register('amount', {
                            min: 1,
                            max: account.money,
                            required: true,
                        })}
                        type="number"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 bg-white/5 text-white ring-1 ring-inset ring-gray-400/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500/50 sm:text-sm sm:leading-6"
                        placeholder="1000"
                    />
                </div>
                {errors.amount && <span className="text-red-400 text-sm">{inputErrorMessage(errors.amount.type)}</span>}

                <input
                    {...register('reason', {
                        maxLength: 90,
                    })}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 px-3 bg-white/5 text-white ring-1 ring-inset ring-gray-400/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500/50 sm:text-sm sm:leading-6"
                    placeholder="Libellé du transfert (optionel)"
                />
                {errors.reason && <span className="text-red-400 text-sm">{inputErrorMessage(errors.reason.type)}</span>}

                <button className="border-2 border-green-500/50 w-full p-2 rounded-md">Transférer</button>
            </form>
        </Card>
    );
};
