import { Provider } from '@core/decorators/provider';
import { BlipFactory } from '@public/client/blip';
import { Notifier } from '@public/client/notifier';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerPositionProvider } from '@public/client/player/player.position.provider';
import { PlayerService } from '@public/client/player/player.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { VoipService } from '@public/client/voip/voip.service';
import { WeaponService } from '@public/client/weapon/weapon.service';
import { Once, OnceStep, OnEvent, OnGameEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { wait, waitUntil } from '@public/core/utils';
import { ClientEvent, GameEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import {
    LaserGameAddPlayerDistance,
    LaserGameAdminInfo,
    LaserGameBlipOptions,
    LaserGameClient,
    LaserGameColorEnum,
    LaserGameData,
    LaserGameFFASpawnPosition,
    LaserGameManagePosition,
    LaserGamePlayerData,
    LaserGamePosition,
    LaserGameStateEnum,
    LaserGameTeam,
    LaserGameTeamEnum,
    LaserGameTeamSpawnPosition,
    LaserGameTypeEnum,
} from '@public/shared/games/laser';
import { CRITICAL_HEALTH } from '@public/shared/health';
import { MenuType } from '@public/shared/nui/menu';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { getDistance, Vector2, Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { WeaponName } from '@public/shared/weapons/weapon';

@Provider()
export class LaserGameProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(VoipService)
    public readonly voipService: VoipService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(WeaponService)
    private readonly weaponService: WeaponService;

    game: LaserGameClient;
    team: LaserGameTeamEnum | null = null;
    starting: boolean = false;
    hasGameRequest: boolean = false;
    playersInSpectatedGame = {};
    startGameHealth = null;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        const game = await emitRpc<LaserGameClient | null>(RpcServerEvent.LASER_GAME_GET_AS_CLIENT);
        if (game) {
            this.onLaserGameSyncGame(game);
        }

        this.blipFactory.create('laser-game', LaserGameBlipOptions);
        this.targetFactory.createForPed({
            model: 'mp_f_freemode_01',
            coords: {
                x: LaserGamePosition[0],
                y: LaserGamePosition[1],
                z: LaserGamePosition[2],
                w: LaserGamePosition[3],
            },
            skin: {
                Hair: {
                    HairType: 123,
                    HairColor: 29,
                    HairSecondaryColor: 29,
                    BeardOpacity: 1,
                    EyebrowOpacity: 1,
                    BeardType: -1,
                    ChestHairType: -1,
                    BeardColor: 0,
                    EyebrowColor: 8,
                    ChestHairColor: 0,
                    EyebrowType: 1,
                    ChestHairOpacity: 1,
                },
            },
            components: {
                3: [18, 0, 0],
                4: [79, 3, 0],
                6: [58, 3, 0],
                8: [15, 0, 0],
                11: [180, 3, 0],
            },
            props: {
                0: [90, 3, 0],
            },
            invincible: true,
            blockevents: true,
            freeze: true,
            target: {
                distance: 2.5,
                options: [
                    {
                        label: 'Créer une partie de Laser Game',
                        icon: 'global/users',
                        category: 'citizen',
                        canInteract: async () => {
                            return !this.game || this.game?.state === LaserGameStateEnum.NONE;
                        },
                        action: async () => {
                            this.nuiMenu.openMenu(MenuType.LaserGameCreate, null, {
                                position: {
                                    position: LaserGamePosition,
                                    distance: 2.5,
                                },
                            });
                        },
                    },
                    {
                        label: 'Entrer dans le hub du Laser Game',
                        icon: 'housing/enter',
                        category: 'citizen',
                        canInteract: async () => {
                            const player = this.playerService.getPlayer();
                            return (
                                this.game?.state === LaserGameStateEnum.CREATED &&
                                this.game?.creator == player.citizenid
                            );
                        },
                        action: async () => {
                            const player = this.playerService.getPlayer();
                            this.playerService.updateState({ isInGameHub: true });
                            await wait(500);

                            await this.weaponService.clear();
                            await this.playerPositionProvider.removeProps();

                            TriggerServerEvent(ServerEvent.LASER_GAME_TP_IN_HUB, player.citizenid);
                        },
                    },
                ],
            },
        });

        this.targetFactory.createForBoxZone(
            'laser-game:out',
            {
                ...new BoxZone([2154.93, 2919.3, -81.08], 1.0, 1.0, {
                    heading: 17.18,
                    minZ: -82.08,
                    maxZ: -80.08,
                }),
            },
            [
                {
                    label: 'Sortir du hub du Laser Game',
                    icon: 'housing/enter',
                    category: 'citizen',
                    canInteract: async () => {
                        const player = this.playerService.getPlayer();
                        return (
                            !this.game ||
                            (this.game?.state === LaserGameStateEnum.CREATED && this.game?.creator == player.citizenid)
                        );
                    },
                    action: async () => {
                        this.playerService.updateState({ isInGameHub: false });
                        await wait(500);
                        TriggerServerEvent(ServerEvent.LASER_GAME_TP_OUT_HUB);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'laser-game:manage',
            {
                ...new BoxZone(
                    [LaserGameManagePosition[0], LaserGameManagePosition[1], LaserGameManagePosition[2]],
                    2.0,
                    3.6,
                    {
                        heading: LaserGameManagePosition[3],
                        minZ: -82.08,
                        maxZ: -80.08,
                    }
                ),
            },
            [
                {
                    label: 'Gérer la partie de Laser Game',
                    icon: 'dmc/allumer',
                    category: 'citizen',
                    canInteract: async () => {
                        const player = this.playerService.getPlayer();
                        return (
                            this.game?.state === LaserGameStateEnum.CREATED && this.game?.creator === player.citizenid
                        );
                    },
                    action: async () => {
                        const gameData = await emitRpc<LaserGameData | null>(RpcServerEvent.LASER_GAME_GET_DATA);

                        if (!gameData) {
                            return;
                        }

                        this.nuiMenu.openMenu(MenuType.LaserGameManage, gameData, {
                            position: {
                                position: LaserGameManagePosition,
                                distance: 5,
                            },
                        });
                    },
                },
                {
                    label: 'Rejoindre la partie',
                    icon: 'crimi/user-plus',
                    category: 'citizen',
                    canInteract: async () => {
                        if (!this.game || this.game?.state === LaserGameStateEnum.NONE) {
                            return false;
                        }
                        const bucket = await emitRpc<number>(RpcServerEvent.LASER_GAME_GET_BUCKET);
                        return Boolean(bucket);
                    },
                    action: async () => {
                        TriggerServerEvent(ServerEvent.LASER_GAME_REJOIN_GAME);
                    },
                },
                {
                    label: 'Quitter la partie',
                    icon: 'housing/enter',
                    category: 'citizen',
                    canInteract: async () => {
                        const player = this.playerService.getPlayer();
                        return (
                            this.game?.state === LaserGameStateEnum.CREATED && this.game?.creator !== player.citizenid
                        );
                    },
                    action: async () => {
                        TriggerServerEvent(ServerEvent.LASER_GAME_LEAVE_GAME, this.game.creator);
                    },
                },
            ]
        );

        this.targetFactory.createForAllPlayer([
            {
                label: 'Ajouter dans la partie',
                icon: 'crimi/user-plus',
                category: 'citizen',
                canInteract: entity => {
                    if (this.game?.state !== LaserGameStateEnum.CREATED) {
                        return false;
                    }

                    const gamePos = [LaserGamePosition[0], LaserGamePosition[1]] as Vector2;
                    const highestDistance = Math.max(
                        getDistance(gamePos, GetEntityCoords(entity) as Vector2),
                        getDistance(gamePos, GetEntityCoords(PlayerPedId()) as Vector2)
                    );
                    if (highestDistance > LaserGameAddPlayerDistance) {
                        return false;
                    }

                    return true;
                },
                action: (entity: number) => {
                    const playerIndex = NetworkGetPlayerIndexFromPed(entity);
                    const playerServerId = GetPlayerServerId(playerIndex);

                    TriggerServerEvent(ServerEvent.LASER_GAME_NOTIFY_ADD_PLAYER, playerServerId);
                },
            },
        ]);
    }

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    async onPlayerVictim(
        victim: number,
        attacker: number,
        _unkInt1: number,
        _unkBool1: number,
        _unkBool2: number,
        isFatal: boolean,
        weaponHash: number
    ): Promise<void> {
        if (!this.isGameRunning()) return;
        if (!IsPedAPlayer(victim)) return;

        const playerPed = PlayerPedId();
        if (playerPed !== victim) return;

        if (weaponHash === GetHashKey('weapon_raycarbine')) {
            if (IsEntityDead(playerPed)) return;
            SetEntityHealth(playerPed, 0);
            const attackerServerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(attacker));
            TriggerServerEvent(
                ServerEvent.LASER_GAME_INCR_SCORE,
                this.game.creator,
                GetPlayerServerId(NetworkGetPlayerIndexFromPed(attacker)),
                GetPlayerServerId(NetworkGetPlayerIndexFromPed(victim))
            );

            const name = await emitRpc<string | null>(
                RpcServerEvent.LASER_GAME_GET_PLAYER_NAME,
                this.game.creator,
                attackerServerId
            );
            if (name) {
                this.nuiDispatch.dispatch('laser_game', 'AddKilled', name);
            }
        }
    }

    @OnEvent(ClientEvent.LASER_GAME_ADD_KILL)
    public async addKill(name: string) {
        if (name) {
            this.nuiDispatch.dispatch('laser_game', 'AddKill', name);
        }
    }

    public isGameRunning() {
        return this.game?.state === LaserGameStateEnum.STARTED;
    }

    public async handleOnDeath() {
        if (!this.isGameRunning()) return;
        await wait(5_000);

        let revivePosition = this.getRandomPosition();
        const ped = PlayerPedId();
        if (!revivePosition || !revivePosition.length || !this.isGameRunning()) {
            const pos = GetEntityCoords(ped);
            revivePosition = [pos[0], pos[1], pos[2], GetEntityHeading(ped)] as Vector4;
        }

        NetworkResurrectLocalPlayer(
            revivePosition[0],
            revivePosition[1],
            revivePosition[2],
            revivePosition[3],
            1,
            false
        );
        SetEntityHealth(ped, GetPedMaxHealth(ped));

        TriggerEvent(ClientEvent.LSMC_SET_DEATH, false);
        await wait(500);
        this.voipService.mutePlayer(false);
        await this.ensureWeaponLoop();

        return;
    }

    private getRandomPosition(): Vector4 {
        const positions = this.getPositionListForCurrentGame();
        return positions[Math.floor(Math.random() * positions.length)];
    }

    private getPositionListForCurrentGame(): Array<Vector4> {
        if (!this.game) {
            return [];
        }
        return this.game.type === LaserGameTypeEnum.FFA
            ? LaserGameFFASpawnPosition
            : LaserGameTeamSpawnPosition[this.team] || [];
    }

    @OnNuiEvent(NuiEvent.LaserGameAdminMenuOpen)
    public async onLaserGameAdminMenuOpen() {
        const games = await emitRpc<Record<string, LaserGameAdminInfo> | null>(
            RpcServerEvent.LASER_GAME_GET_INFO_AS_STAFF
        );
        if (games === null) return;

        this.nuiMenu.openMenu(MenuType.LaserGameAdmin, games);
    }

    @OnNuiEvent(NuiEvent.LaserGameCreate)
    public async onLaserGameCreate(game_type: LaserGameTypeEnum) {
        const game = await emitRpc<LaserGameClient | null>(RpcServerEvent.LASER_GAME_CREATE, game_type);

        if (game === null) {
            return;
        }

        this.nuiMenu.closeMenu();
        this.onLaserGameSyncGame(game);
    }

    @OnNuiEvent(NuiEvent.LaserGameActionPlayer)
    public async onLaserGameActionPlayer(action_payload: Record<string, string>) {
        const players = await emitRpc<Record<string, LaserGamePlayerData> | null>(
            RpcServerEvent.LASER_GAME_ACTION_PLAYER,
            action_payload
        );

        this.onLaserGameSyncPlayerForMenu(players);
    }

    @OnNuiEvent(NuiEvent.LaserGameSetPlayerColor)
    public async onLaserSetPlayerColor({ citizenId, color }: { citizenId: string; color: LaserGameColorEnum }) {
        TriggerServerEvent(ServerEvent.LASER_GAME_SET_PLAYER_COLOR, citizenId, color);
    }

    @OnNuiEvent(NuiEvent.LaserGameSetTeamColor)
    public async onLaserSetTeamColor({ team, color }: { team: LaserGameTeamEnum; color: LaserGameColorEnum }) {
        TriggerServerEvent(ServerEvent.LASER_GAME_SET_TEAM_COLOR, team, color);
    }

    @OnNuiEvent(NuiEvent.LaserGameSetScoreGoal)
    public async onLaserSetScoreGoal({ scoreGoal }: { scoreGoal: number }) {
        TriggerServerEvent(ServerEvent.LASER_GAME_SET_SCORE_GOAL, scoreGoal);
    }

    @OnNuiEvent(NuiEvent.LaserGameSetGameDuration)
    public async onLaserSetDuration({ gameDuration }: { gameDuration: number }) {
        TriggerServerEvent(ServerEvent.LASER_GAME_SET_GAME_DURATION, gameDuration);
    }

    @OnNuiEvent(NuiEvent.LaserGameStartGame)
    public async onNuiLaserGameStart() {
        this.nuiMenu.closeMenu();
        TriggerServerEvent(ServerEvent.LASER_GAME_START);
    }

    @OnNuiEvent(NuiEvent.LaserGameCancelGame)
    public async onNuiLaserGameCancel() {
        this.nuiMenu.closeMenu();
        TriggerServerEvent(ServerEvent.LASER_GAME_CANCEL);
    }

    @OnEvent(ClientEvent.LASER_GAME_REJOIN_GAME)
    public async onRejoinGame(gameData: LaserGameData, timeDiff: number) {
        this.game.state = gameData.state;
        if (this.game.state !== LaserGameStateEnum.STARTED) return;

        this.notifier.notify('Vous êtes de nouveau dans la partie');
        const player = this.playerService.getPlayer();

        this.playerService.updateState({ isInGame: true });
        TriggerEvent(ClientEvent.PLAYER_HEALTH_SET_NUTRITION_DISABLED, true);
        const ped = PlayerPedId();
        await waitUntil(async () => !IsEntityPositionFrozen(ped));

        this.nuiDispatch.dispatch('laser_game', 'SetCurrentPlayer', player.citizenid);
        this.nuiDispatch.dispatch('laser_game', 'SetGameData', gameData);
        await wait(500);

        await this.ensureWeaponLoop();
        this.nuiDispatch.dispatch('laser_game', 'SetStart', {
            start: Date.now() - timeDiff,
            duration: gameData.gameDuration,
        });
    }

    @OnEvent(ClientEvent.LASER_GAME_START_GAME)
    public async onStartGame(gameData: LaserGameData) {
        this.game.state = gameData.state;
        if (this.game.state !== LaserGameStateEnum.STARTED) return;
        this.starting = true;
        this.weaponService.setDisabled('laser-game', true);
        this.playerService.updateState({ isInGame: true });

        const player = this.playerService.getPlayer();

        TriggerEvent(ClientEvent.PLAYER_HEALTH_SET_NUTRITION_DISABLED, true);
        const ped = PlayerPedId();
        this.startGameHealth = GetEntityHealth(PlayerPedId());

        await waitUntil(async () => !IsEntityPositionFrozen(ped));
        FreezeEntityPosition(ped, true);

        this.nuiDispatch.dispatch('laser_game', 'SetCurrentPlayer', player.citizenid);
        this.nuiDispatch.dispatch('laser_game', 'SetGameData', gameData);
        await wait(500);

        PlaySoundFrontend(-1, '5s_To_Event_Start_Countdown', 'GTAO_FM_Events_Soundset', false);
        this.nuiDispatch.dispatch('laser_game', 'SetCountDown', '6');
        await wait(1000);

        this.nuiDispatch.dispatch('laser_game', 'SetCountDown', '5');
        await wait(1000);

        this.nuiDispatch.dispatch('laser_game', 'SetCountDown', '4');
        await wait(1000);

        this.nuiDispatch.dispatch('laser_game', 'SetCountDown', '3');
        await wait(1000);

        this.nuiDispatch.dispatch('laser_game', 'SetCountDown', '2');
        await wait(1000);

        this.nuiDispatch.dispatch('laser_game', 'SetCountDown', '1');
        await wait(1000);

        PlaySoundFrontend(-1, 'Start', 'DLC_AW_Frontend_Sounds', false);
        this.nuiDispatch.dispatch('laser_game', 'SetCountDown', 'START');

        this.starting = false;
        FreezeEntityPosition(ped, false);
        await this.ensureWeaponLoop();
        setTimeout(() => this.nuiDispatch.dispatch('laser_game', 'SetCountDown', null), 1000);
        this.nuiDispatch.dispatch('laser_game', 'SetStart', {
            start: Date.now(),
            duration: gameData.gameDuration,
        });
    }

    @OnEvent(ClientEvent.LASER_GAME_STOP_GAME)
    public async onStopGame(gameData: LaserGameData, shouldRes: boolean) {
        const ped = PlayerPedId();
        if (IsEntityDead(ped) && shouldRes) {
            const pos = GetEntityCoords(ped);
            const revivePosition = [pos[0], pos[1], pos[2], GetEntityHeading(ped)] as Vector4;

            NetworkResurrectLocalPlayer(
                revivePosition[0],
                revivePosition[1],
                revivePosition[2],
                revivePosition[3],
                1,
                false
            );
            SetEntityHealth(ped, GetPedMaxHealth(ped));

            TriggerEvent(ClientEvent.LSMC_SET_DEATH, false);
            await wait(1000);
            this.voipService.mutePlayer(false);
        }
        this.game.state = LaserGameStateEnum.ENDED;
        if (this.startGameHealth) {
            SetEntityHealth(ped, this.startGameHealth);
        }
        this.startGameHealth = null;

        FreezeEntityPosition(ped, true);

        const weapon = GetHashKey(WeaponName.RAYCARBINE);
        RemoveWeaponFromPed(ped, weapon);

        this.playerService.updateState({ isInGame: false });
        TriggerEvent(ClientEvent.PLAYER_HEALTH_SET_NUTRITION_DISABLED, false);

        this.nuiDispatch.dispatch('laser_game', 'SetStart', null);
        this.nuiDispatch.dispatch('laser_game', 'SetScores', gameData?.scores);
        if (gameData) {
            let end = 'TERMINÉ';
            if (gameData?.scores) {
                const [id] = Object.entries(gameData.scores).sort(([nameA, scoreA], [nameB, scoreB]) => {
                    if (scoreA < scoreB) {
                        return 1;
                    }

                    if (scoreA > scoreB) {
                        return -1;
                    }

                    return nameA.localeCompare(nameB);
                })[0];

                if (gameData.type === LaserGameTypeEnum.FFA) {
                    end = `${gameData.players[id].name} a gagné la partie!`;
                } else {
                    end = `L'${LaserGameTeam[id]} a gagné la partie!`;
                }
            }
            this.nuiDispatch.dispatch('laser_game', 'SetCountDown', end);
            PlaySoundFrontend(-1, 'Finish_Default', 'DLC_AW_Frontend_Sounds', false);
            await wait(10_000);
            this.nuiDispatch.dispatch('laser_game', 'SetCountDown', null);
        }

        this.playerService.updateState({ isInGameHub: false });
        await wait(500);

        await this.weaponService.clear();
        this.weaponService.setDisabled('laser-game', false);
        TriggerServerEvent(ServerEvent.LASER_GAME_TP_OUT_HUB);

        this.game = null;
        if (gameData === null) return;
        await wait(5_000);
        this.nuiDispatch.dispatch('laser_game', 'SetGameData', null);
        this.nuiDispatch.dispatch('laser_game', 'SetCurrentPlayer', null);
    }

    @OnEvent(ClientEvent.LASER_GAME_SYNC_TEAM)
    public async onLaserGameSyncTeam(team: LaserGameTeamEnum | null) {
        this.team = team;
    }

    @OnEvent(ClientEvent.LASER_GAME_ADDED_IN_GAME)
    public async onLaserGameSyncGame(game: LaserGameClient) {
        this.game = game;
    }

    @OnEvent(ClientEvent.LASER_GAME_SYNC_SCORES)
    public async onLaserGameSyncScores(scores: Record<any, number>) {
        this.nuiDispatch.dispatch('laser_game', 'SetScores', scores);
    }

    @OnEvent(ClientEvent.LASER_GAME_DEATH_IN_HUB)
    public async onLaserGameDeathInHub() {
        const player = this.playerService.getPlayer();

        this.playerService.updateState({ isInGameHub: false });
        await wait(500);
        if (player.citizenid !== this.game.creator) {
            TriggerServerEvent(ServerEvent.LASER_GAME_KICK_ON_DEATH, this.game.creator);
        } else {
            TriggerServerEvent(ServerEvent.LASER_GAME_TP_OUT_HUB);
        }
    }

    @OnEvent(ClientEvent.LASER_GAME_SYNC_PLAYER_MENU)
    public async onLaserGameSyncPlayerForMenu(players: Record<string, LaserGamePlayerData> | null) {
        if (players === null) return;
        if (this.nuiMenu.getOpened() !== MenuType.LaserGameManage) return;

        this.nuiDispatch.dispatch('laser_game_manage', 'SetPlayerData', {
            players: players,
        });
    }

    @OnEvent(ClientEvent.LASER_GAME_REQUEST_JOIN)
    public async requestEnter(citizenId: string) {
        let player = this.playerService.getPlayer();
        if (this.hasGameRequest || player.metadata.isdead) return;

        this.hasGameRequest = true;
        const [confirmed] = await this.notifier.notifyWithConfirm(
            `Vous êtes invité à rejoindre une partie de laser game.~n~Faites ~g~Y~s~ pour l'accepter ou ~r~N~s~ pour la refuser`
        );

        player = this.playerService.getPlayer();
        if (confirmed && !player.metadata.isdead) {
            if (player.metadata.plaster?.length) {
                this.notifier.notify('Regarde ton état, tu devrais attendre de ne plus avoir de platres.', 'error');

                return;
            }
            if (GetEntityHealth(PlayerPedId()) <= CRITICAL_HEALTH) {
                this.notifier.notify(
                    'Regarde ton état, tu devrais plutôt te faire soigner avant de participer.',
                    'error'
                );

                return;
            }
            this.playerService.updateState({ isInGameHub: true });
            await wait(500);
            await this.weaponService.clear();
            await this.playerPositionProvider.removeProps();

            TriggerServerEvent(ServerEvent.LASER_GAME_ADD_PLAYER, citizenId);
        }
        this.hasGameRequest = false;
    }

    @Tick(10 * TickInterval.EVERY_SECOND)
    public async ensureWeaponLoop() {
        if (!this.isGameRunning() || this.starting) return;

        const player = PlayerPedId();
        const weapon = GetHashKey(WeaponName.RAYCARBINE);
        const weaponAmmo = 9999;

        const [, hash] = GetCurrentPedWeapon(player, false);
        if (hash !== GetHashKey(WeaponName.UNARMED)) return;

        GiveWeaponToPed(player, weapon, weaponAmmo, false, true);
        SetPedAmmo(player, weapon, weaponAmmo);
        SetCurrentPedWeapon(player, weapon, true);
    }
}
