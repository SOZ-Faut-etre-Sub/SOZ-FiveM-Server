import { Rpc } from '@public/core/decorators/rpc';
import { RpcServerEvent } from '@public/shared/rpc';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AdminPlayer } from '../../shared/admin/admin';
import { Disease } from '../../shared/disease';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerMetadata } from '../../shared/player';
import { Vector3 } from '../../shared/polyzone/vector';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { PlayerStateService } from '../player/player.state.service';

@Provider()
export class AdminMenuPlayerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PrismaService)
    private prisma: PrismaService;

    @OnEvent(ServerEvent.ADMIN_ADD_PERSISTENT_PROP)
    public async addPersistentProp(source: number, model: number, event: string | null, position: any) {
        await this.prisma.persistent_prop.create({
            data: {
                event,
                model,
                position: JSON.stringify(position),
            },
        });

        TriggerEvent('core:server:refreshPersistentProp');
    }

    @OnEvent(ServerEvent.ADMIN_SPECTATE_PLAYER)
    public spectatePlayer(source: number, player: AdminPlayer) {
        const position = GetEntityCoords(GetPlayerPed(player.id)) as Vector3;

        TriggerClientEvent(ClientEvent.ADMIN_SPECTATE_PLAYER, source, player.id, position);
    }

    @OnEvent(ServerEvent.ADMIN_KILL_PLAYER)
    public killPlayer(source: number, player: AdminPlayer) {
        TriggerClientEvent(ClientEvent.ADMIN_KILL_PLAYER, player.id);
    }

    @OnEvent(ServerEvent.ADMIN_SET_METADATA)
    public onSetHealthMetadata(source: number, player: AdminPlayer, key: keyof PlayerMetadata, value: number) {
        this.playerService.setPlayerMetadata(player.id, key, value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STAMINA)
    public onSetStamina(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'max_stamina', value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STRESS_LEVEL)
    public onSetStressLevel(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'stress_level', value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STRENGTH)
    public onSetStrength(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'strength', value);
        this.playerService.updatePlayerMaxWeight(player.id);
    }

    @OnEvent(ServerEvent.ADMIN_SET_DISEASE)
    public setPlayerDisease(source: number, player: AdminPlayer, disease: Disease) {
        this.playerService.setPlayerMetadata(player.id, 'disease', disease);
        TriggerClientEvent(ClientEvent.LSMC_DISEASE_APPLY_CURRENT_EFFECT, player.id, disease);
    }

    @OnEvent(ServerEvent.ADMIN_RESET_EFFECT)
    public resetEffect(source: number, player: AdminPlayer) {
        this.playerService.setPlayerMetadata(player.id, 'alcohol', 0);
        this.playerService.setPlayerMetadata(player.id, 'drug', 0);
    }

    @OnEvent(ServerEvent.ADMIN_SET_DRUG_EFFECT)
    public setPlayerDrug(source: number, player: AdminPlayer) {
        this.playerService.setPlayerMetadata(player.id, 'drug', 100);
    }

    @OnEvent(ServerEvent.ADMIN_SET_ALCOHOL_EFFECT)
    public setPlayerAlcohol(source: number, player: AdminPlayer) {
        this.playerService.setPlayerMetadata(player.id, 'alcohol', 100);
    }

    @OnEvent(ServerEvent.ADMIN_UNFREEZE_PLAYER)
    public unfreezePlayer(source: number, player: AdminPlayer) {
        const ped = GetPlayerPed(player.id);
        FreezeEntityPosition(ped, false);
    }

    @OnEvent(ServerEvent.ADMIN_FREEZE_PLAYER)
    public freezePlayer(source: number, player: AdminPlayer) {
        const ped = GetPlayerPed(player.id);
        FreezeEntityPosition(ped, true);
    }

    @OnEvent(ServerEvent.ADMIN_RESET_SKIN)
    public resetPlayerSkin(source: number, player: AdminPlayer) {
        TriggerClientEvent(ClientEvent.CHARACTER_REQUEST_CHARACTER_WIZARD, player.id);
    }

    @OnEvent(ServerEvent.ADMIN_TELEPORT_TO_PLAYER)
    public teleportToPlayer(source: number, player: AdminPlayer) {
        const ped = GetPlayerPed(source);
        const position = GetEntityCoords(GetPlayerPed(player.id));

        SetEntityCoords(ped, position[0], position[1], position[2], false, false, false, false);
    }

    @OnEvent(ServerEvent.ADMIN_TELEPORT_PLAYER_TO_ME)
    public teleportPlayerToMe(source: number, player: AdminPlayer) {
        const ped = GetPlayerPed(player.id);
        const position = GetEntityCoords(GetPlayerPed(ped));

        SetEntityCoords(ped, position[0], position[1], position[2], false, false, false, false);

        this.playerService.setPlayerMetadata(player.id, 'inside', {
            apartment: false,
            exitCoord: false,
            property: null,
        });
    }

    @OnEvent(ServerEvent.ADMIN_SET_AIO)
    public onSetAIO(source: number, player: AdminPlayer, value: 'min' | 'max') {
        this.onSetStamina(source, player, value === 'min' ? -1000 : 1000);
        this.onSetStressLevel(source, player, value === 'min' ? -1000 : 1000);
        this.onSetStrength(source, player, value === 'min' ? -1000 : 1000);

        const targetPlayer = this.playerService.getPlayer(player.id);

        if (!targetPlayer) {
            return;
        }

        const nutritionValue = value === 'min' ? 0 : 25;
        const newHealthLevel = this.playerService.getIncrementedMetadata(
            targetPlayer,
            'health_level',
            value === 'min' ? -100 : 100,
            0,
            100
        );

        let maxHealth = 200;

        if (newHealthLevel < 20) {
            maxHealth = 160;
        } else if (newHealthLevel < 40) {
            maxHealth = 180;
        }

        this.playerService.setPlayerMetaDatas(player.id, {
            fiber: nutritionValue,
            sugar: nutritionValue,
            protein: nutritionValue,
            lipid: nutritionValue,
            max_health: maxHealth,
            health_level: newHealthLevel,
        });
    }

    @OnEvent(ServerEvent.ADMIN_RESET_SKIN)
    public async onResetSkin(source: number, target: number) {
        TriggerClientEvent(ClientEvent.CHARACTER_REQUEST_CHARACTER_WIZARD, target);
        this.notifier.notify(source, 'Le skin du joueur a été reset.');
    }

    @OnEvent(ServerEvent.ADMIN_RESET_HALLOWEEN)
    public async onResetHalloween(source: number, target: number, year: '2022', scenario: 'scenario1' | 'scenario2') {
        this.playerService.setPlayerMetadata(target, `halloween2022`, {
            ...this.playerService.getPlayer(target).metadata.halloween2022,
            [scenario]: null,
        });
        this.notifier.notify(
            source,
            `La progression du joueur ~b~Halloween ${year} (${scenario})~s~ a été réinitialisée.`,
            'info'
        );
    }

    @Rpc(RpcServerEvent.ADMIN_GET_REPUTATION)
    public getReputation(source: number, target: number) {
        return this.playerService.getPlayer(target).metadata.criminal_reputation;
    }

    @OnEvent(ServerEvent.ADMIN_RESET_CLIENT_STATE)
    public async onResetClientState(source: number, target: number) {
        this.playerStateService.resetClientState(target);

        this.notifier.notify(source, `L'état client du joueur a été réinitialisée.`, 'info');
    }
}
