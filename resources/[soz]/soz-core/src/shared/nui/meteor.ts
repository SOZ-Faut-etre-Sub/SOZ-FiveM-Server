import { Vector3 } from '../polyzone/vector';

export interface NuiMeteorMap {
    start: never;
    update: {
        playerPosition: Vector3;
        meteorPostion: Vector3;
        heading: number;
    };
    end: never;
    white: never;
    music: boolean;
}
