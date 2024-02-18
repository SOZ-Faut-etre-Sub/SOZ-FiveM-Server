import { ClientEvent } from '@public/shared/event/client';
import { VehicleHandlingType } from '@public/shared/vehicle/modification';

import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { VehicleSpawner } from './vehicle.spawner';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleCommandProvider {
    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Logger)
    private logger: Logger;

    @Command('car', { role: ['staff', 'admin', 'gamemaster'], description: 'Spawn Vehicle (Admin Only)' })
    async createCarCommand(source: number, model: string) {
        const spawned = await this.vehicleSpawner.spawnTemporaryVehicle(source, model);

        if (!spawned) {
            this.logger.error(`Vehicle ${model} could not be spawned`);
        }
    }
    @Command('dv', { role: ['staff', 'admin'], description: 'Delete Vehicle (Admin Only)' })
    async deleteCarCommand(source: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (closestVehicle !== null) {
            await this.vehicleSpawner.delete(closestVehicle.vehicleNetworkId);
        }
    }

    @Command('dirty', { role: ['admin'], description: 'Set vehicle dirty (Admin Only)' })
    async dirtyCommand(source: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            dirtLevel: 15.0,
        });
    }

    @Command('fuel', { role: ['admin'], description: 'Set fuel level (Admin Only)' })
    async fuelCommand(source: number, newlevel: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            fuelLevel: newlevel,
        });
    }

    @Command('oil', { role: ['admin'], description: 'Set oil level (Admin Only)' })
    async oilCommand(source: number, newlevel: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            oilLevel: newlevel,
        });
    }

    @Command('handling', { role: ['admin'] })
    public async handling(source: number, type: string, valStr: string) {
        const veh = GetVehiclePedIsIn(GetPlayerPed(source), false);
        if (!veh) {
            this.notifier.notify(source, 'not in Veh');
            return;
        }

        if (!Object.values(VehicleHandlingType).includes(type as VehicleHandlingType)) {
            this.notifier.notify(source, 'Invalid type ' + type);
            return;
        }

        const val = parseFloat(valStr);

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(veh);
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        let handling = state.configuration.handling;
        if (!handling) {
            handling = {};
        }
        handling[type] = val;
        state.configuration.handling = handling;

        TriggerClientEvent(
            ClientEvent.VEHICLE_CONDITION_REGISTER,
            source,
            vehicleNetworkId,
            state.condition,
            state.configuration,
            false
        );

        if (state.volatile.isPlayerVehicle) {
            await this.prismaService.playerVehicle.update({
                where: {
                    id: state.volatile.id,
                },
                data: {
                    mods: JSON.stringify(state.configuration),
                },
            });
        }
    }
}
