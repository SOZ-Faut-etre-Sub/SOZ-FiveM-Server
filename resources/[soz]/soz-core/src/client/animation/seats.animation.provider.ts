import { Once, OnceStep } from '../../core/decorators/event';
import { Command } from '@core/decorators/command';
import { Provider } from '../../core/decorators/provider';
import { Inject } from '../../core/decorators/injectable';
import { TargetFactory } from '../target/target.factory';
import { LoungerTargetList, SeatsTargetList, SeatsTargetConfig } from '../../config/seats';
import { getDistance } from '@public/shared/polyzone/vector';

let Px = 0.0, Py = 0.0, Pz = 0.0;
let IsSit = false;

@Provider()
export class SeatAnimationProvider {

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Command('unsit', {
        description: 'Se lever d\'un siège',
        keys: [{ mapper: 'keyboard', key: 'End' }],
    })
    public async Unsit() {
        if (isNaN(Px) || !IsSit){return;}
        const ped = PlayerPedId();
        SetPedCoordsKeepVehicle(ped, Px , Py, Pz); 
        IsSit = false;
    }

    public Relative2Absolute(Ox, Oy, heading){
        heading = heading * (Math.PI/180);
        let x = Ox * Math.cos(heading) - Oy * Math.sin(heading);
        let y = Ox * Math.sin(heading) + Oy * Math.cos(heading);
        return [x, y, heading];
    }

    public SeatCalculation(entity,ped){
        [Px, Py, Pz] = GetEntityCoords(ped);
        const [x, y, z] = GetEntityCoords(entity);
        let heading = GetEntityHeading(entity);
        if (heading >= 180) {heading = heading - 179} else {heading = heading + 179}

        let Offset;
        let x2 = 0.0, y2 = 0.0, heading2 = 0.0, BestDistance = 2.0;
        let BestSeat = "0";

        if (Object.keys(SeatsTargetConfig[GetEntityModel(entity)]).length === 1) {
            Offset = SeatsTargetConfig[GetEntityModel(entity)][0].offset;
            [x2, y2, heading2] = this.Relative2Absolute(Offset.x, Offset.y, heading);
        } else {
            for (const [key, value] of Object.entries(SeatsTargetConfig[GetEntityModel(entity)])) {
                Offset = SeatsTargetConfig[GetEntityModel(entity)][key].offset;
                [x2, y2, heading2] = this.Relative2Absolute(Offset.x, Offset.y, heading);
                let distance = getDistance([Px, Py, Pz], [x+x2, y+y2, z]);
                if (distance < BestDistance){BestDistance = distance; BestSeat = key}
            }
            Offset = SeatsTargetConfig[GetEntityModel(entity)][BestSeat].offset;
            [x2, y2, heading2] = this.Relative2Absolute(Offset.x, Offset.y, heading); 
        }
        return [x + x2, y + y2, z + Offset.z, heading + Offset.heading];
    }

    public async SimpleSeat(entity){
        const ped = PlayerPedId();
        const [Cx,Cy,Cz,Ch] = this.SeatCalculation(entity, ped);
        IsSit = true;
        TaskStartScenarioAtPosition(ped, "PROP_HUMAN_SEAT_CHAIR_MP_PLAYER", Cx, Cy, Cz, Ch, -1, true, true);
    }
    public async SitnDrink(entity){
        const ped = PlayerPedId();
        const [Cx,Cy,Cz,Ch] = this.SeatCalculation(entity, ped);
        IsSit = true;
        TaskStartScenarioAtPosition(ped, "PROP_HUMAN_SEAT_CHAIR_DRINK_BEER", Cx, Cy, Cz, Ch, -1, false, true);
    }
    public async SitnEat(entity){
        const ped = PlayerPedId();
        const [Cx,Cy,Cz,Ch] = this.SeatCalculation(entity, ped);
        IsSit = true;
        TaskStartScenarioAtPosition(ped, "PROP_HUMAN_SEAT_CHAIR_FOOD", Cx, Cy, Cz, Ch, -1, false, true);
    }
    public async LoungerSeat(entity){
        const ped = PlayerPedId();
        const [Cx,Cy,Cz,Ch] = this.SeatCalculation(entity, ped);
        IsSit = true;
        TaskStartScenarioAtPosition(ped, "PROP_HUMAN_SEAT_SUNLOUNGER", Cx, Cy, Cz, Ch, -1, false, false);
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        const ped = PlayerPedId();
        this.targetFactory.createForModel(
            SeatsTargetList,
            [
                {
                    label: 'S\'asseoir',
                    icon: 'fas fa-person-seat',
                    action: async entity => this.SimpleSeat(entity),
                }
            ],
            1.2
        );
        this.targetFactory.createForModel(
            SeatsTargetList,
            [
                {
                    label: 'S\'asseoir et Boire',
                    icon: 'fas fa-beer-mug',
                    action: async entity => this.SitnDrink(entity),
                }
            ],
            1.2
        );
        this.targetFactory.createForModel(
            SeatsTargetList,
            [
                {
                    label: 'S\'asseoir et Manger',
                    icon: 'fas fa-burger',
                    action: async entity => this.SitnEat(entity),
                }
            ],
            1.2
        );
        this.targetFactory.createForModel(
            LoungerTargetList,
            [
                {
                    label: 'S\'allonger',
                    icon: 'fas fa-umbrella-beach',
                    action: async entity => this.LoungerSeat(entity),
                }
            ],
            1.2
        );
    }
}