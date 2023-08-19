import cn from 'classnames';
import React from 'react';

import { Piece } from '../game/Piece';

type CellProps = {
    block: Piece | 'ghost';
};

export const Cell: React.FC<CellProps> = ({ block }) => {
    return (
        <div
            className={cn('aspect-square', {
                //'border border-[#0d1a48]': block,
                'bg-[#3eafff]': block === 'I',
                'bg-[#37d437]': block === 'J',
                'bg-[#e851ea]': block === 'L',
                'bg-[#feda2a]': block === 'O',
                'bg-[#e55f00]': block === 'S',
                'bg-[#1300e5]': block === 'T',
                'bg-[#ff4f4d]': block === 'Z',
                'bg-[#ffffff56]': block === 'ghost',
            })}
        />
    );
};
