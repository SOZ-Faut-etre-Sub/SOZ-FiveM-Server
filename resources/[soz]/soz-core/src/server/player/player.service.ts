import { Inject, Injectable } from '../../core/decorators/injectable';
import { SozRole } from '../../core/permissions';
import { Disease } from '../../shared/disease';
import { ClientEvent } from '../../shared/event';
import { PlayerData, PlayerMetadata } from '../../shared/player';
import { QBCore } from '../qbcore';

@Injectable()
export class PlayerService {
    @Inject(QBCore)
    private QBCore: QBCore;

    public getPlayerWeapon(source: number): any | null {
        const state = Player(source).state;

        return state.CurrentWeaponData || null;
    }

    public getPlayer(source: number): PlayerData | null {
        const player = this.QBCore.getPlayer(source);

        if (null === player) {
            return null;
        }

        return player.PlayerData;
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

    public setPlayerDisease(source: number, disease: Disease | false) {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return;
        }

        if (disease === false) {
            player.Functions.SetMetaData('disease', disease);
            TriggerClientEvent(ClientEvent.LSMC_DISEASE_APPLY_CURRENT_EFFECT, player.PlayerData.source, disease);

            return;
        }

        if (disease === 'grippe' && player.PlayerData.metadata['hazmat']) {
            return;
        }

        let interval = 2 * 60 * 60 * 1000; // 2 hours

        if (player.PlayerData.metadata.health_level > 80) {
            interval = 45 * 60 * 1000; // 30 minutes
        } else if (player.PlayerData.metadata.health_level > 60) {
            interval = 45 * 60 * 1000; // 45 minutes
        } else if (player.PlayerData.metadata.health_level > 40) {
            interval = 1 * 60 * 60 * 1000; // 1 hour
        }

        if (
            player.PlayerData.metadata.last_disease_at &&
            Date.now() - player.PlayerData.metadata.last_disease_at < interval
        ) {
            return;
        }

        if (player && (disease !== 'grippe' || (disease === 'grippe' && !player.PlayerData.metadata['hazmat']))) {
            player.Functions.SetMetaData('disease', disease);
            player.Functions.SetMetaData('last_disease_at', Date.now());

            TriggerClientEvent(ClientEvent.LSMC_DISEASE_APPLY_CURRENT_EFFECT, player.PlayerData.source, disease);
        }
    }

    public save(source: number): void {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            player.Functions.Save();
        }
    }

    public incrementMetadata<K extends keyof PlayerMetadata>(
        source: number,
        key: K,
        value: number,
        min = 0,
        max: number | null = null
    ) {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            const currentValue = player.PlayerData.metadata[key] as number;
            let newValue = currentValue + value;

            if (newValue < min) {
                newValue = min;
            }

            if (max && newValue > max) {
                newValue = max;
            }

            player.Functions.SetMetaData(key, newValue);
        }
    }

    public hasPermission(source: number, permission: SozRole): boolean {
        return this.QBCore.hasPermission(source, permission);
    }
}
