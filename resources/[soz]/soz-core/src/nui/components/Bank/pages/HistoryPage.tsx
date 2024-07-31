import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';

import { BankAccount, BankStatement } from '../../../../shared/bank';
import { Card } from '../component/Card';
import { Header } from '../component/Header';
import { HistoryTable } from '../component/HistoryTable';
import { QuickActionForm } from '../component/QuickActionForm';
import { TextWithCopy } from '../component/TextWithCopy';
import { moneyFormat } from '../utils/format';

interface HistoryProps {
    account: BankAccount;
    history?: BankStatement[];
    showIban?: boolean;
}

export const HistoryPage: FunctionComponent<HistoryProps> = ({ account, history, showIban }) => {
    const styles = useSpring({
        from: { y: 30, opacity: 0 },
        to: { y: 0, opacity: 1 },
    });

    return (
        <div className="space-y-10 h-full">
            <Header title="Historique" />

            <animated.div className="flex gap-10 h-full" style={styles}>
                {/* Left pane */}
                <div className="w-4/6 h-full">
                    <h2 className="uppercase text-sm font-light text-gray-300">Transactions récentes</h2>

                    <div className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                        <HistoryTable account={account} history={history} />
                    </div>
                </div>

                {/* Right pane */}
                <div className="w-2/6 space-y-10">
                    <Card className="space-y-6">
                        <h2 className="uppercase text-sm font-light text-gray-300">Solde bancaire actuel</h2>
                        <p className="text-center font-semibold text-6xl">{moneyFormat(account.money)}</p>
                        <div className="text-sm">
                            {showIban ? (
                                <TextWithCopy text={account?.id}>
                                    IBAN: <span className="font-semibold">{account?.id}</span>
                                </TextWithCopy>
                            ) : (
                                <>
                                    Propriétaire: <span className="font-semibold">{account?.label}</span>
                                </>
                            )}
                        </div>
                    </Card>

                    <QuickActionForm account={account} />
                </div>
            </animated.div>
        </div>
    );
};
