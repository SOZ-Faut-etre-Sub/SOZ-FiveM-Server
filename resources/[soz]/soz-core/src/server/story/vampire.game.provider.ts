import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { PlayerData } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';
import PCancelable from 'p-cancelable';
import { Gauge } from 'prom-client';

import { On, Once, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { Logger } from '../../core/logger';
import { player } from '../../nui/models/player';
import { HalloweenSubMenuState } from '../../shared/admin/admin';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { Feature } from '../../shared/features';
import {
    VampireGameClientState,
    VampireGameCollection,
    VampireGameEnemyRoles,
    VampireGameLabel,
    VampireGameObjectiveCollectionPart1,
    VampireGameObjectivePart2,
    VampireGameObjectiveProps,
    VampireGameObjectiveTypePart2,
    VampireGameRole,
    VampireGameServerState,
    VampireRespawnPoints,
} from '../../shared/halloween';
import { ProgressAnimation } from '../../shared/progress';
import { getRandomKeyWeighted } from '../../shared/random';
import { RpcServerEvent } from '../../shared/rpc';
import { FeatureProvider } from '../feature/feature.provider';
import { LSMCDeathProvider } from '../job/lsmc/lsmc.death.provider';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { PlayerStateService } from '../player/player.state.service';
import { ProgressService } from '../player/progress.service';
import { ServerStateService } from '../server.state.service';
import { Store } from '../store/store';
import { NpcProvider } from '../utils/npc.provider';

const OBJECTIVE_Y_LIMITATION = [-3600, 1200];

@Provider()
export class VampireGameProvider {
    @Inject(PermissionService)
    private readonly permissionService: PermissionService;

    @Inject(ServerStateService)
    private readonly serverStateService: ServerStateService;

    @Inject(ProgressService)
    private readonly progressService: ProgressService;

    @Inject(PlayerStateService)
    private readonly playerStateService: PlayerStateService;

    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject('Store')
    private readonly store: Store;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(Logger)
    private readonly logger: Logger;

    @Inject(NpcProvider)
    private readonly npcProvider: NpcProvider;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(LSMCDeathProvider)
    private lsmcDeathProvider: LSMCDeathProvider;

    private gameDuration = 90; // minutes
    private autoRespawnDuration = 20; // seconds

    private staffEnabled = {
        admin: true,
        staff: true,
        gamemaster: true,
        helper: true,
    };

    private roleMaxNumber: Record<VampireGameRole, number> = {
        [VampireGameRole.Vampire]: 20,
        [VampireGameRole.Ghoul]: 0,
        [VampireGameRole.Hunter]: 10,
        [VampireGameRole.Mortal]: 60,
        [VampireGameRole.Squire]: 5,
        [VampireGameRole.Alchemist]: 5,
    };
    private mortalObjectivePart1: Record<Exclude<VampireGameCollection, 'player'>, number> = {
        prop_streetlight: 30,
        prop_fire_hydrant: 30,
        prop_gas_pump: 10,
        prop_elecbox: 30,
    };
    private mortalObjectivePart2: Record<VampireGameObjectiveTypePart2, number> = {
        battery: 15,
        dam: 15,
        vampire: 20,
        weapon: 15,
    };
    private mortalObjectivePart3Duration = 10; // minutes

    private gameState: VampireGameServerState = {
        started: false,
        timer: null,

        playerRoles: new Map<string, VampireGameRole>(),

        mortalObjectivePart1: new Map<VampireGameCollection, Vector3[]>(),
        mortalObjectivePart2: {
            battery: { finished: false, players: new Set<string>() },
            dam: { finished: false, players: new Set<string>() },
            vampire: { finished: false, players: new Set<string>() },
            weapon: { finished: false, players: new Set<string>() },
        },
        mortalObjectivePart3: null,

        autoRespawn: new Map<string, PCancelable<void>>(),

        gauges: {
            [VampireGameRole.Vampire]: new Gauge({
                name: 'soz_halloween_vampire_count',
                help: 'Number of Vampire in halloween game',
            }),
            [VampireGameRole.Ghoul]: new Gauge({
                name: 'soz_halloween_ghoul_count',
                help: 'Number of Ghoul in halloween game',
            }),
            [VampireGameRole.Hunter]: new Gauge({
                name: 'soz_halloween_hunter_count',
                help: 'Number of Hunter in halloween game',
            }),
            [VampireGameRole.Mortal]: new Gauge({
                name: 'soz_halloween_mortal_count',
                help: 'Number of Mortal in halloween game',
            }),
            [VampireGameRole.Squire]: new Gauge({
                name: 'soz_halloween_squire_count',
                help: 'Number of Squire in halloween game',
            }),
            [VampireGameRole.Alchemist]: new Gauge({
                name: 'soz_halloween_alchemist_count',
                help: 'Number of Alchemist in halloween game',
            }),
        },
    };

    @Once()
    onStart() {
        VampireRespawnPoints.forEach(location => {
            this.playerPositionProvider.registerZone(`halloween_vampire_respawn_${location.id}`, [
                ...location.coords,
                0,
            ]);
        });
    }

    @On('QBCore:Server:PlayerLoaded', false)
    async onPlayerLoaded(data: any) {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.started) return;

        const player = data.PlayerData as PlayerData;

        await this.newPlayer(player);
    }

    @On('QBCore:Server:PlayerUnload', false)
    onPlayerUnload(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.started) return;

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const role = this.gameState.playerRoles.get(player.citizenid);
        if (!role) return;

        this.gameState.gauges[role].dec();
        this.gameState.playerRoles.delete(player.citizenid);
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_START_GAME)
    public async launchGameEvent(source: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        if (this.gameState.started) {
            this.notifier.error(source, 'Le jeu est déjà en cours');
            return;
        }

        this.createObjectivePart1();

        for (const player of this.serverStateService.getPlayers()) {
            await this.newPlayer(player);
        }

        await wait(5000);

        this.npcProvider.disableNPC(true);

        this.store.dispatch.global.update({
            halloween: 'full',
            blackout: true,
            blackoutLevel: 3,
            blackoutOverride: true,
        });
        TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/laugh_evil', 0.8);

        await wait(2000);

        this.gameState.timer = setTimeout(
            () => {
                this.notifier.notify(
                    -1,
                    'Les Vampires ont gagné ce scénario ! Le tournage est terminé, l’ensemble de l’île peut retourner à ses occupations, bravo pour votre prestation.',
                    'info'
                );
                this.stopGame();
            },
            this.gameDuration * 60 * 1000
        );

        this.gameState.started = true;
        TriggerLatentClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, -1, 1024, {
            started: this.gameState.started,
        });

        this.notifier.notify(source, 'Le jeu a été lancé', 'info');
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_STOP_GAME)
    public stopGameEvent(source: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        if (!this.gameState.started) {
            this.notifier.error(source, "Le jeu n'est pas en cours");
            return;
        }

        this.notifier.notify(
            -1,
            'Le tournage est terminé, l’ensemble de l’île peut retourner à ses occupations.',
            'info'
        );
        this.stopGame();
        this.notifier.notify(source, 'Le jeu a été arrêté', 'info');
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_TAKE_OBJECTIVE_PART1)
    public async takeObjectivePart1(source: number, collection: VampireGameCollection, objective: Vector3) {
        if (!this.gameState.started) return;

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (VampireGameEnemyRoles.includes(this.gameState.playerRoles.get(player.citizenid))) {
            this.notifier.error(source, "Vous n'avez pas le droit de faire cette action");
            return;
        }

        const objectiveIndex = this.gameState.mortalObjectivePart1
            .get(collection)
            .findIndex(obj => obj[0] === objective[0] && obj[1] === objective[1] && obj[2] === objective[2]);

        if (objectiveIndex === -1) {
            this.notifier.error(source, 'Objectif invalide');
            return;
        }

        let [name, label, animation]: [string, string, ProgressAnimation] = [
            'halloween_repair',
            'Réparation en cours ...',
            {
                task: 'world_human_welding',
            },
        ];

        if (collection === 'prop_fire_hydrant') {
            [name, label, animation] = [
                'halloween_get',
                'Récupération en cours ...',
                {
                    name: 'base',
                    dictionary: 'amb@prop_human_bum_bin@base',
                    flags: 1,
                },
            ];
        } else if (collection === 'prop_gas_pump') {
            [name, label, animation] = [
                'halloween_get',
                'Récupération en cours ...',
                {
                    dictionary: 'anim@heists@ornate_bank@thermal_charge',
                    name: 'thermal_charge',
                },
            ];
        }

        const { completed } = await this.progressService.progress(source, name, label, 5000, animation, {});
        if (!completed) {
            this.notifier.error(source, 'Objectif abandonné');
            return;
        }

        this.gameState.mortalObjectivePart1.set(
            collection,
            this.gameState.mortalObjectivePart1.get(collection).filter((_, idx) => idx !== objectiveIndex)
        );
        this.notifier.notify(source, 'Objectif validé', 'success');

        this.sendObjectivePart1();

        for (const [, positions] of this.gameState.mortalObjectivePart1) {
            if (positions.length > 0) return;
        }

        this.callFunctionOnNonEnemyPlayers(player => {
            this.notifier.notify(
                player.source,
                'Les Mortels ont ~g~réussi~s~ la première phase ! Leur périple continue avec de ~y~nouveaux objectifs à accomplir~s~.',
                'info'
            );
        });

        this.sendObjectivePart2();
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_TAKE_OBJECTIVE_PART2)
    public async takeObjectivePart2(source: number, objective: VampireGameObjectiveTypePart2) {
        if (!this.gameState.started) return;

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (VampireGameEnemyRoles.includes(this.gameState.playerRoles.get(player.citizenid))) {
            this.notifier.error(source, "Vous n'avez pas le droit de faire cette action");
            return;
        }

        this.gameState.mortalObjectivePart2[objective].players.add(player.citizenid);

        const { completed } = await this.progressService.progress(
            source,
            'halloween_part2',
            '',
            10_000,
            {
                dictionary: 'anim@heists@ornate_bank@thermal_charge',
                name: 'thermal_charge',
            },
            {}
        );
        if (!completed) {
            this.notifier.error(source, 'Objectif abandonné');
            this.gameState.mortalObjectivePart2[objective].players.delete(player.citizenid);
            return;
        }

        if (this.gameState.mortalObjectivePart2[objective].players.size >= this.mortalObjectivePart2[objective]) {
            this.gameState.mortalObjectivePart2[objective].finished = true;

            this.callFunctionOnNonEnemyPlayers(player => {
                this.notifier.notify(
                    player.source,
                    `L'objectif ~b~${VampireGameLabel(objective)}~s~ est validé.`,
                    'success'
                );
            });
        }

        if (!this.gameState.mortalObjectivePart2[objective].finished) {
            const currentPlayers = this.gameState.mortalObjectivePart2[objective].players.size;
            const requiredPlayers = this.mortalObjectivePart2[objective];

            this.notifier.notify(
                player.source,
                `L'objectif ~b~${VampireGameLabel(objective)}~s~ ne peut pas être validé ! ~o~${currentPlayers}~s~/~b~${requiredPlayers} joueurs~s~ réfléchissent.`,
                'error'
            );
        }

        this.gameState.mortalObjectivePart2[objective].players.delete(player.citizenid);

        this.sendObjectivePart2();

        for (const { finished } of Object.values(this.gameState.mortalObjectivePart2)) {
            if (!finished) return;
        }

        this.triggerMortalObjectivePart3();

        this.callFunctionOnNonEnemyPlayers(player => {
            this.notifier.notify(
                player.source,
                `Tous les mortels ont reçu de quoi se défendre, les balles d’argent peuvent tuer les vampires ! La chasse se retourne contre eux, survivez ${this.mortalObjectivePart3Duration} minutes pour sortir victorieux de cette bataille.`,
                'info',
                30_000
            );
        });

        this.callFunctionOnEnemyPlayers(player => {
            this.notifier.notify(
                player.source,
                `Les mortels ont reçu de quoi se défendre, les balles d’argent peuvent te tuer ! Ne deviens pas la proie de ces chasseurs ! Il ne te reste que ${this.mortalObjectivePart3Duration} minutes pour les traquer et leur faire regretter leur audace.`,
                'info',
                30_000
            );
        });
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_PLAYER_KNOCKED_OUT)
    public async playerKnockedOut(source: number) {
        if (!this.gameState.started) return;
        if (this.playerStateService.getClientState(source).isKnockedOut) return;

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        this.playerStateService.setClientState(source, {
            isKnockedOut: true,
        });

        const playerRole = this.gameState.playerRoles.get(player.citizenid);

        if (VampireGameEnemyRoles.includes(playerRole)) {
            const autoRespawn = new PCancelable<void>(async (resolve, reject, onCancel) => {
                let isCanceled = false;

                onCancel(() => {
                    onCancel.shouldReject = false;
                    isCanceled = true;
                });

                await wait(this.autoRespawnDuration * 1000);
                if (isCanceled) return;

                this.switchPlayerRole(source, playerRole);
                resolve();
            });

            this.gameState.autoRespawn.set(player.citizenid, autoRespawn);
        } else {
            const autoRespawn = new PCancelable<void>(async (resolve, reject, onCancel) => {
                let isCanceled = false;

                onCancel(() => {
                    onCancel.shouldReject = false;
                    isCanceled = true;
                });

                await wait(this.autoRespawnDuration * 1000);
                if (isCanceled) return;

                this.switchPlayerRole(source, VampireGameRole.Ghoul);
                resolve();
            });

            this.gameState.autoRespawn.set(player.citizenid, autoRespawn);
        }
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_CANCEL_VAMPIRE_KNOCKOUT)
    public async cancelVampireKnockout(source: number, target?: number, admin?: boolean) {
        if (!this.gameState.started) return;

        if (!target) {
            target = source;
        }

        if (!this.playerStateService.getClientState(target).isKnockedOut) return;

        const player = this.playerService.getPlayer(target);
        if (!player) {
            return;
        }

        this.gameState.autoRespawn.get(player.citizenid)?.cancel();
        this.gameState.autoRespawn.delete(player.citizenid);

        this.playerStateService.setClientState(target, {
            isKnockedOut: false,
        });

        if (admin) {
            TriggerClientEvent(
                ClientEvent.HALLOWEEN_VAMPIRE_PLAYER_CONVERTED,
                target,
                this.gameState.playerRoles.get(player.citizenid)
            );
        }
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_CONVERT_PLAYER)
    public async convertPlayer(source: number, target: number, role: VampireGameRole) {
        if (!this.gameState.started) return;

        const playerSource = this.playerService.getPlayer(source);
        if (!playerSource) {
            return;
        }

        const playerTarget = this.playerService.getPlayer(target);
        if (!playerTarget) {
            return;
        }

        const sourceRole = this.gameState.playerRoles.get(playerSource.citizenid);
        const targetRole = this.gameState.playerRoles.get(playerTarget.citizenid);

        if (![...VampireGameEnemyRoles, VampireGameRole.Alchemist].includes(sourceRole)) {
            this.notifier.error(source, "Vous n'avez pas le droit de faire cette action");
        }

        if (role === VampireGameRole.Ghoul) {
            if (VampireGameEnemyRoles.includes(targetRole)) {
                this.notifier.error(source, 'La cible doit être un Mortel');
                return;
            }

            const { completed } = await this.progressService.progress(
                source,
                'vampire',
                'Ça suce fort',
                3000,
                {
                    name: 'base',
                    dictionary: 'amb@prop_human_bum_bin@base',
                    flags: 1,
                },
                { canCancel: false }
            );

            if (!completed) {
                return;
            }
        } else if (role === VampireGameRole.Mortal) {
            if (targetRole !== VampireGameRole.Ghoul) {
                this.notifier.error(source, 'La cible doit être une Goule');
                return;
            }

            const { completed } = await this.progressService.progress(
                source,
                'analyze',
                'Injection du sérum',
                3000,
                {
                    name: 'base',
                    dictionary: 'amb@prop_human_bum_bin@base',
                    flags: 1,
                },
                { canCancel: false }
            );

            if (!completed) {
                return;
            }
        }

        this.gameState.autoRespawn.get(playerTarget.citizenid)?.cancel();
        this.gameState.autoRespawn.delete(playerTarget.citizenid);
        this.gameState.gauges[targetRole].dec();
        this.gameState.playerRoles.set(playerTarget.citizenid, role);
        this.gameState.gauges[role].inc();

        this.switchPlayerRole(target, role);

        if (VampireGameEnemyRoles.includes(role)) {
            TriggerClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_OBJECTIVE_PART1, target, {});
        }

        await wait(1000);

        const roleGauge = await this.gameState.gauges[VampireGameRole.Mortal].get();
        if (roleGauge.values[0].value > 0) return;

        this.notifier.notify(
            -1,
            'Les Vampires ont gagné ce scénario ! Le tournage est terminé, l’ensemble de l’île peut retourner à ses occupations, bravo pour votre prestation.',
            'info'
        );
        this.stopGame();
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_KNOCK_PLAYER)
    public async knockPlayer(source: number, target: number) {
        if (!this.gameState.started) return;

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!VampireGameEnemyRoles.includes(this.gameState.playerRoles.get(player.citizenid))) return;
        if (this.playerStateService.getClientState(target).isKnockedOut) return;

        TriggerClientEvent(ClientEvent.ADMIN_KILL_PLAYER, target);
    }

    @Tick(TickInterval.EVERY_SECOND)
    async syncEnemyPosition() {
        if (!this.gameState.started) return;

        const squirePlayers = [];
        const enemyPlayers = [];

        const victimPositions: Vector3[] = [];
        const enemyPositions: Vector3[] = [];

        this.gameState.playerRoles.forEach((role, citizenId) => {
            if (VampireGameEnemyRoles.includes(role)) {
                enemyPlayers.push(citizenId);
            } else if (role === VampireGameRole.Squire) {
                squirePlayers.push(citizenId);
            }

            const player = this.playerService.getPlayerByCitizenId(citizenId);
            if (!player) return;

            const [x, y, z] = GetEntityCoords(GetPlayerPed(player.source));

            if (VampireGameEnemyRoles.includes(role)) {
                enemyPositions.push([x, y, z]);
            } else {
                victimPositions.push([x, y, z]);
            }
        });

        squirePlayers.forEach(citizenId => {
            const player = this.playerService.getPlayerByCitizenId(citizenId);
            if (!player) return;

            TriggerLatentClientEvent(
                ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_POSITION,
                player.source,
                1024,
                enemyPositions,
                true
            );
        });

        enemyPlayers.forEach(citizenId => {
            const player = this.playerService.getPlayerByCitizenId(citizenId);
            if (!player) return;

            TriggerLatentClientEvent(
                ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_POSITION,
                player.source,
                1024,
                victimPositions,
                false
            );
        });
    }

    /* Admin events */
    @Rpc(RpcServerEvent.ADMIN_HALLOWEEN_GAME_STATE)
    public getState(): HalloweenSubMenuState {
        return {
            started: this.gameState.started,
            staffEnabled: this.staffEnabled,
            gameDuration: this.gameDuration,
            roleMaxNumber: this.roleMaxNumber,
            mortalObjectivePart1: this.mortalObjectivePart1,
            mortalObjectivePart2: this.mortalObjectivePart2,
            mortalObjectivePart3: this.mortalObjectivePart3Duration,
        };
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_GAME_STAFF_ENABLED)
    public updateStaffEnabled(source: number, role: string, value: boolean): void {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.staffEnabled[role] = value;
        this.notifier.notify(source, `Le rôle ${role} a été mis à jour: ${value ? 'activé' : 'désactivé'}`, 'info');
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_GAME_DURATION)
    public updateGameDuration(source: number, value: number): void {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.gameDuration = value;
        this.notifier.notify(source, `La durée du jeu a été mise à jour, durée maximum: ${value} minutes`, 'info');
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_ROLE)
    public toggleRole(source: number, role: VampireGameRole, value: number): void {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.roleMaxNumber[role] = value;
        if (value <= 0) {
            this.notifier.notify(source, `Le rôle ${role} a été désactivé`, 'info');
            return;
        }

        this.notifier.notify(source, `Le rôle ${role} a été mis à jour, chance de drop: ${value}%`, 'info');
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_FOCE_TRANSFORM_PLAYER)
    public forceTransformStaffPlayer(source: number, target: number, role: VampireGameRole): void {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        const player = this.playerService.getPlayer(target);
        if (!player) {
            return;
        }

        this.gameState.autoRespawn.get(player.citizenid)?.cancel();
        this.gameState.autoRespawn.delete(player.citizenid);

        const oldRole = this.gameState.playerRoles.get(player.citizenid);
        if (oldRole) {
            this.gameState.gauges[oldRole].dec();
        }
        this.gameState.playerRoles.set(player.citizenid, role);
        this.gameState.gauges[role].inc();

        TriggerClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, target, {
            inWaitingRoom: true,
            started: this.gameState.started,
            role,
        });

        this.sendObjectivePart1();
        this.sendObjectivePart2();

        this.switchPlayerRole(target, role);
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_MORTAL_OBJECTIVE_PART1)
    public toggleCollection(source: number, collection: VampireGameCollection, value: number): void {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.mortalObjectivePart1[collection] = value;
        if (value <= 0) {
            this.notifier.notify(source, `La collection ${collection} a été désactivée`, 'info');
            return;
        }

        this.notifier.notify(source, `La collection ${collection} a été mise à jour, props maximum: ${value}`, 'info');
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_MORTAL_OBJECTIVE_PART2)
    public updateObjectivePart2Player(source: number, objective: VampireGameCollection, value: number): void {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.mortalObjectivePart2[objective] = value;
        if (value <= 0) {
            this.notifier.notify(source, `L'objectif ${objective} a été désactivée`, 'info');
            return;
        }

        this.notifier.notify(source, `L'objectif ${objective} a été mise à jour, joueur requis: ${value}`, 'info');
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_MORTAL_OBJECTIVE_PART3)
    public updateObjectivePart3(source: number, value: number): void {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.mortalObjectivePart3Duration = value;
        this.notifier.notify(source, `La durée de l'objectif 3 a été mise à jour, durée: ${value} minutes`, 'info');
    }

    /* Private methods */
    private stopGame() {
        TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/wolf', 0.8);

        this.npcProvider.disableNPC(false);

        this.store.dispatch.global.update({
            halloween: '',
            blackout: false,
            blackoutLevel: 0,
            blackoutOverride: false,
        });

        clearTimeout(this.gameState.timer);
        clearTimeout(this.gameState.mortalObjectivePart3);

        this.gameState.playerRoles.forEach((_, citizenId) => {
            const player = this.playerService.getPlayerByCitizenId(citizenId);
            if (!player) {
                return;
            }

            const playerState = this.playerStateService.getClientStateByCitizenId(citizenId);
            if (!playerState.isKnockedOut) return;

            TriggerClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_PLAYER_CONVERTED, player.source, VampireGameRole.Mortal);
            this.gameState.autoRespawn.get(citizenId)?.cancel();
        });

        this.playerStateService.setAllClientsState({
            halloweenRole: null,
            isKnockedOut: false,
        });

        TriggerLatentClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, -1, 1024, {
            inWaitingRoom: false,
            started: false,
            role: null,
            objectivePart1: null,
            objectivePart2: null,
        } as VampireGameClientState);

        Object.values(this.gameState.gauges).forEach(gauge => gauge.reset());
        this.gameState.mortalObjectivePart1.clear();
        Object.keys(this.gameState.mortalObjectivePart2).forEach(key => {
            this.gameState.mortalObjectivePart2[key].finished = false;
            this.gameState.mortalObjectivePart2[key].players.clear();
        });
        this.gameState.mortalObjectivePart3 = null;
        this.gameState.autoRespawn.clear();
        this.gameState.playerRoles.clear();
        this.gameState.started = false;
    }

    private async newPlayer(player: PlayerData) {
        const playerRole = this.permissionService.getPermission(player.source);
        if (playerRole !== 'user' && !this.staffEnabled[playerRole]) {
            return;
        }

        if (this.gameState.playerRoles.has(player.citizenid)) {
            const role = this.gameState.playerRoles.get(player.citizenid);

            this.logger.error(
                `${player.charinfo.firstname} ${player.charinfo.lastname} has already been assigned to a role: ${role}`
            );

            this.playerStateService.setClientState(player.source, {
                halloweenRole: role,
            });

            TriggerLatentClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, player.source, 1024, {
                inWaitingRoom: true,
                started: this.gameState.started,
                role,
            });

            this.sendObjectivePart1();
            this.sendObjectivePart2();

            return;
        }

        const role = await this.getRandomRole();
        if (!role) {
            this.logger.error(
                `${player.charinfo.firstname} ${player.charinfo.lastname} n'a pas pu être assigné à un rôle, aucun rôle de disponible...`
            );
            return;
        }

        this.gameState.playerRoles.set(player.citizenid, role);
        this.gameState.gauges[role].inc();

        this.playerStateService.setClientState(player.source, {
            halloweenRole: role,
        });

        TriggerLatentClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, player.source, 1024, {
            inWaitingRoom: true,
            started: this.gameState.started,
            role,
            objectivePart1: !VampireGameEnemyRoles.includes(role)
                ? Object.fromEntries(this.gameState.mortalObjectivePart1.entries())
                : null,
            objectivePart2: null,
        });

        if (player.metadata.isdead) {
            await this.lsmcDeathProvider.revive(player.source, player.source, true, false, false);
        }

        this.logger.debug(
            `Player ${player.charinfo.firstname} ${player.charinfo.lastname} has been assigned to role ${role}`
        );
    }

    private async getRandomRole(): Promise<VampireGameRole> {
        for (const role of Object.keys(this.roleMaxNumber) as VampireGameRole[]) {
            if (this.roleMaxNumber[role] <= 0) {
                continue;
            }

            const roleGauge = await this.gameState.gauges[role].get();
            if (roleGauge.values[0].value >= 1) {
                continue;
            }

            return role;
        }

        return getRandomKeyWeighted<VampireGameRole>(this.roleMaxNumber, VampireGameRole.Vampire) as VampireGameRole;
    }

    private createObjectivePart1() {
        for (const collection of Object.keys(VampireGameObjectiveCollectionPart1) as VampireGameCollection[]) {
            this.gameState.mortalObjectivePart1.set(
                collection,
                this.getCollectionContent(collection, this.mortalObjectivePart1[collection])
            );
        }
    }

    private getCollectionContent(collection: VampireGameCollection, amount: number): Vector3[] {
        const collectionPropsList = VampireGameObjectiveCollectionPart1[collection];
        if (!collectionPropsList) {
            return [];
        }

        const collectionContent = Object.values(collectionPropsList).flatMap(props => {
            return VampireGameObjectiveProps[props];
        });

        return collectionContent
            .filter(coords => coords[1] >= OBJECTIVE_Y_LIMITATION[0] && coords[1] <= OBJECTIVE_Y_LIMITATION[1])
            .sort(() => Math.random() - 0.5)
            .slice(0, amount);
    }

    private sendObjectivePart1() {
        if (!this.gameState.started) return;

        this.callFunctionOnNonEnemyPlayers(player => {
            TriggerLatentClientEvent(
                ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_OBJECTIVE_PART1,
                player.source,
                1024,
                Object.fromEntries(this.gameState.mortalObjectivePart1.entries())
            );
        });
    }

    private sendObjectivePart2() {
        if (!this.gameState.started) return;

        for (const [, positions] of this.gameState.mortalObjectivePart1) {
            if (positions.length > 0) return;
        }

        this.callFunctionOnNonEnemyPlayers(player => {
            TriggerLatentClientEvent(
                ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_OBJECTIVE_PART2,
                player.source,
                1024,
                Object.fromEntries(
                    Object.entries(VampireGameObjectivePart2).map(([key]) => [
                        key,
                        {
                            playerRequired: this.mortalObjectivePart2[key],
                            finished: this.gameState.mortalObjectivePart2[key].finished,
                        },
                    ])
                )
            );
        });
    }

    private callFunctionOnNonEnemyPlayers(callback: (player: PlayerData) => void) {
        this.gameState.playerRoles.forEach((role, citizenId) => {
            if (VampireGameEnemyRoles.includes(role)) return;

            const player = this.playerService.getPlayerByCitizenId(citizenId);
            if (!player) {
                return;
            }

            callback(player);
        });
    }

    private callFunctionOnEnemyPlayers(callback: (player: PlayerData) => void) {
        this.gameState.playerRoles.forEach((role, citizenId) => {
            if (!VampireGameEnemyRoles.includes(role)) return;

            const player = this.playerService.getPlayerByCitizenId(citizenId);
            if (!player) {
                return;
            }

            callback(player);
        });
    }

    private triggerMortalObjectivePart3() {
        this.gameState.playerRoles.forEach((role, citizenId) => {
            if (VampireGameEnemyRoles.includes(role)) return;
            if (role === VampireGameRole.Hunter) return;

            const player = this.playerService.getPlayerByCitizenId(citizenId);
            if (!player) {
                return;
            }

            this.gameState.gauges[role].dec();
            this.gameState.playerRoles.set(citizenId, VampireGameRole.Hunter);
            this.gameState.gauges[VampireGameRole.Hunter].inc();

            this.switchPlayerRole(player.source, VampireGameRole.Hunter);
        });

        clearInterval(this.gameState.mortalObjectivePart3);
        this.gameState.mortalObjectivePart3 = setTimeout(
            () => {
                this.notifier.notify(
                    -1,
                    'Les Mortels ont gagné ce scénario ! Le tournage est terminé, l’ensemble de l’île peut retourner à ses occupations, bravo pour votre prestation.',
                    'info'
                );
                this.stopGame();
            },
            this.mortalObjectivePart3Duration * 60 * 1000
        );
    }

    private switchPlayerRole(source: number, role: VampireGameRole) {
        this.playerStateService.setClientState(source, {
            isKnockedOut: false,
            halloweenRole: role,
        });

        TriggerClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, source, { role });
        TriggerClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_PLAYER_CONVERTED, source, role);

        TriggerLatentClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_POSITION, source, 1024, [], false);
    }
}
