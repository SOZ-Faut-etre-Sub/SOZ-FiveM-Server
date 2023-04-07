import { PlayerService } from '@public/client/player/player.service';
import { emitRpc } from '@public/core/rpc';
import { ServerEvent } from '@public/shared/event';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { Once } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { TargetFactory } from '../../target/target.factory';

const hopital = BoxZone.fromZone({
    center: [346.73, -1413.53, 32.26] as Vector3,
    length: 84.4,
    width: 92.6,
    heading: 320,
    debugPoly: false,
    minZ: 28.46,
    maxZ: 39.86,
});

@Provider()
export class LSMCInteractionProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Once()
    public onStart() {
        this.targetFactory.createForAllPlayer([
            {
                label: 'Rehabiliter',
                color: 'lsmc',
                icon: 'c:ems/Rehabiliter.png',
                job: 'lsmc',
                blackoutGlobal: true,
                blackoutJob: 'lsmc',
                canInteract: async entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const canRemoveItt = await emitRpc<boolean>(RpcServerEvent.LSMC_CAN_REMOVE_ITT, target);
                    return (
                        this.playerService.getPlayer().job.onduty &&
                        !Player(target).state.isdead &&
                        hopital.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3) &&
                        canRemoveItt
                    );
                },
                action: entity => {
                    TriggerServerEvent('lsmc:server:SetItt', GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)));
                },
            },
            {
                label: 'Deshabiliter',
                color: 'lsmc',
                icon: 'c:ems/Deshabiliter.png',
                job: 'lsmc',
                blackoutGlobal: true,
                blackoutJob: 'lsmc',
                canInteract: async entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const canSetItt = await emitRpc<boolean>(RpcServerEvent.LSMC_CAN_SET_ITT, target);
                    return (
                        this.playerService.getPlayer().job.onduty &&
                        !Player(target).state.isdead &&
                        hopital.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3) &&
                        canSetItt
                    );
                },
                action: entity => {
                    TriggerServerEvent('lsmc:server:SetItt', GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)));
                },
            },
            {
                label: 'Déshabiller',
                color: 'lsmc',
                icon: 'c:ems/desabhiller.png',
                job: 'lsmc',
                canInteract: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    return (
                        hopital.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3) &&
                        !Player(target).state.isWearingPatientOutfit
                    );
                },
                action: entity => {
                    TriggerServerEvent(
                        ServerEvent.LSMC_SET_PATIENT_OUTFIT,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        true
                    );
                },
            },
            {
                label: 'Rhabiller',
                color: 'lsmc',
                icon: 'c:ems/rhabiller.png',
                job: 'lsmc',
                canInteract: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    return (
                        hopital.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3) &&
                        Player(target).state.isWearingPatientOutfit
                    );
                },
                action: entity => {
                    TriggerServerEvent(
                        ServerEvent.LSMC_SET_PATIENT_OUTFIT,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        false
                    );
                },
            },
        ]);
    }
}
