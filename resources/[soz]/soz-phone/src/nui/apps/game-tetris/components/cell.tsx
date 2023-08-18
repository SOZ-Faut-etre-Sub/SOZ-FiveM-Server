import React from 'react';

type CellProps = {
    type?: number;
    x: number;
    y: number;
};

const CELL_SIZE = 30;

const Cell: React.FC<CellProps> = ({ type, x, y }) => {
    // On définit les couleurs possibles pour chaque type de cellule
    const colors = ['', '#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#fff', '#5d8921'];

    // On calcule la position de la cellule en pixels en fonction de sa position sur la grille
    const left = `${CELL_SIZE * x + 1}px`;
    const top = `${CELL_SIZE * y + 1}px`;

    // On retourne un élément div avec la bonne couleur et la bonne position
    return (
        <div
            className="tetris-cell"
            style={{
                width: `${CELL_SIZE - 1}px`,
                height: `${CELL_SIZE - 1}px`,
                left,
                top,
                backgroundColor: colors[type || 0],
            }}
        />
    );
};

export default Cell;
