import cn from 'classnames';
import React, { FunctionComponent } from 'react';

import { BankAccount, BankContact, BankStatement } from '../../../../shared/bank';
import { useHudColor } from '../../Hud/hooks/useHudColor';
import FileIcon from '../assets/file.svg';
import { PlayerAccountRegExp } from '../utils/format';
import { Money } from './Money';
import { TextWithCopy } from './TextWithCopy';

interface HistoryRowProps {
    account: BankAccount;
    history: BankStatement;
    contacts?: BankContact[];
}

export const HistoryRow: FunctionComponent<HistoryRowProps> = ({ account, contacts, history }) => {
    const { isDaltonism } = useHudColor();

    const isSource = history.source_accountid === account.id;

    const title = isSource ? 'Paiement à' : 'Virement de';
    const targetAccount = isSource ? history.target_accountid : history.source_accountid;
    const targetLabel = isSource ? history.target_label : history.source_label;
    const targetImage = (isSource ? history.target_accountid : history.source_accountid).replace('offshore_', '');

    const targetWithLabel = () => {
        const contact = contacts?.find(c => c.accountid === targetAccount);
        if (contact) {
            return `${contact.label} (${contact.accountid})`;
        }

        if (account.type === 'player' && targetAccount.match(PlayerAccountRegExp)) {
            return targetAccount;
        }

        return targetLabel;
    };

    return (
        <div className="flex items-center gap-4">
            <FileIcon className="size-5" />
            <div className="flex flex-col min-w-0 grow">
                {history.source_accountid === '' || history.target_accountid === '' ? (
                    <span>Action effectuée sur votre compte</span>
                ) : (
                    <span className="flex items-center gap-1.5">
                        {title}
                        <img
                            className="w-5 h-5"
                            src={`https://soz.zerator.com/static/game/images/society/${targetImage}.webp`}
                            alt={targetLabel}
                            onError={e => (e.currentTarget.style.display = 'none')}
                        ></img>
                        <TextWithCopy text={targetAccount} className="font-semibold">
                            {targetWithLabel()}
                        </TextWithCopy>
                    </span>
                )}
                <span className="text-sm truncate">{history.reason}</span>
            </div>

            <span
                className={cn('font-semibold rounded-lg shadow px-2.5 py-1', {
                    'bg-[#AD1F1F33] text-[#AD1F1F]': !isDaltonism && isSource,
                    'bg-[#32912133] text-[#268116]': !isDaltonism && !isSource,
                    'bg-[#B314E833] text-[#B314E8]': isDaltonism && isSource,
                    'bg-[#00FFFF33] text-[#00FFFF]': isDaltonism && !isSource,
                })}
            >
                {isSource ? '- ' : '+ '}
                <Money amount={history.amount} useColor={false} />
            </span>
        </div>
    );
};
