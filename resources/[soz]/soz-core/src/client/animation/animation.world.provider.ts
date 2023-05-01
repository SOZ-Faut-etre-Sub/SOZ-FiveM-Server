import { Command } from '@core/decorators/command';
import { getDistance, Vector4 } from '@public/shared/polyzone/vector';

import { BarbecueList, EntityConfig, LoungerTargetList, SeatsTargetList } from '../../config/worldinterraction';
import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { TargetFactory } from '../target/target.factory';
let Px = 0.0,
    Py = 0.0,
    Pz = 0.0;
let IsScenario = false;
@Provider()
export class SeatAnimationProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Command('StopScenario', {
        description: 'Se lever/Arrêter Anim',
        keys: [{ mapper: 'keyboard', key: 'End' }],
    })
    public async StopScenario() {
        if (isNaN(Px) || !IsScenario) {
            return;
        }
        const ped = PlayerPedId();
        SetPedCoordsKeepVehicle(ped, Px, Py, Pz);
        IsScenario = false;
    }

    public Relative2Absolute(Ox: number, Oy: number, heading: number): [number, number] {
        heading = heading * (Math.PI / 180);
        const x = Ox * Math.cos(heading) - Oy * Math.sin(heading);
        const y = Ox * Math.sin(heading) + Oy * Math.cos(heading);
        return [x, y];
    }

    public SeatCalculation(entity: number, ped: number) {
        [Px, Py, Pz] = GetEntityCoords(ped);
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

    public async PlaySitAnimation(entity: number, animation: string, siting: boolean, TP: boolean) {
        const ped = PlayerPedId();
        const [Cx, Cy, Cz, Ch] = this.SeatCalculation(entity, ped);
        IsScenario = true;
        TaskStartScenarioAtPosition(ped, animation, Cx, Cy, Cz, Ch, -1, siting, TP);
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
                        this.PlaySitAnimation(entity, 'PROP_HUMAN_SEAT_CHAIR_MP_PLAYER', true, true),
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
                        this.PlaySitAnimation(entity, 'PROP_HUMAN_SEAT_CHAIR_DRINK_BEER', false, true),
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
                    action: async entity => this.PlaySitAnimation(entity, 'PROP_HUMAN_SEAT_CHAIR_FOOD', false, true),
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
                    action: async entity => this.PlaySitAnimation(entity, 'PROP_HUMAN_SEAT_SUNLOUNGER', false, false),
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
                    action: async entity => this.PlaySitAnimation(entity, 'PROP_HUMAN_BBQ', false, false),
                },
            ],
            1.0
        );
    }
}
