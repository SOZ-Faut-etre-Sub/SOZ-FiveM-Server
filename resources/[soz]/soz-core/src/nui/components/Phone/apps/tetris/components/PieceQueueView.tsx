import React, { FunctionComponent, useContext } from 'react';

import { Context } from '../utils/context';
import { PieceView } from './PieceView';

export const PieceQueue: FunctionComponent = () => {
    const { queue } = useContext(Context);

    return (
        <div className="flex flex-col space-y-4 p-1 bg-[#0d1a48]/60">
            {queue.queue.map((piece, i) => (
                <PieceView piece={piece} key={i} />
            ))}
        </div>
    );
};
