import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';

import { BankAccount, BankContact, BankStatement } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { Card } from '../component/Card';
import { Header } from '../component/Header';
import { HistoryTable } from '../component/HistoryTable';
import { QuickActionForm } from '../component/QuickActionForm';
import { TextWithCopy } from '../component/TextWithCopy';
import { TransferActionForm } from '../component/TransferActionForm';
import { moneyFormat } from '../utils/format';

export interface DashboardProps {
    account: BankAccount;
    contacts: BankContact[];
    history: BankStatement[];
    showIban?: boolean;
    showCreateOffshoreAccount?: boolean;
}

export const DashboardPage: FunctionComponent<DashboardProps> = ({
    account,
    contacts,
    history,
    showIban,
    showCreateOffshoreAccount,
}) => {
    const [styles] = useSpring(
        () => ({
            from: { y: 30, opacity: 0 },
            to: { y: 0, opacity: 1 },
            reset: true,
        }),
        [account]
    );

    const createOffshoreAccount = async () => {
        await fetchNui(NuiEvent.BankCreateOffshoreAccount);
    };

    return (
        <div className="space-y-10 h-full">
            <Header title="Tableau de bord" />

            <animated.div className="flex gap-10 h-full" style={styles}>
                {/* Left pane */}
                <div className="w-4/6 space-y-10">
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

                    <div className="h-full">
                        <h2 className="uppercase text-sm font-light text-gray-300">Transactions récentes</h2>

                        <div className="h-[65%] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                            <HistoryTable account={account} history={history.slice(0, 10)} />
                        </div>
                    </div>
                </div>

                {/* Right pane */}
                <div className="w-2/6 space-y-10">
                    <QuickActionForm account={account} />
                    <TransferActionForm account={account} contacts={contacts} />

                    {showCreateOffshoreAccount && (
                        <Card>
                            <h2 className="uppercase text-sm font-light text-gray-300">Compte offshore</h2>
                            <p className="text-sm mt-2">
                                Créez un compte offshore pour sécuriser vos actifs et bénéficier d'une fiscalité
                                avantageuse.
                            </p>
                            <button
                                onClick={createOffshoreAccount}
                                className="border-2 mt-3 border-green-500/50 w-full p-2 rounded-md"
                            >
                                Créer un compte
                            </button>
                        </Card>
                    )}
                </div>
            </animated.div>
        </div>
    );
};
