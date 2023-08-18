import { TetrisEvents } from '@typings/app/tetris';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useVisibility } from '../../../hooks/usePhone';
import { fetchNui } from '../../../utils/fetchNui';
import * as Game from '../components/Game';
import { KeyboardMap, useKeyboardControls } from '../hooks/keyboard_detection';
import { Context } from '../utils/context';
import Gameboard from './GameboardView';
import PieceQueue from './PieceQueueView';

export type RenderFn = (params: {
    Gameboard: React.ComponentType;
    PieceQueue: React.ComponentType;
    points: number;
    linesCleared: number;
    level: number;
    state: Game.State;
    controller: Controller;
}) => React.ReactElement;

export type Controller = {
    hardDrop: () => void;
    moveDown: () => void;
    moveLeft: () => void;
    moveRight: () => void;
    restart: () => void;
};

type Props = {
    keyboardControls?: KeyboardMap;
    children: RenderFn;
};

const defaultKeyboardMap: KeyboardMap = {
    down: 'MOVE_DOWN',
    left: 'MOVE_LEFT',
    right: 'MOVE_RIGHT',
    space: 'HARD_DROP',
    up: 'FLIP_CLOCKWISE',
};

const tickSeconds = (level: number) => (0.8 - (level - 1) * 0.007) ** (level - 1);

export default function Tetris(props: Props): JSX.Element {
    const [game, dispatch] = React.useReducer(Game.update, Game.init());
    const keyboardMap = props.keyboardControls ?? defaultKeyboardMap;
    useKeyboardControls(keyboardMap, dispatch);
    const level = Game.getLevel(game);
    const { visibility } = useVisibility();
    const navigate = useNavigate();

    React.useEffect(() => {
        let interval: number | undefined;
        if (game.state === 'PLAYING') {
            interval = window.setInterval(() => {
                dispatch('TICK');
                if (!visibility) {
                    navigate('/');
                }
            }, tickSeconds(level) * 1000);
        } else if (game.state === 'LOST') {
            const score = game.points;
            if (!game.score_send) {
                fetchNui(TetrisEvents.SEND_SCORE, { score });
            }
            game.score_send = true;
        }

        return () => {
            window.clearInterval(interval);
        };
    }, [game.state, level, visibility]);

    const controller = React.useMemo(
        () => ({
            hardDrop: () => dispatch('HARD_DROP'),
            moveDown: () => dispatch('MOVE_DOWN'),
            moveLeft: () => dispatch('MOVE_LEFT'),
            moveRight: () => dispatch('MOVE_RIGHT'),
            restart: () => dispatch('RESTART'),
        }),
        [dispatch]
    );

    return (
        <Context.Provider value={game}>
            {props.children({
                Gameboard,
                PieceQueue,
                points: game.points,
                linesCleared: game.lines,
                state: game.state,
                level,
                controller,
            })}
        </Context.Provider>
    );
}
