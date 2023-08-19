import cn from 'classnames';

import { Piece } from '../game/Piece';

type PieceColorFn = (piece: Piece | 'ghost') => string;

export const usePieceColor = (): PieceColorFn => {
    return piece =>
        cn('aspect-square', {
            'bg-gradient-to-br': piece,
            'from-sky-400 to-sky-700': piece === 'I',
            'from-green-400 to-green-700': piece === 'J',
            'from-pink-400 to-pink-700': piece === 'L',
            'from-yellow-400 to-yellow-700': piece === 'O',
            'from-orange-400 to-orange-700': piece === 'S',
            'from-blue-400 to-blue-700': piece === 'T',
            'from-red-400 to-red-700': piece === 'Z',
            'bg-[#ffffff10]': piece === 'ghost',
        });
};
