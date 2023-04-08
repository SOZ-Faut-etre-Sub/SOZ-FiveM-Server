import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { AdminPlayer, HEALTH_OPTIONS, MOVEMENT_OPTIONS, VOCAL_OPTIONS } from '../../shared/admin/admin';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
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
        return (await emitRpc<AdminPlayer[]>(RpcServerEvent.ADMIN_GET_PLAYERS)).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    @OnNuiEvent(NuiEvent.AdminGetPlayers)
    public async onGetPlayers() {
        const players = await this.getPlayers();

        return Ok(players);
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
                const player = players.find(p => {
                    return (
                        p.name.toLowerCase().includes(value.toLowerCase()) ||
                        p.rpFullName.toLowerCase().includes(value.toLowerCase())
                    );
                });
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
        this.notifier.notify(`Le joueur ~g~${player.name}~s~ a été ~r~${action}.`, 'info');
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
            const isMuted = await emitRpc<boolean>(RpcServerEvent.VOIP_IS_MUTED, player.id);

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
        TriggerServerEvent('admin:server:disease', player.id, action);
        this.notifier.notify(`La maladie ~g~${action}~s~ a été appliquée sur le joueur ~g~${player.name}~s~.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleResetSkin)
    public async handleResetSkin(player: AdminPlayer): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_RESET_SKIN, player.id);
        this.notifier.notify(`Le skin du joueur ~g~${player.name}~s~ a été réinitialisé.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleResetHalloween)
    public async handleResetHalloween({
        player,
        year,
        scenario,
    }: {
        player: AdminPlayer;
        year: '2022';
        scenario: 'scenario1' | 'scenario2' | 'scenario3' | 'scenario4';
    }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_RESET_HALLOWEEN, player.id, year, scenario);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleOpenGunSmith)
    public async handleOpenGunSmith(): Promise<void> {
        emit(ClientEvent.WEAPON_OPEN_GUNSMITH);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleSetAttribute)
    public async handleSetAttribute({
        player,
        attribute,
        value,
    }: {
        player: AdminPlayer;
        attribute: 'strength' | 'stamina' | 'stress' | 'deficiency' | 'all';
        value: 'min' | 'max';
    }): Promise<void> {
        switch (attribute) {
            case 'strength':
                TriggerServerEvent(ServerEvent.ADMIN_SET_STRENGTH, player, value === 'min' ? 0 : 150);
                this.notifier.notify(`La force du joueur ~g~${player.name}~s~ a été modifiée.`, 'info');
                break;
            case 'stamina':
                TriggerServerEvent(ServerEvent.ADMIN_SET_STAMINA, player, value === 'min' ? 60 : 150);
                this.notifier.notify(`L'endurance du joueur ~g~${player.name}~s~ a été modifiée.`, 'info');
                break;
            case 'stress':
                TriggerServerEvent(ServerEvent.ADMIN_SET_STRESS_LEVEL, player, value === 'min' ? 0 : 100);
                this.notifier.notify(`Le stress du joueur ~g~${player.name}~s~ a été modifié.`, 'info');
                break;
            case 'deficiency':
                ['fiber', 'lipid', 'sugar', 'protein'].map(attribute => {
                    TriggerServerEvent(ServerEvent.ADMIN_SET_METADATA, player, attribute, value === 'min' ? 0 : 200);
                });
                this.notifier.notify(`Les carences du joueur ~g~${player.name}~s~ ont été modifiées.`, 'info');
                break;
            case 'all':
                TriggerServerEvent(ServerEvent.ADMIN_SET_AIO, player, value);
                this.notifier.notify(`Les attributs du joueur ~g~${player.name}~s~ ont été modifiés.`, 'info');
                break;
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleInjuriesUpdate)
    public async updateInjuriesCount({ player, value }: { player: AdminPlayer; value: number }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SET_INJURIES_COUNT, player.id, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleSetReputation)
    public async handleGiveReputation(player: AdminPlayer): Promise<void> {
        const current = await emitRpc<number>(RpcServerEvent.ADMIN_GET_REPUTATION, player.id);
        const value = await this.inputService.askInput(
            {
                title: `Changer la Réputation (actuelle ${current})`,
                defaultValue: '',
                maxCharacters: 7,
            },
            value => {
                if (!value) {
                    return Ok(true);
                }
                const int = parseInt(value);
                if (isNaN(int) || int < 0) {
                    return Err('Valeur incorrecte');
                }
                return Ok(true);
            }
        );

        if (!value) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_SET_REPUTATION, player.id, value);
    }
}
