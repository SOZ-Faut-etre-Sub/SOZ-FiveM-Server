import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Command } from '@public/core/decorators/command';
import { Once } from '@public/core/decorators/event';
import { emitRpc } from '@public/core/rpc';
import { RpcServerEvent } from '@public/shared/rpc';

import { ResourceLoader } from '../repository/resource.loader';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class VehicleTrainProvider {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    private train: number = 0;

    @Command('train')
    public async trainSpawn(source: number, typeStr: string) {
        const [isAllowed] = await emitRpc<[boolean, string]>(RpcServerEvent.ADMIN_IS_ALLOWED);
        if (!isAllowed) {
            return;
        }

        const type = Number.parseInt(typeStr);
        const coords = GetEntityCoords(PlayerPedId());
        await this.resourceLoader.loadModel('freight');
        await this.resourceLoader.loadModel('freight2');
        await this.resourceLoader.loadModel('freightcar');
        await this.resourceLoader.loadModel('freightcar2');
        await this.resourceLoader.loadModel('freightcont1');
        await this.resourceLoader.loadModel('freightcont2');
        await this.resourceLoader.loadModel('freightgrain');
        await this.resourceLoader.loadModel('metrotrain');
        await this.resourceLoader.loadModel('tankercar');
        this.train = CreateMissionTrain(type, coords[0], coords[1], coords[2], true);

        TaskWarpPedIntoVehicle(PlayerPedId(), this.train, -1);
        SetTrainSpeed(this.train, 0.0);
        SetTrainCruiseSpeed(this.train, 0.0);
    }

    @Command('dtrain')
    public async dtrain() {
        DeleteMissionTrain(this.train);
        this.train = 0;
    }

    @Once()
    public init() {
        SetTrainsForceDoorsOpen(false);
        this.targetFactory.createForModel('metrotrain', [
            {
                category: 'citizen',
                label: 'entrer Conducteur',
                canInteract: entity => !GetPedInVehicleSeat(entity, -1),
                action: entity => {
                    TaskWarpPedIntoVehicle(PlayerPedId(), entity, -1);
                },
            },
            {
                category: 'citizen',
                label: 'entrer Passager 1',
                canInteract: entity => !GetPedInVehicleSeat(entity, 1),
                action: entity => {
                    TaskWarpPedIntoVehicle(PlayerPedId(), entity, 1);
                },
            },
            {
                category: 'citizen',
                label: 'entrer Passager 2',
                canInteract: entity => !GetPedInVehicleSeat(entity, 2),
                action: entity => {
                    TaskWarpPedIntoVehicle(PlayerPedId(), entity, 2);
                },
            },
        ]);
        this.targetFactory.createForModel(
            ['freight', 'freight2'],
            [
                {
                    category: 'citizen',
                    label: 'entrer Conducteur',
                    canInteract: entity => !GetPedInVehicleSeat(entity, -1),
                    action: entity => {
                        TaskWarpPedIntoVehicle(PlayerPedId(), entity, -1);
                    },
                },
            ]
        );
    }
}
