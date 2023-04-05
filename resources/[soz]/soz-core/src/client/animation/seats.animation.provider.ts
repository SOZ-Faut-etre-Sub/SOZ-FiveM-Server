import { Once, OnceStep } from '../../core/decorators/event';
import { Command } from '@core/decorators/command';
import { Provider } from '../../core/decorators/provider';
import { Inject } from '../../core/decorators/injectable';
import { TargetFactory } from '../target/target.factory';
import { LoungerTargetList, SeatsTargetList, SeatsTargetConfig } from '../../config/seats';

let Px:number = 0.0, Py:number = 0.0, Pz:number = 0.0;
let IsSit:boolean = false;

@Provider()
export class SeatAnimationProvider {

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Command('unsit', {
        description: 'Se lever d\'un siège',
        keys: [{ mapper: 'keyboard', key: 'End' }],
    })
    public async Unsit() {
        if (Px == null || !IsSit){return;}
        const ped = PlayerPedId();
        SetPedCoordsKeepVehicle(ped, Px , Py, Pz); 
        IsSit = false;
    }

    public SeatCalculation(entity,ped){
        [Px, Py, Pz] = GetEntityCoords(ped);
        const [x, y, z] = GetEntityCoords(entity);
        let heading = GetEntityHeading(entity);
        if (heading >= 180) {heading = heading - 179} else {heading = heading + 179}
        const Offset = SeatsTargetConfig[GetEntityModel(entity)]
        let heading2 = (heading || 0.0) * (Math.PI/180);
        let x2 = (Offset.x || 0.0)*Math.cos(heading2) - (Offset.y || 0.0)*Math.sin(heading2);
        let y2 = (Offset.x || 0.0)*Math.sin(heading2) + (Offset.y || 0.0)*Math.cos(heading2);
        return [x + x2, y + y2, z + (Offset.z || 0.0), Offset.heading || heading];
    }

    public SimpleSeat(entity){
        const ped = PlayerPedId();
        const [Cx,Cy,Cz,Ch] = this.SeatCalculation(entity, ped);
        IsSit = true;
        TaskStartScenarioAtPosition(ped, "PROP_HUMAN_SEAT_CHAIR_MP_PLAYER", Cx, Cy, Cz, Ch, -1, true, true);
    }
    public SitnDrink(entity){
        const ped = PlayerPedId();
        const [Cx,Cy,Cz,Ch] = this.SeatCalculation(entity, ped);
        IsSit = true;
        TaskStartScenarioAtPosition(ped, "PROP_HUMAN_SEAT_CHAIR_DRINK_BEER", Cx, Cy, Cz, Ch, -1, false, true);
    }
    public SitnEat(entity){
        const ped = PlayerPedId();
        const [Cx,Cy,Cz,Ch] = this.SeatCalculation(entity, ped);
        IsSit = true;
        TaskStartScenarioAtPosition(ped, "PROP_HUMAN_SEAT_CHAIR_FOOD", Cx, Cy, Cz, Ch, -1, false, true);
    }
    public LoungerSeat(entity){
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
                    icon: 'fas person-seat',
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
                    icon: 'fas beer-mug',
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
                    icon: 'fas burger',
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
                    icon: 'fas burger',
                    action: async entity => this.LoungerSeat(entity),
                }
            ],
            1.2
        );
    }
}