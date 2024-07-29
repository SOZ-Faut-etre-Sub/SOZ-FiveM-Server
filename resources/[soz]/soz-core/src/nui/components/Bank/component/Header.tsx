import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import { FaMoneyBillWave, FaPiggyBank } from 'react-icons/fa';

import { usePlayer } from '../../../hook/data';
import { Mugshot } from '../../Player/Mugshot';
import { FORMAT_CURRENCY } from '../utils/format';

type HeaderProps = {
    title: ReactNode;
    bankMoney?: number;
};

export const Header: FunctionComponent<HeaderProps> = ({ title, bankMoney }) => {
    const player = usePlayer();

    const playerMoney = useMemo<number>(() => {
        if (!player) return 0;

        return Number(player.money.money) + Number(player.money.marked_money);
    }, [player.money]);

    return (
        <div className="flex justify-between items-center">
            <span className="text-3xl font-semibold">{title}</span>
            <span className="flex items-center gap-3 text-md">
                <Mugshot
                    player={player}
                    containerClass="h-10 w-10 rounded-full"
                    mugshotClass="h-10 w-10 rounded-full"
                />
                <div className="flex flex-col">
                    <span>
                        {player?.charinfo?.firstname || 'John'} {player?.charinfo?.lastname || 'Doe'}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-white/70">
                        {bankMoney && (
                            <>
                                <FaPiggyBank /> {bankMoney.toLocaleString('en-US', FORMAT_CURRENCY)}
                            </>
                        )}
                        <FaMoneyBillWave /> {playerMoney.toLocaleString('en-US', FORMAT_CURRENCY)}
                    </span>
                </div>
            </span>
        </div>
    );
};
