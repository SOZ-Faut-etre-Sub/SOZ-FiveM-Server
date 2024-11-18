import { animated, useSpring } from '@react-spring/web';
import React, { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BankAccount, BankContact } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import { Button } from '../component/Button';
import { Card } from '../component/Card';
import { ContactCard } from '../component/ContactCard';
import { Input } from '../component/Input';
import { Money } from '../component/Money';
import { Title } from '../component/Title';
import { TransferActionForm } from '../component/TransferActionForm';
import { DashboardProps } from './DashboardPage';

interface HistoryProps extends DashboardProps {
    bankType: string;
    account: BankAccount;
    contacts: BankContact[];
}

interface AddContactFormInputs {
    label: string;
    accountid: string;
}

export const ContactPage: FunctionComponent<HistoryProps> = ({ bankType, account, contacts }) => {
    const player = usePlayer();

    const styles = useSpring({
        from: { y: 30, opacity: 0 },
        to: { y: 0, opacity: 1 },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddContactFormInputs>({ mode: 'onChange' });

    const submitForm: SubmitHandler<AddContactFormInputs> = async data => {
        await fetchNui(NuiEvent.BankContactAdd, {
            label: data.label,
            iban: data.accountid,
        });

        reset();
    };

    const deleteContact = async (contact: BankContact) => {
        await fetchNui(NuiEvent.BankContactDelete, {
            id: contact.id,
        });
    };

    return (
        <animated.div className="flex grow gap-2.5 min-h-0" style={styles}>
            {/* Left pane */}
            <div className="flex flex-col gap-2.5 w-4/6">
                <div className="flex flex-none gap-2.5">
                    <Card className="w-1/2">
                        <Title size="small">Solde bancaire</Title>

                        <div className="flex flex-col justify-center items-center py-2.5">
                            <Title size="xlarge">
                                <Money amount={account.money} />
                            </Title>
                        </div>
                    </Card>

                    <Card className="w-1/2">
                        <Title size="small">Portefeuille</Title>

                        <div className="flex flex-col justify-center items-center py-2.5">
                            <Title size="xlarge">
                                <Money amount={player.money.money} />
                            </Title>
                        </div>
                    </Card>
                </div>

                <Card className="flex flex-col grow gap-5 min-h-0">
                    <Title size="xsmall">Annuaire</Title>

                    <div className="grid grid-cols-2 gap-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-black/20">
                        {contacts.map(contact => (
                            <ContactCard key={contact.id} contact={contact} onDelete={() => deleteContact(contact)} />
                        ))}

                        {contacts.length === 0 && (
                            <div className="col-span-3 flex items-center justify-center text-gray-300 py-10">
                                Vous n'avez pas de bénéficiaire
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Right pane */}
            <div className="w-2/6 space-y-2.5">
                <Card className="space-y-2.5">
                    <Title size="xsmall">Nouveau bénéficiaire</Title>

                    <form onSubmit={handleSubmit(submitForm)} className="mt-2">
                        <div className="flex flex-col gap-4 text-sm text-gray-500">
                            <div>
                                <label htmlFor="label" className="block text-sm font-medium leading-6 text-gray-100">
                                    Nom
                                </label>
                                <Input
                                    type="text"
                                    {...register('label', {
                                        minLength: 2,
                                        maxLength: 50,
                                        required: true,
                                    })}
                                    placeholder="Mon compte"
                                    error={errors.label}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="accountid"
                                    className="block text-sm font-medium leading-6 text-gray-100"
                                >
                                    IBAN
                                </label>
                                <Input
                                    type="text"
                                    {...register('accountid', {
                                        minLength: 2,
                                        maxLength: 50,
                                        required: true,
                                    })}
                                    placeholder="XXXZXXXXTXXX"
                                    error={errors.accountid}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button>Ajouter</Button>
                        </div>
                    </form>
                </Card>

                <TransferActionForm account={account} contacts={contacts} />
            </div>
        </animated.div>
    );
};
