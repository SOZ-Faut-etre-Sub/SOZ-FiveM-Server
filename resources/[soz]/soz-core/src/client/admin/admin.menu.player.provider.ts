import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { HEALTH_OPTIONS, MOVEMENT_OPTIONS, VOCAL_OPTIONS } from '../../nui/components/Admin/PlayerSubMenu';
import { AdminPlayer } from '../../shared/admin/admin';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';

const ALLOWED_HEALTH_OPTIONS = HEALTH_OPTIONS.map(option => option.value);
const ALLOWED_MOVEMENT_OPTIONS = MOVEMENT_OPTIONS.map(option => option.value);
const ALLOWED_VOCAL_OPTIONS = VOCAL_OPTIONS.map(option => option.value);

@Provider()
export class AdminMenuPlayerProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnNuiEvent(NuiEvent.AdminGetPlayers)
    public async getPlayers(): Promise<void> {
        const players = await emitRpc<AdminPlayer[]>(RpcEvent.ADMIN_GET_PLAYERS);

        this.nuiDispatch.dispatch('admin_player_submenu', 'SetPlayers', players);
    }

    @OnNuiEvent(NuiEvent.AdminSpectate)
    public async spectate(player: AdminPlayer): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SPECTATE, player);
    }

    @OnNuiEvent(NuiEvent.AdminHandleHealthOption)
    public async handleHealthOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        if (!ALLOWED_HEALTH_OPTIONS.includes(action)) {
            return;
        }
        const event: ServerEvent = action === 'kill' ? ServerEvent.ADMIN_KILL : ServerEvent.ADMIN_REVIVE;
        TriggerServerEvent(event, player);
    }

    @OnNuiEvent(NuiEvent.AdminHandleMovementOption)
    public async handleMovementOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        if (!ALLOWED_MOVEMENT_OPTIONS.includes(action)) {
            return;
        }
        const event: ServerEvent = action === 'freeze' ? ServerEvent.ADMIN_FREEZE : ServerEvent.ADMIN_UNFREEZE;
        TriggerServerEvent(event, player);
    }

    @OnNuiEvent(NuiEvent.AdminHandleVocalOption)
    public async handleVocalOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        if (!ALLOWED_VOCAL_OPTIONS.includes(action)) {
            return;
        }
        if (action === 'status') {
            const isMuted = await emitRpc<boolean>(RpcEvent.VOIP_IS_MUTED, player.id);

            if (isMuted) {
                this.notifier.notify(`Le joueur est ~r~muté.`, 'info');
            } else {
                this.notifier.notify(`Le joueur ~g~n'est pas muté.`, 'info');
            }
        } else if (action === 'mute') {
            TriggerServerEvent(ServerEvent.VOIP_MUTE, true, player.id);
        } else {
            TriggerServerEvent(ServerEvent.VOIP_MUTE, false, player.id);
        }
    }
}
