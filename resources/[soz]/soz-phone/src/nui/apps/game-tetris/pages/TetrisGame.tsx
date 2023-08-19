import React, { FunctionComponent, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../../store';
import { AppContent } from '../../../ui/components/AppContent';
import { ActionButton } from '../../../ui/old_components/ActionButton';
import Tetris from '../components/Tetris';

export const LeaderBoardIcon: FunctionComponent<{ className: string; onClick: () => void }> = ({
    className,
    onClick,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1.5rem"
            className={className}
            onClick={onClick}
            fill="currentColor"
            viewBox="0 0 640 512"
        >
            <path d="M353.8 54.1L330.2 6.3c-3.9-8.3-16.1-8.6-20.4 0L286.2 54.1l-52.3 7.5c-9.3 1.4-13.3 12.9-6.4 19.8l38 37-9 52.1c-1.4 9.3 8.2 16.5 16.8 12.2l46.9-24.8 46.6 24.4c8.6 4.3 18.3-2.9 16.8-12.2l-9-52.1 38-36.6c6.8-6.8 2.9-18.3-6.4-19.8l-52.3-7.5zM256 256c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32H256zM32 320c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H160c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zm416 96v64c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32V416c0-17.7-14.3-32-32-32H480c-17.7 0-32 14.3-32 32z" />
        </svg>
    );
};

export const TetrisGame: React.FC = () => {
    const navigate = useNavigate();
    const tetrisLeaderboard = useSelector((state: RootState) => state.appTetrisLeaderboard);

    const onClickLeaderboard = () => {
        navigate('/game-tetris/leaderboard');
    };

    return (
        <AppContent scrollable={false}>
            <Tetris>
                {({ Gameboard, PieceQueue, points, level, linesCleared, state, controller }) => (
                    <>
                        <div style={{ opacity: state === 'PLAYING' ? 1 : 0.5 }}>
                            <header className="flex items-center text-white font-semibold px-2 mt-6">
                                <div className="flex flex-col text-sm w-1/3">
                                    <p>
                                        Lines <span className="text-lg font-bold">{linesCleared}</span>
                                    </p>
                                    <p>
                                        Level <span className="text-lg font-bold">{level}</span>
                                    </p>
                                </div>

                                <div className="text-center text-3xl w-1/3">{points}</div>

                                <div className="flex justify-end w-1/3 ">
                                    <LeaderBoardIcon className="cursor-pointer" onClick={onClickLeaderboard} />
                                </div>
                            </header>

                            <section className="flex mt-12">
                                <div className="w-9/12">
                                    <Gameboard />
                                </div>
                                <div className="border-2 border-white h-fit w-3/12 ml-2 rounded">
                                    <div className="bg-white text-center text-[#38428b]">Next pieces</div>
                                    <PieceQueue />
                                </div>
                            </section>
                        </div>

                        {state === 'LOST' && (
                            <div className="mt-6 text-center">
                                <div className="text-red-500 text-xl font-bold">Vous avez perdu !</div>
                                <ActionButton className="tetris_button" onClick={controller.restart}>
                                    Recommencer
                                </ActionButton>
                            </div>
                        )}
                    </>
                )}
            </Tetris>
        </AppContent>
    );
};

export default TetrisGame;
