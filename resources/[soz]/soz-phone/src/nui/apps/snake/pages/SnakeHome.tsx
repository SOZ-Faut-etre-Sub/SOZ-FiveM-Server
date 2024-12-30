import { SnakeEvents } from '@typings/app/snake';
import { AppContent } from '@ui/components/AppContent';
import { LeaderBoardIcon } from '@ui/components/games/LeaderBoardIcon';
import { ActionButton } from '@ui/old_components/ActionButton';
import cn from 'classnames';
import { FunctionComponent, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchNui } from '../../../common/utils/fetchNui';
import { useCitizenID, useVisibility } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { store } from '../../../store';
import DownLeft from '../ui/downleft.png';
import DownRight from '../ui/downright.png';
import Food from '../ui/fruit.png';
import HeadDown from '../ui/headdown.png';
import HeadLeft from '../ui/headleft.png';
import HeadRight from '../ui/headright.png';
import HeadUp from '../ui/headup.png';
import LeftRight from '../ui/leftright.png';
import TailDown from '../ui/taildown.png';
import TailLeft from '../ui/tailleft.png';
import TailRight from '../ui/tailright.png';
import TailUp from '../ui/tailup.png';
import UpDown from '../ui/updown.png';
import UpLeft from '../ui/upleft.png';
import UpRight from '../ui/upright.png';
import Wall from '../ui/wall.png';

type Position = {
    x: number;
    y: number;
};

const SNAKE_MOVE_WAIT_TIME_MS = 150;

let ellapsedTimeSinceSnakeMove = 0;

const verticalSize = 20;
const horizontalSize = 30;

const initialSnakePositions: Position[] = [
    { x: verticalSize / 2, y: 3 },
    { x: verticalSize / 2, y: 2 },
    { x: verticalSize / 2, y: 1 },
];

const getInitialRows = () => {
    const initialRows: string[][] = [];
    for (let i = 0; i < horizontalSize; i++) {
        initialRows.push([]);
        for (let k = 0; k < verticalSize; k++) {
            initialRows[i].push('blank');
        }
    }

    for (let i = 0; i < horizontalSize; i++) {
        initialRows[i][0] = 'wall';
        initialRows[i][verticalSize - 1] = 'wall';
    }

    for (let i = 0; i < verticalSize; i++) {
        initialRows[0][i] = 'wall';
        initialRows[horizontalSize - 1][i] = 'wall';
    }

    return initialRows;
};

type DataContainerProps = {
    title: string;
    value: string | number;
};

const DataContainer: FunctionComponent<DataContainerProps> = ({ title, value }) => {
    return (
        <div id="arcade" className="h-fit w-3/12 ml-2 rounded">
            <div className="text-center">{title}</div>
            <p className={cn('p-1 text-center text-2xl')}>{value}</p>
        </div>
    );
};

export const SnakeHome = memo(() => {
    const visibility = useVisibility();
    const navigate = useNavigate();
    const playerCitizenID = useCitizenID();
    const snakeLeaderboard = useSelector((state: RootState) => state.appSnakeLeaderboard);

    const snakePositionRef = useRef<Position[]>(initialSnakePositions);
    const animationRequestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const inputDirectionRef = useRef<string>(null);
    const currentDirectionRef = useRef<string>('right');
    const isGameOngoingRef = useRef<boolean>(true);
    const [lostReason, setLostReason] = useState<string>('');
    const [displayedRows, setDisplayedRows] = useState<string[][]>(getInitialRows());

    const getRandomFoodPosition = () => {
        let position: Position = {
            x: -1,
            y: -1,
        };

        if (snakePositionRef.current.length != (horizontalSize - 1) * (verticalSize - 1)) {
            let foodOnSnake = false;

            do {
                foodOnSnake = false;
                position = {
                    x: Math.floor(Math.random() * (horizontalSize - 2)) + 1,
                    y: Math.floor(Math.random() * (verticalSize - 2)) + 1,
                };
                for (let i = 0; i < snakePositionRef.current.length; i++) {
                    if (position.x == snakePositionRef.current[i].x && position.y == snakePositionRef.current[i].y) {
                        foodOnSnake = true;
                    }
                }
            } while (foodOnSnake);
        }

        return position;
    };

    const foodPositionRef = useRef<Position>(getRandomFoodPosition());

    const onClickLeaderboard = () => {
        store.dispatch.appSnakeLeaderboard.loadLeaderboard();
        navigate('/snake/leaderboard');
    };

    const highScore = useMemo(() => {
        if (!snakeLeaderboard) return 0;

        const player = snakeLeaderboard.sort((a, b) => b.score - a.score).find(p => p.citizenid === playerCitizenID);
        if (!player) return 0;

        return player.score;
    }, [playerCitizenID, snakeLeaderboard]);

    const resetGameState = () => {
        isGameOngoingRef.current = true;
        currentDirectionRef.current = 'right';
        snakePositionRef.current = initialSnakePositions;
        foodPositionRef.current = getRandomFoodPosition();
        ellapsedTimeSinceSnakeMove = 0;
    };

    const handleDefeat = (score: number, reason: string) => {
        isGameOngoingRef.current = false;
        setLostReason(reason);
        fetchNui(SnakeEvents.SEND_SCORE, { score });
    };

    const changeDirectionWithKeys = (e: KeyboardEvent) => {
        e.preventDefault();

        if (e.repeat || !['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
            return;
        }

        switch (e.key) {
            case 'ArrowLeft':
                inputDirectionRef.current = currentDirectionRef.current !== 'right' ? 'left' : 'right';
                break;
            case 'ArrowUp':
                inputDirectionRef.current = currentDirectionRef.current !== 'down' ? 'up' : 'down';
                break;
            case 'ArrowRight':
                inputDirectionRef.current = currentDirectionRef.current !== 'left' ? 'right' : 'left';
                break;
            case 'ArrowDown':
                inputDirectionRef.current = currentDirectionRef.current !== 'up' ? 'down' : 'up';
                break;
            default:
                break;
        }

        ellapsedTimeSinceSnakeMove = SNAKE_MOVE_WAIT_TIME_MS;
    };

    useEffect(() => {
        document.addEventListener('keydown', changeDirectionWithKeys, false);

        return () => document.removeEventListener('keydown', changeDirectionWithKeys);
    }, [visibility.visibility, isGameOngoingRef.current]);

    const moveSnake = () => {
        const newSnake: Position[] = [];

        if (inputDirectionRef.current) {
            currentDirectionRef.current = inputDirectionRef.current;
            inputDirectionRef.current = null;
        }

        switch (currentDirectionRef.current) {
            case 'right':
                newSnake.push({
                    x: snakePositionRef.current[0].x,
                    y: (snakePositionRef.current[0].y + 1) % verticalSize,
                });
                break;
            case 'left':
                newSnake.push({
                    x: snakePositionRef.current[0].x,
                    y: (snakePositionRef.current[0].y - 1 + verticalSize) % verticalSize,
                });
                break;
            case 'up':
                newSnake.push({
                    x: (snakePositionRef.current[0].x - 1 + horizontalSize) % horizontalSize,
                    y: snakePositionRef.current[0].y,
                });
                break;
            case 'down':
                newSnake.push({
                    x: (snakePositionRef.current[0].x + 1) % horizontalSize,
                    y: snakePositionRef.current[0].y,
                });
                break;
        }

        snakePositionRef.current.forEach(cell => {
            newSnake.push(cell); //we add the entire old snake to the new snake's head. that increase the snake length, but we will remove one cell if his head wasn't on the fruit
        });

        // if snake's head was on fruit, create a new fruit. else, remove the last cell of the new snake
        if (
            snakePositionRef.current[0].x === foodPositionRef.current.x &&
            snakePositionRef.current[0].y === foodPositionRef.current.y
        ) {
            foodPositionRef.current = getRandomFoodPosition();
        } else {
            newSnake.pop();
        }

        for (let i = 1; i < newSnake.length; i++) {
            // defeat if the head is on a body cell
            if (newSnake[0].x == newSnake[i].x && newSnake[0].y == newSnake[i].y) {
                handleDefeat((newSnake.length - 3) * 100, 'Vous vous êtes mordu ...');

                return;
            }
        }

        if (
            newSnake[0].x == 0 ||
            newSnake[0].x == horizontalSize - 1 ||
            newSnake[0].y == 0 ||
            newSnake[0].y == verticalSize - 1
        ) {
            // defeat if next move put snake on wall
            handleDefeat((newSnake.length - 3) * 100, 'Vous vous êtes pris le mur !');

            return;
        }

        snakePositionRef.current = newSnake;
    };

    const storeSnakePosition = () => {
        const newRows = getInitialRows();
        newRows[foodPositionRef.current.x][foodPositionRef.current.y] = 'food';

        if (snakePositionRef.current[0].y < snakePositionRef.current[1].y) {
            newRows[snakePositionRef.current[0].x][snakePositionRef.current[0].y] = 'snakeheadleft';
        } else if (snakePositionRef.current[0].x > snakePositionRef.current[1].x) {
            newRows[snakePositionRef.current[0].x][snakePositionRef.current[0].y] = 'snakeheaddown';
        } else if (snakePositionRef.current[0].y > snakePositionRef.current[1].y) {
            newRows[snakePositionRef.current[0].x][snakePositionRef.current[0].y] = 'snakeheadright';
        } else if (snakePositionRef.current[0].x < snakePositionRef.current[1].x) {
            newRows[snakePositionRef.current[0].x][snakePositionRef.current[0].y] = 'snakeheadup';
        }

        for (let i = 1; i < snakePositionRef.current.length - 1; i++) {
            const prev = snakePositionRef.current[i - 1];
            const next = snakePositionRef.current[i + 1];
            const current = snakePositionRef.current[i];

            if ((prev.x < current.x && next.x > current.x) || (next.x < current.x && prev.x > current.x)) {
                // Up-Down
                newRows[snakePositionRef.current[i].x][snakePositionRef.current[i].y] = 'snakeupdown';
            } else if ((prev.x < current.x && next.y > current.y) || (next.x < current.x && prev.y > current.y)) {
                // Angle Up-Right
                newRows[snakePositionRef.current[i].x][snakePositionRef.current[i].y] = 'snakeupright';
            } else if ((prev.y < current.y && next.y > current.y) || (next.y < current.y && prev.y > current.y)) {
                // Left-Right
                newRows[snakePositionRef.current[i].x][snakePositionRef.current[i].y] = 'snakeleftright';
            } else if ((prev.y < current.y && next.x < current.x) || (next.y < current.y && prev.x < current.x)) {
                // Angle Up-Left
                newRows[snakePositionRef.current[i].x][snakePositionRef.current[i].y] = 'snakeupleft';
            } else if ((prev.x > current.x && next.y < current.y) || (next.x > current.x && prev.y < current.y)) {
                // Angle Down-Left
                newRows[snakePositionRef.current[i].x][snakePositionRef.current[i].y] = 'snakedownleft';
            } else if ((prev.y > current.y && next.x > current.x) || (next.y > current.y && prev.x > current.x)) {
                // Angle Down-Right
                newRows[snakePositionRef.current[i].x][snakePositionRef.current[i].y] = 'snakedownright';
            }
        }

        const prev = snakePositionRef.current[snakePositionRef.current.length - 2];
        const tail = snakePositionRef.current[snakePositionRef.current.length - 1];

        if (prev.y < tail.y) {
            newRows[snakePositionRef.current[snakePositionRef.current.length - 1].x][
                snakePositionRef.current[snakePositionRef.current.length - 1].y
            ] = 'snaketailright';
        } else if (prev.x > tail.x) {
            newRows[snakePositionRef.current[snakePositionRef.current.length - 1].x][
                snakePositionRef.current[snakePositionRef.current.length - 1].y
            ] = 'snaketailup';
        } else if (prev.y > tail.y) {
            newRows[snakePositionRef.current[snakePositionRef.current.length - 1].x][
                snakePositionRef.current[snakePositionRef.current.length - 1].y
            ] = 'snaketailleft';
        } else if (prev.x < tail.x) {
            newRows[snakePositionRef.current[snakePositionRef.current.length - 1].x][
                snakePositionRef.current[snakePositionRef.current.length - 1].y
            ] = 'snaketaildown';
        }

        setDisplayedRows(newRows);
    };

    const draw = (time: number) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            ellapsedTimeSinceSnakeMove += deltaTime;

            if (ellapsedTimeSinceSnakeMove >= SNAKE_MOVE_WAIT_TIME_MS && isGameOngoingRef.current) {
                moveSnake();
                storeSnakePosition();

                ellapsedTimeSinceSnakeMove = 0;
            }
        }

        previousTimeRef.current = time;
        animationRequestRef.current = requestAnimationFrame(draw);
    };

    useEffect(() => {
        animationRequestRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animationRequestRef.current);
    }, []);

    return (
        <AppContent scrollable={false}>
            <>
                <div
                    className={cn({
                        'opacity-80': !isGameOngoingRef.current,
                    })}
                >
                    {(snakePositionRef.current.length - 3) * 100 > highScore && (
                        <div className="absolute -rotate-12 -top-6 left-1/3 bg-yellow-500 text-sm text-white font-bold px-2 py-1 rounded">
                            Nouveau record !
                        </div>
                    )}
                    <header className="flex justify-around items-center text-white font-semibold px-2 mt-6">
                        <DataContainer title="Taille" value={snakePositionRef.current.length} />
                        <DataContainer title="Score" value={(snakePositionRef.current.length - 3) * 100} />
                    </header>
                    <div className="grid grid-cols-[repeat(20,_minmax(0,_1fr))] pt-6 p-2">
                        {displayedRows &&
                            displayedRows.map(row => (
                                <>
                                    {row.map(e => {
                                        switch (e) {
                                            case 'blank':
                                                return (
                                                    <div
                                                        className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}
                                                    ></div>
                                                );
                                            case 'snakeleftright':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={LeftRight}></img>
                                                    </div>
                                                );
                                            case 'snakeupdown':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={UpDown}></img>
                                                    </div>
                                                );
                                            case 'snakeheadup':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={HeadUp}></img>
                                                    </div>
                                                );
                                            case 'snakedownleft':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={DownLeft}></img>
                                                    </div>
                                                );
                                            case 'snakedownright':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={DownRight}></img>
                                                    </div>
                                                );
                                            case 'snakeupleft':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={UpLeft}></img>
                                                    </div>
                                                );
                                            case 'snakeupright':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={UpRight}></img>
                                                    </div>
                                                );
                                            case 'snakeheaddown':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={HeadDown}></img>
                                                    </div>
                                                );
                                            case 'snakeheadleft':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={HeadLeft}></img>
                                                    </div>
                                                );
                                            case 'snakeheadright':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={HeadRight}></img>
                                                    </div>
                                                );
                                            case 'snaketailup':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={TailUp}></img>
                                                    </div>
                                                );
                                            case 'snaketaildown':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={TailDown}></img>
                                                    </div>
                                                );
                                            case 'snaketailleft':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={TailLeft}></img>
                                                    </div>
                                                );
                                            case 'snaketailright':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={TailRight}></img>
                                                    </div>
                                                );
                                            case 'food':
                                                return (
                                                    <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}>
                                                        <img src={Food}></img>
                                                    </div>
                                                );
                                            case 'wall':
                                                return (
                                                    <div className="w-1/10">
                                                        <img src={Wall}></img>
                                                    </div>
                                                );
                                        }
                                    })}
                                </>
                            ))}
                    </div>

                    <ActionButton className="mt-6 bg-opacity-80" onClick={onClickLeaderboard}>
                        <LeaderBoardIcon /> Voir le classement
                    </ActionButton>

                    {!isGameOngoingRef.current && (
                        <div className="fixed inset-0 flex items-center justify-around m-4">
                            <div className="bg-black/70 p-4 w-full rounded-lg">
                                <div className="text-red-400 text-4xl text-center py-4 font-bold">Game Over</div>
                                <div className="text-white text-2xl text-center py-1 font-bold">{lostReason}</div>
                                <p className="text-white py-4">
                                    Vous avez atteint le score de{' '}
                                    <strong>{(snakePositionRef.current.length - 3) * 100} !</strong>
                                </p>
                                <p className="text-white pb-8">
                                    Votre meilleur score est de{' '}
                                    <strong>
                                        {(snakePositionRef.current.length - 3) * 100 > highScore
                                            ? ((snakePositionRef.current.length - 3) * 100).toLocaleString('fr-FR')
                                            : highScore.toLocaleString('fr-FR')}
                                    </strong>
                                </p>
                                <ActionButton onClick={resetGameState}>Recommencer</ActionButton>
                            </div>
                        </div>
                    )}
                </div>
            </>
        </AppContent>
    );
});
