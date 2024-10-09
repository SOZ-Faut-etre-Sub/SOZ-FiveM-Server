import { Rpc } from '@core/decorators/rpc';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { Notifier } from '@public/server/notifier';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class VehiclePushProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    private carPushed: Record<
        number,
        Partial<{
            pushingPed: number;
            position: string;
            directionPed: number;
            direction: number;
        }>
    > = {};

    @Rpc(RpcServerEvent.VEHICLE_GRAB_CAR)
    public async onGrabCar(source: number, vehNetId: number) {
        const vehicle = NetworkGetEntityFromNetworkId(vehNetId);
        const owner = await this.getVehicleOwner(source, vehicle);

        if (owner === -1) {
            return false;
        }

        this.carPushed[vehNetId] ??= {};
        if (!vehNetId) {
            delete this.carPushed[vehNetId].pushingPed;
            delete this.carPushed[vehNetId].position;
            TriggerClientEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE, owner, vehNetId, this.carPushed[vehNetId]);
            return false;
        }

        const currentPedId = this.carPushed[vehNetId].pushingPed;
        if (currentPedId) {
            const currentPed = NetworkGetEntityFromNetworkId(currentPedId);
            if (DoesEntityExist(currentPed) && vehicle === GetEntityAttachedTo(currentPed)) {
                this.notifier.notify(source, `Quelqu'un pousse déjà le véhicule.`, 'error');
                return false;
            }
        }

        const pedNetId = NetworkGetNetworkIdFromEntity(GetPlayerPed(source));
        if (this.carPushed[vehNetId].directionPed === pedNetId) {
            delete this.carPushed[vehNetId].directionPed;
            delete this.carPushed[vehNetId].direction;
        }
        this.carPushed[vehNetId].pushingPed = pedNetId;
        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE, owner, vehNetId, this.carPushed[vehNetId]);
        return true;
    }

    @Rpc(RpcServerEvent.VEHICLE_GRAB_STEERING_WHEEL)
    public async onGrabSteeringWheel(source: number, vehNetId: number) {
        const vehicle = NetworkGetEntityFromNetworkId(vehNetId);
        const owner = await this.getVehicleOwner(source, vehicle);

        if (owner === -1) {
            return false;
        }

        this.carPushed[vehNetId] ??= {};
        if (!vehNetId) {
            delete this.carPushed[vehNetId].directionPed;
            delete this.carPushed[vehNetId].direction;
            TriggerClientEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE, owner, vehNetId, this.carPushed[vehNetId]);
            return false;
        }

        const currentPedId = this.carPushed[vehNetId].directionPed;
        if (currentPedId) {
            const currentPed = NetworkGetEntityFromNetworkId(currentPedId);
            if (DoesEntityExist(currentPed) && vehicle === GetEntityAttachedTo(currentPed)) {
                this.notifier.notify(source, `La place est déjà prise.`, 'error');
                return false;
            }
        }

        const pedNetId = NetworkGetNetworkIdFromEntity(GetPlayerPed(source));
        if (this.carPushed[vehNetId].pushingPed === pedNetId) {
            delete this.carPushed[vehNetId].pushingPed;
            delete this.carPushed[vehNetId].position;
        }
        this.carPushed[vehNetId].directionPed = pedNetId;
        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE, owner, vehNetId, this.carPushed[vehNetId]);
        return true;
    }

    @OnEvent(ServerEvent.VEHICLE_START_PUSHING)
    public async onStartPushing(source: number, vehNetId: number, position: string) {
        const vehicle = NetworkGetEntityFromNetworkId(vehNetId);
        const owner = await this.getVehicleOwner(source, vehicle);

        if (owner === -1) {
            return;
        }

        this.carPushed[vehNetId] ??= {};
        this.carPushed[vehNetId].position = position;

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE, owner, vehNetId, this.carPushed[vehNetId]);
    }

    @OnEvent(ServerEvent.VEHICLE_STOP_PUSHING)
    public async onStopPushing(source: number, vehNetId: number) {
        const owner = await this.getVehicleOwner(source, NetworkGetEntityFromNetworkId(vehNetId));

        if (owner === -1) {
            return;
        }

        delete this.carPushed[vehNetId]?.position;
        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE, owner, vehNetId, this.carPushed[vehNetId]);
    }

    @OnEvent(ServerEvent.VEHICLE_CHANGE_DIRECTION)
    public async onChangeDirection(source: number, vehNetId: number, direction: number) {
        const vehicle = NetworkGetEntityFromNetworkId(vehNetId);
        const owner = await this.getVehicleOwner(source, vehicle);

        if (owner === -1) {
            return;
        }

        this.carPushed[vehNetId].direction = direction;
        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE, owner, vehNetId, this.carPushed[vehNetId]);
    }

    @OnEvent(ServerEvent.VEHICLE_UPDATE_PUSHING_OWNER)
    public async onUpdatePushingOwner(source: number, vehNetId: number) {
        const vehicle = NetworkGetEntityFromNetworkId(vehNetId);
        const owner = await this.getVehicleOwner(source, vehicle);

        if (owner === -1) {
            return;
        }

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE, owner, vehNetId, this.carPushed[vehNetId]);
    }

    private async getVehicleOwner(source: number, vehicle: number) {
        let owner = NetworkGetEntityOwner(vehicle);
        let tryCount = 0;

        while (owner === -1 && tryCount < 100) {
            await wait(0);
            owner = NetworkGetEntityOwner(vehicle);
            tryCount++;
        }

        if (owner === -1) {
            this.notifier.notify(source, `Quelque chose ne va pas, la véhicule est impossible à bouger`, 'error');
        }

        return owner;
    }
}
