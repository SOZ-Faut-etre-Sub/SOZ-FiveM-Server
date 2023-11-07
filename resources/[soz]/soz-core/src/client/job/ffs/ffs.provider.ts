import { emitRpc } from '@public/core/rpc';
import { CraftsList } from '@public/shared/craft/craft';
import { JobType } from '@public/shared/job';
import { RpcServerEvent } from '@public/shared/rpc';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';

@Provider()
export class FightForStyleProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private state = {
        ffs_cotton_bale: false,
    };

    @Once(OnceStep.PlayerLoaded)
    public setupFfsJob() {
        this.createBlips();
    }

    @OnNuiEvent(NuiEvent.FfsDisplayBlip)
    public async onDisplayBlip({ blip, value }: { blip: string; value: boolean }) {
        this.state[blip] = value;
        this.blipFactory.hide(blip, !value);
    }

    @OnEvent(ClientEvent.JOBS_FFS_OPEN_SOCIETY_MENU)
    public async onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.FightForStyleJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        const crafting = await emitRpc<CraftsList>(RpcServerEvent.CRAFT_GET_RECIPES, JobType.Ffs);
        this.nuiMenu.openMenu(MenuType.FightForStyleJobMenu, {
            recipes: crafting.categories,
            state: this.state,
            onDuty: this.playerService.isOnDuty(),
        });
    }

    private createBlips() {
        this.blipFactory.create('jobs:ffs', {
            name: 'Fight For Style',
            coords: { x: 717.72, y: -974.24, z: 24.91 },
            sprite: 808,
            scale: 1.2,
        });
        this.blipFactory.create('ffs_cotton_bale', {
            name: 'Point de récolte de balles de coton',
            coords: { x: 2564.11, y: 4680.59, z: 34.08 },
            sprite: 808,
            scale: 0.9,
        });
        this.blipFactory.hide('ffs_cotton_bale', true);
    }
}
