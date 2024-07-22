import { wait } from '@public/core/utils';

import { Command } from '../../core/decorators/command';
import { Once, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClothConfig } from '../../shared/cloth';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { AnimationService } from '../animation/animation.service';
import { HudMinimapProvider } from '../hud/hud.minimap.provider';
import { HudStateProvider } from '../hud/hud.state.provider';
import { JobMenuProvider } from '../job/job.menu.provider';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { HalloweenSpiderService } from '../object/halloween.spider.service';
import { ProgressService } from '../progress.service';
import { VampireGameStateProvider } from '../story/vampire.game.state.provider';
import { VoiceProvider } from '../voip/voice/voice.provider';
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

    @Inject(VoiceProvider)
    private voiceProvider: VoiceProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(VampireGameStateProvider)
    private vampireGameStateProvider: VampireGameStateProvider;

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
            naked: this.playerService.getPlayer().cloth_config.Config.Naked,
            arachnophobe: this.halloweenSpiderService.isArachnophobeMode(),
        });
    }

    @OnNuiEvent(NuiEvent.PlayerMenuClothConfigUpdate)
    public async clothComponentUpdate({ key, value }: { key: keyof ClothConfig['Config']; value: boolean }) {
        if (this.vampireGameStateProvider.isGameRunning()) {
            return;
        }

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
        await this.voiceProvider.reconnect(true, 'Demande joueur');
    }

    @OnNuiEvent(NuiEvent.PlayerMenuHudSetArachnophobe)
    public async toogleArachnophobe(value: boolean) {
        this.halloweenSpiderService.updateArachnophobeMode(value);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuRemoveDeguisement)
    public async removeDeguisement() {
        const progress = await this.playerWardrobe.waitProgress(false);

        if (!progress.completed) {
            return;
        }

        await wait(10);

        TriggerEvent('soz-character:Client:ApplyCurrent');
        this.playerService.setDeguisement(false);
        this.menu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuReDress)
    public async reDrees() {
        const progress = await this.playerWardrobe.waitProgress(false);

        if (!progress.completed) {
            return;
        }

        TriggerServerEvent('soz-character:server:UpdateClothConfig', 'Naked', false);
    }
}
