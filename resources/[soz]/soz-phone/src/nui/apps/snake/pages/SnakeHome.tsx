import { SnakeEvents } from '@typings/app/snake';
import { AppContent } from '@ui/components/AppContent';
import { LeaderBoardIcon } from '@ui/components/games/LeaderBoardIcon';
import { ActionButton } from '@ui/old_components/ActionButton';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
import React, { FunctionComponent, memo, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useCitizenID } from '../../../hooks/usePhone';
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
import { useInterval } from '../utils/interval';

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
    const verticalSize = 20;
    const horizontalSize = 30;
    const initialRows = [];
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

    const navigate = useNavigate();

    const onClickLeaderboard = () => {
        store.dispatch.appSnakeLeaderboard.loadLeaderboard();
        navigate('/snake/leaderboard');
    };

    const randomPosition = () => {
        let position = {
            x: -1,
            y: -1,
        };
        if (snake.length != (horizontalSize - 1) * (verticalSize - 1)) {
            // food spawnable
            let foodOnSnake = false;
            do {
                foodOnSnake = false;
                position = {
                    x: Math.floor(Math.random() * (horizontalSize - 2)) + 1,
                    y: Math.floor(Math.random() * (verticalSize - 2)) + 1,
                };
                for (let i = 0; i < snake.length; i++) {
                    if (position.x == snake[i].x && position.y == snake[i].y) {
                        foodOnSnake = true;
                    }
                }
            } while (foodOnSnake);
        }
        return position;
    };

    const [rows, setRows] = useState(initialRows);
    const [snake, setSnake] = useState([
        { x: verticalSize / 2, y: 3 },
        { x: verticalSize / 2, y: 2 },
        { x: verticalSize / 2, y: 1 },
    ]);
    const [direction, setDirection] = useState('right');
    const [nextDirection, setNextDirection] = useState('right'); // buffer to avoid some problems with half-turn
    const [food, setFood] = useState(randomPosition);
    const [isMoving, setMoving] = useState(true);

    const playerCitizenID = useCitizenID();
    const snakeLeaderboard = useSelector((state: RootState) => state.appSnakeLeaderboard);

    const highScore = useMemo(() => {
        if (!snakeLeaderboard) return null;

        const player = snakeLeaderboard.sort((a, b) => b.score - a.score).find(p => p.citizenid === playerCitizenID);
        if (!player) return null;

        return player.score;
    }, [playerCitizenID, snakeLeaderboard]);

    function handleDefeat(score: number) {
        setMoving(false);
        fetchNui(SnakeEvents.SEND_SCORE, { score });
    }

    const changeDirectionWithKeys = (e: KeyboardEvent) => {
        e.preventDefault();
        if (e.repeat) {
            return;
        }
        switch (e.key) {
            case 'ArrowLeft':
                setNextDirection('left');
                break;
            case 'ArrowUp':
                setNextDirection('up');
                break;
            case 'ArrowRight':
                setNextDirection('right');
                break;
            case 'ArrowDown':
                setNextDirection('down');
                break;
            default:
                break;
        }
    };

    document.addEventListener('keydown', changeDirectionWithKeys, false);

    const displaySnake = () => {
        const newRows = initialRows;
        newRows[food.x][food.y] = 'food';
        if (snake[0].y < snake[1].y) {
            newRows[snake[0].x][snake[0].y] = 'snakeheadleft';
        } else if (snake[0].x > snake[1].x) {
            newRows[snake[0].x][snake[0].y] = 'snakeheaddown';
        } else if (snake[0].y > snake[1].y) {
            newRows[snake[0].x][snake[0].y] = 'snakeheadright';
        } else if (snake[0].x < snake[1].x) {
            newRows[snake[0].x][snake[0].y] = 'snakeheadup';
        }
        for (let i = 1; i < snake.length - 1; i++) {
            const prev = snake[i - 1];
            const next = snake[i + 1];
            const current = snake[i];

            if ((prev.x < current.x && next.x > current.x) || (next.x < current.x && prev.x > current.x)) {
                // Up-Down
                newRows[snake[i].x][snake[i].y] = 'snakeupdown';
            } else if ((prev.x < current.x && next.y > current.y) || (next.x < current.x && prev.y > current.y)) {
                // Angle Up-Right
                newRows[snake[i].x][snake[i].y] = 'snakeupright';
            } else if ((prev.y < current.y && next.y > current.y) || (next.y < current.y && prev.y > current.y)) {
                // Left-Right
                newRows[snake[i].x][snake[i].y] = 'snakeleftright';
            } else if ((prev.y < current.y && next.x < current.x) || (next.y < current.y && prev.x < current.x)) {
                // Angle Up-Left
                newRows[snake[i].x][snake[i].y] = 'snakeupleft';
            } else if ((prev.x > current.x && next.y < current.y) || (next.x > current.x && prev.y < current.y)) {
                // Angle Down-Left
                newRows[snake[i].x][snake[i].y] = 'snakedownleft';
            } else if ((prev.y > current.y && next.x > current.x) || (next.y > current.y && prev.x > current.x)) {
                // Angle Down-Right
                newRows[snake[i].x][snake[i].y] = 'snakedownright';
            }
        }
        const prev = snake[snake.length - 2];
        const tail = snake[snake.length - 1];
        if (prev.y < tail.y) {
            newRows[snake[snake.length - 1].x][snake[snake.length - 1].y] = 'snaketailright';
        } else if (prev.x > tail.x) {
            newRows[snake[snake.length - 1].x][snake[snake.length - 1].y] = 'snaketailup';
        } else if (prev.y > tail.y) {
            newRows[snake[snake.length - 1].x][snake[snake.length - 1].y] = 'snaketailleft';
        } else if (prev.x < tail.x) {
            newRows[snake[snake.length - 1].x][snake[snake.length - 1].y] = 'snaketaildown';
        }
        setRows(newRows);
    };

    const moveSnake = () => {
        const newSnake = [];

        if (isMoving) {
            switch (nextDirection) {
                case 'right':
                    if (direction !== 'left') {
                        setDirection('right');
                    }
                    break;
                case 'left':
                    if (direction !== 'right') {
                        setDirection('left');
                    }
                    break;
                case 'up':
                    if (direction !== 'down') {
                        setDirection('up');
                    }
                    break;
                case 'down':
                    if (direction !== 'up') {
                        setDirection('down');
                    }
                    break;
            }
            switch (direction) {
                case 'right':
                    newSnake.push({ x: snake[0].x, y: (snake[0].y + 1) % verticalSize });
                    break;
                case 'left':
                    newSnake.push({ x: snake[0].x, y: (snake[0].y - 1 + verticalSize) % verticalSize });
                    break;
                case 'up':
                    newSnake.push({ x: (snake[0].x - 1 + horizontalSize) % horizontalSize, y: snake[0].y });
                    break;
                case 'down':
                    newSnake.push({ x: (snake[0].x + 1) % horizontalSize, y: snake[0].y });
                    break;
            }
            snake.forEach(cell => {
                newSnake.push(cell); //we add the entire old snake to the new snake's head. that increase the snake length, but we will remove one cell if his head wasn't on the fruit
            });
            // if snake's head was on fruit, create a new fruit. else, remove the last cell of the new snake
            if (snake[0].x === food.x && snake[0].y === food.y) {
                setFood(randomPosition);
            } else {
                newSnake.pop();
            }
            for (let i = 1; i < newSnake.length; i++) {
                // defeat if the head is on a body cell
                if (newSnake[0].x == newSnake[i].x && newSnake[0].y == newSnake[i].y) {
                    handleDefeat((newSnake.length - 3) * 100);
                }
            }
            if (
                newSnake[0].x == 0 ||
                newSnake[0].x == horizontalSize - 1 ||
                newSnake[0].y == 0 ||
                newSnake[0].y == verticalSize - 1
            ) {
                // defeat if next move put snake on wall
                handleDefeat((newSnake.length - 3) * 100);
            }
            setSnake(newSnake);
            displaySnake();
        }
    };
    useInterval(moveSnake, 170);

    const displayRows = rows.map(row => (
        <>
            {row.map(e => {
                switch (e) {
                    case 'blank':
                        return <div className={cn('w-1/10 aspect-square bg-ios-700 opacity-75')}></div>;
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
    ));

    const handleStart = () => {
        setDirection('right');
        setNextDirection('right');
        setMoving(true);
        setSnake([
            { x: verticalSize / 2, y: 3 },
            { x: verticalSize / 2, y: 2 },
            { x: verticalSize / 2, y: 1 },
        ]);
        setFood(randomPosition);
    };

    return (
        <AppContent scrollable={false}>
            <>
                <div
                    className={cn({
                        'opacity-80': isMoving === false,
                    })}
                >
                    {(snake.length - 3) * 100 > highScore && (
                        <div className="absolute -rotate-12 -top-6 left-1/3 bg-yellow-500 text-sm text-white font-bold px-2 py-1 rounded">
                            Nouveau record !
                        </div>
                    )}
                    <header className="flex justify-around items-center text-white font-semibold px-2 mt-6">
                        <DataContainer title="Taille" value={snake.length} />
                        <DataContainer title="Score" value={(snake.length - 3) * 100} />
                    </header>
                    <div className="grid grid-cols-[repeat(20,_minmax(0,_1fr))] pt-6 p-3">{displayRows}</div>

                    <ActionButton className="mt-6 bg-opacity-80" onClick={onClickLeaderboard}>
                        <LeaderBoardIcon /> Voir le classement
                    </ActionButton>

                    {isMoving === false && (
                        <div className="fixed inset-0 flex items-center justify-around m-4">
                            <div className="bg-black/70 p-4 w-full rounded-lg">
                                <div className="text-red-400 text-4xl text-center py-4 font-bold">
                                    Vous avez perdu !
                                </div>
                                <p className="text-white py-4">
                                    Vous avez atteint la taille {(snake.length - 3) * 100}.
                                </p>
                                <p className="text-white pt-4 pb-8">
                                    Votre meilleur score est de{' '}
                                    {(snake.length - 3) * 100 > highScore ? (snake.length - 3) * 100 : highScore}.
                                </p>
                                <ActionButton onClick={handleStart}>Recommencer</ActionButton>
                            </div>
                        </div>
                    )}
                </div>
            </>
        </AppContent>
    );
});
