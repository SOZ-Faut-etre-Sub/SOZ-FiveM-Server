import { Dialog, Transition } from '@headlessui/react';
import { animated, useSpring } from '@react-spring/web';
import classnames from 'classnames';
import React, { Fragment, FunctionComponent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaPlus, FaTrash } from 'react-icons/fa';

import { BankAccount, BankContact } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { InputAlertIcon } from '../component/AlertIcon';
import { Card } from '../component/Card';
import { Header } from '../component/Header';
import { QuickActionForm } from '../component/QuickActionForm';
import { TextWithCopy } from '../component/TextWithCopy';
import { moneyFormat } from '../utils/format';
import { DashboardProps } from './DashboardPage';

interface HistoryProps extends DashboardProps {
    account: BankAccount;
    contacts: BankContact[];
}

interface AddContactFormInputs {
    label: string;
    accountid: string;
}

export const ContactPage: FunctionComponent<HistoryProps> = ({ account, contacts, showIban }) => {
    const [isOpen, setIsOpen] = useState(false);

    const styles = useSpring({
        from: { y: 30, opacity: 0 },
        to: { y: 0, opacity: 1 },
    });

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddContactFormInputs>();

    const submitForm: SubmitHandler<AddContactFormInputs> = async data => {
        await fetchNui(NuiEvent.BankContactAdd, {
            label: data.label,
            iban: data.accountid,
        });

        reset();
        closeModal();
    };

    const deleteContact = async (contact: BankContact) => {
        await fetchNui(NuiEvent.BankContactDelete, {
            id: contact.id,
        });
    };

    return (
        <div className="space-y-10 h-full">
            <Header title="Mes bénéficiaires" />

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-30" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1c2128] p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-100">
                                        Ajouter un bénéficiaire
                                    </Dialog.Title>

                                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                        <button
                                            onClick={closeModal}
                                            type="button"
                                            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                            <span className="sr-only">Close</span>
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit(submitForm)} className="mt-2">
                                        <div className="flex flex-col gap-4 text-sm text-gray-500">
                                            <div>
                                                <label
                                                    htmlFor="label"
                                                    className="block text-sm font-medium leading-6 text-gray-100"
                                                >
                                                    Nom
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        {...register('label', { minLength: 2, required: true })}
                                                        type="text"
                                                        className="block w-full rounded-md border-0 pl-2 py-1.5 bg-white/5 text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300/5 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-green-600/50 sm:text-sm sm:leading-6"
                                                        placeholder="Mon compte"
                                                    />
                                                    {errors.label && <InputAlertIcon />}
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="accountid"
                                                    className="block text-sm font-medium leading-6 text-gray-100"
                                                >
                                                    IBAN
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        {...register('accountid', { minLength: 2, required: true })}
                                                        type="text"
                                                        className="block w-full rounded-md border-0 pl-2 py-1.5 bg-white/5 text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300/5 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-green-600/50 sm:text-sm sm:leading-6"
                                                        placeholder="XXXZXXXXTXXX"
                                                    />
                                                    {errors.accountid && <InputAlertIcon />}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-4">
                                            <button className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-2 py-1 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none">
                                                Ajouter
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <animated.div className="flex gap-10 h-[85%]" style={styles}>
                {/* Left pane */}
                <div className="w-4/6 space-y-10">
                    <div className="flex justify-between">
                        <h2 className="uppercase text-sm font-light text-gray-300">Mes bénéficiaires</h2>
                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 py-1 px-2 cursor-pointer rounded-lg border-2 border-green-500/20 hover:border-green-600/20"
                        >
                            <FaPlus className="h-4 w-4" />
                            Ajouter
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                        {contacts.map(contact => (
                            <div key={contact.id} className="col-span-1 flex rounded-md shadow-sm">
                                <div
                                    className={classnames(
                                        'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-cover bg-center',
                                        {
                                            'bg-gray-200/15': !contact?.avatar,
                                        }
                                    )}
                                    style={{
                                        backgroundImage: `url(${contact?.avatar})`,
                                    }}
                                />
                                <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200/10 bg-white/5">
                                    <div className="flex-1 truncate px-4 py-2 text-sm">
                                        <p className="font-medium text-gray-100">{contact.label}</p>
                                        <p className="text-gray-500">{contact.accountid}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            type="button"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={() => deleteContact(contact)}
                                        >
                                            <FaTrash className="h-3 w-3 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {contacts.length === 0 && (
                            <div className="col-span-3 flex items-center justify-center text-gray-300">
                                Vous n'avez pas de bénéficiaire
                            </div>
                        )}
                    </div>
                </div>

                {/* Right pane */}
                <div className="w-2/6 space-y-10">
                    <Card className="space-y-6">
                        <h2 className="uppercase text-sm font-light text-gray-300">Solde bancaire actuel</h2>
                        <p className="text-center font-semibold text-6xl">{moneyFormat(account.money)}</p>
                        <div className="text-sm">
                            <TextWithCopy text={account?.id}>
                                IBAN: <span className="font-semibold">{account?.id}</span>
                            </TextWithCopy>
                        </div>
                    </Card>

                    <QuickActionForm account={account} />
                </div>
            </animated.div>
        </div>
    );
};
