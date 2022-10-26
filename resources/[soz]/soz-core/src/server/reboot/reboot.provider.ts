import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ServerEvent } from '../../shared/event';
import { PrismaService } from '../database/prisma.service';
import { QBCore } from '../qbcore';
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

    @OnEvent(ServerEvent.FIVEM_PLAYER_CONNECTING)
    public onPlayerConnecting(name, setKickReason, deferrals) {
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

        exports['soz-inventory'].saveInventories();

        await this.prismaService.player_vehicles.updateMany({
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

        await this.prismaService.player_vehicles.updateMany({
            where: {
                life_counter: -1,
            },
            data: {
                state: 4,
                parkingtime: Math.round(Date.now() / 1000),
            },
        });

        exports['soz-bank'].saveAccounts();
        exports['soz-vehicle'].saveUpw();
        exports['soz-vehicle'].finishAuctions();

        await this.prismaService.player_vehicles.deleteMany({
            where: {
                plate: {
                    contains: 'ESSAI',
                },
            },
        });
    }

    @Command('thunder', {
        role: 'admin',
    })
    private async thunder() {
        this.weatherProvider.setWeatherUpdate(false);

        this.weatherProvider.setWeather('CLEARING');
        await wait(5 * 60 * 1000);

        this.weatherProvider.setWeather('RAIN');
        await wait(5 * 60 * 1000);

        this.weatherProvider.setWeather('THUNDER');
        await wait(2 * 60 * 1000);

        GlobalState.blackout = true;
        await wait(2 * 60 * 1000);

        TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'system/reboot', 0.05);
        await wait(30 * 1000);

        TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'system/reboot', 0.05);
        await wait(30 * 1000);

        await this.reboot();
    }
}
