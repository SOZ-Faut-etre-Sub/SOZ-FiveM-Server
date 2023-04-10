import { Inject, Injectable } from '../../core/decorators/injectable';
import { Disease } from '../../shared/disease';
import { ClientEvent } from '../../shared/event';
import { PlayerData, PlayerMetadata } from '../../shared/player';
import { QBCore } from '../qbcore';

@Injectable()
export class PlayerService {
    @Inject(QBCore)
    private QBCore: QBCore;

    public getPlayerByCitizenId(citizenId: string): PlayerData | null {
        const player = this.QBCore.getPlayerByCitizenId(citizenId);

        if (player) {
            return player.PlayerData;
        }

        return null;
    }

    public getPlayerWeapon(source: number): any | null {
        const state = Player(source).state;

        return state.CurrentWeaponData || null;
    }

    public getPlayer(source: number): PlayerData | null {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return null;
        }

        return player.PlayerData;
    }

    public getPlayerJobAndGrade(source: number): [string, number] | null {
        const player = this.QBCore.getPlayer(source);

        return [player.PlayerData.job.id, Number(player.PlayerData.job.grade)];
    }

    public updatePlayerMaxWeight(source: number): void {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            player.Functions.UpdateMaxWeight();
        }
    }

    public setPlayerMetadata<K extends keyof PlayerMetadata>(source: number, key: K, value: PlayerMetadata[K]) {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            player.Functions.SetMetaData(key, value);
        }
    }

    public setPlayerMetaDatas(source: number, datas: Partial<PlayerMetadata>) {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            player.Functions.SetMetaDatas(datas);

            if (datas.strength) {
                player.Functions.UpdateMaxWeight();
            }
        }
    }

    public setPlayerDisease(source: number, disease: Disease = false): Disease {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return false;
        }

        if (!disease) {
            player.Functions.SetMetaData('disease', false);
            TriggerClientEvent(ClientEvent.LSMC_DISEASE_APPLY_CURRENT_EFFECT, player.PlayerData.source, false);

            return false;
        }

        if (disease === 'grippe' && player.PlayerData.metadata['hazmat']) {
            return false;
        }

        let interval = 2 * 60 * 60 * 1000; // 2 hours

        if (player.PlayerData.metadata.health_level < 20) {
            interval = 45 * 60 * 1000; // 30 minutes
        } else if (player.PlayerData.metadata.health_level < 40) {
            interval = 45 * 60 * 1000; // 45 minutes
        } else if (player.PlayerData.metadata.health_level < 60) {
            interval = 1 * 60 * 60 * 1000; // 1 hour
        }

        if (
            disease !== 'dyspepsie' &&
            player.PlayerData.metadata.last_disease_at &&
            Date.now() - player.PlayerData.metadata.last_disease_at < interval
        ) {
            return false;
        }

        player.Functions.SetMetaDatas({
            last_disease_at: Date.now(),
            disease: disease,
        });

        TriggerClientEvent(ClientEvent.LSMC_DISEASE_APPLY_CURRENT_EFFECT, player.PlayerData.source, disease);

        return disease;
    }

    public getIncrementedMetadata<K extends keyof PlayerMetadata>(
        player: PlayerData,
        key: K,
        value: number,
        min: number,
        max?: number
    ): number {
        const currentValue = player.metadata[key] as number;
        let newValue = currentValue + value;

        if (newValue < min) {
            newValue = min;
        }

        if (max && newValue > max) {
            newValue = max;
        }

        return newValue;
    }

    public incrementMetadata<K extends keyof PlayerMetadata>(
        source: number,
        key: K,
        value: number,
        min: number,
        max?: number
    ): number {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            const newValue = this.getIncrementedMetadata(player.PlayerData, key, value, min, max);

            player.Functions.SetMetaData(key, newValue);

            return newValue;
        }

        return null;
    }

    public setJobDuty(source: number, onDuty: boolean): PlayerData | null {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return null;
        }

        player.Functions.SetJobDuty(onDuty);
    }

    public getSteamIdentifier(source: number): string {
        return this.QBCore.getSteamIdentifier(source);
    }
}
