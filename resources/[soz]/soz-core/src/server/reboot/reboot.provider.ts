import { PlayerVehicleState } from '@public/shared/vehicle/player.vehicle';

import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { wait } from '../../core/utils';
import { ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { ApiClient } from '../api/api.client';
import { PrismaService } from '../database/prisma.service';
import { PlayerCleanService } from '../player/player.clean.service';
import { QBCore } from '../qbcore';
import { Store } from '../store/store';
import { VehicleDealershipProvider } from '../vehicle/vehicle.dealership.provider';
import { WeatherProvider } from '../weather/weather.provider';

@Provider()
export class RebootProvider {
    private isClosed = false;

    @Inject(QBCore)
    private qbCore: QBCore;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(WeatherProvider)
    private weatherProvider: WeatherProvider;

    @Inject(VehicleDealershipProvider)
    private vehicleDealershipProvider: VehicleDealershipProvider;

    @Inject(PlayerCleanService)
    private playerCleanService: PlayerCleanService;

    @Inject(ApiClient)
    private apiClient: ApiClient;

    @Inject(Logger)
    private logger: Logger;

    @Inject('Store')
    private store: Store;

    @OnEvent(ServerEvent.FIVEM_PLAYER_CONNECTING)
    public onPlayerConnecting(source, name, setKickReason, deferrals) {
        deferrals.defer();

        if (this.isClosed) {
            deferrals.done('Le serveur est en cours de redémarrage, veuillez réessayer plus tard.');
        }

        deferrals.done();
    }

    @Command('reboot', {
        role: 'admin',
    })
    private async reboot() {
        this.isClosed = true;

        const players = this.qbCore.getPlayersSources();

        for (const source of players) {
            DropPlayer(source.toString(), 'Le serveur redémarre...');
        }

        await this.prismaService.playerVehicle.updateMany({
            where: {
                state: PlayerVehicleState.Out,
            },
            data: {
                state: PlayerVehicleState.InPound,
                garage: 'fourriere',
                parkingtime: Math.round(Date.now() / 1000),
                life_counter: {
                    decrement: 1,
                },
            },
        });

        await this.prismaService.playerVehicle.updateMany({
            where: {
                life_counter: -1,
                state: {
                    not: {
                        in: [PlayerVehicleState.Missing, PlayerVehicleState.Destroyed],
                    },
                },
            },
            data: {
                state: PlayerVehicleState.Missing,
                parkingtime: Math.round(Date.now() / 1000),
            },
        });

        await this.vehicleDealershipProvider.finishAuctions();

        await this.prismaService.playerVehicle.deleteMany({
            where: {
                plate: {
                    contains: 'ESSAI',
                },
            },
        });

        exports['soz-bank'].saveAccounts();
        exports['soz-upw'].saveUpw();
        exports['soz-inventory'].saveInventories();
        exports['soz-inventory'].stopSyncInventories();

        const ids = await this.playerCleanService.getPlayerToCleans();
        const [houseOwnerCount, houseRoommateCount] = await this.playerCleanService.cleanPlayerHouses(ids);

        this.logger.info(`[reboot] Houses owner cleaned: ${houseOwnerCount}`);
        this.logger.info(`[reboot] Houses roommate cleaned: ${houseRoommateCount}`);
    }

    @Command('thunder', {
        role: 'admin',
    })
    private async thunder() {
        this.weatherProvider.setWeatherUpdate(false);

        await this.sendRebootMessage(15);
        this.weatherProvider.setWeather('CLEARING');
        // Send the storm alert after resetting the weather forecasts
        // Otherwise we won't see the current weather on the weather app of the phone
        this.weatherProvider.setStormDeadline(Date.now() + 15 * 60 * 1000);

        await wait(5 * 60 * 1000);

        this.weatherProvider.setWeather('RAIN');
        await wait(5 * 60 * 1000);

        await this.sendRebootMessage(5);
        this.weatherProvider.setWeather('THUNDER');
        await wait(2 * 60 * 1000);

        this.store.dispatch.global.update({ blackout: true });

        if (isFeatureEnabled(Feature.HalloweenReboot)) {
            this.weatherProvider.setWeather('HALLOWEEN');
            await wait(60 * 1000);

            this.weatherProvider.setWeather('HALLOWEEN');

            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/wolf', 1.0);
            await wait(20 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/wolf', 1.0);
            await wait(20 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/wolf', 1.0);
            await wait(20 * 1000);

            this.weatherProvider.setWeather('HALLOWEEN');
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_witch', 0.8);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'system/reboot', 0.05);
            await wait(10 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_evil', 0.8);
            await wait(10 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_witch', 0.8);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_evil', 0.8);
            await wait(10 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'system/reboot', 0.05);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_evil', 0.8);
            await wait(10 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_evil', 0.8);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_witch', 0.8);
            await wait(10 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_evil', 0.8);
            await wait(10 * 1000);
        } else {
            await wait(2 * 60 * 1000);

            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'system/reboot', 0.05);
            await wait(30 * 1000);

            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'system/reboot', 0.05);
            await wait(30 * 1000);
        }

        await this.apiClient.removeRebootMessage();

        await this.reboot();
    }

    private async sendRebootMessage(minutes: 5 | 15) {
        await this.apiClient.removeRebootMessage();
        await this.apiClient.addRebootMessage(minutes);

        exports['soz-phone'].createNewsBroadcast({
            type: `reboot_${minutes}`,
            message: `Un ouragan arrive à toute allure ! Il devrait frapper le coeur de San Andreas d'ici ${minutes} minutes. Veuillez ranger vos véhicules et vous abriter ! Votre sécurité est primordiale.`,
            reporter: 'San Andreas Météo',
        });
    }
}
