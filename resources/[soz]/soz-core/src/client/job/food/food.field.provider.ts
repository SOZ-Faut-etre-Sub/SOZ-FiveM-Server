import { DrugSkill } from '@private/shared/drugs';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent } from '../../../shared/event/client';
import { ServerEvent } from '../../../shared/event/server';
import { JobPermission, JobType } from '../../../shared/job';
import { FoodFields, FoodFieldType } from '../../../shared/job/food';
import { PolygonZone } from '../../../shared/polyzone/polygon.zone';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';

@Provider()
export class FoodFieldProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Once(OnceStep.PlayerLoaded)
    public setupFoodFields() {
        for (const type of Object.keys(FoodFields)) {
            const field = FoodFields[type as FoodFieldType];

            for (const index in field.zones) {
                const zone = field.zones[index];
                const minZ = zone.reduce((acc, zone) => Math.min(acc, zone[2]), 9999);
                const maxZ = zone.reduce((acc, zone) => Math.max(acc, zone[2]), -9999);
                const polygone = new PolygonZone<any>(zone, { minZ, maxZ });
                const id = `food-field-${type}-${index}`;

                this.targetFactory.createForPolygoneZone(id, polygone, [
                    {
                        label: 'Récolter',
                        icon: 'food/collecter',
                        blackoutGlobal: true,
                        blackoutJob: JobType.Food,
                        job: JobType.Food,
                        category: 'society',
                        canInteract: entity =>
                            !IsEntityAVehicle(entity) &&
                            !IsEntityAPed(entity) &&
                            this.jobService.hasPermission(JobType.Food, JobPermission.Harvest),
                        action: () => {
                            this.collectIngredients(type as FoodFieldType, index);
                        },
                    },
                    {
                        label: 'Récolter de la Zeed',
                        icon: 'crimi/zeed',
                        category: 'criminal',
                        canInteract: entity =>
                            !IsEntityAVehicle(entity) &&
                            !IsEntityAPed(entity) &&
                            this.playerService.hasDrugSkill(DrugSkill.Botaniste),
                        action: this.harvestZeed.bind(this),
                    },
                ]);
            }
        }
    }

    public async collectIngredients(type: FoodFieldType, index: string) {
        if (IsPedInAnyVehicle(PlayerPedId(), false)) {
            return;
        }

        TriggerServerEvent(ServerEvent.FOOD_COLLECT, type, index);
    }

    public harvestZeed() {
        TriggerEvent(ClientEvent.DRUGS_HARVEST_ZEED, { location: 'food' });
    }
}
