import React, { FunctionComponent, ReactNode } from 'react';

import { usePlayer } from '../../../hook/data';
import { Mugshot } from '../../Player/Mugshot';
import { Title } from './Title';

type HeaderProps = {
    category?: ReactNode;
    title?: ReactNode;
};

export const Header: FunctionComponent<HeaderProps> = ({ category, title }) => {
    const player = usePlayer();

    return (
        <div className="flex flex-none justify-between items-center h-24">
            <div className="flex flex-col">
                <Title size="small" uppercase={false}>
                    {category}
                </Title>
                <Title size="large">{title}</Title>
            </div>

            <span className="flex flex-col items-center gap-1.5 text-md">
                <Mugshot
                    player={player}
                    containerClass="h-12 w-12 rounded-full"
                    mugshotClass="h-12 w-12 rounded-full"
                />
                <span>
                    {player?.charinfo?.firstname || 'John'} {player?.charinfo?.lastname || 'Doe'}
                </span>
            </span>
        </div>
    );
};
