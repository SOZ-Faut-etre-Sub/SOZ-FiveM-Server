import React from 'react';

import I from '../assets/piece_I.svg';
import J from '../assets/piece_J.svg';
import L from '../assets/piece_L.svg';
import O from '../assets/piece_O.svg';
import S from '../assets/piece_S.svg';
import T from '../assets/piece_T.svg';
import Z from '../assets/piece_Z.svg';
import { Piece } from '../game/Piece';

type Props = {
    piece?: Piece;
};

const PieceView: React.FC<Props> = ({ piece }): JSX.Element => {
    switch (piece) {
        case 'I':
            return <I />;
        case 'J':
            return <J />;
        case 'L':
            return <L />;
        case 'O':
            return <O />;
        case 'S':
            return <S />;
        case 'T':
            return <T />;
        case 'Z':
            return <Z />;
    }
};

export default PieceView;
