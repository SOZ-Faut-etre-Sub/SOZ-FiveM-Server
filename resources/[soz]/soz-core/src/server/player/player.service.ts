import { ServerStateService } from '@public/server/server.state.service';
import { ClothConfig } from '@public/shared/cloth';
import { DrivingSchoolLicense } from '@public/shared/driving-school';
import { JobType } from '@public/shared/job';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Disease } from '../../shared/disease';
import { ClientEvent } from '../../shared/event';
import { PlayerCharInfo, PlayerData, PlayerMetadata, Skin } from '../../shared/player';
import { PrismaService } from '../database/prisma.service';
import { QBCore } from '../qbcore';

@Injectable()
export class PlayerService {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    private names: Record<string, string> = {};

    public getPlayerByCitizenId(citizenId: string): PlayerData | null {
        const player = this.QBCore.getPlayerByCitizenId(citizenId);

        if (player) {
            return player.PlayerData;
        }

        return null;
    }

    public getPlayer(source: number): PlayerData | null {
        const player = this.serverStateService.getPlayer(source);

        if (!player) {
            return null;
        }

        return player;
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
            interval = 60 * 60 * 1000; // 1 hour
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
        const currentValue = (player.metadata[key] as number) ?? 0;
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

    public updateSkin(source: number, updater: (skin: Skin) => Skin, apply: boolean): void {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return;
        }

        const skin = player.PlayerData.skin;
        const newSkin = updater(skin);

        player.Functions.SetSkin(newSkin, apply);
    }

    public updateClothConfig<K extends keyof ClothConfig>(
        source: number,
        key: K,
        value: ClothConfig[K],
        apply: boolean
    ): void {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return;
        }

        const config = player.PlayerData.cloth_config;
        config[key] = value;

        player.Functions.SetClothConfig(config, apply);
    }

    public addLicence(source: number, license: DrivingSchoolLicense): void {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return;
        }

        const licenses = player.PlayerData.metadata['licences'];
        licenses[license.licenseType] = license.points;
        this.setPlayerMetadata(source, 'licences', licenses);
    }

    public setJob(source: number, job: JobType, grade: number): PlayerData | null {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return null;
        }

        player.Functions.SetJob(job, grade);
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

    public async getNameFromCitizenId(citizenId: string) {
        if (!this.names[citizenId]) {
            const dbInfo = await this.prismaService.player.findFirst({
                where: {
                    citizenid: citizenId,
                },
                select: {
                    charinfo: true,
                },
            });

            if (!dbInfo) {
                return 'Inconnu';
            }

            const charInfo = JSON.parse(dbInfo.charinfo) as PlayerCharInfo;

            this.names[citizenId] = charInfo.firstname + ' ' + charInfo.lastname;
        }

        return this.names[citizenId];
    }

    public playerHasAMask(player: PlayerData): boolean {
        return  !player.cloth_config.Config.HideMask
    }
}
