import { Inject, Injectable } from '../../core/decorators/injectable';
import { SozRole } from '../../core/permissions';
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
            console.log('setPlayerMetadata', key, value);
            player.Functions.SetMetaData(key, value);
        }
    }

    public setPlayerDisease(source: number, disease: string | false) {
        TriggerEvent('lsmc:maladie:server:SetCurrentDisease', disease, source);
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
