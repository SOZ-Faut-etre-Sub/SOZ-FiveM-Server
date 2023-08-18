import React from 'react';

import { getBlocks, getClassName, Piece } from './Piece';

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

    const rows = blocks.map((row, i) => {
        const blocksInRow = row.map((block, j) => {
            let classString = 'game-block ';

            if (piece && block) {
                classString += getClassName(piece);
            } else {
                classString += 'block-empty';
            }

            return <td key={j} className={classString} />;
        });

        return <tr key={i}>{blocksInRow}</tr>;
    });
    return (
        <table className="piece-view">
            <tbody>{rows}</tbody>
        </table>
    );
};

export default PieceView;
