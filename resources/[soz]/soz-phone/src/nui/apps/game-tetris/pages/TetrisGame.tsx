import { DataContainer } from '@ui/components/games/DataContainer';
import { LeaderBoardIcon } from '@ui/components/games/LeaderBoardIcon';
import cn from 'classnames';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useCitizenID } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { store } from '../../../store';
import { AppContent } from '../../../ui/components/AppContent';
import { ActionButton } from '../../../ui/old_components/ActionButton';
import Tetris from '../components/Tetris';

export const TetrisGame: React.FC = () => {
    const navigate = useNavigate();

    const playerCitizenID = useCitizenID();
    const tetrisLeaderboard = useSelector((state: RootState) => state.appTetrisLeaderboard);

    const bestPlayerScore = useMemo(() => {
        if (!tetrisLeaderboard) return null;

        const player = tetrisLeaderboard.sort((a, b) => b.score - a.score).find(p => p.citizenid === playerCitizenID);
        if (!player) return null;

        return player.score;
    }, [playerCitizenID, tetrisLeaderboard]);

    const onClickLeaderboard = () => {
        store.dispatch.appTetrisLeaderboard.loadLeaderboard();
        navigate('/game-tetris/leaderboard');
    };

    return (
        <AppContent scrollable={false}>
            <Tetris>
                {({ Gameboard, PieceQueue, points, level, linesCleared, state, controller }) => (
                    <>
                        <div
                            className={cn({
                                'opacity-50': state !== 'PLAYING',
                            })}
                        >
                            {points > bestPlayerScore && (
                                <div className="absolute -rotate-12 -top-6 left-1/3 bg-yellow-500 text-sm text-white font-bold px-2 py-1 rounded">
                                    Nouveau record !
                                </div>
                            )}
                            <header className="flex justify-around items-center text-white font-semibold px-2 mt-6">
                                <DataContainer title="Lignes" value={linesCleared} />
                                <DataContainer title="Points" value={points} big />
                                <DataContainer title="Niveau" value={level} />
                            </header>

                            <section className="flex mt-8">
                                <div className="w-9/12">
                                    <Gameboard />
                                </div>
                                <div className="border-2 border-white h-fit w-3/12 ml-2 rounded">
                                    <div className="bg-white text-center text-[#38428b]">Pièces</div>
                                    <PieceQueue />
                                </div>
                            </section>
                        </div>

                        <ActionButton className="mt-6 bg-opacity-80" onClick={onClickLeaderboard}>
                            <LeaderBoardIcon /> Voir le classement
                        </ActionButton>

                        {state === 'LOST' && (
                            <div className="fixed inset-0 flex items-center justify-around m-4">
                                <div className="bg-black/70 p-4 w-full rounded-lg">
                                    <div className="text-red-400 text-4xl text-center py-4 font-bold">
                                        Vous avez perdu !
                                    </div>
                                    <p className="text-white py-4">
                                        Vous avez fait {points} points et vous avez atteint le niveau {level} avec{' '}
                                        {linesCleared} lignes complétées.
                                    </p>
                                    <p className="text-white pt-4 pb-8">
                                        Votre meilleur score est de{' '}
                                        {points > bestPlayerScore ? points : bestPlayerScore} points.
                                    </p>
                                    <ActionButton onClick={controller.restart}>Recommencer</ActionButton>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Tetris>
        </AppContent>
    );
};

export default TetrisGame;
