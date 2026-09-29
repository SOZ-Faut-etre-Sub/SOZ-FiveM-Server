import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { VehicleSeat } from '../../shared/vehicle/vehicle';

const WAYPOINT_SPRITE = 8;

@Provider()
export class HudGpsProvider {
    private frontSeatWaypointActive = false;
    private lastBroadcastActive: boolean = null;

    @Command('hud_gps_delete_waypoint', {
        description: 'Supprimer le point GPS',
        keys: [{ mapper: 'keyboard', key: 'DELETE' }],
    })
    public deleteWaypoint() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);
        const isFrontSeat = this.isFrontSeat(vehicle, ped);

        if (!isFrontSeat && this.frontSeatWaypointActive) {
            return;
        }

        this.clearLocalWaypoint();

        if (!isFrontSeat) {
            return;
        }

        const otherOccupants = this.getOtherOccupantPlayerIds(vehicle, ped);

        if (otherOccupants.length > 0) {
            TriggerServerEvent(ServerEvent.VEHICLE_FORCE_CLEAR_WAYPOINT, otherOccupants);
        }
    }

    @OnEvent(ClientEvent.VEHICLE_FORCE_CLEAR_WAYPOINT)
    public onForceClearWaypoint() {
        this.clearLocalWaypoint();
    }

    @OnEvent(ClientEvent.VEHICLE_WAYPOINT_STATE)
    public onWaypointStateUpdate(active: boolean) {
        this.frontSeatWaypointActive = active;
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public onVehicleChange() {
        this.frontSeatWaypointActive = false;
        this.lastBroadcastActive = null;
    }

    @Tick(TickInterval.EVERY_SECOND)
    public broadcastFrontSeatWaypointState() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!this.isFrontSeat(vehicle, ped)) {
            return;
        }

        const active = this.hasWaypoint();

        if (active === this.lastBroadcastActive) {
            return;
        }

        const otherOccupants = this.getOtherOccupantPlayerIds(vehicle, ped);

        if (otherOccupants.length === 0) {
            return;
        }

        this.lastBroadcastActive = active;
        TriggerServerEvent(ServerEvent.VEHICLE_WAYPOINT_STATE, otherOccupants, active);
    }

    private isFrontSeat(vehicle: number, ped: number): boolean {
        return (
            !!vehicle &&
            (GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === ped ||
                GetPedInVehicleSeat(vehicle, VehicleSeat.Copilot) === ped)
        );
    }

    private getOtherOccupantPlayerIds(vehicle: number, ped: number): number[] {
        const maxSeats = GetVehicleMaxNumberOfPassengers(vehicle);
        const players: number[] = [];

        for (let seat = -1; seat < maxSeats; seat++) {
            const seatPed = GetPedInVehicleSeat(vehicle, seat);

            if (!seatPed || seatPed === ped || !IsPedAPlayer(seatPed)) {
                continue;
            }

            players.push(GetPlayerServerId(NetworkGetPlayerIndexFromPed(seatPed)));
        }

        return players;
    }

    private hasWaypoint(): boolean {
        return DoesBlipExist(GetFirstBlipInfoId(WAYPOINT_SPRITE));
    }

    private clearLocalWaypoint() {
        if (!this.hasWaypoint()) {
            return;
        }

        RemoveBlip(GetFirstBlipInfoId(WAYPOINT_SPRITE));
        SetWaypointOff();
    }
}
