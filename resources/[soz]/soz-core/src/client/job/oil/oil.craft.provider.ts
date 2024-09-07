import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { JobType } from '../../../shared/job';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class OilCraftProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once(OnceStep.PlayerLoaded)
    public setupOilCraft() {
        this.targetFactory.createForBoxZone(
            'mtp_fuel_craft',
            {
                center: [-203.11, 6115.01, 31.35],
                width: 2.8,
                length: 3.2,
                heading: 315,
                minZ: 30.35,
                maxZ: 33.35,
            },
            [
                {
                    icon: 'c:fuel/pistolet',
                    color: 'oil',
                    label: 'Carburant conditionné',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    category: 'society',
                    action: this.craftOil.bind(this),
                },
                {
                    icon: 'c:fuel/pistolet',
                    color: 'oil',
                    label: 'Kérosène conditionné',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    category: 'society',
                    action: this.craftKerosene.bind(this),
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'mtp_jerrycan_craft',
            {
                center: [-206.84, 6119.91, 31.35],
                width: 1.45,
                length: 3.2,
                heading: 315,
                minZ: 30.35,
                maxZ: 33.35,
            },
            [
                {
                    icon: 'c:fuel/pistolet',
                    color: 'oil',
                    label: 'Bidon d’essence',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    category: 'society',
                    action: this.craftOilJerryCan.bind(this),
                },
                {
                    icon: 'c:fuel/pistolet',
                    color: 'oil',
                    label: 'Bidon de kérosène',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    category: 'society',
                    action: this.craftKeroseneJerryCan.bind(this),
                },
            ]
        );
    }

    public craftOil() {
        TriggerServerEvent(ServerEvent.OIL_CRAFT_ESSENCE);
    }

    public craftKerosene() {
        TriggerServerEvent(ServerEvent.OIL_CRAFT_KEROSENE);
    }

    public craftOilJerryCan() {
        TriggerServerEvent(ServerEvent.OIL_CRAFT_ESSENCE_JERRYCAN);
    }

    public craftKeroseneJerryCan() {
        TriggerServerEvent(ServerEvent.OIL_CRAFT_KEROSENE_JERRYCAN);
    }
}
