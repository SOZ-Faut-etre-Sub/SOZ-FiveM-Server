import { Once, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { ItemService } from '@public/server/item/item.service';
import { MeteorSubMenuState } from '@public/shared/admin/admin';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { RpcServerEvent } from '@public/shared/rpc';

import { FeatureProvider } from '../feature/feature.provider';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { PlayerAppearanceService } from '../player/player.appearance.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { RebootProvider } from '../reboot/reboot.provider';
import { NpcProvider } from '../utils/npc.provider';
import { EarthquakeProvider } from './earthquake.provider';
import { FireProvider } from './fire.provider';
import { OceanProvider } from './ocean.provider';
import { TornadoProvider } from './tornado.provider';

@Provider()
export class MeteorProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(RebootProvider)
    public rebootProvider: RebootProvider;

    @Inject(EarthquakeProvider)
    public earthquakeProvider: EarthquakeProvider;

    @Inject(OceanProvider)
    public oceanProvider: OceanProvider;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerAppearanceService)
    private playerAppearanceService: PlayerAppearanceService;

    @Inject(NpcProvider)
    private npcProvider: NpcProvider;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(TornadoProvider)
    private tornadoProvider: TornadoProvider;

    @Inject(FireProvider)
    private fireProvider: FireProvider;

    private siren = 0;
    private music = 0;
    private chronos = 0;
    private sandstormmusic = 0;

    @Once()
    public onStart() {
        this.itemService.setItemUseCallback('full_scarf', this.useFullScarf.bind(this));
    }

    private async useFullScarf(source: number) {
        const progress = await this.progressService.progress(
            source,
            'switch_clothes',
            "Changement d'habits...",
            1000,
            {
                name: 'put_on_mask',
                dictionary: 'mp_masks@on_foot',
                options: {
                    cancellable: false,
                    enablePlayerControl: false,
                },
            },
            {
                disableCombat: true,
                disableMovement: true,
                canCancel: false,
            }
        );

        if (!progress.completed) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(source);
        targetPlayer.cloth_config.Config.HideMask = false;
        this.playerAppearanceService.setClothConfig(source, targetPlayer.cloth_config, true);

        TriggerClientEvent(ClientEvent.FULL_SCARF_TOGGLE, source);
    }

    @Rpc(RpcServerEvent.ADMIN_METEOR_STATE)
    public getMeteorSate(): MeteorSubMenuState {
        return {
            disableNpc: this.npcProvider.isDisabled(),
            music: this.music,
            siren: this.siren,
            chronos: this.chronos,
            earthQuake: this.earthquakeProvider.isEarthQuake(),
            highWave: this.oceanProvider.getHighWave(),
            sandstormmusic: this.sandstormmusic,
            tornado: this.tornadoProvider.isRunning(),
            firePropagation: this.fireProvider.propagationIsEnabled(),
        };
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_SIREN)
    public toggleMetorSiren(source: number, value: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.siren = value;
        TriggerClientEvent(ClientEvent.METEOR_SIREN, -1, value);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_ACTIVATE)
    public activate(source: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        TriggerClientEvent(ClientEvent.METEOR_START, -1);
        this.notifier.notify(source, 'Lancement météorite...');
        this.music = 0;
        this.siren = 0;
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_MUSIC)
    public activateMusic(source: number, value: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.music = value;
        TriggerClientEvent(ClientEvent.METEOR_MUSIC, -1, value);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_CHONOS_MUSIC)
    public activateChonosMusic(source: number, value: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.chronos = value;
        TriggerClientEvent(ClientEvent.METEOR_CHONOS_MUSIC, -1, value);
    }

    @OnEvent(ServerEvent.ADMIN_SANDSTORM_MUSIC)
    public activateSandstormMusic(source: number, value: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.sandstormmusic = value;
        TriggerClientEvent(ClientEvent.METEOR_SANDSTORM_MUSIC, -1, value);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_KICK_PLAYERS)
    public kickPlayers() {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        const message = this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)
            ? " Suite à l'impact de la bombe nucléaire, San Andreas et ses habitants se sont évaporés, clôturant ainsi cette première édition du WHAT IF ! Merci à tous les joueurs pour leur participation. ❤️ "
            : "L'impact de la météorite vous a assommé, vous pourrez vous réveiller dans quelques minutes...";
        this.rebootProvider.kickAll(message);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_DISABLE_NPC)
    public disableNPC(source: number, value: boolean) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.npcProvider.disableNPC(value);
    }
}
