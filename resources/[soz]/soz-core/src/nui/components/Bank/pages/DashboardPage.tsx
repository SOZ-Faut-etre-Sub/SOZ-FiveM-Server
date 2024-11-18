import { animated, useSpring } from '@react-spring/web';
import React, { FunctionComponent } from 'react';

import { BankAccount, BankContact, BankStatement } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import { Button } from '../component/Button';
import { Card } from '../component/Card';
import { HistoryTable } from '../component/HistoryTable';
import { Money } from '../component/Money';
import { QuickActionForm } from '../component/QuickActionForm';
import { TextWithCopy } from '../component/TextWithCopy';
import { Title } from '../component/Title';
import { TransferActionForm } from '../component/TransferActionForm';

export interface DashboardProps {
    bankType: string;
    account: BankAccount;
    contacts: BankContact[];
    history: BankStatement[];

    showIban?: boolean;
    showBankAccountName?: boolean;
    showCreateOffshoreAccount?: boolean;
}

export const DashboardPage: FunctionComponent<DashboardProps> = ({
    bankType,
    account,
    contacts,
    history,
    showIban,
    showBankAccountName,
    showCreateOffshoreAccount,
}) => {
    const player = usePlayer();

    const [styles] = useSpring(
        () => ({
            from: { y: 30, opacity: 0 },
            to: { y: 0, opacity: 1 },
            reset: true,
        }),
        [account.id]
    );

    const createOffshoreAccount = async () => {
        await fetchNui(NuiEvent.BankCreateOffshoreAccount);
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
                    <Title size="xsmall">Transactions récentes</Title>

                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-black/20">
                        <HistoryTable account={account} history={history.slice(0, 10)} contacts={contacts} />
                    </div>
                </Card>
            </div>

            {/* Right pane */}
            <div className="w-2/6 space-y-2.5">
                {showBankAccountName && (
                    <Card className="flex justify-center items-center gap-2.5">
                        <Title size="small" className="truncate">
                            {account?.label}
                        </Title>
                        <img
                            className="size-10"
                            src={`/public/images/society/${account?.id}.webp`}
                            alt={account?.id}
                            onError={e => (e.currentTarget.style.display = 'none')}
                        />
                    </Card>
                )}

                <QuickActionForm account={account} bankType={bankType} />
                <TransferActionForm account={account} contacts={contacts} />

                {showCreateOffshoreAccount && (
                    <Card>
                        <h2 className="uppercase text-sm font-light text-gray-300">Compte offshore</h2>
                        <p className="text-sm mt-2">
                            Créez un compte offshore pour sécuriser vos actifs et bénéficier d'une fiscalité
                            avantageuse.
                        </p>
                        <Button onClick={createOffshoreAccount}>Créer un compte</Button>
                    </Card>
                )}

                {showIban && (
                    <Card className="relative flex justify-center -z-10">
                        <TextWithCopy text={account?.id} className="font-semibold">
                            IBAN : {account?.id}
                        </TextWithCopy>
                    </Card>
                )}
            </div>
        </animated.div>
    );
};
