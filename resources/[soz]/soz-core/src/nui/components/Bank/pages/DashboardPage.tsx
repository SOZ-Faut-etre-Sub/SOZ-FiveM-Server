import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { FunctionComponent, useState } from 'react';

import { BankUiData } from '../../../../shared/bank';
import { Card } from '../component/Card';
import { Header } from '../component/Header';
import { HistoryTable } from '../component/HistoryTable';

export const DashboardPage: FunctionComponent<BankUiData> = ({ accounts: { personal } }) => {
    const [quickAction, setQuickAction] = useState<number>(0);

    const tabClass = (tab: any) => {
        return classnames('p-1 rounded-md focus:ring-0 ', { 'bg-white/10': tab.selected });
    };

    return (
        <div className="space-y-10">
            <Header title="Tableau de bord" />

            <div className="flex gap-10">
                {/* Left pane */}
                <div className="w-4/6 space-y-10">
                    <Card className="space-y-6">
                        <h2 className="uppercase text-sm font-light text-gray-300">Solde bancaire actuel</h2>
                        <p className="text-center font-semibold text-6xl">$ {personal.money}</p>
                        <div className="text-sm">
                            IBAN: <span className="font-semibold">{personal.id}</span>
                        </div>
                    </Card>

                    <div>
                        <h2 className="uppercase text-sm font-light text-gray-300">Transactions récentes</h2>

                        <HistoryTable
                            rows={[
                                {
                                    type: 'withdraw',
                                    accountId: 'ID',
                                    accountName: 'Zerator',
                                    description: 'cagnotte',
                                    amount: 512,
                                    date: new Date(2024, 6, 26, 10, 0),
                                },
                                {
                                    type: 'deposit',
                                    accountId: 'ID',
                                    accountName: 'Entreprise',
                                    description: 'salaire',
                                    amount: 1024,
                                    date: new Date(2024, 6, 26, 16, 0),
                                },
                                {
                                    type: 'deposit',
                                    accountId: 'ID',
                                    accountName: 'Entreprise',
                                    description: 'salaire',
                                    amount: 1024,
                                    date: new Date(2024, 6, 25, 16, 0),
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* Right pane */}
                <div className="w-2/6 space-y-10">
                    <Card>
                        <h2 className="uppercase text-sm font-light text-gray-300">Actions rapides</h2>
                        <Tab.Group selectedIndex={quickAction} onChange={index => setQuickAction(index)}>
                            <Tab.List className="grid grid-cols-2 gap-3 p-1 my-3 bg-white/5 text-gray-200 rounded-md">
                                <Tab className={tabClass}>Retirer</Tab>
                                <Tab className={tabClass}>Déposer</Tab>
                            </Tab.List>
                        </Tab.Group>

                        <div className="relative my-6 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-white sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 bg-white/5 text-white ring-1 ring-inset ring-gray-400/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500/50 sm:text-sm sm:leading-6"
                                placeholder="1000"
                            />
                        </div>

                        <button className="border-2 border-green-500/50 w-full p-2 rounded-md">
                            {quickAction === 0 ? 'Retirer' : 'Déposer'}
                        </button>
                    </Card>

                    <Card>
                        <h2 className="uppercase text-sm font-light text-gray-300">Mes cartes bancaires</h2>
                    </Card>
                </div>
            </div>
        </div>
    );
};
