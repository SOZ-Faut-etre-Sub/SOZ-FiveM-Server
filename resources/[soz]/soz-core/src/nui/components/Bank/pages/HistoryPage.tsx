import { animated, useSpring } from '@react-spring/web';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { BankAccount, BankContact, BankStatement } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import { Card } from '../component/Card';
import { HistoryTable } from '../component/HistoryTable';
import { QuickActionForm } from '../component/QuickActionForm';
import { Tabs } from '../component/Tabs';
import { Title } from '../component/Title';
import { TransferActionForm } from '../component/TransferActionForm';
import { moneyFormat } from '../utils/format';

interface HistoryProps {
    bankType: string;
    account: BankAccount;
    history?: BankStatement[];
    contacts?: BankContact[];
}

export const HistoryPage: FunctionComponent<HistoryProps> = ({ bankType, account, contacts, history }) => {
    const player = usePlayer();

    const [action, setAction] = useState<number>(0);
    const handleAction = async (index: number) => {
        let filter = 'all';
        switch (index) {
            case 0:
                filter = 'all';
                break;
            case 1:
                filter = 'withdraw';
                break;
            case 2:
                filter = 'deposit';
                break;
            case 3:
                filter = 'transfer';
                break;
        }

        await fetchNui(NuiEvent.BankHistoryFilter, filter);
        setAction(index);
    };

    const [styles] = useSpring(
        () => ({
            from: { y: 30, opacity: 0 },
            to: { y: 0, opacity: 1 },
            reset: true,
        }),
        [account.id]
    );

    useEffect(() => {
        return () => {
            setAction(0);
            fetchNui(NuiEvent.BankHistoryFilter, 'all');
        };
    }, []);

    return (
        <animated.div className="flex flex-col gap-2.5 grow min-h-0" style={styles}>
            <div className="flex gap-2.5">
                <div className="flex flex-col grow w-4/6">
                    <Tabs
                        selected={action}
                        onChange={handleAction}
                        tabs={['Tout voir', 'Dépense', 'Recette', 'Transfert']}
                        className="p-2.5"
                        reverseColor
                    />
                </div>

                <div className="w-2/6 space-y-2.5">
                    <div className="flex gap-2.5">
                        <Card className="w-1/2">
                            <Title size="xxsmall" className="truncate">
                                Solde bancaire
                            </Title>

                            <div className="flex flex-col justify-center items-center">
                                <Title size="small">{moneyFormat(account.money)}</Title>
                            </div>
                        </Card>

                        <Card className="w-1/2">
                            <Title size="xxsmall">Portefeuille</Title>

                            <div className="flex flex-col justify-center items-center">
                                <Title size="small">{moneyFormat(Number(player.money.money))}</Title>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="flex grow gap-2.5 min-h-0">
                {/* Left pane */}
                <Card className="flex flex-col grow w-4/6">
                    <Title size="xsmall">Transactions récentes</Title>

                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-black/20">
                        <HistoryTable account={account} history={history} contacts={contacts} />
                    </div>
                </Card>

                {/* Right pane */}
                <div className="w-2/6 space-y-2.5">
                    <QuickActionForm bankType={bankType} account={account} />
                    <TransferActionForm account={account} contacts={contacts} />
                </div>
            </div>
        </animated.div>
    );
};
