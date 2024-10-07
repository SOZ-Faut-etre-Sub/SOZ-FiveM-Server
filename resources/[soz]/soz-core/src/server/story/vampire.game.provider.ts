import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { PlayerData } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';
import { Gauge } from 'prom-client';

import { FeatureProvider } from '../../client/feature/feature.provider';
import { On, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { Logger } from '../../core/logger';
import { HalloweenSubMenuState } from '../../shared/admin/admin';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { Feature } from '../../shared/features';
import {
    VampireGameClientState,
    VampireGameCollection,
    VampireGameObjectiveCollection,
    VampireGameObjectiveProps,
    VampireGameRole,
    VampireGameServerState,
} from '../../shared/halloween';
import { ProgressAnimation } from '../../shared/progress';
import { RpcServerEvent } from '../../shared/rpc';
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

    private roleMaxNumber: Record<VampireGameRole, number> = {
        [VampireGameRole.Vampire]: 50,
        [VampireGameRole.Fanatic]: 5,
        [VampireGameRole.Hunter]: 5,
        [VampireGameRole.Mortal]: 200,
        [VampireGameRole.Squire]: 5,
        [VampireGameRole.Alchemist]: 5,
    };
    private mortalObjective: Record<VampireGameCollection, number> = {
        prop_streetlight: 30,
        prop_fire_hydrant: 30,
        prop_gas_pump: 10,
        prop_elecbox: 30,
    };
    private gameState: VampireGameServerState = {
        started: false,
        playerRoles: new Map<number, VampireGameRole>(),

        objective: {
            [VampireGameRole.Vampire]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Fanatic]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Hunter]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Mortal]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Squire]: new Map<VampireGameCollection, Vector3[]>(),
            [VampireGameRole.Alchemist]: new Map<VampireGameCollection, Vector3[]>(),
        },

        gauges: {
            [VampireGameRole.Vampire]: new Gauge({
                name: 'soz_halloween_vampire_count',
                help: 'Number of Vampire in halloween game',
            }),
            [VampireGameRole.Fanatic]: new Gauge({
                name: 'soz_halloween_fanatic_count',
                help: 'Number of Fanatic in halloween game',
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

    @Rpc(RpcServerEvent.ADMIN_HALLOWEEN_GAME_STATE)
    public getState(): HalloweenSubMenuState {
        return {
            started: this.gameState.started,
            roleMaxNumber: this.roleMaxNumber,
            mortalObjective: this.mortalObjective,
        };
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

    @OnEvent(ServerEvent.ADMIN_HALLOWEEN_LAUNCH_GAME)
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
            this.newPlayer(player);
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

    @OnEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_CONVERT_PLAYER)
    public async convertPlayer(source: number, target: number) {
        if (!this.gameState.started) {
            return;
        }

        const roleGauge = await this.gameState.gauges[VampireGameRole.Mortal].get();
        if (roleGauge.values[0].value > 0) return;

        this.notifier.notify(
            -1,
            'Les Vampires ont gagné ce scénario ! Le tournage est terminé, l’ensemble de l’île peut retourner à ses occupations, bravo pour votre prestation.',
            'info'
        );
        this.stopGame();
    }

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

    private newPlayer(player: PlayerData) {
        const role = this.getRandomRole();
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

    private getRandomRole(): VampireGameRole {
        const availableRoles = Object.entries(this.roleMaxNumber)
            .filter(([, amount]) => amount > 0)
            .filter(async ([role, amount]) => {
                const roleGauge = await this.gameState.gauges[role as VampireGameRole].get();
                return roleGauge.values[0].value < amount;
            });

        if (availableRoles.length === 0) {
            return null;
        }

        return availableRoles[Math.floor(Math.random() * availableRoles.length)][0] as VampireGameRole;
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
