import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { AdminPlayer, HEALTH_OPTIONS, MOVEMENT_OPTIONS, VOCAL_OPTIONS } from '../../shared/admin/admin';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { VampireGameRole } from '../../shared/halloween';
import { InventoryType } from '../../shared/inventory';
import { PositiveNumberValidator } from '../../shared/nui/input';
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
        const player = await this.inputService.askInput<string>(
            {
                title: 'Rechercher un joueur',
                maxCharacters: 50,
            },
            value => {
                if (!value || value === '') {
                    return Ok(value);
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
                return Ok(value);
            }
        );
        this.nuiDispatch.dispatch('admin_player_submenu', 'SetSearchFilter', player || '');
    }

    @OnEvent(ClientEvent.ADMIN_KILL_PLAYER)
    public async killPlayer(): Promise<void> {
        SetEntityHealth(PlayerPedId(), 0);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleHealthOption)
    public async handleHealthOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        if (!ALLOWED_HEALTH_OPTIONS.includes(action)) {
            return;
        }

        if (action === 'kill') {
            TriggerServerEvent(ServerEvent.ADMIN_KILL_PLAYER, player);
        } else {
            TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_CANCEL_VAMPIRE_KNOCKOUT, player.id, true);
            TriggerServerEvent(ServerEvent.LSMC_REVIVE, player.id, true, false, false);
        }

        this.notifier.notify(`Le joueur ~g~${player.name}~s~ a été ~r~${action}.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleMovementOption)
    public async handleMovementOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        if (!ALLOWED_MOVEMENT_OPTIONS.includes(action)) {
            return;
        }
        const event: ServerEvent =
            action === 'freeze' ? ServerEvent.ADMIN_FREEZE_PLAYER : ServerEvent.ADMIN_UNFREEZE_PLAYER;
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
            const hasBeenMuted = await emitRpc<boolean>(RpcServerEvent.VOIP_SET_MUTE, player.id, true);

            if (hasBeenMuted) {
                this.notifier.notify(`Le joueur ~g~${player.name}~s~ est maintenant ~r~muté.`, 'info');
            } else {
                this.notifier.notify(`Le joueur ~g~${player.name}~s~ n'a pas pu être ~r~muté.`, 'error');
            }
        } else {
            const hasBeenUnmuted = await emitRpc<boolean>(RpcServerEvent.VOIP_SET_MUTE, player.id, false);

            if (hasBeenUnmuted) {
                this.notifier.notify(`Le joueur ~g~${player.name}~s~ est maintenant ~g~démuté.`, 'info');
            } else {
                this.notifier.notify(`Le joueur ~g~${player.name}~s~ n'a pas pu être ~g~démuté.`, 'error');
            }
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
        if (action === 'normal') {
            TriggerServerEvent(ServerEvent.ADMIN_RESET_EFFECT, player);
        }

        if (action === 'alcohol') {
            TriggerServerEvent(ServerEvent.ADMIN_SET_ALCOHOL_EFFECT, player);
        }

        if (action === 'drug') {
            TriggerServerEvent(ServerEvent.ADMIN_SET_DRUG_EFFECT, player);
        }

        this.notifier.notify(`L'effet ~g~${action}~s~ a été appliqué sur le joueur ~g~${player.name}~s~.`, 'info');
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleDiseaseOption)
    public async handleDiseaseOption({ action, player }: { action: string; player: AdminPlayer }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SET_DISEASE, player, action);
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
        year: 'halloween2022' | 'halloween2023';
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
                maxCharacters: 7,
            },
            PositiveNumberValidator
        );

        if (!value) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_SET_REPUTATION, player.id, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleResetCrimi)
    public async handleResetCrimi(player: AdminPlayer): Promise<void> {
        const value = await this.inputService.askInput({
            title: `Entrer 'OUI' pour confirmer le Reset Criminalité de ce personnage`,
            maxCharacters: 7,
        });

        if (value === 'OUI') {
            TriggerServerEvent(ServerEvent.ADMIN_RESET_CRIMI, player.id);
        }
        return;
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerHandleResetClientState)
    public async handleResetClientState(player: AdminPlayer): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_RESET_CLIENT_STATE, player.id);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSearch)
    public async handleResetPlayerSearch(player: AdminPlayer): Promise<void> {
        TriggerServerEvent(ServerEvent.INVENTORY_OPEN, InventoryType.Player, 'player_' + player.citizenId);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSetSenateParty)
    public async handlePlayerSetSenateParty({
        player,
        value,
    }: {
        player: AdminPlayer;
        value: string | null;
    }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_PLAYER_SET_SENATE_PARTY, player.id, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSetZombie)
    public async handlePlayerSetZombie({ player, value }: { player: AdminPlayer; value: boolean }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_PLAYER_SET_ZOMBIE, player.id, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSetHalloweenRole)
    public async handlePlayerSetHalloweenRole({
        player,
        value,
    }: {
        player: AdminPlayer;
        value: VampireGameRole;
    }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_FOCE_TRANSFORM_PLAYER, player.id, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSetVoipDebug)
    public async setPlayerDebug({ player, value }: { player: AdminPlayer; value: boolean }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_PLAYER_SET_VOIP_DEBUG, player.id, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSetPlate)
    public async setPlayerPlate({
        type,
        player,
        value,
    }: {
        type: 'plate' | 'special_plate';
        player: AdminPlayer;
        value: boolean;
    }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_PLAYER_SET_PLATE, type, player, value);
    }
}
