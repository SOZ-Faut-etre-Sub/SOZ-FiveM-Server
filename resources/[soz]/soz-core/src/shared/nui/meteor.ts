import { Music } from '../audio';

export interface NuiMeteorMap {
    load: never;
    start: never;
    stop: never;
    white: never;
    earthquake: boolean;
    destruction: boolean;
    musics: Record<Music, number>;
}
