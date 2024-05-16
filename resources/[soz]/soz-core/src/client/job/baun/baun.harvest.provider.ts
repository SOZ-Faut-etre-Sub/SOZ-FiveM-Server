import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { JobType } from '../../../shared/job';
import { Zone } from '../../../shared/polyzone/box.zone';
import { toVector4Object, Vector4 } from '../../../shared/polyzone/vector';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

type HarvestZone = {
    item: string;
    ped?: string;
    zones: Zone[];
};

const HARVEST_ZONES: HarvestZone[] = [
    {
        item: 'liquor_crate',
        zones: [
            {
                center: [1409.39, 1147.35, 114.33],
                length: 6.8,
                width: 0.2,
                minZ: 113.38,
                maxZ: 114.58,
                heading: 0,
            },
        ],
    },
    {
        item: 'flavor_crate',
        ped: 'a_m_m_prolhost_01',
        zones: [
            {
                center: [868.5, -1625.73, 29.25],
                heading: 141.6,
            },
        ],
    },
    {
        item: 'furniture_crate',
        ped: 'a_f_y_business_02',
        zones: [
            {
                center: [45.3, -1750.68, 28.62],
                heading: 26.92,
            },
        ],
    },
    {
        item: 'snack_crate',
        ped: 'a_f_y_business_01',
        zones: [
            {
                center: [-753.6, -2571.93, 12.83],
                heading: 236.79,
            },
        ],
    },
];

@Provider()
export class BaunHarvestProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once(OnceStep.PlayerLoaded)
    public async loadHarvestZones() {
        for (const harvestZone of HARVEST_ZONES) {
            for (const zone of harvestZone.zones) {
                const options: TargetOptions[] = [
                    {
                        color: JobType.Baun,
                        label: 'Récupérer',
                        icon: 'c:jobs/recuperer.png',
                        blackoutJob: JobType.Baun,
                        blackoutGlobal: true,
                        job: JobType.Baun,
                        action: () => {
                            this.harvest(harvestZone);
                        },
                    },
                ];

                if (harvestZone.ped) {
                    await this.targetFactory.createForPed({
                        freeze: true,
                        invincible: true,
                        blockevents: true,
                        spawnNow: true,
                        minusOne: true,
                        model: harvestZone.ped,
                        coords: toVector4Object([...zone.center, zone.heading] as Vector4),
                        target: {
                            options,
                            distance: 2.5,
                        },
                    });
                } else {
                    this.targetFactory.createForBoxZone(`job_baun_harvest_${harvestZone.item}`, zone, options);
                }
            }
        }
    }

    public harvest(zone: HarvestZone) {
        TriggerServerEvent(ServerEvent.BAUN_HARVEST, zone.item);
    }
}
