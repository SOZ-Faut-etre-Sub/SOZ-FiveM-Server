import cn from 'classnames';
import React from 'react';

import { Piece } from '../game/Piece';

type CellProps = {
    block: Piece | 'ghost';
};

export const Cell: React.FC<CellProps> = ({ block }) => {
    switch (block) {
        case 'I':
            return (
                <svg viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M123.67 0.0300293H0.339966V123.53H123.67V0.0300293Z" fill="#31AFB7" />
                    <path d="M123.66 0.0300293H0.339966V123.53L123.66 0.0300293Z" fill="#36D8ED" />
                    <path d="M98.4 25.3301H25.6V98.2301H98.4V25.3301Z" fill="#32C0CB" />
                </svg>
            );
        case 'O':
            return (
                <svg viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M123.85 0.679932H0.0100098V124H123.85V0.679932Z" fill="#A99518" />
                    <path d="M0.0100098 124V0.679932H123.84L0.0100098 124Z" fill="#F9E516" />
                    <path d="M98.48 25.9399H25.37V98.7399H98.48V25.9399Z" fill="#D7BF0F" />
                </svg>
            );
        case 'S':
            return (
                <svg viewBox="0 0 125 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M124.2 0H0.700012V123.8H124.2V0Z" fill="#2B8E30" />
                    <path d="M0.700012 123.8V0H124.2L0.700012 123.8Z" fill="#38D43F" />
                    <path d="M98.9 25.3599H26V98.4499H98.9V25.3599Z" fill="#34B03A" />
                </svg>
            );
        case 'T':
            return (
                <svg viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M123.74 0.669922H0.23999V123.99H123.74V0.669922Z" fill="#8B0E97" />
                    <path d="M0.23999 124V0.669922H123.74L0.23999 124Z" fill="#EF74FF" />
                    <path d="M98.43 25.9299H25.53V98.7399H98.43V25.9299Z" fill="#CE2AE4" />
                </svg>
            );
        case 'Z':
            return (
                <svg viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M123.86 0.509766H0.200012V124H123.86V0.509766Z" fill="#862321" />
                    <path d="M0.200012 124V0.509766H123.86L0.200012 124Z" fill="#DB2622" />
                    <path d="M98.53 25.8096H25.53V98.7096H98.53V25.8096Z" fill="#B12825" />
                </svg>
            );
        case 'L':
            return (
                <svg viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M124 0.25H0.679932V123.75H124V0.25Z" fill="#AB7722" />
                    <path d="M124 0.25H0.679932V123.75L124 0.25Z" fill="#FDBC39" />
                    <path d="M98.7399 25.55H25.9399V98.4601H98.7399V25.55Z" fill="#D99926" />
                </svg>
            );
        case 'J':
            return (
                <svg viewBox="0 0 125 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M124.31 0.25H0.98999V123.75H124.31V0.25Z" fill="#3C3C9E" />
                    <path d="M124.32 0.25H0.98999V123.75L124.32 0.25Z" fill="#7062F0" />
                    <path d="M99.05 25.55H26.25V98.4601H99.05V25.55Z" fill="#504ACC" />
                </svg>
            );
    }

    return (
        <div
            className={cn('aspect-square', {
                'bg-[#ffffff20]': block === 'ghost',
            })}
        />
    );
};
