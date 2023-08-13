import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClothConfig } from '../../shared/cloth';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { AnimationService } from '../animation/animation.service';
import { HudMinimapProvider } from '../hud/hud.minimap.provider';
import { HudStateProvider } from '../hud/hud.state.provider';
import { JobMenuProvider } from '../job/job.menu.provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
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
        });
    }

    @OnNuiEvent(NuiEvent.PlayerMenuOpenKeys)
    public async openKeys() {
        TriggerServerEvent(ServerEvent.VEHICLE_OPEN_KEYS);

        this.menu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuCardShow)
    public async onPlayerMenuCardShow({ type }) {
        await this.playerService.showCard(type);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuCardSee)
    public async seeCard({ type }) {
        const player = this.playerService.getId();

        if (!player) {
            return;
        }

        this.dispatcher.dispatch('card', 'addCard', {
            type,
            player,
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
}
