import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { AdminPlayer, FullAdminPlayer } from '../../shared/admin/admin';
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

    public intervalHandlers = {
        displayOwners: null,
        displayPlayerNames: null,
        displayPlayersOnMap: null,
    };

    private multiplayerTags: Map<string, number> = new Map();
    private playerBlips: Map<string, number> = new Map();
    private previousPlayers: string[] = [];

    @OnNuiEvent(NuiEvent.AdminToggleDisplayOwners)
    public async toggleDisplayOwners(value: boolean): Promise<void> {
        if (!value) {
            clearInterval(this.intervalHandlers.displayOwners);
            this.intervalHandlers.displayOwners = null;
            return;
        }
        this.intervalHandlers.displayOwners = setInterval(async () => {
            const vehicles: number[] = GetGamePool('CVehicle');
            const playerCoords = GetEntityCoords(PlayerPedId(), false);
            for (const vehicle of vehicles) {
                const vehicleCoords = GetEntityCoords(vehicle, false);
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
                        `Veh Engine.: ${GetVehicleEngineHealth(vehicle).toFixed(2)} ` +
                        `| Veh Body: ${GetVehicleBodyHealth(vehicle).toFixed(2)}` +
                        `| Veh Tank: ${GetVehiclePetrolTankHealth(vehicle).toFixed(2)}` +
                        `| Veh Oil: ${GetVehicleOilLevel(vehicle).toFixed(2)}/${GetVehicleHandlingFloat(
                            vehicle,
                            'CHandlingData',
                            'fOilVolume'
                        ).toFixed(2)}`;
                    this.drawService.drawText3d([vehicleCoords[0], vehicleCoords[1], vehicleCoords[2] + 1], ownerInfo);
                    this.drawService.drawText3d(
                        [vehicleCoords[0], vehicleCoords[1], vehicleCoords[2] + 2],
                        vehicleInfo
                    );
                }
            }

            const peds: number[] = GetGamePool('CPed');
            for (const ped of peds) {
                if (IsPedInAnyVehicle(ped, false) || !NetworkGetEntityIsNetworked(ped)) {
                    continue;
                }
                const pedCoords = GetEntityCoords(ped, false);
                const dist = GetDistanceBetweenCoords(
                    pedCoords[0],
                    pedCoords[1],
                    pedCoords[2],
                    playerCoords[0],
                    playerCoords[1],
                    playerCoords[2],
                    false
                );
                if (dist < 50) {
                    let text = ' | OwnerNet: ';
                    if (GetPlayerServerId(NetworkGetEntityOwner(ped)) === GetPlayerServerId(PlayerId())) {
                        text = ` | ~g~OwnerNet: `;
                    }
                    const ownerInfo =
                        `PedNet: ${NetworkGetNetworkIdFromEntity(ped)} ` +
                        `${text} ${GetPlayerServerId(NetworkGetEntityOwner(ped))}`;
                    this.drawService.drawText3d([pedCoords[0], pedCoords[1], pedCoords[2] + 1], ownerInfo);
                }
            }
        }, 1);
    }

    @OnNuiEvent(NuiEvent.AdminToggleDisplayPlayerNames)
    public async toggleDisplayPlayerNames({
        value,
        withDetails,
    }: {
        value: boolean;
        withDetails: boolean;
    }): Promise<void> {
        if (!value) {
            for (const value of this.multiplayerTags.values()) {
                SetMpGamerTagVisibility(value, 0, false);
                RemoveMpGamerTag(value);
            }
            clearInterval(this.intervalHandlers.displayPlayerNames);
            this.intervalHandlers.displayPlayerNames = null;
            return;
        }
        await this.displayPlayerNames(withDetails);
        this.intervalHandlers.displayPlayerNames = setInterval(async () => {
            await this.displayPlayerNames(withDetails);
        }, 5000);
    }

    @OnNuiEvent(NuiEvent.AdminToggleDisplayPlayersOnMap)
    public async toggleDisplayPlayersOnMap(value: boolean): Promise<void> {
        if (!value) {
            for (const value of Object.values(this.playerBlips)) {
                RemoveBlip(value);
            }
            clearInterval(this.intervalHandlers.displayPlayersOnMap);
            return;
        }
        this.intervalHandlers.displayPlayersOnMap = setInterval(async () => {
            for (const value of Object.values(this.playerBlips)) {
                RemoveBlip(value);
            }

            const players = await emitRpc<FullAdminPlayer[]>(RpcEvent.ADMIN_GET_FULL_PLAYERS);

            for (const player of players) {
                const blipId = this.playerBlips.get(player.citizenId);

                const coords = player.coords;
                if (DoesBlipExist(blipId)) {
                    SetBlipCoords(blipId, coords[0], coords[1], coords[2]);
                    SetBlipRotation(blipId, Math.ceil(player.heading));
                } else {
                    const createdBlip = this.QBCore.createBlip('admin:player-blip:' + player.citizenId, {
                        coords: { x: coords[0], y: coords[1], z: coords[2] },
                        heading: player.heading,
                        name: player.rpFullName,
                        playername: player.rpFullName,
                        showheading: true,
                        sprite: 1,
                    });
                    SetBlipCategory(createdBlip, 7);
                    this.playerBlips.set(player.citizenId, createdBlip);
                }
            }
            this.previousPlayers = players.map(player => player.citizenId);
        }, 2500);
    }

    private async displayPlayerNames(withDetails: boolean): Promise<void> {
        for (const value of Object.values(this.multiplayerTags)) {
            RemoveMpGamerTag(value);
            this.multiplayerTags.delete(value);
        }

        const players = await emitRpc<AdminPlayer[]>(RpcEvent.ADMIN_GET_PLAYERS);

        players.forEach(player => {
            this.multiplayerTags.set(player.citizenId, GetPlayerFromServerId(player.id));

            let name = player.rpFullName;
            if (withDetails) {
                name += ` | ${player.name} | ${player.id}`;
            }
            CreateMpGamerTagWithCrewColor(
                this.multiplayerTags.get(player.citizenId),
                name,
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
