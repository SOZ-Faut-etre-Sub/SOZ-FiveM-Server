import cn from 'classnames';
import React, { FunctionComponent, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useCitizenID } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { AppContent } from '../../../ui/components/AppContent';
import { ActionButton } from '../../../ui/old_components/ActionButton';
import Tetris from '../components/Tetris';

export const LeaderBoardIcon: FunctionComponent = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" fill="currentColor" viewBox="0 0 640 512">
            <path d="M353.8 54.1L330.2 6.3c-3.9-8.3-16.1-8.6-20.4 0L286.2 54.1l-52.3 7.5c-9.3 1.4-13.3 12.9-6.4 19.8l38 37-9 52.1c-1.4 9.3 8.2 16.5 16.8 12.2l46.9-24.8 46.6 24.4c8.6 4.3 18.3-2.9 16.8-12.2l-9-52.1 38-36.6c6.8-6.8 2.9-18.3-6.4-19.8l-52.3-7.5zM256 256c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32H256zM32 320c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H160c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zm416 96v64c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32V416c0-17.7-14.3-32-32-32H480c-17.7 0-32 14.3-32 32z" />
        </svg>
    );
};

type DataContainerProps = {
    title: string;
    value: string | number;
    big?: boolean;
};

const DataContainer: FunctionComponent<DataContainerProps> = ({ title, value, big = false }) => {
    return (
        <div className="border-2 border-white h-fit w-3/12 ml-2 rounded">
            <div className="bg-white text-center text-[#38428b]">{title}</div>
            <p
                className={cn('p-1 text-center', {
                    'text-2xl': big,
                })}
            >
                {value}
            </p>
        </div>
    );
};

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
                                    <div className="bg-white text-center text-[#38428b]">Next pieces</div>
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
