import { Inject, Injectable } from '@public/core/decorators/injectable';
import { emitRpc } from '@public/core/rpc';
import { CraftsList } from '@public/shared/craft/craft';
import { JobType } from '@public/shared/job';
import { NamedZone } from '@public/shared/polyzone/box.zone';
import { RpcServerEvent } from '@public/shared/rpc';

import { JobService } from '../job/job.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';
import { WeaponService } from '../weapon/weapon.service';

export class craftOptions {
    weapon: string;
}

@Injectable()
export class CraftService {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    public createBtargetZoneCraft(
        zones: NamedZone[],
        icon: string,
        label: string,
        job: JobType,
        options?: craftOptions
    ) {
        zones.forEach(zone =>
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    icon: icon,
                    label: label,
                    job: job,
                    color: job,
                    blackoutGlobal: true,
                    blackoutJob: job,
                    canInteract: () => {
                        if (options) {
                            if (options.weapon && this.weaponService.getCurrentWeapon().name !== options.weapon) {
                                return false;
                            }
                        }
                        return this.playerService.isOnDuty();
                    },
                    action: async () => {
                        const crafting = await emitRpc<CraftsList>(RpcServerEvent.CRAFT_GET_RECIPES, job);
                        crafting.title = this.jobService.getJob(job).label;
                        crafting.subtitle = 'Confection';
                        this.nuiDispatch.dispatch('craft', 'ShowCraft', crafting);
                    },
                },
            ])
        );
    }
}
