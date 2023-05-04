import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { BarbecueList, EntityConfig, LoungerTargetList, SeatsTargetList } from '../../config/worldinterraction';
import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { TargetFactory } from '../target/target.factory';
import { AnimationService } from './animation.service';

@Provider()
export class SeatAnimationProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AnimationService)
    private animationService: AnimationService;

    public Relative2Absolute(Ox: number, Oy: number, heading: number): [number, number] {
        heading = heading * (Math.PI / 180);
        const x = Ox * Math.cos(heading) - Oy * Math.sin(heading);
        const y = Ox * Math.sin(heading) + Oy * Math.cos(heading);
        return [x, y];
    }

    public calculateSeatPosition(entity: number, position: Vector3): Vector4 {
        const [Px, Py, Pz] = position;
        const [x, y, z] = GetEntityCoords(entity);
        let heading = GetEntityHeading(entity);
        if (heading >= 180) {
            heading = heading - 179;
        } else {
            heading = heading + 179;
        }

        let Offset: Vector4 = [0, 0, 0, 0];
        let x2 = 0.0,
            y2 = 0.0,
            BestDistance = 2.0;
        let BestSeat = '0';

        if (EntityConfig[GetEntityModel(entity)]) {
            if (Object.keys(EntityConfig[GetEntityModel(entity)]).length === 1) {
                Offset = EntityConfig[GetEntityModel(entity)][0];
                [x2, y2] = this.Relative2Absolute(Offset[0], Offset[1], heading);
            } else {
                for (const [key] of Object.entries(EntityConfig[GetEntityModel(entity)])) {
                    Offset = EntityConfig[GetEntityModel(entity)][key];
                    [x2, y2] = this.Relative2Absolute(Offset[0], Offset[1], heading);
                    const distance = getDistance([Px, Py, Pz], [x + x2, y + y2, z]);
                    if (distance < BestDistance) {
                        BestDistance = distance;
                        BestSeat = key;
                    }
                }
                Offset = EntityConfig[GetEntityModel(entity)][BestSeat];
                [x2, y2] = this.Relative2Absolute(Offset[0], Offset[1], heading);
            }
        }
        return [x + x2, y + y2, z + Offset[2], heading + Offset[3]];
    }

    public async playSitAnimation(
        entity: number,
        scenario: string,
        isSittingScenario: boolean,
        shouldTeleport: boolean
    ) {
        const ped = PlayerPedId();
        const position = GetEntityCoords(ped) as Vector3;
        const heading = GetEntityHeading(ped);
        const seatPosition = this.calculateSeatPosition(entity, position);

        await this.animationService.playScenario({
            name: scenario,
            position: seatPosition,
            isSittingScenario,
            shouldTeleport,
        });

        if (shouldTeleport) {
            SetPedCoordsKeepVehicle(ped, position[0], position[1], position[2]);
            SetEntityHeading(ped, heading);
        }
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        this.targetFactory.createForModel(
            SeatsTargetList,
            [
                {
                    label: "S'asseoir",
                    icon: 'fas fa-chair',
                    action: async entity =>
                        this.playSitAnimation(entity, 'PROP_HUMAN_SEAT_CHAIR_MP_PLAYER', true, true),
                },
            ],
            1.2
        );
        this.targetFactory.createForModel(
            SeatsTargetList,
            [
                {
                    label: "S'asseoir et Boire",
                    icon: 'fas fa-beer',
                    action: async entity =>
                        this.playSitAnimation(entity, 'PROP_HUMAN_SEAT_CHAIR_DRINK_BEER', false, true),
                },
            ],
            1.2
        );
        this.targetFactory.createForModel(
            SeatsTargetList,
            [
                {
                    label: "S'asseoir et Manger",
                    icon: 'fas fa-hamburger',
                    action: async entity => this.playSitAnimation(entity, 'PROP_HUMAN_SEAT_CHAIR_FOOD', false, true),
                },
            ],
            1.2
        );
        this.targetFactory.createForModel(
            LoungerTargetList,
            [
                {
                    label: "S'allonger",
                    icon: 'fas fa-umbrella-beach',
                    action: async entity => this.playSitAnimation(entity, 'PROP_HUMAN_SEAT_SUNLOUNGER', false, false),
                },
            ],
            1.4
        );
        this.targetFactory.createForModel(
            BarbecueList,
            [
                {
                    label: 'Cuisiner',
                    icon: 'fas fa-stroopwafel',
                    action: async entity => this.playSitAnimation(entity, 'PROP_HUMAN_BBQ', false, false),
                },
            ],
            1.0
        );
    }
}
