import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { HEALTH_OPTIONS, MOVEMENT_OPTIONS, VOCAL_OPTIONS } from '../../nui/components/Admin/PlayerSubMenu';
import { AdminPlayer } from '../../shared/admin/admin';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Err, Ok } from '../../shared/result';
import { RpcEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
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

    @Inject(InputService)
    private inputService: InputService;

    private async getPlayers(): Promise<AdminPlayer[]> {
        return (await emitRpc<AdminPlayer[]>(RpcEvent.ADMIN_GET_PLAYERS)).sort((a, b) => a.name.localeCompare(b.name));
    }

    @OnNuiEvent(NuiEvent.AdminGetPlayers)
    public async onGetPlayers(): Promise<void> {
        const players = await this.getPlayers();

        this.nuiDispatch.dispatch('admin_player_submenu', 'SetPlayers', players);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleSearchPlayer)
    public async handleSearchPlayer(): Promise<void> {
        const players = await this.getPlayers();
        const player = await this.inputService.askInput(
            {
                title: 'Rechercher un joueur',
                maxCharacters: 50,
                defaultValue: '',
            },
            value => {
                if (!value || value === '') {
                    return Ok(true);
                }
                const player = players.find(p => p.name.toLowerCase().includes(value.toLowerCase()));
                if (!player) {
                    return Err('Aucun joueur trouvé.');
                }
                return Ok(true);
            }
        );
        this.nuiDispatch.dispatch('admin_player_submenu', 'SetSearchFilter', player || '');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSpectate)
    public async spectate(player: AdminPlayer): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SPECTATE, player);
        this.notifier.notify(`Vous êtes maintenant en mode spectateur sur ~g~${player.name}.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleHealthOption)
    public async handleHealthOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        if (!ALLOWED_HEALTH_OPTIONS.includes(action)) {
            return;
        }
        const event: ServerEvent = action === 'kill' ? ServerEvent.ADMIN_KILL : ServerEvent.ADMIN_REVIVE;
        TriggerServerEvent(event, player);
        this.notifier.notify(`Le joueur ~g~${player.name}~s~ est maintenant ~r~${action}.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleMovementOption)
    public async handleMovementOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        if (!ALLOWED_MOVEMENT_OPTIONS.includes(action)) {
            return;
        }
        const event: ServerEvent = action === 'freeze' ? ServerEvent.ADMIN_FREEZE : ServerEvent.ADMIN_UNFREEZE;
        TriggerServerEvent(event, player);
        this.notifier.notify(`Le joueur ~g~${player.name}~s~ est maintenant ~r~${action}.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleVocalOption)
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
            this.notifier.notify(`Le joueur ~g~${player.name}~s~ est maintenant ~r~muté.`, 'info');
        } else {
            TriggerServerEvent(ServerEvent.VOIP_MUTE, false, player.id);
            this.notifier.notify(`Le joueur ~g~${player.name}~s~ n'est plus ~r~muté.`, 'info');
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleTeleportOption)
    public async handleTeleportOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        if (action === 'goto') {
            TriggerServerEvent(ServerEvent.ADMIN_TELEPORT_TO_PLAYER, player);
        } else if (action === 'bring') {
            TriggerServerEvent(ServerEvent.ADMIN_TELEPORT_PLAYER_TO_ME, player);
        } else {
            this.notifier.notify(`L'action ~r~${action}~s~ n'est pas valide.`, 'error');
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleEffectsOption)
    public async handleEffectsOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        TriggerServerEvent(`admin:server:effect:${action}`, player.id);
        this.notifier.notify(`L'effet ~g~${action}~s~ a été appliqué sur le joueur ~g~${player.name}~s~.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleDiseaseOption)
    public async handleDiseaseOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        TriggerServerEvent(`admin:server:disease:${action}`, player.id);
        this.notifier.notify(`La maladie ~g~${action}~s~ a été appliquée sur le joueur ~g~${player.name}~s~.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleResetSkin)
    public async handleResetSkin(player: AdminPlayer): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_RESET_SKIN, player);
        this.notifier.notify(`Le skin du joueur ~g~${player.name}~s~ a été réinitialisé.`, 'info');
    }
}
