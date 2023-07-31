import { Vector2, Vector3, Vector4 } from './polyzone/vector';

const ZONE_RADIUS = 512;

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

const getGridChunk = (x: number): number => {
    return Math.floor((x + 8192) / ZONE_RADIUS);
};

export const getChunkId = (v: Vector2 | Vector3 | Vector4): number => {
    const x = getGridChunk(v[0]);
    const y = getGridChunk(v[1]);

    return (x << 2) | y[1];
};

export const getGridChunks = (position: Vector2 | Vector3 | Vector4): number[] => {
    const chunks = [];

    chunks.push(getChunkId(position)); // Get current chunk

    for (const delta of DELTAS) {
        const chunkSize = [position[0] + delta[0] * 256, position[1] + delta[1] * 256] as Vector2;
        const chunkId = getChunkId(chunkSize);

        if (!chunks.includes(chunkId)) {
            chunks.push(chunkId);
        }
    }

    return chunks;
};
