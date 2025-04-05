import { Provider } from '@core/decorators/provider';
import { Command } from '@public/core/decorators/command';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { AdminMenuInteractiveProvider } from '@public/server/admin/admin.menu.interactive.provider';
import { BankStatementsService } from '@public/server/bank/bank.statements.service';
import { PriceService } from '@public/server/bank/price.service';
import { Notifier } from '@public/server/notifier';
import { PlayerAppearanceService } from '@public/server/player/player.appearance.service';
import { PlayerMoneyService } from '@public/server/player/player.money.service';
import { PlayerPositionProvider } from '@public/server/player/player.position.provider';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import {
    LaserGameAdminInfo,
    LaserGameClient,
    LaserGameColorEnum,
    LaserGameData,
    LaserGameDefaultDuration,
    LaserGameFFASpawnPosition,
    LaserGameInfo,
    LaserGameInPosition,
    LaserGameMaximalDuration,
    LaserGameMaximalPlayer,
    LaserGameMinimalDuration,
    LaserGameMinimalPlayer,
    LaserGameOutPosition,
    LaserGamePlayerData,
    LaserGamePrice,
    LaserGameStateEnum,
    LaserGameTeamEnum,
    LaserGameTeamSpawnPosition,
    LaserGameTypeEnum,
    TeamColorClotheSet,
} from '@public/shared/games/laser';
import { CRITICAL_HEALTH } from '@public/shared/health';
import { isStaff, PlayerData } from '@public/shared/player';
import { Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { TaxType } from '@public/shared/tax';

@Provider()
export class LaserGameProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(PlayerAppearanceService)
    private playerAppearanceService: PlayerAppearanceService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(PriceService)
    private priceService: PriceService;

    @Inject(BankStatementsService)
    private bankStatementsService: BankStatementsService;

    @Inject(AdminMenuInteractiveProvider)
    private adminMenuInteractiveProvider: AdminMenuInteractiveProvider;

    games: Record<string, LaserGameInfo> = {};

    @Rpc(RpcServerEvent.LASER_GAME_GET_INFO_AS_STAFF)
    public async onLaserGameAsStaff(source: number): Promise<Record<string, LaserGameAdminInfo> | null> {
        const player = this.playerService.getPlayer(source);
        if (!player || !isStaff(player)) {
            return null;
        }

        const gamesAsStaff: Record<string, LaserGameAdminInfo> = {};
        for (const game of Object.values(this.games)) {
            const players = {};
            for (const citizenId of Object.keys(game.players)) {
                const playerData = this.playerService.getPlayerByCitizenId(citizenId);
                players[citizenId] = this.adminMenuInteractiveProvider.getPlayer(playerData);
            }
            gamesAsStaff[game.creator] = {
                ...game,
                players: players,
            };
        }
        return gamesAsStaff;
    }

    @Rpc(RpcServerEvent.LASER_GAME_GET_AS_CLIENT)
    public async onLaserGameAsClient(source: number): Promise<LaserGameClient | null> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const game = Object.values(this.games).find(game => game.players[player.citizenid]) || null;
        return game ? this.getGameAsClientData(game) : null;
    }

    @Rpc(RpcServerEvent.LASER_GAME_GET_BUCKET)
    public async onLaserGameGetBucket(source: number): Promise<number | null> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const game = Object.values(this.games).find(game => game.players[player.citizenid]) || null;
        if (!game) return;

        const playerBucket = GetPlayerRoutingBucket(String(player.source));

        if (playerBucket === game.bucket) {
            return;
        }

        return game.bucket;
    }

    @Rpc(RpcServerEvent.LASER_GAME_CREATE)
    public async onLaserGameCreate(source: number, gameType: LaserGameTypeEnum): Promise<LaserGameClient | null> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (player.metadata.plaster?.length || GetEntityHealth(GetPlayerPed(player.source)) <= CRITICAL_HEALTH) {
            this.notifier.notify(
                player.source,
                'Regarde son état, il devrait plutôt se faire soigner avant de vouloir jouer.',
                'error'
            );

            return;
        }

        if (this.isPlayerRegisterInAnyGame(player.citizenid)) {
            this.notifier.notify(source, 'Vous avez déjà enregistré pour une partie', 'error');

            return null;
        }

        const priceWithTaxes = await this.priceService.getPrice(LaserGamePrice, TaxType.SERVICE);
        if (!(await this.playerMoneyService.buy(source, LaserGamePrice, TaxType.SERVICE))) {
            this.notifier.notify(
                source,
                `Tu comptes jouer gratuitement ? L'electricité n'est pas gratuite, reviens avec ~r~$${priceWithTaxes}~s~!`,
                'error'
            );
            return;
        }
        const account = await this.playerService.getBankAccountFromCitizenId(player.citizenid);
        if (account) {
            await this.bankStatementsService.createStatement(account, '', priceWithTaxes, 'Laser game');
        }

        const team1Color = this.getRandomColor();
        const scores =
            gameType === LaserGameTypeEnum.FFA
                ? {
                      [player.citizenid]: 0,
                  }
                : {
                      [LaserGameTeamEnum.A]: 0,
                      [LaserGameTeamEnum.B]: 0,
                  };
        this.games[player.citizenid] = {
            type: gameType,
            state: LaserGameStateEnum.CREATED,
            createdAt: Date.now(),
            startedAt: null,
            creator: player.citizenid,
            players: {
                [player.citizenid]: this.createPlayerAsData(player.citizenid),
            },
            teams: {
                [LaserGameTeamEnum.A]: team1Color,
                [LaserGameTeamEnum.B]: this.getRandomColor(team1Color),
            },
            scores: scores,
            bucket: this.getBucket(),
            gameDuration: LaserGameDefaultDuration,
            scoreGoal: 0,
        };

        this.notifier.notify(
            source,
            'La partie a été créée. Tu es le maître de la partie, tu peux à présent inviter les personnes que tu souhaites.',
            'success',
            15000
        );
        this.notifier.notify(
            source,
            'Un ordinateur est accessible dans le hub du laser game afin de gérer la partie.',
            'success',
            15000
        );
        return this.getGameAsClientData(this.games[player.citizenid]);
    }

    @Rpc(RpcServerEvent.LASER_GAME_GET_DATA)
    public async onLaserGameGetData(source: number): Promise<LaserGameData | null> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const game = this.games[player.citizenid];
        if (!this.isGameInCreateState(game)) {
            return;
        }

        return this.getGameAsGameData(game);
    }

    @Rpc(RpcServerEvent.LASER_GAME_ACTION_PLAYER)
    public async onLaserGameActionPlayer(
        source: number,
        { action, targetCitizenId }
    ): Promise<Array<LaserGamePlayerData> | null> {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayerByCitizenId(targetCitizenId);
        if (!player) {
            return;
        }

        const game = this.games[player.citizenid];
        if (!this.isGameInCreateState(game) && !this.isPlayerRegisterInCurrentGame(game, targetCitizenId)) {
            return;
        }

        if (action == 'kick' && targetCitizenId !== player.citizenid) {
            this.removePlayerFromCurrentGame(player.citizenid, targetCitizenId, null);
        } else if (action == 'team1') {
            game.players[targetCitizenId].team = LaserGameTeamEnum.A;
            if (target) {
                this.setPlayerCloth(target, game);
                TriggerClientEvent(ClientEvent.LASER_GAME_SYNC_TEAM, target.source, game.players[targetCitizenId].team);
            }
        } else if (action == 'team2') {
            game.players[targetCitizenId].team = LaserGameTeamEnum.B;
            if (target) {
                this.setPlayerCloth(target, game);
                TriggerClientEvent(ClientEvent.LASER_GAME_SYNC_TEAM, target.source, game.players[targetCitizenId].team);
            }
        } else if (action == 'noteam') {
            game.players[targetCitizenId].team = null;
            if (target) {
                this.setPlayerCloth(target, game);
                TriggerClientEvent(ClientEvent.LASER_GAME_SYNC_TEAM, target.source, game.players[targetCitizenId].team);
            }
        }

        return Object.values(game.players);
    }

    @Rpc(RpcServerEvent.LASER_GAME_GET_PLAYER_NAME)
    public async onLaserGameAttackerName(
        source: number,
        citizenId: string,
        playerServerId: number
    ): Promise<string | null> {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(playerServerId);

        if (!target) {
            return null;
        }

        if (player) {
            TriggerClientEvent(
                ClientEvent.LASER_GAME_ADD_KILL,
                target.source,
                this.games[citizenId]?.players[player.citizenid]?.name || null
            );
        }
        return this.games[citizenId]?.players[target.citizenid]?.name || null;
    }

    @OnEvent(ServerEvent.LASER_GAME_KICK_ON_DEATH)
    public onKickOnDeath(source: number, citizenId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const game = this.games[citizenId];
        if (!game) return;

        const gameOwner = this.playerService.getPlayerByCitizenId(game.creator);
        this.removePlayerFromCurrentGame(gameOwner.citizenid, player.citizenid, null);
        TriggerClientEvent(ClientEvent.LASER_GAME_SYNC_PLAYER_MENU, gameOwner.source, Object.values(game.players));
    }

    @OnEvent(ServerEvent.LASER_GAME_NOTIFY_ADD_PLAYER)
    public onNotifyAddPlayer(source: number, playerServerId: number): Promise<void> {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(playerServerId);
        if (!player || !target) {
            return;
        }

        TriggerClientEvent(ClientEvent.LASER_GAME_REQUEST_JOIN, target.source, player.citizenid);
    }

    @OnEvent(ServerEvent.LASER_GAME_ADD_PLAYER)
    public onAddPlayer(source: number, citizenId: string): Promise<void> {
        const player = this.playerService.getPlayerByCitizenId(citizenId);
        const target = this.playerService.getPlayer(source);
        if (!player || !target) {
            return;
        }

        if (target.metadata.plaster?.length) {
            this.notifier.notify(
                player.source,
                'Regarde son état, il devrait plutôt attendre de ne plus avoir de platre.',
                'error'
            );

            return;
        }
        if (GetEntityHealth(GetPlayerPed(target.source)) <= CRITICAL_HEALTH) {
            this.notifier.notify(
                player.source,
                'Regarde son état, il devrait plutôt se faire soigner avant de participer.',
                'error'
            );

            return;
        }

        if (!this.isGameInCreateState(this.games[player.citizenid])) {
            return;
        }

        if (this.isPlayerRegisterInAnyGame(target.citizenid)) {
            this.notifier.notify(player.source, 'La personne participe déjà à une partie.', 'error');

            return;
        }

        this.games[player.citizenid].players[target.citizenid] = this.createPlayerAsData(target.citizenid);
        if (this.games[player.citizenid].type === LaserGameTypeEnum.FFA) {
            this.games[player.citizenid].scores[target.citizenid] = 0;
        }
        this.teleportInLazerGameHub(target.source, player.citizenid);
        TriggerClientEvent(
            ClientEvent.LASER_GAME_ADDED_IN_GAME,
            target.source,
            this.getGameAsClientData(this.games[player.citizenid])
        );
        this.setPlayerCloth(target, this.games[player.citizenid]);
        this.notifier.notify(player.source, 'La personne est enregistré pour la partie.', 'success');
    }
    @OnEvent(ServerEvent.LASER_GAME_REJOIN_GAME)
    public onrejoinGame(source: number): void {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const game = Object.values(this.games).find(game => game.players[player.citizenid]) || null;
        if (!game) return;

        SetPlayerRoutingBucket(String(source), game.bucket);
        TriggerClientEvent(
            ClientEvent.LASER_GAME_REJOIN_GAME,
            player.source,
            this.getGameAsGameData(game),
            Date.now() - game.startedAt
        );
    }

    @OnEvent(ServerEvent.LASER_GAME_START)
    public onStartGame(source: number): void {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const game = this.games[player.citizenid];
        if (!this.isGameInCreateState(game)) {
            return;
        }

        if (!game.scoreGoal) {
            this.notifier.notify(
                source,
                'La partie ne peut démarrer sans avoir ajouter un score de victoire.',
                'error'
            );
            return;
        }

        if (game.gameDuration < LaserGameMinimalDuration || game.gameDuration > LaserGameMaximalDuration) {
            this.notifier.notify(source, "Une partie ne peut durer qu'entre 10 et 60 minutes.", 'error');
            return;
        }

        if (!this.enoughPlayerInGame(game) || this.tooMuchPlayerInTeam(game)) {
            return;
        }

        if (
            game.type !== LaserGameTypeEnum.FFA &&
            game.teams[LaserGameTeamEnum.A] === game.teams[LaserGameTeamEnum.B]
        ) {
            this.notifier.notify(source, 'Les deux équipes ne peuvent pas être de la même couleur.', 'error');
            return;
        }

        game.state = LaserGameStateEnum.STARTED;
        const positions: Partial<Record<LaserGameTeamEnum, Array<Vector4>>> =
            game.type === LaserGameTypeEnum.FFA ? this.getRandomPositionFfaList() : this.getRandomPositionTeamList();

        const n = {
            [LaserGameTeamEnum.A]: 0,
            [LaserGameTeamEnum.B]: 0,
        };
        for (const citizenId of Object.keys(game.players)) {
            const playerInGame = this.playerService.getPlayerByCitizenId(citizenId);

            let position: Vector4;
            if (game.type === LaserGameTypeEnum.FFA) {
                position = positions[LaserGameTeamEnum.A][n[LaserGameTeamEnum.A]];
                n[LaserGameTeamEnum.A]++;
            } else {
                if (game.players[citizenId].team === null) {
                    game.players[citizenId].team = this.getRandomTeam(game);
                    this.setPlayerCloth(playerInGame, game);
                }
                position = positions[game.players[citizenId].team][n[game.players[citizenId].team]];
                n[game.players[citizenId].team]++;
            }

            this.playerPositionProvider.teleportToCoords(playerInGame.source, position);
        }

        const gameData = this.getGameAsGameData(game);
        for (const citizenId of Object.keys(game.players)) {
            const playerInGame = this.playerService.getPlayerByCitizenId(citizenId);
            TriggerClientEvent(ClientEvent.LASER_GAME_START_GAME, playerInGame.source, gameData);
        }

        game.startedAt = Date.now() + 8_000;
    }

    @OnEvent(ServerEvent.LASER_GAME_INCR_SCORE)
    public onIncrementScore(source: number, owner: string, attackerId: number, victimId: number): void {
        const game = this.games[owner];
        if (this.isGameAlreadyEnded(game)) return;

        const attacker = this.playerService.getPlayer(attackerId);
        const victim = this.playerService.getPlayer(victimId);
        if (!victim || !attacker) return;

        if (game.type === LaserGameTypeEnum.FFA) {
            game.scores[attacker.citizenid] ??= 0;
            game.scores[attacker.citizenid] += 1;
        } else {
            let team: LaserGameTeamEnum;
            if (game.players[attacker.citizenid].team !== game.players[victim.citizenid].team) {
                team = game.players[attacker.citizenid].team;
            } else {
                team =
                    game.players[attacker.citizenid].team === LaserGameTeamEnum.A
                        ? LaserGameTeamEnum.B
                        : LaserGameTeamEnum.A;
            }

            game.scores[team] ??= 0;
            game.scores[team] += 1;
        }

        if (this.finalScoreReached(game)) {
            this.endGame(game, true, true);
        } else {
            this.syncScoreToPlayers(game);
        }
    }

    @OnEvent(ServerEvent.LASER_GAME_LEAVE_GAME)
    public onLeave(source: number, citizenId: string): void {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!this.isGameInCreateState(this.games[citizenId])) {
            return;
        }

        this.removePlayerFromCurrentGame(citizenId, player.citizenid, null);
    }

    @OnEvent(ServerEvent.LASER_GAME_CANCEL)
    public onCancel(source: number): void {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!this.isGameInCreateState(this.games[player.citizenid])) {
            return;
        }

        this.endGame(this.games[player.citizenid], false, false);
    }

    @OnEvent(ServerEvent.LASER_GAME_SET_PLAYER_COLOR)
    public onSetPlayerColor(source: number, citizenId: string, color: LaserGameColorEnum): void {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayerByCitizenId(citizenId);
        if (!player || !target) {
            return;
        }

        this.games[player.citizenid].players[citizenId].color = color;
        this.setPlayerCloth(target, this.games[player.citizenid]);
    }

    @OnEvent(ServerEvent.LASER_GAME_SET_TEAM_COLOR)
    public onSetTeamColor(source: number, team: LaserGameTeamEnum, color: LaserGameColorEnum): void {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        this.games[player.citizenid].teams[team] = color;
        const game = this.games[player.citizenid];
        for (const gamePlayer of Object.values(game.players)) {
            if (gamePlayer.team === team) {
                const target = this.playerService.getPlayerByCitizenId(gamePlayer.citizenId);
                this.setPlayerCloth(target, this.games[player.citizenid]);
            }
        }
    }

    @OnEvent(ServerEvent.LASER_GAME_SET_SCORE_GOAL)
    public onSetScoreGoal(source: number, scoreGoal: number): void {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        this.games[player.citizenid].scoreGoal = scoreGoal;
    }

    @OnEvent(ServerEvent.LASER_GAME_SET_GAME_DURATION)
    public onSetDuration(source: number, duration: number): void {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        this.games[player.citizenid].gameDuration = duration;
    }

    @OnEvent(ServerEvent.LASER_GAME_TP_IN_HUB)
    private teleportInLazerGameHub(source: number, citizenId: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        SetPlayerRoutingBucket(String(source), this.games[citizenId].bucket);
        this.playerPositionProvider.teleportToCoords(source, LaserGameInPosition);
        this.setPlayerCloth(player, this.games[citizenId]);
    }

    @OnEvent(ServerEvent.LASER_GAME_TP_OUT_HUB)
    private teleportOutLazerGameHub(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        this.playerPositionProvider.teleportToCoords(source, LaserGameOutPosition);
        this.setPlayerCloth(player, null, false);
        SetPlayerRoutingBucket(String(source), 0);
    }

    private isPlayerRegisterInAnyGame(citizenId: string) {
        for (const game of Object.values(this.games)) {
            if (game.players[citizenId]) {
                return true;
            }
        }

        return false;
    }

    private isPlayerRegisterInCurrentGame(game: LaserGameInfo, targetCitizenId: string) {
        return game.players[targetCitizenId];
    }

    private enoughPlayerInGame(game: LaserGameInfo) {
        const nPlayer = Object.keys(game.players).length;
        if (nPlayer < LaserGameMinimalPlayer[game.type]) {
            this.notifier.notify(source, "Il n'y a pas assez de joueurs dans la partie", 'error');
            return false;
        } else if (nPlayer > LaserGameMaximalPlayer[game.type]) {
            this.notifier.notify(source, 'Il y a trop de joueurs dans la partie', 'error');
            return false;
        }

        return true;
    }

    private tooMuchPlayerInTeam(game: LaserGameInfo) {
        if (game.type === LaserGameTypeEnum.FFA) {
            return false;
        }

        const teamAPlayers = Object.values(game.players).filter(player => player.team === LaserGameTeamEnum.A);
        const teamBPlayers = Object.values(game.players).filter(player => player.team === LaserGameTeamEnum.B);
        const maxTeamSize = LaserGameMaximalPlayer[game.type] / 2;
        if (teamAPlayers.length > maxTeamSize) {
            this.notifier.notify(source, "Il y a trop de joueurs dans l'équipe A", 'error');
            return true;
        } else if (teamBPlayers.length > maxTeamSize) {
            this.notifier.notify(source, "Il y a trop de joueurs dans l'équipe B", 'error');
            return true;
        }

        return false;
    }

    private getRandomTeam(game: LaserGameInfo) {
        const teamAPlayers = Object.values(game.players).filter(player => player.team === LaserGameTeamEnum.A);
        const teamBPlayers = Object.values(game.players).filter(player => player.team === LaserGameTeamEnum.B);

        const availableTeam: Array<LaserGameTeamEnum> = [];

        const maxTeamSize = LaserGameMaximalPlayer[game.type] / 2;
        if (teamAPlayers.length < maxTeamSize) {
            availableTeam.push(LaserGameTeamEnum.A);
        }
        if (teamBPlayers.length < maxTeamSize) {
            availableTeam.push(LaserGameTeamEnum.B);
        }

        return availableTeam[Math.floor(Math.random() * availableTeam.length)];
    }

    private isGameInCreateState(game: LaserGameInfo): boolean {
        if (game && game.state !== LaserGameStateEnum.CREATED) {
            this.notifier.notify(source, 'Aucune partie de disponible.', 'error');

            return false;
        }

        return true;
    }

    private isGameRunning(game: LaserGameInfo): boolean {
        return game && game.state == LaserGameStateEnum.STARTED;
    }

    private isGameAlreadyEnded(game: LaserGameInfo): boolean {
        return !this.isGameRunning(game) || this.finalScoreReached(game);
    }

    private finalScoreReached(game: LaserGameInfo): boolean {
        if (game.type === LaserGameTypeEnum.FFA) {
            return Boolean(Object.values(game.scores).find(score => score >= game.scoreGoal));
        } else {
            return (
                game.scores[LaserGameTeamEnum.A] >= game.scoreGoal || game.scores[LaserGameTeamEnum.B] >= game.scoreGoal
            );
        }
    }

    private getGameAsClientData(game: LaserGameInfo): LaserGameClient {
        return {
            type: game.type,
            state: game.state,
            creator: game.creator,
        };
    }

    private getGameAsGameData(game: LaserGameInfo): LaserGameData {
        return {
            type: game.type,
            state: game.state,
            creator: game.creator,
            players: game.players,
            teams: game.teams,
            scoreGoal: game.scoreGoal,
            gameDuration: game.gameDuration,
            scores: game.scores,
        };
    }

    private getBucket(): number {
        let bucket = 1;
        let loop = true;
        while (loop) {
            loop = false;
            for (const game of Object.values(this.games)) {
                if (game.bucket == bucket) {
                    loop = true;
                    bucket += 1;
                    break;
                }
            }
        }

        return bucket;
    }

    private createPlayerAsData(citizenId: string): LaserGamePlayerData {
        const player = this.playerService.getPlayerByCitizenId(citizenId);

        return {
            citizenId: citizenId,
            name: `${player.charinfo.firstname} ${player.charinfo.lastname.charAt(0).toLocaleUpperCase()}.`,
            color: this.getRandomColor(),
            team: null,
        };
    }

    private getRandomColor(exception?: LaserGameColorEnum) {
        const enumValues = Object.keys(LaserGameColorEnum);

        let color: LaserGameColorEnum = null;
        do {
            const randomIndex = Math.floor(Math.random() * enumValues.length);
            color = LaserGameColorEnum[enumValues[randomIndex]];
        } while (exception && color === exception);

        return color;
    }

    private async setPlayerCloth(player: PlayerData, game: LaserGameInfo | null, showHelmet: boolean = true) {
        player.cloth_config.Config.ShowHelmet = showHelmet;

        let color: LaserGameColorEnum = null;
        if (game) {
            if (game.type != LaserGameTypeEnum.FFA && game.players[player.citizenid].team != null) {
                color = game.teams[game.players[player.citizenid].team];
            } else {
                color = game.players[player.citizenid].color;
            }
        }

        player.cloth_config.TemporaryClothSet = TeamColorClotheSet[player.skin.Model.Hash]?.[color] || null;
        await this.playerAppearanceService.setClothConfig(player.source, player.cloth_config, false);
    }

    private getRandomPositionFfaList(): Partial<Record<LaserGameTeamEnum, Array<Vector4>>> {
        return { [LaserGameTeamEnum.A]: this.getRandomPositionList(LaserGameFFASpawnPosition) };
    }

    private getRandomPositionTeamList(): Record<LaserGameTeamEnum, Array<Vector4>> {
        return {
            [LaserGameTeamEnum.A]: this.getRandomPositionList(LaserGameTeamSpawnPosition[LaserGameTeamEnum.A]),
            [LaserGameTeamEnum.B]: this.getRandomPositionList(LaserGameTeamSpawnPosition[LaserGameTeamEnum.B]),
        };
    }

    private getRandomPositionList(positions: Array<Vector4>): Array<Vector4> {
        return positions
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }

    private removePlayerFromCurrentGame(
        citizenId: string,
        targetCitizenId: string,
        gameData: LaserGameData | null,
        shouldRes: boolean = false
    ) {
        const target = this.playerService.getPlayerByCitizenId(targetCitizenId);
        if (!target) {
            return;
        }

        if (citizenId !== targetCitizenId && gameData === null) {
            delete this.games[citizenId].players[targetCitizenId];
            delete this.games[citizenId].scores[targetCitizenId];
        }
        TriggerClientEvent(ClientEvent.LASER_GAME_STOP_GAME, target.source, gameData, shouldRes);
    }

    private async endGame(game: LaserGameInfo, keepDisplay: boolean = true, shouldRes: boolean = false) {
        game.state = LaserGameStateEnum.ENDED;
        const gameData = this.getGameAsGameData(game);
        for (const citizenId of Object.keys(game.players)) {
            this.removePlayerFromCurrentGame(game.creator, citizenId, keepDisplay ? gameData : null, shouldRes);
        }

        await wait(1000);
        delete this.games[game.creator];
    }

    private syncScoreToPlayers(game: LaserGameInfo) {
        for (const citizenId of Object.keys(game.players)) {
            const target = this.playerService.getPlayerByCitizenId(citizenId);
            TriggerClientEvent(ClientEvent.LASER_GAME_SYNC_SCORES, target.source, game.scores);
        }
    }

    @Tick(TickInterval.EVERY_SECOND * 10)
    async processing() {
        for (const game of Object.values(this.games)) {
            if (this.isGameRunning(game)) {
                if (game.startedAt + game.gameDuration < Date.now()) {
                    this.endGame(game, true, true);
                }
            }
        }
    }

    @Command('reset-all-laser-games', {
        role: ['admin', 'staff'],
        description: 'Reset all Laser-Game games',
    })
    public async triggerResetAllGames() {
        for (const game of Object.values(this.games)) {
            this.endGame(game, false, true);
        }
    }

    @Command('stop-laser-game', {
        role: ['admin', 'staff'],
        description: 'Stop current laser game',
    })
    public async stopLaserGame(source: number) {
        const player = this.playerService.getPlayer(source);
        const game = Object.values(this.games).find(game => game.players[player.citizenid]);

        if (!game) return;

        this.endGame(game, true, true);
    }
}
