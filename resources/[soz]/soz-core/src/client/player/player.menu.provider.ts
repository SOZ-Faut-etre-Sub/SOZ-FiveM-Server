import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { RpcServerEvent } from '@public/shared/rpc';

import { Command } from '../../core/decorators/command';
import { Once, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClothConfig } from '../../shared/cloth';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { AnimationService } from '../animation/animation.service';
import { HudMinimapProvider } from '../hud/hud.minimap.provider';
import { HudStateProvider } from '../hud/hud.state.provider';
import { JobMenuProvider } from '../job/job.menu.provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { HalloweenSpiderService } from '../object/halloween.spider.service';
import { ProgressService } from '../progress.service';
import { PlayerAnimationProvider } from './player.animation.provider';
import { PlayerService } from './player.service';
import { PlayerWardrobe } from './player.wardrobe';

@Provider()
export class PlayerMenuProvider {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    @Inject(NuiMenu)
    private menu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @Inject(HudStateProvider)
    private hudStateProvider: HudStateProvider;

    @Inject(HudMinimapProvider)
    private hudMinimapProvider: HudMinimapProvider;

    @Inject(PlayerAnimationProvider)
    private playerAnimationProvider: PlayerAnimationProvider;

    @Inject(JobMenuProvider)
    private jobMenuProvider: JobMenuProvider;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(HalloweenSpiderService)
    private halloweenSpiderService: HalloweenSpiderService;

    @Once()
    public async init() {
        await this.halloweenSpiderService.init();
    }

    @Command('soz_core_toggle_personal_menu', {
        description: 'Ouvrir le menu personnel',
        passthroughNuiFocus: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'F1',
            },
        ],
    })
    public async togglePersonalMenu() {
        if (this.menu.getOpened() === MenuType.PlayerPersonal) {
            this.menu.closeMenu();
            return;
        }

        this.menu.openMenu(MenuType.PlayerPersonal, {
            ...this.hudStateProvider.getState(),
            scaledNui: this.hudMinimapProvider.scaledNui,
            shortcuts: this.playerAnimationProvider.getShortcuts(),
            job: this.jobMenuProvider.getJobMenuData(),
            deguisement: this.playerService.hasDeguisement(),
            halloween: isFeatureEnabled(Feature.Halloween),
            arachnophobe: this.halloweenSpiderService.isArachnophobeMode(),
        });
    }

    @Command('openPlayerKeyInventory', {
        description: 'Ouvrir le trousseau de clés',
        keys: [{ mapper: 'keyboard', key: '' }],
    })
    @OnNuiEvent(NuiEvent.PlayerMenuOpenKeys)
    public async openKeys() {
        TriggerServerEvent(ServerEvent.VEHICLE_OPEN_KEYS);

        this.menu.closeMenu();
    }

    @OnEvent(ClientEvent.PLAYER_CARD_SHOW)
    @OnNuiEvent(NuiEvent.PlayerMenuCardShow)
    public async onPlayerMenuCardShow(type, accountId?: string) {
        await this.playerService.showCard(type, accountId);
    }

    @OnEvent(ClientEvent.PLAYER_CARD_SEE)
    @OnNuiEvent(NuiEvent.PlayerMenuCardSee)
    public async seeCard({ type }) {
        const player = this.playerService.getId();
        let iban = '';
        if (!player) {
            return;
        }

        if (type === 'bank') {
            iban = await emitRpc<string>(RpcServerEvent.BANK_GET_ACCOUNT, player.citizenid);
        }

        this.dispatcher.dispatch('card', 'addCard', {
            type,
            player,
            iban,
        });
    }

    @OnNuiEvent(NuiEvent.PlayerMenuClothConfigUpdate)
    public async clothComponentUpdate({ key, value }: { key: keyof ClothConfig['Config']; value: boolean }) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (!this.playerService.canDoAction()) {
            return;
        }

        this.progressService.cancel();

        await this.playerWardrobe.setClothConfig(key, value);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuAnimationStop)
    public async stopAnimation() {
        if (!this.playerService.canDoAction()) {
            return;
        }

        this.animationService.stop();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuHudSetGlobal)
    public async hudComponentSetGlobal({ value }: { value: boolean }) {
        this.hudStateProvider.setHudVisible(value);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuHudSetCinematicMode)
    public async hudComponentSetCinematicMode({ value }: { value: boolean }) {
        this.hudStateProvider.setCinematicMode(value);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuHudSetCinematicCameraActive)
    public async hudComponentSetCinematicCameraActive({ value }: { value: boolean }) {
        this.hudStateProvider.setCinematicCameraActive(value);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuHudSetScaledNui)
    public async hudComponentSetScaledNui({ value }: { value: boolean }) {
        this.hudMinimapProvider.scaledNui = value;
    }

    @OnNuiEvent(NuiEvent.PlayerMenuVoipReset)
    public async resetVoip() {
        TriggerEvent('voip:client:reset');
    }

    @OnNuiEvent(NuiEvent.PlayerMenuHudSetArachnophobe)
    public async toogleArachnophobe(value: boolean) {
        this.halloweenSpiderService.updateArachnophobeMode(value);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuRemoveDeguisement)
    public async removeDeguisement() {
        const progress = await this.progressService.progress(
            'switch_clothes',
            "Changement d'habits...",
            5000,
            {
                name: 'male_shower_towel_dry_to_get_dressed',
                dictionary: 'anim@mp_yacht@shower@male@',
                options: {
                    cancellable: false,
                    enablePlayerControl: false,
                },
            },
            {
                useAnimationService: true,
                disableCombat: true,
                disableMovement: true,
                canCancel: false,
            }
        );

        if (!progress.completed) {
            return;
        }

        await wait(10);

        TriggerEvent('soz-character:Client:ApplyCurrent');
        this.playerService.setDeguisement(false);
        this.menu.closeMenu();
    }
}
