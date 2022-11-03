import { JobBlips, JobBossShop, JobMenu } from '../../config/job';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { BossShop, JobPermission, JobType } from '../../shared/job';
import { MenuType } from '../../shared/nui/menu';
import { Ok } from '../../shared/result';
import { BlipFactory } from '../blip';
import { ItemService } from '../item/item.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';
import { JobPermissionService } from './job.permission.service';

@Provider()
export class JobProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobPermissionService)
    private jobPermissionService: JobPermissionService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ItemService)
    private itemService: ItemService;

    @Once(OnceStep.PlayerLoaded)
    public async onStart() {
        for (const [job, blips] of Object.entries(JobBlips)) {
            for (const blipIndex in blips) {
                const blip = blips[blipIndex];
                this.blipFactory.create(`job_${job}_${blipIndex}`, blip);
            }
        }

        for (const [job, shop] of Object.entries(JobBossShop)) {
            this.targetFactory.createForBoxZone(`boss_shop_${job}`, shop.zone, [
                {
                    label: 'Récupérer du matériel',
                    icon: 'fas fa-briefcase',
                    color: job,
                    job,
                    action: () => {
                        this.openBossShop(job as JobType, shop);
                    },
                    canInteract: () => {
                        return this.jobPermissionService.hasPermission(job as JobType, JobPermission.SocietyShop);
                    },
                },
            ]);
        }
    }

    @OnEvent(ClientEvent.JOB_OPEN_MENU)
    public async toggleJobMenu(job: JobType) {
        const menuType = JobMenu[job];

        if (!menuType) {
            return;
        }

        if (this.nuiMenu.getOpened() === menuType) {
            this.nuiMenu.closeMenu();
        } else {
            this.nuiMenu.openMenu(menuType);
        }
    }

    @OnNuiEvent(NuiEvent.JobBossShopBuyItem)
    public async buyBossShopItem({ job, item }) {
        TriggerServerEvent(ServerEvent.JOB_BOSS_SHOP_BUY_ITEM, job, item);

        this.nuiMenu.closeMenu();
    }

    public openBossShop(job: JobType, shop: BossShop) {
        const items = [];

        for (const item of shop.items) {
            const itemInfo = this.itemService.getItem(item.name);

            if (!itemInfo) {
                continue;
            }

            items.push({
                ...item,
                label: itemInfo.label,
            });
        }

        this.nuiMenu.openMenu(
            MenuType.BossShop,
            {
                job,
                shop: {
                    ...shop,
                    items,
                },
            },
            {
                position: {
                    position: shop.zone.center,
                    distance: 3.0,
                },
            }
        );
    }

    @OnNuiEvent(NuiEvent.JobPlaceProps)
    public async onPlaceProps(props: { item: string; props: string }) {
        TriggerServerEvent(ServerEvent.JOBS_PLACE_PROPS, props.item, props.props);
        return Ok(true);
    }
}
