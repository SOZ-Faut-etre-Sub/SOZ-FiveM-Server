import { Vector2, Vector3, Vector4 } from './polyzone/vector';

const ZONE_RADIUS = 256;

const DELTAS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
];

const getGridChunk = (x: number, radius = ZONE_RADIUS): number => {
    return Math.floor((x + 8192) / radius);
};

export const getChunkId = (v: Vector2 | Vector3 | Vector4, radius = ZONE_RADIUS): number => {
    const x = getGridChunk(v[0], radius);
    const y = getGridChunk(v[1], radius);

    return (x << 16) | y;
};

export const getGridChunks = (position: Vector2 | Vector3 | Vector4, radius = ZONE_RADIUS): number[] => {
    const chunks = [];

    chunks.push(getChunkId(position, radius)); // Get current chunk

    for (const delta of DELTAS) {
        const chunkSize = [position[0] + delta[0] * (radius / 2), position[1] + delta[1] * (radius / 2)] as Vector2;
        const chunkId = getChunkId(chunkSize, radius);

        if (!chunks.includes(chunkId)) {
            chunks.push(chunkId);
        }
    }

    return chunks;
};
