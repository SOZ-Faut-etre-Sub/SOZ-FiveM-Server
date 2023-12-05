import { emitRpc } from '@public/core/rpc';
import { CraftsList } from '@public/shared/craft/craft';
import { JobPermission, JobType } from '@public/shared/job';
import { RpcServerEvent } from '@public/shared/rpc';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';

@Provider()
export class FightForStyleProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(JobService)
    private jobService: JobService;

    private state = {
        ffs_cotton_bale: false,
    };

    @Once(OnceStep.PlayerLoaded)
    public setupFfsJob() {
        this.createBlips();

        this.targetFactory.createForBoxZone(
            'ffs:duty',
            {
                center: [707.29, -967.58, 30.41],
                length: 0.35,
                width: 0.4,
                minZ: 30.21,
                maxZ: 30.66,
            },
            [
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Prise de service',
                    canInteract: () => {
                        return !this.playerService.isOnDuty();
                    },
                    job: JobType.Ffs,
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: JobType.Ffs,
                },
                {
                    icon: 'fas fa-users',
                    label: 'Employé(e)s en service',
                    action: () => {
                        TriggerServerEvent('QBCore:GetEmployOnDuty');
                    },
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return (
                            this.playerService.isOnDuty() &&
                            this.jobService.hasPermission(player.job.id, JobPermission.OnDutyView)
                        );
                    },
                    job: JobType.Ffs,
                },
            ]
        );
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
