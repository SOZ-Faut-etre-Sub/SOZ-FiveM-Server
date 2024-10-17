import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { PlayerData } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';
import PCancelable from 'p-cancelable';
import { Gauge } from 'prom-client';

import { On, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { Logger } from '../../core/logger';
import { HalloweenSubMenuState } from '../../shared/admin/admin';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { Feature } from '../../shared/features';
import {
    VampireGameClientState,
    VampireGameCollection,
    VampireGameEnemyRoles,
    VampireGameObjectiveCollection,
    VampireGameObjectiveProps,
    VampireGameRole,
    VampireGameServerState,
} from '../../shared/halloween';
import { ProgressAnimation } from '../../shared/progress';
import { RpcServerEvent } from '../../shared/rpc';
import { FeatureProvider } from '../feature/feature.provider';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { PlayerStateService } from '../player/player.state.service';
import { ProgressService } from '../player/progress.service';
import { ServerStateService } from '../server.state.service';
import { Store } from '../store/store';

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

    @Inject('Store')
    private readonly store: Store;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(Logger)
    private readonly logger: Logger;

    private gameDuration = 30; // minutes
    private autoRespawnDuration = 20; // seconds
    private roleMaxNumber: Record<VampireGameRole, number> = {
        [VampireGameRole.Vampire]: 50,
        [VampireGameRole.Ghoul]: 0,
        [VampireGameRole.Hunter]: 20,
        [VampireGameRole.Mortal]: 300,
        [VampireGameRole.Squire]: 20,
        [VampireGameRole.Alchemist]: 20,
    };
    private mortalObjective: Record<Exclude<VampireGameCollection, 'player'>, number> = {
        prop_streetlight: 30,
        prop_fire_hydrant: 30,
        prop_gas_pump: 10,
        prop_elecbox: 30,
    };
    private gameState: VampireGameServerState = {
        started: false,
        timer: null,
        playerRoles: new Map<number, VampireGameRole>(),

        objective: {
            [VampireGameRole.Vampire]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Ghoul]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Hunter]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Mortal]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Squire]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Alchemist]: new Map<VampireGameCollection, Vector3[]>(),
        },

        autoRespawn: new Map<number, PCancelable<void>>(),

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

    @On('QBCore:Server:PlayerLoaded', false)
    onPlayerLoaded(data: any) {
        const player = data.PlayerData as PlayerData;

        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.started) return;

        this.newPlayer(player);
    }

    @On('QBCore:Server:PlayerUnload', false)
    onPlayerUnload(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.started) return;

        const role = this.gameState.playerRoles.get(source);
        if (role) {
            this.gameState.gauges[role].dec();
            this.gameState.playerRoles.delete(source);
        }
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

        for (const role of Object.keys(this.gameState.objective)) {
            this.createObjective(role as VampireGameRole);
        }

        for (const player of this.serverStateService.getPlayers()) {
            await this.newPlayer(player);
        }

        await wait(5000);

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

        this.stopGame();
        this.notifier.notify(source, 'Le jeu a été arrêté', 'info');
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_TAKE_OBJECTIVE)
    public async takeObjective(
        source: number,
        role: VampireGameRole,
        collection: VampireGameCollection,
        objective: Vector3
    ) {
        if (!this.gameState.started) {
            return;
        }

        const objectiveIndex = this.gameState.objective[role]
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

        if (collection === 'prop_fire_hydrant' || collection === 'prop_gas_pump') {
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

        this.gameState.objective[role].set(
            collection,
            this.gameState.objective[role].get(collection).filter((_, idx) => idx !== objectiveIndex)
        );
        this.notifier.notify(source, 'Objectif validé', 'success');

        for (const [player, playerRole] of this.gameState.playerRoles.entries()) {
            if (playerRole !== role) continue;

            TriggerLatentClientEvent(
                ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_OBJECTIVE,
                player,
                1024,
                Object.fromEntries(this.gameState.objective[role].entries())
            );
        }

        for (const [, positions] of this.gameState.objective[role]) {
            if (positions.length > 0) return;
        }

        this.notifier.notify(
            -1,
            'Les Mortels ont gagné ce scénario ! Le tournage est terminé, l’ensemble de l’île peut retourner à ses occupations, bravo pour votre prestation.',
            'info'
        );
        this.stopGame();
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_PLAYER_KNOCKED_OUT)
    public async playerKnockedOut(source: number) {
        if (!this.gameState.started) return;
        if (this.playerStateService.getClientState(source).isKnockedOut) return;

        this.playerStateService.setClientState(source, {
            isKnockedOut: true,
        });

        const playerRole = this.gameState.playerRoles.get(source);

        if (VampireGameEnemyRoles.includes(playerRole)) {
            const autoRespawn = new PCancelable<void>(async (resolve, reject, onCancel) => {
                let isCanceled = false;

                onCancel(() => {
                    onCancel.shouldReject = false;
                    isCanceled = true;
                });

                await wait(this.autoRespawnDuration * 1000);
                if (isCanceled) return;

                TriggerClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_PLAYER_CONVERTED, source, playerRole);
                resolve();
            });

            this.gameState.autoRespawn.set(source, autoRespawn);
        }
    }

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_CONVERT_PLAYER)
    public async convertPlayer(source: number, target: number, role: VampireGameRole) {
        if (!this.gameState.started) {
            return;
        }

        const sourceRole = this.gameState.playerRoles.get(source);
        const targetRole = this.gameState.playerRoles.get(target);

        if (![...VampireGameEnemyRoles, VampireGameRole.Alchemist].includes(sourceRole)) {
            this.notifier.error(source, "Vous n'avez pas le droit de faire cette action");
        }

        if (role === VampireGameRole.Ghoul) {
            if (VampireGameEnemyRoles.includes(targetRole)) {
                this.notifier.error(source, 'La cible doit être un Mortel');
                return;
            }

            const { completed } = await this.progressService.progress(source, 'vampire', 'Ça suce fort', 3000, {
                name: 'base',
                dictionary: 'amb@prop_human_bum_bin@base',
                flags: 1,
            });

            if (!completed) {
                return;
            }
        } else if (role === VampireGameRole.Mortal) {
            if (targetRole !== VampireGameRole.Ghoul) {
                this.notifier.error(source, 'La cible doit être une Goule');
                return;
            }

            const { completed } = await this.progressService.progress(source, 'analyze', 'Injection du sérum', 3000, {
                name: 'base',
                dictionary: 'amb@prop_human_bum_bin@base',
                flags: 1,
            });

            if (!completed) {
                return;
            }
        }

        this.gameState.autoRespawn.get(target)?.cancel();
        this.gameState.autoRespawn.delete(target);
        this.gameState.gauges[targetRole].dec();
        this.gameState.playerRoles.set(target, role);
        this.gameState.gauges[role].inc();

        TriggerClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, target, {
            role,
        });

        this.playerStateService.setClientState(target, {
            isKnockedOut: false,
        });

        TriggerClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_PLAYER_CONVERTED, target, role);

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
        if (!VampireGameEnemyRoles.includes(this.gameState.playerRoles.get(source))) return;
        if (this.playerStateService.getClientState(target).isKnockedOut) return;

        TriggerClientEvent(ClientEvent.ADMIN_KILL_PLAYER, target);
    }

    @Tick(TickInterval.EVERY_SECOND)
    async syncEnemyPosition() {
        if (!this.gameState.started) return;

        const squirePlayers = [];
        const enemyPositions: Vector3[] = [];

        this.gameState.playerRoles.forEach((role, player) => {
            if (role === VampireGameRole.Squire) {
                squirePlayers.push(player);
            }

            if (!VampireGameEnemyRoles.includes(role)) return;

            const [x, y, z] = GetEntityCoords(GetPlayerPed(player));
            enemyPositions.push([x, y, z]);
        });

        squirePlayers.forEach(player => {
            TriggerLatentClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_ENEMY_POSITION, player, 1024, enemyPositions);
        });
    }

    /* Admin events */
    @Rpc(RpcServerEvent.ADMIN_HALLOWEEN_GAME_STATE)
    public getState(): HalloweenSubMenuState {
        return {
            started: this.gameState.started,
            gameDuration: this.gameDuration,
            roleMaxNumber: this.roleMaxNumber,
            mortalObjective: this.mortalObjective,
        };
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

        this.notifier.notify(source, `Le rôle ${role} a été mis à jour, joueurs maximum: ${value}`, 'info');
    }

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_MORTAL_COLLECTION)
    public toggleCollection(source: number, collection: VampireGameCollection, value: number): void {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.mortalObjective[collection] = value;
        if (value <= 0) {
            this.notifier.notify(source, `La collection ${collection} a été désactivée`, 'info');
            return;
        }

        this.notifier.notify(source, `La collection ${collection} a été mise à jour, props maximum: ${value}`, 'info');
    }

    /* Private methods */
    private stopGame() {
        this.gameState.started = false;
        this.gameState.playerRoles.clear();
        Object.keys(this.gameState.objective).forEach(role => this.gameState.objective[role].clear());
        Object.values(this.gameState.gauges).forEach(gauge => gauge.reset());

        TriggerClientEvent('InteractSound_CL:PlayOnOne', -1, 'halloween/wolf', 0.8);

        this.store.dispatch.global.update({
            halloween: '',
            blackout: false,
            blackoutLevel: 0,
            blackoutOverride: false,
        });

        this.playerStateService.setAllClientsState({
            halloweenRole: null,
        });

        TriggerLatentClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, -1, 1024, {
            inWaitingRoom: false,
            started: this.gameState.started,
            role: null,
            objective: null,
        } as VampireGameClientState);
    }

    private async newPlayer(player: PlayerData) {
        const role = await this.getRandomRole();
        if (!role) {
            this.logger.error(
                `${player.charinfo.firstname} ${player.charinfo.lastname} n'a pas pu être assigné à un rôle, aucun rôle de disponible...`
            );
            return;
        }

        this.gameState.playerRoles.set(player.source, role);
        this.gameState.gauges[role].inc();

        this.playerStateService.setClientState(player.source, {
            halloweenRole: role,
        });

        TriggerLatentClientEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE, player.source, 1024, {
            inWaitingRoom: true,
            started: this.gameState.started,
            role,
            objective: Object.fromEntries(this.gameState.objective[role].entries()),
        });

        this.logger.debug(
            `Player ${player.charinfo.firstname} ${player.charinfo.lastname} has been assigned to role ${role}`
        );
    }

    private async getRandomRole(): Promise<VampireGameRole> {
        let availableRoles = Object.keys(this.roleMaxNumber).filter(role => this.roleMaxNumber[role] > 0);

        for (const role of availableRoles) {
            const roleGauge = await this.gameState.gauges[role as VampireGameRole].get();
            if (roleGauge.values[0].value >= this.roleMaxNumber[role]) {
                availableRoles = availableRoles.filter(r => r !== role);
            }
        }

        if (availableRoles.length === 0) {
            return null;
        }

        return availableRoles[Math.floor(Math.random() * availableRoles.length)] as VampireGameRole;
    }

    private createObjective(role: VampireGameRole) {
        switch (role) {
            case VampireGameRole.Mortal:
                for (const collection of Object.keys(VampireGameObjectiveCollection) as VampireGameCollection[]) {
                    this.gameState.objective[role].set(
                        collection,
                        this.getCollectionContent(collection, this.mortalObjective[collection])
                    );
                }
                break;
            default:
                break;
        }
    }

    private getCollectionContent(collection: VampireGameCollection, amount: number): Vector3[] {
        const collectionPropsList = VampireGameObjectiveCollection[collection];
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
}
