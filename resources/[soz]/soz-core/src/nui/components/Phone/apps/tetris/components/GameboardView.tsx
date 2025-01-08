import React, { FunctionComponent, useContext } from 'react';

import { viewMatrix } from '../game/Game';
import { Context } from '../utils/context';
import { Cell } from './cell';

export const GameboardView: FunctionComponent = () => {
    const game = useContext(Context);
    const matrix = viewMatrix(game);

    return (
        <div className="border-4 border-blue-400 bg-[#0d1a48]/60 p-1 rounded-xl overflow-hidden">
            <table className="h-full w-full border-collapse border border-slate-500">
                <tbody>
                    {matrix.map((row, i) => {
                        const blocksInRow = row.map((block, j) => {
                            return (
                                <td key={j} className="border-collapse border border-slate-500/30">
                                    <Cell block={block} />
                                </td>
                            );
                        });

                        return <tr key={i}>{blocksInRow}</tr>;
                    })}
                </tbody>
            </table>
        </div>
    );
};
