import { Command } from '@core/decorators/command';
import { getDistance } from '@public/shared/polyzone/vector';

import { LoungerTargetList, SeatsTargetConfig, SeatsTargetList } from '../../config/seats';
import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { TargetFactory } from '../target/target.factory';

let Px = 0.0,
    Py = 0.0,
    Pz = 0.0;
let IsSit = false;

@Provider()
export class SeatAnimationProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Command('unsit', {
        description: "Se lever d'un siège",
        keys: [{ mapper: 'keyboard', key: 'End' }],
    })
    public async Unsit() {
        if (isNaN(Px) || !IsSit) {
            return;
        }
        const ped = PlayerPedId();
        SetPedCoordsKeepVehicle(ped, Px, Py, Pz);
        IsSit = false;
    }

    public Relative2Absolute(Ox, Oy, heading) {
        heading = heading * (Math.PI / 180);
        const x = Ox * Math.cos(heading) - Oy * Math.sin(heading);
        const y = Ox * Math.sin(heading) + Oy * Math.cos(heading);
        return [x, y];
    }

    public SeatCalculation(entity, ped) {
        [Px, Py, Pz] = GetEntityCoords(ped);
        const [x, y, z] = GetEntityCoords(entity);
        let heading = GetEntityHeading(entity);
        if (heading >= 180) {
            heading = heading - 179;
        } else {
            heading = heading + 179;
        }

        let Offset;
        let x2 = 0.0,
            y2 = 0.0,
            BestDistance = 2.0;
        let BestSeat = '0';

        if (Object.keys(SeatsTargetConfig[GetEntityModel(entity)]).length === 1) {
            Offset = SeatsTargetConfig[GetEntityModel(entity)][0].offset;
            [x2, y2, ,] = this.Relative2Absolute(Offset.x, Offset.y, heading);
        } else {
            for (const [key] of Object.entries(SeatsTargetConfig[GetEntityModel(entity)])) {
                Offset = SeatsTargetConfig[GetEntityModel(entity)][key].offset;
                [x2, y2, ,] = this.Relative2Absolute(Offset.x, Offset.y, heading);
                const distance = getDistance([Px, Py, Pz], [x + x2, y + y2, z]);
                if (distance < BestDistance) {
                    BestDistance = distance;
                    BestSeat = key;
                }
            }
            Offset = SeatsTargetConfig[GetEntityModel(entity)][BestSeat].offset;
            [x2, y2] = this.Relative2Absolute(Offset.x, Offset.y, heading);
        }
        return [x + x2, y + y2, z + Offset.z, heading + Offset.heading];
    }

    public async PlaySitAnimation(entity, animation, Siting, TP) {
        const ped = PlayerPedId();
        const [Cx, Cy, Cz, Ch] = this.SeatCalculation(entity, ped);
        IsSit = true;
        TaskStartScenarioAtPosition(ped, animation, Cx, Cy, Cz, Ch, -1, Siting, TP);
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        this.targetFactory.createForModel(
            SeatsTargetList,
            [
                {
                    label: "S'asseoir",
                    icon: 'fas fa-person-seat',
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
                    icon: 'fas fa-beer-mug',
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
                    icon: 'fas fa-burger',
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
    }
}
