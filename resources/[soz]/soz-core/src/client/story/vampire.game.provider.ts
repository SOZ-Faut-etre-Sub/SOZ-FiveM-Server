import { Command } from '@core/decorators/command';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { emitRpc } from '@core/rpc';
import { VampireGameStateProvider } from '@public/client/story/vampire.game.state.provider';
import { Once, OnceStep, OnEvent, OnGameEvent, OnNuiEvent } from '@public/core/decorators/event';
import { uuidv4, wait } from '@public/core/utils';

import { Tick, TickInterval } from '../../core/decorators/tick';
import { Blip } from '../../shared/blip';
import { ClientEvent } from '../../shared/event/client';
import { GameEvent } from '../../shared/event/game';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { Feature } from '../../shared/features';
import {
    GhoulOutfit,
    MortalRespawnPoints,
    VampireGameClientState,
    VampireGameCollection,
    VampireGameEnemyRoles,
    VampireGameLabel,
    VampireGameObjectivePart2,
    VampireGameObjectiveTypePart2,
    VampireGameRole,
    VampireGameSprite,
    VampireOutfit,
    VampireRespawnPoints,
} from '../../shared/halloween';
import { Font } from '../../shared/hud';
import { BIN_MODELS } from '../../shared/job/garbage';
import { MenuType } from '../../shared/nui/menu';
import { PlayerClientState } from '../../shared/player';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { toVector3Object, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleSeat } from '../../shared/vehicle/vehicle';
import { WeaponName } from '../../shared/weapons/weapon';
import { BlipFactory } from '../blip';
import { DrawService } from '../draw.service';
import { FeatureProvider } from '../feature/feature.provider';
import { InstructionalService } from '../instructional.service';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { ObjectProvider } from '../object/object.provider';
import { MapPickerProvider } from '../picker/map.picker.provider';
import { PlayerInOutService } from '../player/player.inout.service';
import { PlayerListStateService } from '../player/player.list.state.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { PlayerStateProvider } from '../player/player.state.provider';
import { PlayerWalkstyleProvider } from '../player/player.walkstyle.provider';
import { InteractionProvider } from '../quick-interaction/interaction.provider';
import { SkinService } from '../skin/skin.service';
import { TargetFactory } from '../target/target.factory';
import { BlurService } from '../utils/blur.service';
import { WeaponService } from '../weapon/weapon.service';

@Provider()
export class VampireGameProvider {
    @Inject(VampireGameStateProvider)
    private readonly gameState: VampireGameStateProvider;

    @Inject(InstructionalService)
    private readonly instructionalService: InstructionalService;

    @Inject(InteractionProvider)
    private readonly interactionProvider: InteractionProvider;

    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    @Inject(BlipFactory)
    private readonly blipFactory: BlipFactory;

    @Inject(PlayerListStateService)
    private readonly playerListStateService: PlayerListStateService;

    @Inject(BlurService)
    private readonly blurService: BlurService;

    @Inject(SkinService)
    private readonly skinService: SkinService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(PlayerStateProvider)
    private readonly playerStateProvider: PlayerStateProvider;

    @Inject(WeaponService)
    private readonly weaponService: WeaponService;

    @Inject(MapPickerProvider)
    private readonly mapPickerProvider: MapPickerProvider;

    @Inject(PlayerInOutService)
    private readonly playerInOutService: PlayerInOutService;

    @Inject(NuiMenu)
    private readonly nuiMenu: NuiMenu;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(PlayerPositionProvider)
    private readonly playerPositionProvider: PlayerPositionProvider;

    @Inject(PlayerWalkstyleProvider)
    private readonly playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(DrawService)
    private readonly drawService: DrawService;

    private blipDisabled = new Set<string>();
    private objectiveInteractions = new Set<string>();
    private collectiveObjectives = new Set<string>();
    private vampirePositionBlip = new Set<string>();

    public async handleOnDeath() {
        if (!this.gameState.isGameRunning()) return;
        if (this.gameState.playerRespawning()) return;
        if (this.playerListStateService.isKnockedOut(GetPlayerServerId(PlayerId()))) return;

        if (GetEntityModel(PlayerPedId()) === GetHashKey('a_c_crow')) {
            const ped = PlayerPedId();
            const pos = GetEntityCoords(ped);
            const heading = GetEntityHeading(ped);

            NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, 1, false);
            SetEntityHealth(ped, GetPedMaxHealth(ped));
            return;
        }

        this.blurService.add('dead', 5);
        StartScreenEffect('DeathFailOut', 0, true);

        if (this.gameState.hasRole(VampireGameRole.Vampire)) {
            this.instructionalService.display(
                ['Tu as failli à ta tâche...', "Tu as quand même droit à une nouvelle chance d'ici quelques secondes"],
                true
            );
        } else if (this.gameState.hasRole(VampireGameRole.Ghoul)) {
            this.instructionalService.display(
                ['Tu as failli à ta tâche...', "Ton vampire va te réanimer d'ici quelques secondes"],
                true
            );
        } else {
            this.instructionalService.display(["Tu es au sol, prie pour qu'un vampire ne te suce pas !"], true);
        }

        TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_PLAYER_KNOCKED_OUT);
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onTick() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.isGameRunning()) return;

        if (this.gameState.hasEnemyRole()) {
            RestorePlayerStamina(PlayerId(), 1.0);
        }

        const ped = PlayerPedId();

        const vehicle = GetVehiclePedIsIn(ped, false);
        if (!vehicle) return;

        const isDriver = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === ped;
        if (!isDriver) return;

        if (!GetIsVehicleEngineRunning(vehicle)) return;

        const model = GetEntityModel(vehicle);

        if (IsThisModelABoat(model) || IsThisModelAHeli(model) || IsThisModelAPlane(model)) {
            this.drawService.drawText('Véhicule non autorisé ! Rangez-le immédiatement !', [0.315, 0.015], {
                font: Font.ChaletComprimeCologne,
                size: 1.0,
                color: [244, 43, 29, 255],
            });
            return;
        }

        SetVehicleEngineOn(vehicle, false, true, true);
    }

    @Once(OnceStep.PlayerLoaded)
    async onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;

        this.targetFactory.createForAllPlayer([
            {
                label: 'Sucer',
                icon: 'halloween/vampire',
                category: 'citizen',
                event: 'vampire:game',
                canInteract: async entity => {
                    if (!this.gameState.isGameRunning()) return false;
                    if (!this.gameState.hasEnemyRole()) return false;

                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    if (!this.playerListStateService.isKnockedOut(targetSource)) return false;

                    const targetState = await emitRpc<PlayerClientState>(
                        RpcServerEvent.PLAYER_GET_CLIENT_STATE,
                        targetSource
                    );

                    return !VampireGameEnemyRoles.includes(targetState.halloweenRole);
                },
                action: async entity => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(
                        ServerEvent.HALLOWEEN_VAMPIRE_GAME_CONVERT_PLAYER,
                        targetSource,
                        VampireGameRole.Ghoul
                    );
                },
            },
            {
                label: 'Soigner',
                icon: 'ems/heal',
                category: 'citizen',
                event: 'vampire:game',
                canInteract: async entity => {
                    if (!this.gameState.isGameRunning()) return false;
                    if (!this.gameState.hasRole(VampireGameRole.Alchemist)) return false;

                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    if (!this.playerListStateService.isKnockedOut(targetSource)) return false;

                    const targetState = await emitRpc<PlayerClientState>(
                        RpcServerEvent.PLAYER_GET_CLIENT_STATE,
                        targetSource
                    );

                    return targetState.halloweenRole === VampireGameRole.Ghoul;
                },
                action: async entity => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(
                        ServerEvent.HALLOWEEN_VAMPIRE_GAME_CONVERT_PLAYER,
                        targetSource,
                        VampireGameRole.Mortal
                    );
                },
            },
        ]);

        for (const [type, zone] of Object.entries(VampireGameObjectivePart2)) {
            this.targetFactory.createForBoxZone(`halloween_vampire_objective_part2_${type}`, zone, [
                {
                    label: VampireGameLabel(type as VampireGameObjectiveTypePart2),
                    category: 'citizen',
                    event: 'vampire:game',
                    canInteract: async () => {
                        if (!this.gameState.isGameRunning()) return false;
                        if (!this.gameState.getObjectivePart2()) return false;
                        if (this.gameState.hasEnemyRole()) return false;

                        return !this.gameState.isObjectivePart2Finished(type as VampireGameObjectiveTypePart2);
                    },
                    action: async () => {
                        TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_TAKE_OBJECTIVE_PART2, type);
                    },
                },
            ]);

            this.playerInOutService.add(
                `io_halloween_vampire_objective_part2_${type}`,
                new BoxZone(zone.center, zone.length + 30, zone.width + 30, {
                    minZ: zone.minZ,
                    maxZ: zone.maxZ,
                }),
                isInside => {
                    if (!this.gameState.isGameRunning()) return;
                    if (!this.gameState.getObjectivePart2()) return;
                    if (this.gameState.hasEnemyRole()) return;

                    if (isInside) {
                        this.instructionalService.display(
                            this.gameState.getObjectivePart2Instructions(type as VampireGameObjectiveTypePart2),
                            true
                        );
                    } else {
                        this.instructionalService.clear();
                    }
                }
            );
        }

        // Trigger game start if a game is already running
        setTimeout(async () => {
            if (!this.gameState.isGameRunning()) return;

            await this.onGameStart();
            await this.syncModel(this.gameState.getRole());
            await this.displayRoleObjective(this.gameState.getRole());
        }, 10_000);
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE)
    public async onGameStateUpdate(state: Partial<VampireGameClientState>) {
        if (this.gameState.isGameRunning() && !this.gameState.getCompleteState(state).started) {
            await this.onGameEnd();
        }

        this.gameState.setState(state);

        if (this.gameState.isGameStarting() && !this.gameState.isGameRunning()) {
            await this.onGameStart();
            await this.syncModel(this.gameState.getRole());
            await this.displayRoleObjective(this.gameState.getRole());
        }

        this.syncObjectivePart1(this.gameState.getObjectivePart1());
        this.syncObjectivePart2(this.gameState.getObjectivePart2());
        this.createEnemyTeleports();
        this.createMortalTeleports();
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_PLAYER_CONVERTED)
    public async onPlayerConverted(role: VampireGameRole) {
        this.gameState.setPlayerRespawning(true);

        const ped = PlayerPedId();
        let pos = GetEntityCoords(ped);
        const heading = GetEntityHeading(ped);

        StopScreenEffect('DeathFailOut');
        this.blurService.remove('dead', 1000);

        // be sure to remove the knockout effect before resurrecting
        TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_CANCEL_VAMPIRE_KNOCKOUT);

        if (role === VampireGameRole.Vampire) {
            const location = await this.mapPickerProvider.showSouthLocationPicker(VampireRespawnPoints);
            await this.playerPositionProvider.teleportPlayerToPosition(`halloween_vampire_respawn_${location.id}`);
            pos = location.coords;
        }

        NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, 1, false);
        SetEntityHealth(ped, GetPedMaxHealth(ped));

        await this.syncModel(role);
        await this.displayRole();

        await this.displayRoleObjective(this.gameState.getRole());
        this.gameState.setPlayerRespawning(false);
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_OBJECTIVE_PART1)
    public syncObjectivePart1(objective: Record<VampireGameCollection, Vector3[]>) {
        this.gameState.setState({ objectivePart1: objective });

        this.objectiveInteractions.forEach(interaction => {
            this.interactionProvider.deleteInteraction(interaction);
            this.blipFactory.remove(`halloween_vampire_objective_${interaction}`);
        });
        this.objectiveInteractions.clear();

        if (this.gameState.hasEnemyRole()) {
            return;
        }

        for (const [collection, objectives] of Object.entries(this.gameState.getObjectivePart1() ?? {})) {
            for (const objective of objectives) {
                const interactionId = this.interactionProvider.createInteractionForCoords(
                    [objective[0], objective[1], objective[2] + 0.7],
                    {
                        label: VampireGameLabel(collection as VampireGameCollection),
                        event: 'vampire:game',
                        action: async () => {
                            TaskTurnPedToFaceCoord(PlayerPedId(), objective[0], objective[1], objective[2], 500);
                            await wait(500);

                            TriggerServerEvent(
                                ServerEvent.HALLOWEEN_VAMPIRE_GAME_TAKE_OBJECTIVE_PART1,
                                collection,
                                objective
                            );
                        },
                    },
                    2,
                    15
                );

                this.objectiveInteractions.add(interactionId);
                this.blipFactory.create(
                    `halloween_vampire_objective_${interactionId}`,
                    {
                        name: VampireGameLabel(collection as VampireGameCollection),
                        coords: toVector3Object(objective),
                        sprite: VampireGameSprite(collection as VampireGameCollection),
                        color: 1,
                    },
                    true
                );
            }
        }
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_OBJECTIVE_PART2)
    public syncObjectivePart2(
        objective: Record<VampireGameObjectiveTypePart2, { playerRequired: number; finished: boolean }>
    ) {
        this.gameState.setState({ objectivePart2: objective });

        this.collectiveObjectives.forEach(id => {
            this.blipFactory.remove(`halloween_vampire_objective_${id}`);
        });
        this.collectiveObjectives.clear();

        if (this.gameState.hasEnemyRole()) {
            return;
        }

        for (const [objective, { finished }] of Object.entries(this.gameState.getObjectivePart2() ?? {})) {
            const id = uuidv4();
            this.blipFactory.create(
                `halloween_vampire_objective_${id}`,
                {
                    name: VampireGameLabel(objective as VampireGameObjectiveTypePart2),
                    coords: toVector3Object(VampireGameObjectivePart2[objective].center),
                    sprite: VampireGameSprite(objective as VampireGameObjectiveTypePart2),
                    color: finished ? 2 : 1,
                },
                true
            );

            this.collectiveObjectives.add(id);
        }
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_POSITION)
    public syncEnemyPosition(positions: Vector3[], isEnemy: boolean) {
        this.vampirePositionBlip.forEach(blipName => {
            this.blipFactory.remove(blipName);
        });
        this.vampirePositionBlip.clear();

        for (const [index, position] of positions.entries()) {
            const blipName = `halloween_vampire_position_${index}`;

            this.blipFactory.create(
                blipName,
                {
                    name: isEnemy ? 'Danger' : 'Viande fraîche',
                    coords: toVector3Object(position),
                    sprite: 1,
                    color: isEnemy ? 1 : 0,
                },
                true
            );
            this.vampirePositionBlip.add(blipName);
        }
    }

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    async onPlayerAttack(victim: number, attacker: number): Promise<void> {
        if (!this.gameState.isGameRunning()) return;

        const playerPed = PlayerPedId();
        if (playerPed !== attacker) return;

        if (!IsPedAPlayer(victim)) return;

        if (this.gameState.hasEnemyRole()) {
            const victimId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(victim));
            TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_KNOCK_PLAYER, victimId);
        }
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
        if (!this.gameState.isGameRunning()) return;
        if (!this.gameState.hasRole(VampireGameRole.Vampire)) return;

        const playerPed = PlayerPedId();
        const pos = GetEntityCoords(playerPed);
        const heading = GetEntityHeading(playerPed);

        if (playerPed !== victim) return;

        if (weaponHash === GetHashKey('weapon_musket')) {
            SetEntityHealth(playerPed, 0);
        } else if (isFatal) {
            NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, 1, false);
            SetEntityHealth(playerPed, GetPedMaxHealth(playerPed));
            TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_CANCEL_VAMPIRE_KNOCKOUT);
        } else {
            SetEntityHealth(playerPed, GetPedMaxHealth(playerPed));
        }
    }

    @Command('soz_halloween_vampire_game_menu', {
        description: 'Ouvre le menu du jeu Halloween Vampire',
        keys: [{ mapper: 'keyboard', key: 'H' }],
    })
    public async openMenu() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.isGameRunning()) return;
        if (!this.gameState.hasRole(VampireGameRole.Vampire)) return;
        if (this.playerStateProvider.getState().isKnockedOut) return;

        if (this.nuiMenu.getOpened() === MenuType.HalloweenVampire) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.HalloweenVampire);
    }

    @OnNuiEvent(NuiEvent.HalloweenVampireSwitchModel)
    public async switchModel(model: 'vampire' | 'crow' | 'wolf') {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.isGameRunning()) return;
        if (!this.gameState.hasRole(VampireGameRole.Vampire)) return;

        this.nuiMenu.closeMenu();
        await this.syncModel(this.gameState.getRole(), model);
    }

    @Tick(10 * TickInterval.EVERY_SECOND)
    public async onPlayerLeaveVehicle() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.isGameRunning()) return;
        if (!this.gameState.hasRole(VampireGameRole.Hunter)) return;

        const player = PlayerPedId();
        const weapon = GetHashKey(WeaponName.MUSKET);
        const weaponAmmo = 500;

        const [, hash] = GetCurrentPedWeapon(player, false);
        if (hash !== GetHashKey(WeaponName.UNARMED)) return;

        GiveWeaponToPed(player, weapon, weaponAmmo, false, true);
        SetPedAmmo(player, weapon, weaponAmmo);
        SetCurrentPedWeapon(player, weapon, true);
    }

    private async onGameStart() {
        const player = PlayerPedId();
        SwitchOutPlayer(player, 0, 2);

        this.playerWalkstyleProvider.updateWalkStyle('overloaded', null);
        this.weaponService.setDisabled('vampire-game', true);

        for (const [name] of this.blipFactory.getAll().entries()) {
            if (
                name.startsWith('halloween_vampire_objective_') ||
                this.blipFactory.isHidden(name) ||
                this.blipDisabled.has(name)
            ) {
                continue;
            }

            this.blipDisabled.add(name);
            this.blipFactory.hide(name, true);
        }
        this.blipFactory.qbHide('job_pawl', true);
        this.blipFactory.qbHide('job_upw', true);

        this.instructionalService.display(['Tu es désormais', this.gameState.getRole()], true);

        do {
            await wait(0);
        } while (this.gameState.isGameStarting() && !this.gameState.isGameRunning());

        this.instructionalService.clear();
        SwitchInPlayer(player);
    }

    private async onGameEnd() {
        this.blipDisabled.forEach(name => {
            this.blipFactory.hide(name, false);
        });
        this.blipFactory.qbHide('job_pawl', false);
        this.blipFactory.qbHide('job_upw', false);
        this.blipDisabled.clear();

        for (let i = 0; i < 10; i++) {
            ForceLightningFlash();
            await wait(10);
        }

        this.weaponService.setDisabled('vampire-game', false);
        this.instructionalService.clear();
        await this.syncModel(null);
        this.syncEnemyPosition([], false);
        this.gameState.setPlayerRespawning(false);

        const playerPed = PlayerPedId();
        SetEntityHealth(playerPed, 200);
    }

    private async syncModel(role: VampireGameRole, model?: string) {
        const player = this.playerService.getPlayer();
        const ped = PlayerPedId();

        await this.weaponService.clear();

        SetPedArmour(ped, 0);
        this.playerService.setNbArmorPlates(0);

        const pos = GetEntityCoords(ped);
        const weapon = GetHashKey(WeaponName.MUSKET);
        const weaponAmmo = 500;

        const isInsideVehicle = IsPedInAnyVehicle(ped, true);
        const [found, z] = GetGroundZFor_3dCoord_2(pos[0], pos[1], pos[2], false);

        if (!isInsideVehicle && found) {
            SetPedCoordsKeepVehicle(ped, pos[0], pos[1], z + 1.0);
        }

        // Reset ped and clothes
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');

        if (role === VampireGameRole.Vampire) {
            if (model === 'crow') {
                await this.skinService.setModel('a_c_crow');
            } else if (model === 'wolf') {
                await this.skinService.setModel('a_c_coyote');
            } else {
                this.playerService.setTempClothes(VampireOutfit[player.skin.Model.Hash]);
            }
        } else if (role === VampireGameRole.Ghoul) {
            this.playerService.setTempClothes(GhoulOutfit[player.skin.Model.Hash]);

            SetPedArmour(PlayerPedId(), 100);
            this.playerService.setNbArmorPlates(3);
        } else if (role === VampireGameRole.Hunter) {
            GiveWeaponToPed(ped, weapon, weaponAmmo, false, true);
            SetPedAmmo(ped, weapon, weaponAmmo);
            SetCurrentPedWeapon(ped, weapon, true);
        }
    }

    private async displayRole() {
        this.instructionalService.display(['Tu es désormais', this.gameState.getRole()], true);
        await wait(5000);
        this.instructionalService.clear();
    }

    @Command('soz_halloween_vampire_game_objective', {
        description: 'Affiche les objectifs du jeu Halloween Vampire',
        keys: [{ mapper: 'keyboard', key: 'GRAVE' }],
    })
    private async displayRoleObjective(role: VampireGameRole) {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;
        if (!this.gameState.isGameRunning()) return;

        if (!role) {
            role = this.gameState.getRole();
        }

        await this.displayRole();

        switch (role) {
            case VampireGameRole.Vampire:
                this.instructionalService.display(
                    [
                        "Dirige-toi en ville pour empêcher les survivants de rallumer l'électricité, et suce pour gagner des pouvoirs.",
                    ],
                    true
                );
                this.notifier.notify(
                    'En tant que Vampire tu peux te transformer. Appuie sur H pour ouvrir le menu.',
                    'info'
                );
                break;
            case VampireGameRole.Ghoul:
                this.instructionalService.display(
                    [
                        "Dirige-toi en ville pour empêcher les survivants de rallumer l'électricité, et suce pour gagner des pouvoirs.",
                    ],
                    true
                );
                break;
            case VampireGameRole.Hunter:
                this.instructionalService.display(
                    [
                        'En tant que Chasseur, tu peux tuer les Vampires à l’aide de ton Mousquet et tes Balles en Argent.',
                    ],
                    true
                );
                break;
            case VampireGameRole.Mortal:
                this.instructionalService.display(
                    [
                        "Dirige-toi en ville pour réparer l'électricité en accomplissant divers objectifs, et survie aux monstres.",
                    ],
                    true
                );
                break;
            case VampireGameRole.Squire:
                this.instructionalService.display(
                    [
                        'En tant qu’Écuyère, tu as le pouvoir de sentir la présence des vampires sur ta carte. Aide les Chasseurs à trouver les vampires et protège les Mortels.',
                    ],
                    true
                );
                break;
            case VampireGameRole.Alchemist:
                this.instructionalService.display(
                    [
                        'En tant qu’Alchimiste, tu as le pouvoir de réanimer les Goules en Mortel. Soigne-les dès que tu le peux.',
                    ],
                    true
                );
                break;
        }

        await wait(10000);
        this.instructionalService.clear();
    }

    private createEnemyTeleports() {
        const bins = this.objectProvider.getObjects(object => BIN_MODELS.includes(object.model));

        for (const bin of bins) {
            if (this.gameState.isGameRunning() && this.gameState.hasEnemyRole()) {
                if (this.blipFactory.exist(`vampire_tp_${bin.id}`)) {
                    continue;
                }

                this.blipFactory.create(
                    `vampire_tp_${bin.id}`,
                    {
                        name: 'Cercueil de vampire',
                        coords: {
                            x: bin.position[0],
                            y: bin.position[1],
                            z: bin.position[2],
                        },
                        sprite: 885,
                    },
                    true,
                    [
                        {
                            label: 'Téléporter',
                            action: async (blip: Blip, data: string) => {
                                SetFrontendActive(false);
                                TriggerServerEvent(ServerEvent.PLAYER_ZOMBIE_TP, data);
                            },
                            data: bin.id,
                        },
                    ]
                );
            } else {
                this.blipFactory.remove(`vampire_tp_${bin.id}`);
            }
        }
    }

    private createMortalTeleports() {
        Object.entries(MortalRespawnPoints).forEach(([id, location]) => {
            if (this.gameState.isGameRunning() && !this.gameState.hasEnemyRole()) {
                if (this.blipFactory.exist(`mortal_tp_${id}`)) {
                    return;
                }

                this.blipFactory.create(
                    `mortal_tp_${id}`,
                    {
                        name: 'Safe Zone',
                        coords: toVector3Object(location),
                        sprite: 40,
                    },
                    true,
                    [
                        {
                            label: 'Téléporter',
                            action: async (blip: Blip, data: string) => {
                                SetFrontendActive(false);
                                TriggerServerEvent(ServerEvent.PLAYER_MORTAL_TP, data);
                            },
                            data: id,
                        },
                    ]
                );
            } else {
                this.blipFactory.remove(`mortal_tp_${id}`);
            }
        });
    }
}
