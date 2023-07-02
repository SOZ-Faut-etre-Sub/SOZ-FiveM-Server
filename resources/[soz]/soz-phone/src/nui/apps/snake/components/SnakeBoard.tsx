import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { useConfig } from '../../../hooks/usePhone';

interface IUseInterval {
    (callback: () => void, interval: number): void;
}

const SnakeBoard = () => {
    const config = useConfig();
    const size = 20;
    const initialRows = [];
    for (let i = 0; i < size; i++) {
        initialRows.push([]);
        for (let k = 0; k < size; k++) {
            initialRows[i].push('blank');
        }
    }

    const handleNewHighScore = async (newHighscore: number) => {
        setHighScore(newHighscore);
    };

    const randomPosition = () => {
        const position = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) };
        return position;
    };

    const [rows, setRows] = useState(initialRows);
    const [snake, setSnake] = useState([]);
    const [direction, setDirection] = useState('right');
    const [nextDirection, setNextDirection] = useState('right'); // buffer to avoid some problems with half-turn
    const [food, setFood] = useState(randomPosition);
    const [highScore, setHighScore] = useState(0);
    const [isMoving, setMoving] = useState(false);

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
        switch (direction) {
            case 'right':
                newRows[snake[0].x][snake[0].y] = 'snakeheadright';
                break;
            case 'left':
                newRows[snake[0].x][snake[0].y] = 'snakeheadleft';
                break;
            case 'up':
                newRows[snake[0].x][snake[0].y] = 'snakeheadup';
                break;
            case 'down':
                newRows[snake[0].x][snake[0].y] = 'snakeheaddown';
                break;
        }
        for (let i = 1; i < snake.length; i++) {
            newRows[snake[i].x][snake[i].y] = 'snake';
        }
        newRows[food.x][food.y] = 'food';
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
                    newSnake.push({ x: snake[0].x, y: (snake[0].y + 1) % size });
                    break;
                case 'left':
                    newSnake.push({ x: snake[0].x, y: (snake[0].y - 1 + size) % size });
                    break;
                case 'up':
                    newSnake.push({ x: (snake[0].x - 1 + size) % size, y: snake[0].y });
                    break;
                case 'down':
                    newSnake.push({ x: (snake[0].x + 1) % size, y: snake[0].y });
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
                    setMoving(false);
                    if (newSnake.length > highScore) {
                        handleNewHighScore(newSnake.length);
                    }
                }
            }
            setSnake(newSnake);
            displaySnake();
        }
    };

    const useInterval: IUseInterval = (callback, interval) => {
        const savedCallback = useRef<(() => void) | null>(null);
        // After every render, save the latest callback into our ref.
        useEffect(() => {
            savedCallback.current = callback;
        });

        useEffect(() => {
            function tick() {
                if (savedCallback.current) {
                    savedCallback.current();
                }
            }

            const id = setInterval(tick, interval);
            return () => clearInterval(id);
        }, [interval]);
    };

    useInterval(moveSnake, 100);

    const displayRows = rows.map(row => (
        <>
            {row.map(e => {
                switch (e) {
                    case 'blank':
                        return (
                            <div
                                className={cn('w-1/10 aspect-square', {
                                    'bg-ios-700': config.theme.value === 'dark',
                                    'bg-white': config.theme.value === 'light',
                                })}
                            ></div>
                        );

                    case 'snake':
                        return <div className="w-1/10 aspect-square bg-green-900"></div>;
                    case 'snakeheadup':
                        return <div className="w-1/10 aspect-square bg-green-900 rounded-t-3xl"></div>;
                    case 'snakeheaddown':
                        return <div className="w-1/10 aspect-square bg-green-900 rounded-b-3xl"></div>;
                    case 'snakeheadleft':
                        return <div className="w-1/10 aspect-square bg-green-900 rounded-l-3xl"></div>;
                    case 'snakeheadright':
                        return <div className="w-1/10 aspect-square bg-green-900 rounded-r-3xl"></div>;
                    case 'food':
                        return <div className="w-1/10 aspect-square bg-red-700 rounded-full"></div>;
                }
            })}
        </>
    ));

    const handleStart = () => {
        setDirection('right');
        setNextDirection('right');
        setMoving(true);
        setSnake([
            { x: size / 2, y: size / 2 },
            { x: size / 2, y: size / 2 - 1 },
            { x: size / 2, y: size / 2 - 2 },
        ]);
        setFood(randomPosition);
    };

    return (
        <>
            <div className="grid grid-cols-[repeat(20,_minmax(0,_1fr))] pt-6 p-3">{displayRows}</div>
            <div className="flex pt-10 p-6 w-1/2 mx-auto text-center">
                <Button
                    className={cn(
                        'w-full mx-auto text-center flex flex-col justify-center items-center rounded-xl p-3',
                        {
                            'bg-ios-700 text-[#347DD9]': config.theme.value === 'dark',
                            'bg-white text-gray-700': config.theme.value === 'light',
                        }
                    )}
                    onClick={handleStart}
                >
                    <p className="text-sm text-center">Start</p>
                </Button>
            </div>
            <div className="grid grid-cols-2 pt-6 p-3">
                <div
                    className={cn('w-1/2 mx-auto text-center', {
                        'text-white': config.theme.value === 'dark',
                        'text-black': config.theme.value === 'light',
                    })}
                >
                    Score: {snake.length}
                </div>
                <div
                    className={cn('w-1/2 mx-auto text-center', {
                        'text-white': config.theme.value === 'dark',
                        'text-black': config.theme.value === 'light',
                    })}
                >
                    High Score: {highScore}
                </div>
            </div>
        </>
    );
};

export default SnakeBoard;
