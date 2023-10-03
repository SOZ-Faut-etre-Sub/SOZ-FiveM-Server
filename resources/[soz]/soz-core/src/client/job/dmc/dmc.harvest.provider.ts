import { PlayerService } from '@public/client/player/player.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { WeaponService } from '@public/client/weapon/weapon.service';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { DMC_FIELDS_ZONES } from '@public/shared/job/dmc';

@Provider()
export class DmcHarvestProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    @Once(OnceStep.PlayerLoaded)
    public setupDMCFields() {
        for (const id of Object.keys(DMC_FIELDS_ZONES)) {
            const zones = DMC_FIELDS_ZONES[id];
            for (let i = 0; i < zones.length; i++) {
                const zone = zones[i];
                this.targetFactory.createForBoxZone(
                    `dmc:harvest_${id}_${i}`,
                    {
                        center: zone.center,
                        width: zone.width,
                        length: zone.length,
                        heading: zone.heading,
                        minZ: zone.minZ,
                        maxZ: zone.maxZ,
                    },
                    [
                        {
                            label: 'Miner',
                            icon: 'c:dmc/pickaxe.png',
                            color: 'dmc',
                            job: JobType.DMC,
                            canInteract: () => {
                                return (
                                    this.playerService.isOnDuty() &&
                                    this.weaponService.getCurrentWeapon() &&
                                    this.weaponService.getCurrentWeapon().name === 'weapon_pickaxe'
                                );
                            },
                            action: () => {
                                TriggerServerEvent(ServerEvent.DMC_HARVEST, id);
                            },
                        },
                    ]
                );
            }
        }
    }
}
