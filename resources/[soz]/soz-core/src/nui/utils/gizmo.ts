import { MathUtils, Mesh } from 'three';

import { Vector3, Vector4 } from '../../shared/polyzone/vector';

export const gameToGizmo = (position: Vector4 | Vector3, rotation: Vector3) => {
    return [
        [position[0], position[2], -position[1]],
        [MathUtils.degToRad(rotation[0]), MathUtils.degToRad(rotation[2]), MathUtils.degToRad(-rotation[1])],
    ];
};

export const gameToGizmoMatrix4 = (matrix: number[]): number[] => {
    return [
        matrix[0],
        matrix[2],
        -matrix[1],
        matrix[3],

        matrix[8],
        matrix[10],
        -matrix[9],
        matrix[11],

        -matrix[4],
        -matrix[6],
        matrix[5],
        matrix[7],

        matrix[12],
        matrix[14],
        -matrix[13],
        matrix[15],
    ];
};

export const gizmoToGame = (currentMesh: Mesh) => {
    return [
        [currentMesh.position.x, -currentMesh.position.z, currentMesh.position.y],
        [
            MathUtils.radToDeg(currentMesh.rotation.x),
            MathUtils.radToDeg(-currentMesh.rotation.z),
            MathUtils.radToDeg(currentMesh.rotation.y),
        ],
    ];
};

export const gizmoToGameMatrix4 = (gizmoMatrix: number[]) => {
    return [
        gizmoMatrix[0],
        -gizmoMatrix[2],
        gizmoMatrix[1],
        gizmoMatrix[3],
        -gizmoMatrix[8],
        gizmoMatrix[10],
        -gizmoMatrix[9],
        gizmoMatrix[11],
        gizmoMatrix[4],
        -gizmoMatrix[6],
        gizmoMatrix[5],
        gizmoMatrix[7],
        gizmoMatrix[12],
        -gizmoMatrix[14],
        gizmoMatrix[13],
        gizmoMatrix[15],
    ];
};

export const roundAt = (valueToRound: number): number => {
    const power = Math.pow(10, 3);
    return Math.round(valueToRound * power) / power;
};
