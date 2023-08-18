import Constants from '../utils/game_config';
import {
    addPieceToBoard,
    buildMatrix,
    flipClockwise,
    hardDrop,
    isEmptyPosition,
    Matrix,
    moveDown,
    moveLeft,
    moveRight,
    PositionedPiece,
    setPiece,
} from './Matrix';
import { Piece } from './Piece';
import * as PieceQueue from './Queue';

export type State = 'PAUSED' | 'PLAYING' | 'LOST';

export type Game = {
    state: State;
    matrix: Matrix;
    piece: PositionedPiece;
    queue: PieceQueue.PieceQueue;
    points: number;
    lines: number;
    score_send: boolean;
};

export const getLevel = (game: Game): number => Math.floor(game.lines / 10) + 1;

export type Action = 'TICK' | 'HARD_DROP' | 'MOVE_DOWN' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'FLIP_CLOCKWISE' | 'RESTART';

export const update = (game: Game, action: Action): Game => {
    switch (action) {
        case 'RESTART': {
            return init();
        }
        case 'HARD_DROP': {
            if (game.state !== 'PLAYING') return game;
            const piece = hardDrop(game.matrix, game.piece);
            return lockInPiece({ ...game, piece });
        }
        case 'TICK':
        case 'MOVE_DOWN': {
            if (game.state !== 'PLAYING') return game;
            const updated = applyMove(moveDown, game);
            if (game.piece === updated.piece) {
                return lockInPiece(updated);
            } else {
                return updated;
            }
        }
        case 'MOVE_LEFT': {
            return applyMove(moveLeft, game);
        }
        case 'MOVE_RIGHT': {
            return applyMove(moveRight, game);
        }
        case 'FLIP_CLOCKWISE': {
            return applyMove(flipClockwise, game);
        }
        default: {
            const exhaustiveCheck: never = action;
            throw new Error(`Unhandled action: ${exhaustiveCheck}`);
        }
    }
};

const lockInPiece = (game: Game): Game => {
    const [matrix, linesCleared] = setPiece(game.matrix, game.piece);
    const next = PieceQueue.getNextPiece(game.queue);
    const piece = initializePiece(next.piece);
    return {
        ...game,
        state: isEmptyPosition(matrix, piece) ? game.state : 'LOST',
        matrix,
        piece,
        queue: next.queue,
        lines: game.lines + linesCleared,
        points: game.points + addScore(linesCleared),
    };
};

const pointsPerLine = 100;
const addScore = (additionalLines: number) => {
    if (additionalLines === 4) {
        return pointsPerLine * 10; // 1000 pts for 4 lines
    } else {
        return additionalLines * pointsPerLine; // 100 pts per line
    }
};

const initialPosition = {
    x: Constants.GAME_WIDTH / 2 - Constants.BLOCK_WIDTH / 2,
    y: 0,
};

const initializePiece = (piece: Piece): PositionedPiece => {
    return {
        position: initialPosition,
        piece,
        rotation: 0,
    };
};

const applyMove = (move: (matrix: Matrix, piece: PositionedPiece) => PositionedPiece | undefined, game: Game): Game => {
    if (game.state !== 'PLAYING') return game;
    const afterFlip = move(game.matrix, game.piece);
    return afterFlip ? { ...game, piece: afterFlip } : game;
};

export function viewMatrix(game: Game): Matrix {
    let gameboard = game.matrix;
    gameboard = addPieceToBoard(gameboard, hardDrop(gameboard, game.piece), true);
    return addPieceToBoard(gameboard, game.piece);
}

export const init = (): Game => {
    const queue = PieceQueue.create(1);
    const next = PieceQueue.getNextPiece(queue);
    return {
        state: 'PLAYING',
        points: 0,
        lines: 0,
        matrix: buildMatrix(),
        piece: initializePiece(next.piece),
        queue: next.queue,
        score_send: false,
    };
};
