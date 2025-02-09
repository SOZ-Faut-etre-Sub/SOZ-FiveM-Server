import clsx from 'clsx';
import React, { FunctionComponent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { RepositoryType } from '../../../../../../shared/repository';
import { useAssetPath } from '../../../../../hook/assets';
import { usePlayer } from '../../../../../hook/data';
import { useRepository } from '../../../../../hook/repository';
import LeaderBoardIcon from '../../../assets/leaderboard.svg';
import { ActionButton } from '../../../components/ActionButton';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { DataContainer } from '../components/DataContainer';
import { Tetris } from '../components/Tetris';

export const TetrisGame: FunctionComponent = () => {
    const navigate = useNavigate();

    const player = usePlayer();
    const leaderboard = useRepository(RepositoryType.LeaderboardTetris);

    const { getPath } = useAssetPath();

    const bestPlayerScore = useMemo(() => {
        return Object.values(leaderboard)
            .filter(v => v.citizenid === player?.citizenid)
            .reduce((acc, val) => Math.max(acc, val.score), 0);
    }, [player?.citizenid, leaderboard]);

    const onClickLeaderboard = () => navigate('/tetris/leaderboard');

    return (
        <AppWrapper>
            <AppContent>
                <div
                    className="absolute inset-0 bg-cover bg-center -z-10"
                    style={{
                        backgroundImage: `url(${getPath('images/phone/apps/tetris/background.webp')})`,
                    }}
                />
                <Tetris>
                    {({ GameboardView, PieceQueue, points, level, linesCleared, state, controller }) => (
                        <>
                            <div
                                className={clsx({
                                    'opacity-50': state !== 'PLAYING',
                                })}
                            >
                                <div className="relative">
                                    {points > bestPlayerScore && (
                                        <div className="absolute -rotate-12 -top-3 left-1/3 bg-yellow-500 text-sm text-white font-bold px-2 py-1 rounded">
                                            Nouveau record !
                                        </div>
                                    )}
                                    <header className="flex justify-around items-center text-white font-semibold px-2 mt-6">
                                        <DataContainer title="Lignes" value={linesCleared} />
                                        <DataContainer title="Points" value={points} big />
                                        <DataContainer title="Niveau" value={level} />
                                    </header>
                                </div>

                                <section className="flex mt-8">
                                    <div className="grow">
                                        <GameboardView />
                                    </div>
                                    <div className="border-2 border-white h-fit w-1/5 ml-2 rounded">
                                        <div className="bg-white text-center text-[#38428b]">Pièces</div>
                                        <PieceQueue />
                                    </div>
                                </section>
                            </div>

                            <ActionButton className="mt-6 bg-opacity-80" onClick={onClickLeaderboard}>
                                <LeaderBoardIcon className="size-5" /> Voir le classement
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
        </AppWrapper>
    );
};
