import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { uuidv4, wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PrismaService } from '../database/prisma.service';
import { QBCore } from '../qbcore';
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
                state: 0,
            },
            data: {
                state: 2,
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
            },
            data: {
                state: 4,
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
    }

    @Command('thunder', {
        role: 'admin',
    })
    private async thunder() {
        this.weatherProvider.setWeatherUpdate(false);

        this.sendRebootMessage(15);
        this.weatherProvider.setWeather('CLEARING');
        await wait(5 * 60 * 1000);

        this.weatherProvider.setWeather('RAIN');
        await wait(5 * 60 * 1000);

        this.sendRebootMessage(5);
        this.weatherProvider.setWeather('THUNDER');
        await wait(2 * 60 * 1000);

        GlobalState.blackout = true;

        if (isFeatureEnabled(Feature.HalloweenReboot)) {
            GlobalState.time = { hour: 0, minute: 0, second: 0 };
            this.weatherProvider.setWeather('HALLOWEEN');
            await wait(60 * 1000);

            GlobalState.time = { hour: 0, minute: 0, second: 0 };
            this.weatherProvider.setWeather('HALLOWEEN');

            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/wolf', 1.0);
            await wait(20 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/wolf', 1.0);
            await wait(20 * 1000);
            TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/wolf', 1.0);
            await wait(20 * 1000);

            GlobalState.time = { hour: 0, minute: 0, second: 0 };
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

        exports['soz-api'].RemoveRebootMessage();

        await this.reboot();
    }

    private sendRebootMessage(minutes: 5 | 15) {
        exports['soz-api'].RemoveRebootMessage();
        exports['soz-api'].AddRebootMessage(minutes);
        emit(
            ClientEvent.PHONE_APP_NEWS_CREATE_BROADCAST,
            `${ClientEvent.PHONE_APP_NEWS_CREATE_BROADCAST}:${uuidv4()}`,
            {
                type: `reboot_${minutes}`,
                message: `Un ouragan arrive à toute allure ! Il devrait frapper la coeur de San Andreas d'ici ${minutes} minutes. Veillez ranger vos véhicules et vous abriter ! Votre sécurité est primordiale.`,
                reporter: 'San Andreas Météo',
            }
        );
    }
}
