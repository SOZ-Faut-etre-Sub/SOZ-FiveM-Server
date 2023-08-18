import React from 'react';

import { Context } from '../utils/context';
import PieceView from './PieceView';

export default function PieceQueue(): JSX.Element {
    const { queue } = React.useContext(Context);
    return (
        <div>
            {queue.queue.map((piece, i) => (
                <PieceView piece={piece} key={i} />
            ))}
        </div>
    );
}
