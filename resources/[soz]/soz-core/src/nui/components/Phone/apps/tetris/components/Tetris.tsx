import { fetchNui } from '@public/nui/fetch';
import React, { ComponentType, FunctionComponent, ReactElement, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { usePhoneVisibility } from '../../../system/phone.atom';
import * as Game from '../game/Game';
import { KeyboardMap, useKeyboardControls } from '../hooks/keyboard_detection';
import { Context } from '../utils/context';
import { GameboardView } from './GameboardView';
import { PieceQueue } from './PieceQueueView';

export type RenderFn = (params: {
    GameboardView: ComponentType;
    PieceQueue: ComponentType;
    points: number;
    linesCleared: number;
    level: number;
    state: Game.State;
    controller: Controller;
}) => ReactElement;

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

export const Tetris: FunctionComponent<Props> = ({ keyboardControls, children }) => {
    const navigate = useNavigate();

    const visibility = usePhoneVisibility();

    const [game, dispatch] = useReducer(Game.update, Game.init());
    const level = Game.getLevel(game);
    const keyboardMap = keyboardControls ?? defaultKeyboardMap;

    useKeyboardControls(keyboardMap, dispatch);

    useEffect(() => {
        let interval: number | undefined;
        if (game.state === 'PLAYING') {
            interval = window.setInterval(
                () => {
                    dispatch('TICK');
                    if (!visibility) {
                        navigate('/');
                    }
                },
                tickSeconds(level) * 1000
            );
        } else if (game.state === 'LOST') {
            if (!game.score_send) {
                fetchNui(NuiEvent.PhoneAppTetrisAddScore, game.points);
            }
            game.score_send = true;
        }

        return () => {
            window.clearInterval(interval);
        };
    }, [game.state, level, visibility]);

    const controller = useMemo(
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
            {children({
                GameboardView,
                PieceQueue,
                points: game.points,
                linesCleared: game.lines,
                state: game.state,
                level,
                controller,
            })}
        </Context.Provider>
    );
};
