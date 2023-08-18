import React from 'react';

import { Context } from '../utils/context';
import { viewMatrix } from './Game';
import { getClassName } from './Piece';

export default function GameboardView(): JSX.Element {
    const game = React.useContext(Context);
    const matrix = viewMatrix(game);

    return (
        <table className="game-board">
            <tbody>
                {matrix.map((row, i) => {
                    const blocksInRow = row.map((block, j) => {
                        const classString = `game-block ${block ? getClassName(block) : 'block-empty'}`;
                        return <td key={j} className={classString} />;
                    });

                    return <tr key={i}>{blocksInRow}</tr>;
                })}
            </tbody>
        </table>
    );
}
