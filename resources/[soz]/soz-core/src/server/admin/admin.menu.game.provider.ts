import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { wait } from '../../core/utils';
import { Component, Outfit } from '../../shared/cloth';
import { DrivingSchoolConfig } from '../../shared/driving-school';
import { ServerEvent } from '../../shared/event';
import { JobType } from '../../shared/job';
import { PlayerCharInfo } from '../../shared/player';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { PlayerStateService } from '../player/player.state.service';
import { QBCore } from '../qbcore';

@Provider()
export class AdminMenuGameProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(PrismaService)
    private database: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.ADMIN_ADD_MONEY)
    public addMoney(source: number, moneyType: 'money' | 'marked_money', amount: number): void {
        this.playerMoneyService.add(source, amount, moneyType);
    }

    @OnEvent(ServerEvent.ADMIN_ADD_LICENSE)
    public addLicense(source: number, licenseType: number): void {
        const license = DrivingSchoolConfig.licenses[licenseType];

        if (!license) {
            return;
        }

        this.playerService.addLicence(source, license);
    }

    @OnEvent(ServerEvent.ADMIN_UNCUFF_PLAYER)
    public uncuff(source: number): void {
        this.playerService.setPlayerMetadata(source, 'ishandcuffed', false);
        this.playerStateService.setClientState(source, {
            isHandcuffed: false,
        });
        TriggerClientEvent('police:client:GetUnCuffed', source);
    }

    @OnEvent(ServerEvent.ADMIN_SET_GOD_MODE)
    public setGodMode(source: number, value: boolean): void {
        SetPlayerInvincible(source, !!value);
        this.playerService.setPlayerMetadata(source, 'godmode', !!value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_JOB)
    public setJob(source: number, jobId: JobType, gradeId: number): void {
        this.playerService.setJob(source, jobId, gradeId);
    }

    @OnEvent(ServerEvent.ADMIN_SET_CLOTHES)
    public setClothes(source: number, outfit: Outfit): void {
        this.playerService.updateSkin(
            source,
            skin => {
                skin.Hair.HairType = outfit.Components[Component.Hair].Drawable;

                return skin;
            },
            false
        );
        this.playerService.updateClothConfig(source, 'BaseClothSet', outfit, false);
        this.notifier.notify(source, 'Tenue sauvegardée.', 'success');
    }

    @OnEvent(ServerEvent.ADMIN_CREATE_CHARACTER)
    public async createCharacter(source: number, firstname: string, lastname: string): Promise<void> {
        this.QBCore.logout(source);

        await wait(1000);

        TriggerClientEvent('soz-character:client:create-new-character', source, 'spawn1', firstname, lastname);
    }

    @OnEvent(ServerEvent.ADMIN_SWITCH_CHARACTER)
    public async switchCharacter(source: number, citizenId: string): Promise<void> {
        this.QBCore.logout(source);

        await wait(1000);

        const player = await this.database.player.findUnique({
            where: {
                citizenid: citizenId,
            },
        });

        TriggerClientEvent('soz-character:client:login-character', source, player);
    }

    @Rpc(RpcServerEvent.ADMIN_GET_CHARACTERS)
    public async getCharacters(source: number): Promise<Record<string, PlayerCharInfo>> {
        try {
            const steam = this.QBCore.getSteamIdentifier(source);
            const players = await this.database.player.findMany({
                where: {
                    license: steam,
                },
            });

            const characters = {};

            for (const player of players) {
                characters[player.citizenid] = JSON.parse(player.charinfo);
            }

            return characters;
        } catch (e) {
            console.trace(e);
            return {};
        }
    }
}
