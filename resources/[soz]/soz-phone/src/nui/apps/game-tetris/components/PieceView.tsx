import cn from 'classnames';
import React from 'react';

import { getBlocks, getClassName, Piece } from '../game/Piece';
import { usePieceColor } from '../hooks/usePieceColor';

type Props = {
    piece?: Piece;
};

const defaultBlock = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
] as const;

const PieceView: React.FC<Props> = ({ piece }): JSX.Element => {
    const fromPiece = piece && getBlocks(piece)[0];
    const blocks = fromPiece ?? defaultBlock;
    const pieceColor = usePieceColor();

    const rows = blocks.map((row, i) => {
        const blocksInRow = row.map((block, j) => {
            return (
                <td
                    key={j}
                    className={cn('h-5 w-5', {
                        [pieceColor(piece)]: block,
                    })}
                />
            );
        });

        return <tr key={i}>{blocksInRow}</tr>;
    });
    return (
        <table className="h-full w-full">
            <tbody>{rows}</tbody>
        </table>
    );
};

export default PieceView;
