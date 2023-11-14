import { AnimationService } from '@public/client/animation/animation.service';
import { Notifier } from '@public/client/notifier';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class PoliceJobMenuProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnNuiEvent(NuiEvent.RedCall)
    public redCall(): Promise<void> {
        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped);
        const [street, street2] = GetStreetNameAtCoord(coords[0], coords[1], coords[2]);

        if (IsWarningMessageActive() || GetWarningMessageTitleHash() != 1246147334) {
            let name = GetStreetNameFromHashKey(street);
            if (street2) {
                name += ' et ' + GetStreetNameFromHashKey(street2);
            }

            TriggerEvent(
                ClientEvent.POLICE_RED_CALL,
                '555-POLICE',
                `Code Rouge !!! Un agent a besoin d'aide vers ${name}`,
                `Code Rouge !!! Un agent a besoin d'aide vers <span {class}>${name}</span>`
            );
        }

        return;
    }

    @OnNuiEvent(NuiEvent.PoliceShowBadge)
    public async showBadge(): Promise<void> {
        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped) as Vector3;
        const badgeProp = CreateObject(
            GetHashKey('prop_fib_badge'),
            coords[0],
            coords[1],
            coords[2] + 0.2,
            true,
            true,
            true
        );
        //TODO: change to include props in anim
        const boneIndex = GetPedBoneIndex(ped, 28422);

        const netId = ObjToNet(badgeProp);
        SetNetworkIdCanMigrate(netId, false);
        TriggerServerEvent(ServerEvent.OBJECT_ATTACHED_REGISTER, netId);
        AttachEntityToEntity(
            badgeProp,
            ped,
            boneIndex,
            0.065,
            0.029,
            -0.035,
            80.0,
            -1.9,
            75.0,
            true,
            true,
            false,
            true,
            1,
            true
        );
        const anim = this.animationService.playAnimation({
            base: {
                dictionary: 'paper_1_rcm_alt1-9',
                name: 'player_one_dual-9',
                duration: 3000.0,
                blendInSpeed: 8,
                blendOutSpeed: -8,
                playbackRate: 0,
                lockX: false,
                lockY: false,
                lockZ: false,
                options: {
                    enablePlayerControl: true,
                    onlyUpperBody: true,
                    repeat: true,
                },
            },
        });
        // CreateThread(function()
        const vehicle = this.getVehicleInDirection();
        if (vehicle) {
            let pedFound = 0;
            for (let i = -1; i <= GetVehicleModelNumberOfSeats(vehicle); i++) {
                const vehiclePed = GetPedInVehicleSeat(vehicle, i);
                if (vehiclePed != 0 && !IsPedAPlayer(vehiclePed)) {
                    TaskLeaveVehicle(vehiclePed, vehicle, 256);
                    SetBlockingOfNonTemporaryEvents(vehiclePed, true);
                    TaskWanderStandard(vehiclePed, 10.0, 10.0);

                    pedFound++;
                }
            }

            if (pedFound >= 1) {
                const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

                TriggerServerEvent(ServerEvent.VEHICLE_TAKE_OWNER, vehicleNetworkId);
                this.notifier.notify('Vous venez de réquisitionner ce véhicule');
            }
        }
        await anim;
        //TODO: change to include props in anim
        ClearPedSecondaryTask(ped);
        TriggerServerEvent(ServerEvent.OBJECT_ATTACHED_UNREGISTER, netId);
        DeleteObject(badgeProp);
    }

    private getVehicleInDirection(): number | null {
        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped);
        const inDirection = GetOffsetFromEntityInWorldCoords(ped, 0.0, 5.0, 0.0);
        const rayHandle = StartExpensiveSynchronousShapeTestLosProbe(
            coords[0],
            coords[1],
            coords[2],
            inDirection[0],
            inDirection[1],
            inDirection[2],
            10,
            ped,
            0
        );
        const [, hit, , , entityHit] = GetShapeTestResult(rayHandle);

        if (hit == 1 && GetEntityType(entityHit) == 2) {
            return entityHit;
        } else {
            return null;
        }
    }

    @OnNuiEvent(NuiEvent.PoliceGetWantedPlayers)
    public async getWantedPlayers(): Promise<{ id: number; message: string }[]> {
        return await emitRpc(RpcServerEvent.POLICE_GET_WANTED_PLAYERS);
    }

    @OnNuiEvent(NuiEvent.PoliceDeleteWantedPlayer)
    public async deleteWantedPlayer({ id, message }: { id: number; message: string }): Promise<void> {
        const deletion: boolean = await emitRpc(RpcServerEvent.POLICE_DELETE_WANTED_PLAYER, id);
        if (deletion) {
            this.notifier.notify(`Vous avez retiré ${message} de la liste des personnes recherchées`);
        }
    }
}
