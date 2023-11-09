import { Transition } from '@headlessui/react';
import { FunctionComponent, useEffect, useState } from 'react';

import { uuidv4 } from '../../../core/utils';
import { PlayerData } from '../../../shared/player';
import { useNuiEvent } from '../../hook/nui';
import { BankCard } from './BankCard';
import { HealthCard } from './HealthCard';
import { IdentityCard } from './IdentityCard';
import { LicenseCard } from './LicenseCard';

type CardData = {
    type: 'identity' | 'license' | 'health' | 'bank';
    player: PlayerData;
    iban?: string;
};

type CardItemProps = {
    card: CardData;
};

type CardQueueItem = {
    card: CardData;
    id: string;
};

export const CardItem: FunctionComponent<CardItemProps> = ({ card }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);

        setTimeout(() => {
            setShow(false);
        }, 10000);
    }, []);

    return (
        <Transition
            show={show}
            enter="transform ease-out duration-300 transition"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transform ease-in duration-300 transition"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            {card.type === 'identity' && <IdentityCard player={card.player} />}
            {card.type === 'license' && <LicenseCard player={card.player} />}
            {card.type === 'health' && <HealthCard player={card.player} />}
            {card.type === 'bank' && (
                <BankCard
                    account={card.iban}
                    name={`${card.player.charinfo.firstname} ${card.player.charinfo.lastname}`}
                />
            )}
        </Transition>
    );
};

export const CardApp: FunctionComponent = () => {
    const [cardQueue, setCardQueue] = useState<CardQueueItem[]>([]);

    useNuiEvent('card', 'addCard', card => {
        setCardQueue(prev => [
            {
                card,
                id: uuidv4(),
            },
            ...prev,
        ]);

        setTimeout(() => {
            setCardQueue(prev => {
                const newQueue = [...prev];
                newQueue.pop();
                return newQueue;
            });
        }, 15000);
    });

    if (cardQueue.length === 0) {
        return null;
    }

    return (
        <div className="absolute w-full h-full">
            <div className="flex flex-column justify-end h-full">
                <div className="h-full overflow-hidden p-6">
                    {cardQueue.map(item => {
                        return <CardItem key={item.id} card={item.card} />;
                    })}
                </div>
            </div>
        </div>
    );
};
