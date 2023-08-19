import cn from 'classnames';
import React from 'react';

import { viewMatrix } from '../game/Game';
import { getClassName } from '../game/Piece';
import { usePieceColor } from '../hooks/usePieceColor';
import { Context } from '../utils/context';

export default function GameboardView(): JSX.Element {
    const game = React.useContext(Context);
    const matrix = viewMatrix(game);

    const pieceColor = usePieceColor();

    return (
        <div className="border-4 border-blue-400 bg-[#0d1a48] p-1 rounded-xl overflow-hidden h-[550px]">
            <table className="h-full w-full">
                <tbody>
                    {matrix.map((row, i) => {
                        const blocksInRow = row.map((block, j) => {
                            return <td key={j} className={pieceColor(block)} />;
                        });

                        return <tr key={i}>{blocksInRow}</tr>;
                    })}
                </tbody>
            </table>
        </div>
    );
}
