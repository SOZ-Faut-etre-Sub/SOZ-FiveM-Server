import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { AdminPlayer } from '../../shared/admin/admin';
import { NuiEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { DrawService } from '../draw.service';
import { Qbcore } from '../qbcore';

@Provider()
export class AdminMenuInteractiveProvider {
    @Inject(DrawService)
    private drawService: DrawService;

    @Inject(Qbcore)
    private QBCore: Qbcore;

    private intervalHandlers = {
        displayOwners: null,
        displayPlayerNames: null,
        displayPlayersOnMap: null,
    };

    private multiplayerTags: Map<string, number> = new Map();
    private playerBlips: Map<string, number> = new Map();

    @OnNuiEvent(NuiEvent.AdminToggleDisplayOwners)
    public async toggleDisplayOwners(value: boolean): Promise<void> {
        if (!value) {
            clearInterval(this.intervalHandlers.displayOwners);
            this.intervalHandlers.displayOwners = null;
            return;
        }
        this.intervalHandlers.displayOwners = setInterval(async () => {
            const vehicles: number[] = GetGamePool('CVehicle');
            for (const vehicle of vehicles) {
                const vehicleCoords = GetEntityCoords(vehicle, false);
                const playerCoords = GetEntityCoords(PlayerPedId(), false);
                const dist = GetDistanceBetweenCoords(
                    vehicleCoords[0],
                    vehicleCoords[1],
                    vehicleCoords[2],
                    playerCoords[0],
                    playerCoords[1],
                    playerCoords[2],
                    false
                );
                if (dist < 50) {
                    let text = ' | OwnerNet: ';
                    if (GetPlayerServerId(NetworkGetEntityOwner(vehicle)) === GetPlayerServerId(PlayerId())) {
                        text = ` | ~g~OwnerNet: `;
                    }
                    const ownerInfo =
                        `${GetDisplayNameFromVehicleModel(GetEntityModel(vehicle))} ` +
                        `| VehicleNet: ${NetworkGetNetworkIdFromEntity(vehicle)} ` +
                        `${text} ${GetPlayerServerId(NetworkGetEntityOwner(vehicle))}`;
                    const vehicleInfo =
                        `Vehicle Engine Health: ${GetVehicleEngineHealth(vehicle).toFixed(2)} ` +
                        `| Vehicle Body Health: ${GetVehicleBodyHealth(vehicle).toFixed(2)}` +
                        `| Vehicle Oil: ${GetVehicleOilLevel(vehicle).toFixed(2)}/${GetVehicleHandlingFloat(
                            vehicle,
                            'CHandlingData',
                            'fOilVolume'
                        ).toFixed(2)}`;
                    this.drawService.drawText3d(vehicleCoords[0], vehicleCoords[1], vehicleCoords[2] + 1, ownerInfo);
                    this.drawService.drawText3d(vehicleCoords[0], vehicleCoords[1], vehicleCoords[2] + 2, vehicleInfo);
                }
            }
        }, 1);
    }

    @OnNuiEvent(NuiEvent.AdminToggleDisplayPlayerNames)
    public async toggleDisplayPlayerNames(value: boolean): Promise<void> {
        if (!value) {
            for (const value of this.multiplayerTags.values()) {
                SetMpGamerTagVisibility(value, 0, false);
                RemoveMpGamerTag(value);
            }
            clearInterval(this.intervalHandlers.displayPlayerNames);
            this.intervalHandlers.displayPlayerNames = null;
            return;
        }
        await this.displayPlayerNames();
        this.intervalHandlers.displayPlayerNames = setInterval(async () => {
            await this.displayPlayerNames();
        }, 5000);
    }

    @OnNuiEvent(NuiEvent.AdminToggleDisplayPlayersOnMap)
    public async toggleDisplayPlayersOnMap(): Promise<void> {
        if (this.intervalHandlers.displayPlayersOnMap) {
            clearInterval(this.intervalHandlers.displayPlayersOnMap);
            return;
        }
        this.intervalHandlers.displayPlayersOnMap = setInterval(async () => {
            for (const value of Object.values(this.playerBlips)) {
                this.QBCore.removeBlip(value);
            }

            const players = await emitRpc<AdminPlayer[]>(RpcEvent.ADMIN_GET_PLAYERS);
            for (const player of players) {
                const blipId = 'admin:player-blip:' + player.citizenId;
                this.playerBlips[player.citizenId] = blipId;

                const coords = player.coords;
                this.QBCore.createBlip(blipId, {
                    coords: { x: coords[0], y: coords[1], z: coords[2] },
                    heading: player.heading,
                    name: player.name,
                    showheading: true,
                    sprite: 1,
                });
            }
        }, 2500);
    }

    private async displayPlayerNames(): Promise<void> {
        for (const value of Object.values(this.multiplayerTags)) {
            RemoveMpGamerTag(value);
            this.multiplayerTags.delete(value);
        }

        const players = await emitRpc<AdminPlayer[]>(RpcEvent.ADMIN_GET_PLAYERS);

        players.forEach(player => {
            this.multiplayerTags.set(player.citizenId, GetPlayerFromServerId(player.source));
            CreateMpGamerTagWithCrewColor(
                this.multiplayerTags.get(player.citizenId),
                player.name,
                false,
                false,
                '',
                0,
                0,
                0,
                0
            );
            SetMpGamerTagVisibility(this.multiplayerTags.get(player.citizenId), 0, true);
        });
    }
}
