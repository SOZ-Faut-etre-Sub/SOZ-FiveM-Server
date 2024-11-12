import { animated, useSpring } from '@react-spring/web';
import React, { FunctionComponent } from 'react';

import { BankAccount, BankContact, BankStatement } from '../../../../shared/bank';
import { usePlayer } from '../../../hook/data';
import { Card } from '../component/Card';
import { Header } from '../component/Header';
import { HistoryTable } from '../component/HistoryTable';
import { QuickActionForm } from '../component/QuickActionForm';
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

    const [styles] = useSpring(
        () => ({
            from: { y: 30, opacity: 0 },
            to: { y: 0, opacity: 1 },
            reset: true,
        }),
        [account.id]
    );

    return (
        <>
            <Header category={account.type === 'player' ? 'Compte Personnel' : 'Compte Société'} title="Historique" />

            <animated.div className="flex grow gap-2.5 min-h-0" style={styles}>
                {/* Left pane */}
                <Card className="flex flex-col grow w-4/6">
                    <Title size="xsmall">Transactions récentes</Title>

                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-black/20">
                        <HistoryTable account={account} history={history} contacts={contacts} />
                    </div>
                </Card>

                {/* Right pane */}
                <div className="w-2/6 space-y-2.5">
                    <div className="flex gap-2.5">
                        <Card className="w-1/2">
                            <Title size="xsmall" className="truncate">
                                Solde bancaire
                            </Title>

                            <div className="flex flex-col justify-center items-center py-2.5">
                                <Title size="large">{moneyFormat(account.money)}</Title>
                            </div>
                        </Card>

                        <Card className="w-1/2">
                            <Title size="xsmall">Portefeuille</Title>

                            <div className="flex flex-col justify-center items-center py-2.5">
                                <Title size="large">{moneyFormat(Number(player.money.money))}</Title>
                            </div>
                        </Card>
                    </div>

                    <QuickActionForm bankType={bankType} account={account} />
                    <TransferActionForm account={account} contacts={contacts} />
                </div>
            </animated.div>
        </>
    );
};
