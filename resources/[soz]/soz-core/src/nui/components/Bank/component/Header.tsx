import React, { FunctionComponent } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';

import { usePlayer } from '../../../hook/data';
import { Mugshot } from '../../Player/Mugshot';

type HeaderProps = {
    title: string;
};

export const Header: FunctionComponent<HeaderProps> = ({ title }) => {
    const player = usePlayer();

    return (
        <div className="flex justify-between items-end">
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
                    <span className="flex items-center gap-2 text-sm">
                        <FaMoneyBillWave /> 512
                    </span>
                </div>
            </span>
        </div>
    );
};
