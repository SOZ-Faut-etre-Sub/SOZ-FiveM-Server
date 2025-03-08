import { LaserGameData } from '@public/shared/games/laser';

export interface NuiLaserGameMethodMap {
    SetCountDown: string;
    AddKill: string;
    AddKilled: string;
    SetStart: { start: number; duration: number };
    SetGameData: LaserGameData;
    SetCurrentPlayer: string;
    SetScores: Record<any, number>;
}
