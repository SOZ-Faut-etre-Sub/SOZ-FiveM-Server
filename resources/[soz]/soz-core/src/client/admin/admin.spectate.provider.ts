import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AdminPlayer } from '../../shared/admin/admin';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { Vector3 } from '../../shared/polyzone/vector';
import { Notifier } from '../notifier';
import { VoipService } from '../voip/voip.service';

@Provider()
export class AdminSpectateProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(VoipService)
    private voipService: VoipService;

    private previousPosition: Vector3 = null;

    private spectatingPlayer = null;

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSpectate)
    public async spectate(player: AdminPlayer): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SPECTATE_PLAYER, player);
        this.notifier.notify(`Vous êtes maintenant en mode spectateur sur ~g~${player.name}.`, 'info');
    }

    @OnEvent(ClientEvent.ADMIN_SPECTATE_PLAYER)
    public async spectatePlayer(target: number, position: Vector3): Promise<void> {
        const ped = PlayerPedId();
        const targetPlayer = GetPlayerFromServerId(target);
        const targetPed = GetPlayerPed(targetPlayer);

        if (this.spectatingPlayer === target) {
            NetworkSetInSpectatorMode(false, targetPed);
            SetEntityCoords(
                ped,
                this.previousPosition[0],
                this.previousPosition[1],
                this.previousPosition[2],
                false,
                false,
                false,
                false
            );
            SetEntityVisible(ped, true, false);
            SetEntityInvincible(ped, false);
            SetEntityCollision(ped, true, true);

            this.spectatingPlayer = null;
            this.previousPosition = null;
            this.voipService.mutePlayer(false);

            return;
        }

        if (this.spectatingPlayer === null) {
            SetEntityVisible(ped, false, false);
            SetEntityInvincible(ped, true);
            SetEntityCollision(ped, false, false);
            this.previousPosition = GetEntityCoords(ped, false) as Vector3;
            this.voipService.mutePlayer(true);
        }

        SetEntityCoords(ped, position[0], position[1], position[2], false, false, false, false);
        NetworkSetInSpectatorMode(true, targetPed);
        this.spectatingPlayer = target;
    }
}
