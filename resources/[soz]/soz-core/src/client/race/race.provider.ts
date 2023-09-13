import { Exportable } from '@public/core/decorators/exports';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { Control } from '@public/shared/input';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { CylinderZone } from '@public/shared/polyzone/cylinder.zone';
import {
    getDurationStr,
    Race,
    RaceCheckpointMenuOptions,
    RaceLaunchMenuOptions,
    RaceRankingInfo,
    RaceUpdateMenuOptions,
    RaceVehConfigurationOptions,
    SplitInfo,
} from '@public/shared/race';
import { getRandomInt } from '@public/shared/random';
import { Err, Ok } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';
import { GarageCategory, GarageType, PlaceCapacity } from '@public/shared/vehicle/garage';
import { VehicleColor, VehicleModType } from '@public/shared/vehicle/modification';
import { getDefaultVehicleVolatileState } from '@public/shared/vehicle/vehicle';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { toVector4Object, Vector2, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { BlipFactory } from '../blip';
import { PedFactory } from '../factory/ped.factory';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { ObjectProvider } from '../object/object.provider';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { RaceRepository } from '../repository/race.repository';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetFactory } from '../target/target.factory';
import { VehicleGarageProvider } from '../vehicle/vehicle.garage.provider';
import { VehicleModificationService } from '../vehicle/vehicle.modification.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { VehicleStateService } from '../vehicle/vehicle.state.service';

const npcModel = 's_m_m_autoshop_02';

@Provider()
export class RaceProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(RaceRepository)
    private raceRepository: RaceRepository;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleGarageProvider)
    private vehicleGarageProvider: VehicleGarageProvider;

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    private inRace = false;
    private preRace = false;
    private currentAdminMenuRace: string = null;

    @Once(OnceStep.Start)
    public onStart() {
        this.targetFactory.createForModel(npcModel, [
            {
                label: 'Lancer la course',
                icon: 'c:race/launch.png',
                canInteract: entity => {
                    return !!Object.values(this.raceRepository.get()).find(race => race.npc == entity);
                },
                action: entity => {
                    const race = Object.values(this.raceRepository.get()).find(race => race.npc == entity);
                    this.startRace(race.id, false);
                },
            },
            {
                label: 'Classement',
                icon: 'c:race/score.png',
                canInteract: entity => {
                    return !!Object.values(this.raceRepository.get()).find(race => race.npc == entity);
                },
                action: entity => {
                    const race = Object.values(this.raceRepository.get()).find(race => race.npc == entity);
                    this.nuiMenu.openMenu(MenuType.RaceRank, { id: race.id, name: race.name });
                },
            },
            {
                label: 'Accéder au parking temporaire',
                icon: 'c:garage/ParkingPublic.png',
                canInteract: entity => {
                    const race = Object.values(this.raceRepository.get()).find(race => race.npc == entity);
                    return race && race.garageLocation != null;
                },
                action: entity => {
                    const race = Object.values(this.raceRepository.get()).find(race => race.npc == entity);
                    const id = 'race' + race.id;
                    this.vehicleGarageProvider.enterGarage(id, {
                        category: GarageCategory.All,
                        type: GarageType.Public,
                        id: id,
                        name: id,
                        parkingPlaces: [
                            {
                                center: race.garageLocation,
                                heading: race.garageLocation[3],
                                data: {
                                    capacity: [PlaceCapacity.Small, PlaceCapacity.Medium, PlaceCapacity.Large],
                                },
                            },
                        ],
                        zone: {
                            center: race.npcPosition,
                        },
                    });
                },
            },
        ]);
    }

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoriesLoaded() {
        const races = this.raceRepository.get();
        for (const race of Object.values(races)) {
            if (!race.enabled) {
                continue;
            }

            await this.addNpc(race);
        }
    }

    @Tick(TickInterval.EVERY_FRAME, 'race-display')
    public displayLoop() {
        const races = this.raceRepository.get();
        for (const race of Object.values(races)) {
            if (!race.display) {
                continue;
            }

            new BoxZone(race.start, 1.0, 1.0, {
                heading: race.start[3],
                minZ: race.start[2],
                maxZ: race.start[2] + 2,
            }).draw([0, 255, 0], 128, 'START');
            new BoxZone(race.npcPosition, 1.0, 1.0, {
                heading: race.npcPosition[3],
                minZ: race.npcPosition[2],
                maxZ: race.npcPosition[2] + 2,
            }).draw([0, 255, 0], 128, 'PNJ');
            if (race.garageLocation) {
                new BoxZone(race.garageLocation, 1.0, 1.0, {
                    heading: race.garageLocation[3],
                    minZ: race.garageLocation[2],
                    maxZ: race.garageLocation[2] + 2,
                }).draw([0, 255, 0], 128, 'Garage Spawn');
            }
            race.checkpoints.forEach((checkpoint, index) =>
                new CylinderZone(
                    [checkpoint[0], checkpoint[1]] as Vector2,
                    checkpoint[3],
                    checkpoint[2] - checkpoint[3] / 2,
                    checkpoint[2] + checkpoint[3] / 2
                ).draw([255, 0, 0], 128, (index + 1).toString())
            );
        }
    }

    @OnNuiEvent(NuiEvent.RaceAdminMenuOpen)
    public async onRaceAdminMenuOpen() {
        this.nuiMenu.openMenu(MenuType.RaceAdmin, Object.values(this.raceRepository.get()));
    }

    @OnNuiEvent(NuiEvent.RaceAdd)
    public async onRaceAdd() {
        const name = await this.askName();
        if (!name) {
            return;
        }

        await wait(100);

        const model = await this.askModel();
        if (!model) {
            return;
        }

        const playerPed = PlayerPedId();
        const coords = GetEntityCoords(playerPed);
        const heading = GetEntityHeading(playerPed);

        const race = {
            name: name,
            carModel: model,
            checkpoints: [],
            enabled: false,
            id: 0,
            npcPosition: [coords[0], coords[1], coords[2] - 1, heading],
            start: [coords[0], coords[1], coords[2] - 1, heading],
        } as Race;

        TriggerServerEvent(ServerEvent.RACE_ADD, race);
    }

    private async askName() {
        return this.inputService.askInput(
            {
                title: 'Nom de la course',
                maxCharacters: 50,
                defaultValue: '',
            },
            value => {
                const locations = this.raceRepository.get();

                if (!value) {
                    return Ok(true);
                }

                if (Object.values(locations).find(elem => elem.name.toLocaleLowerCase() == value.toLocaleLowerCase())) {
                    return Err('Une course avec ce nom existe déjà');
                }

                return Ok(true);
            }
        );
    }

    private async askModel() {
        return this.inputService.askInput(
            {
                title: 'Modèle de voiture',
                maxCharacters: 50,
                defaultValue: '',
            },
            value => {
                if (!value) {
                    return Ok(true);
                }

                if (value == 'ped') {
                    return Ok(true);
                }

                const hash = GetHashKey(value);
                if (!IsModelValid(hash)) {
                    return Err("Ce modèle n'existe pas");
                }
                if (!IsModelAVehicle(hash)) {
                    return Err("Ce modèle n'est pas un vehicule");
                }

                return Ok(true);
            }
        );
    }

    private async askRadius() {
        return await this.inputService.askInput(
            {
                title: 'Rayon',
                maxCharacters: 3,
                defaultValue: '5',
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
    }

    @OnNuiEvent(NuiEvent.RaceEnable)
    public async onRaceEnable({ raceId, enabled }: { raceId: number; enabled: boolean }) {
        const race = this.raceRepository.find(raceId);
        race.enabled = enabled;
        TriggerServerEvent(ServerEvent.RACE_UPDATE, race);
    }

    @OnNuiEvent(NuiEvent.RaceFps)
    public async onRaceFps({ raceId, enabled }: { raceId: number; enabled: boolean }) {
        const race = this.raceRepository.find(raceId);
        race.fps = enabled;
        TriggerServerEvent(ServerEvent.RACE_UPDATE, race);
    }

    @OnNuiEvent(NuiEvent.RaceRename)
    public async onRaceRename(raceId: number) {
        const name = await this.askName();

        if (!name) {
            return;
        }

        const race = this.raceRepository.find(raceId);
        race.name = name;

        TriggerServerEvent(ServerEvent.RACE_UPDATE, race);
    }

    @OnNuiEvent(NuiEvent.RaceUpdateLocation)
    public async onRaceUpdateLocation({ raceId, option }: { option: RaceUpdateMenuOptions; raceId: number }) {
        const race = this.raceRepository.find(raceId);

        const playerPed = PlayerPedId();
        const coords = GetEntityCoords(playerPed);
        const heading = GetEntityHeading(playerPed);

        const loc = [coords[0], coords[1], coords[2] - 1, heading] as Vector4;

        switch (option) {
            case RaceUpdateMenuOptions.npc:
                race.npcPosition = loc;
                break;
            case RaceUpdateMenuOptions.garage:
                race.garageLocation = loc;
                break;
            case RaceUpdateMenuOptions.start:
                race.start = loc;
                break;
        }

        TriggerServerEvent(ServerEvent.RACE_UPDATE, race);
    }

    @OnNuiEvent(NuiEvent.RaceUpdateCarModel)
    public async onRaceUpdateCarModel(raceId: number) {
        const model = await this.askModel();
        if (!model) {
            return;
        }

        const race = this.raceRepository.find(raceId);
        race.carModel = model;

        TriggerServerEvent(ServerEvent.RACE_UPDATE, race);
    }

    @OnNuiEvent(NuiEvent.RaceVehConfiguration)
    public async onRaceVehVonfiguration({ raceId, option }: { option: RaceVehConfigurationOptions; raceId: number }) {
        const race = this.raceRepository.find(raceId);

        switch (option) {
            case RaceVehConfigurationOptions.default:
                race.vehicleConfiguration = null;
                break;
            case RaceVehConfigurationOptions.current:
                {
                    const ped = PlayerPedId();
                    const vehicle = GetVehiclePedIsIn(ped, false);
                    if (!vehicle) {
                        this.notifier.error("Tu n'es pas dans un véhicle");
                        return;
                    }

                    if (GetEntityModel(vehicle) != GetHashKey(race.carModel)) {
                        this.notifier.error("Tu n'es pas dans le bon modèle de véhicle");
                        return;
                    }

                    const configuration = this.vehicleModificationService.getVehicleConfiguration(vehicle);
                    race.vehicleConfiguration = configuration;
                }
                break;
        }

        TriggerServerEvent(ServerEvent.RACE_UPDATE, race);
    }

    @OnNuiEvent(NuiEvent.RaceDelete)
    public async onRaceDelete(raceId: number) {
        TriggerServerEvent(ServerEvent.RACE_DELETE, raceId);
    }

    @OnNuiEvent(NuiEvent.RaceMenuLaunch)
    public async onRaceLaunch({ raceId, option }: { option: RaceLaunchMenuOptions; raceId: number }) {
        this.startRace(raceId, option == RaceLaunchMenuOptions.test);
    }

    @OnNuiEvent(NuiEvent.RaceAddCheckpoint)
    public async onRaceAddCheckpoint({ raceId, index }: { raceId: number; index: number }) {
        const radius = await this.askRadius();

        if (!radius) {
            return;
        }

        const playerPed = PlayerPedId();
        const coords = GetEntityCoords(playerPed);

        const race = this.raceRepository.find(raceId);
        race.checkpoints.splice(index, 0, [...coords, parseInt(radius)] as Vector4);

        TriggerServerEvent(ServerEvent.RACE_UPDATE, race);
    }

    @OnNuiEvent(NuiEvent.RaceUpdateCheckPoint)
    public async RaceUpdateCheckPoint({
        raceId,
        option,
        index,
    }: {
        option: RaceCheckpointMenuOptions;
        raceId: number;
        index: number;
    }) {
        const race = this.raceRepository.find(raceId);

        switch (option) {
            case RaceCheckpointMenuOptions.delete:
                race.checkpoints.splice(index, 1);
                break;
            case RaceCheckpointMenuOptions.edit:
                {
                    const radius = await this.askRadius();

                    if (!radius) {
                        return;
                    }

                    const playerPed = PlayerPedId();
                    const coords = GetEntityCoords(playerPed);

                    const race = this.raceRepository.find(raceId);
                    race.checkpoints[index] = [...coords, parseInt(radius)] as Vector4;
                }
                break;
            case RaceCheckpointMenuOptions.goto:
                {
                    const race = this.raceRepository.find(raceId);
                    this.playerPositionProvider.teleportPlayerToPosition(race.checkpoints[index]);
                }
                return;
        }

        TriggerServerEvent(ServerEvent.RACE_UPDATE, race);
    }

    @OnNuiEvent(NuiEvent.RaceDisplay)
    public async onRaceDisplay({ raceId, enabled }: { raceId: number; enabled: boolean }) {
        const race = this.raceRepository.find(raceId);
        race.display = enabled;
    }

    @OnNuiEvent(NuiEvent.RaceTPStart)
    public async onRaceTPStart(raceId: number) {
        const race = this.raceRepository.find(raceId);
        this.playerPositionProvider.teleportPlayerToPosition(race.start);
    }

    @OnNuiEvent(NuiEvent.RaceCurrrent)
    public async onRaceCurrrent(raceId: string) {
        this.currentAdminMenuRace = raceId;
    }

    @OnNuiEvent(NuiEvent.RaceClearRanking)
    public async onRaceClearRanking(raceId: number) {
        TriggerServerEvent(ServerEvent.RACE_CLEAR_RANKING, raceId);
    }

    @OnNuiEvent(NuiEvent.RaceGetRanking)
    public async onRaceGetRanking(raceId: number) {
        return await emitRpc<RaceRankingInfo>(RpcServerEvent.RACE_GET_RANKING, raceId);
    }

    private async startRace(raceId: number, test: boolean) {
        const race = this.raceRepository.find(raceId);
        const start = Date.now();

        const hash = GetHashKey(race.carModel);
        if (race.carModel != 'ped' && (!IsModelInCdimage(hash) || !IsModelAVehicle(hash))) {
            this.notifier.error(`could not load model with given hash or model name ${race.carModel} ${hash}`);

            return;
        }

        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped);
        const heading = GetEntityHeading(ped);

        const [bestRun, bestSplits] = await emitRpc<[number[], number[]]>(RpcServerEvent.RACE_GET_SPLITS, race.id);

        this.inRace = true;
        const view = GetFollowPedCamViewMode();
        if (race.fps) {
            this.firstPersonCheck();
        }

        this.objectProvider.disable();

        SetEntityInvincible(ped, true);
        SetPlayerInvincible(PlayerId(), true);

        let vehicle = null;
        if (race.carModel != 'ped') {
            await this.resourceLoader.loadModel(hash);

            vehicle = CreateVehicle(hash, race.start[0], race.start[1], race.start[2], race.start[3], false, false);
            SetVehRadioStation(vehicle, 'OFF');
            this.vehicleStateService.setVehicleState(
                vehicle,
                {
                    ...getDefaultVehicleVolatileState(),
                },
                true
            );

            if (race.vehicleConfiguration) {
                this.vehicleService.applyVehicleConfiguration(vehicle, race.vehicleConfiguration);
            } else {
                SetVehicleModKit(vehicle, 0);
                ToggleVehicleMod(vehicle, VehicleModType.Turbo, true);
                SetVehicleMod(
                    vehicle,
                    VehicleModType.Engine,
                    GetNumVehicleMods(vehicle, VehicleModType.Engine) - 1,
                    false
                );
                SetVehicleMod(
                    vehicle,
                    VehicleModType.Brakes,
                    GetNumVehicleMods(vehicle, VehicleModType.Brakes) - 1,
                    false
                );
                SetVehicleMod(
                    vehicle,
                    VehicleModType.Transmission,
                    GetNumVehicleMods(vehicle, VehicleModType.Transmission) - 1,
                    false
                );
                SetVehicleColours(
                    vehicle,
                    getRandomInt(0, VehicleColor.BrushedGold),
                    getRandomInt(0, VehicleColor.BrushedGold)
                );
            }

            await wait(100);

            TaskWarpPedIntoVehicle(ped, vehicle, -1);

            this.resourceLoader.unloadModel(hash);
        } else {
            await this.playerPositionProvider.teleportPlayerToPosition(race.start);
        }

        await emitRpc(RpcServerEvent.RACE_SERVER_START);

        const result = await this.runRace(race, ped, vehicle, bestRun, bestSplits);

        await emitRpc(RpcServerEvent.RACE_SERVER_EXIT);

        DoScreenFadeOut(500);
        await wait(500);

        if (!race.fps) {
            RenderScriptCams(false, false, 0, false, false);
            DestroyAllCams(true);
        }

        if (vehicle) {
            DeleteVehicle(vehicle);
        }

        await this.playerPositionProvider.teleportPlayerToPosition([...coords, heading] as Vector4);

        this.objectProvider.enable();

        await wait(200);

        SetEntityInvincible(ped, false);
        SetPlayerInvincible(PlayerId(), false);
        SetFollowPedCamViewMode(view);

        this.monitor.publish(
            'race_finish',
            {
                race: race.id,
            },
            {
                name: race.name,
                time: result != null ? result[0][result[0].length - 1] : 0,
                duration: Date.now() - start,
                complete: !test && result,
            }
        );

        if (!test && result) {
            TriggerServerEvent(ServerEvent.RACE_FINISH, raceId, result);
        }
    }

    private async firstPersonCheck() {
        SetFollowPedCamViewMode(4);
        while (this.inRace) {
            if (GetFollowPedCamViewMode() != 4) {
                SetFollowPedCamViewMode(4);
            }

            DisableControlAction(0, Control.NextCamera, true);
            await wait(0);
        }
    }

    private async pedRaceFreeze() {
        while (this.preRace) {
            DisableControlAction(0, Control.Sprint, true);
            DisableControlAction(0, Control.Enter, true);
            DisableControlAction(0, Control.MoveLeftRight, true);
            DisableControlAction(0, Control.MoveUpDown, true);
            DisableControlAction(0, Control.Duck, true);
            DisableControlAction(0, Control.Jump, true);
            DisableControlAction(0, Control.VehicleAccelerate, true);
            DisableControlAction(0, Control.VehicleFlyThrottleUp, true);
            DisableControlAction(0, Control.VehicleSubThrottleUp, true);
            DisableControlAction(0, Control.VehiclePushbikePedal, true);
            await wait(0);
        }
    }

    private async runRace(race: Race, ped: number, veh: number, bestRun: number[], bestSplits: number[]) {
        let checkpointHandle = 0;
        let blipHandle = 0;
        const raceData: number[] = Array(race.checkpoints.length + 1);

        const splits: SplitInfo[] = Array(race.checkpoints.length).fill({
            current: false,
            delta: 0,
            deltaColor: null,
            time: 0,
        });
        if (!bestRun) {
            bestRun = Array(race.checkpoints.length).fill(0);
        }

        for (let k = 0; k < bestRun.length; k++) {
            if (k < splits.length) {
                splits[k] = {
                    current: false,
                    delta: 0,
                    deltaColor: null,
                    time: bestRun[k],
                } as SplitInfo;
            }
        }
        splits[0].current = true;

        this.nuiDispatch.dispatch('race', 'SetSplits', splits);

        let result: [number[], number[]] = null;
        this.inRace = true;
        this.preRace = true;

        if (
            veh &&
            !IsThisModelABicycle(race.carModel) &&
            !IsThisModelAHeli(race.carModel) &&
            !IsThisModelAPlane(race.carModel)
        ) {
            SetVehicleHandbrake(veh, true);
            SetVehicleBrake(veh, true);
        } else {
            this.pedRaceFreeze();
        }

        PlaySoundFrontend(-1, '5S', 'MP_MISSION_COUNTDOWN_SOUNDSET', false);
        await wait(1000);

        this.nuiDispatch.dispatch('race', 'setCountDown', '3');
        await wait(1000);

        this.nuiDispatch.dispatch('race', 'setCountDown', '2');
        await wait(1000);

        this.nuiDispatch.dispatch('race', 'setCountDown', '1');
        await wait(1000);

        this.nuiDispatch.dispatch('race', 'setCountDown', 'GO');

        setTimeout(() => this.nuiDispatch.dispatch('race', 'setCountDown', null), 1000);

        raceData[0] = Date.now();
        this.nuiDispatch.dispatch('race', 'setStart', raceData[0]);

        if (veh) {
            SetVehicleHandbrake(veh, false);
            SetVehicleBrake(veh, false);
        }
        this.preRace = false;

        for (let index = 0; index < race.checkpoints.length; index++) {
            const checkpoint = race.checkpoints[index];
            const nextCoords = index + 1 >= race.checkpoints.length ? [0, 0, 0, 0] : race.checkpoints[index + 1];
            const checkpointType = index + 1 >= race.checkpoints.length ? 4 : 2;

            if (checkpointHandle) {
                DeleteCheckpoint(checkpointHandle);
            }

            checkpointHandle = CreateCheckpoint(
                checkpointType,
                checkpoint[0],
                checkpoint[1],
                checkpoint[2] - 1,
                nextCoords[0],
                nextCoords[1],
                nextCoords[2],
                checkpoint[3] * 2,
                255,
                255,
                0,
                127,
                0
            );

            if (DoesBlipExist(blipHandle)) {
                RemoveBlip(blipHandle);
            }

            blipHandle = AddBlipForCoord(checkpoint[0], checkpoint[1], checkpoint[2]);
            SetBlipColour(blipHandle, 46);
            SetBlipAsShortRange(blipHandle, true);
            ShowNumberOnBlip(blipHandle, index + 1);
            SetBlipRoute(blipHandle, true);

            const zone = new CylinderZone(
                [checkpoint[0], checkpoint[1]] as Vector2,
                checkpoint[3],
                checkpoint[2] - checkpoint[3] / 2,
                checkpoint[2] + checkpoint[3] / 2
            );

            while (!zone.isPointInside(GetEntityCoords(ped) as Vector3)) {
                if (veh && !IsPedInAnyVehicle(ped, false)) {
                    break;
                }
                if (!veh && IsPedRagdoll(ped)) {
                    break;
                }
                await wait(1);
            }
            if (veh && !IsPedInAnyVehicle(ped, false)) {
                break;
            }
            if (!veh && IsPedRagdoll(ped)) {
                break;
            }

            raceData[index + 1] = Date.now();

            if (index + 1 < race.checkpoints.length) {
                PlaySoundFrontend(-1, 'CHECKPOINT_NORMAL', 'HUD_MINI_GAME_SOUNDSET', false);
                splits[index + 1].current = true;
            } else {
                PlaySoundFrontend(-1, 'FIRST_PLACE', 'HUD_MINI_GAME_SOUNDSET', true);

                let newBestRun = bestRun;
                if (!bestRun[index] || bestRun[index] > raceData[index + 1] - raceData[0]) {
                    newBestRun = raceData.map(time => time - raceData[0]);
                    newBestRun.splice(0, 1);
                }

                if (!bestSplits) {
                    bestSplits = Array(race.checkpoints.length).fill(0);
                }

                for (let raceIndex = 0; raceIndex < race.checkpoints.length; raceIndex++) {
                    const curSplit = raceData[raceIndex + 1] - raceData[raceIndex];
                    bestSplits[raceIndex] = !bestSplits[raceIndex]
                        ? curSplit
                        : Math.min(bestSplits[raceIndex], curSplit);
                }

                result = [newBestRun, bestSplits];

                this.nuiDispatch.dispatch('race', 'setEnd', raceData[index + 1]);

                this.notifier.notify(
                    `Mes ~g~félicitations~s~ ! Tu as réussi à terminer la ~y~${race.name}~s~ en ~g~${getDurationStr(
                        raceData[index + 1] - raceData[0]
                    )}~s~ !`
                );
            }

            splits[index].current = false;
            splits[index].time = raceData[index + 1] - raceData[0];
            if (bestRun[index]) {
                splits[index].delta = splits[index].time - bestRun[index];
                splits[index].deltaColor = splits[index].delta > 0 ? 'text-red-500' : 'text-green-500';
                if (bestSplits && raceData[index + 1] - raceData[index] < bestSplits[index]) {
                    splits[index].deltaColor = 'text-yellow-500';
                }
            }
            this.nuiDispatch.dispatch('race', 'SetSplits', splits);
        }

        if (DoesBlipExist(blipHandle)) {
            RemoveBlip(blipHandle);
        }
        if (checkpointHandle) {
            DeleteCheckpoint(checkpointHandle);
        }

        if (veh) {
            SetVehicleHandbrake(veh, true);
            SetVehicleBrake(veh, true);
        }

        if (!race.fps) {
            const camPos = GetGameplayCamCoord();

            const camera = CreateCamWithParams(
                'DEFAULT_SCRIPTED_CAMERA',
                camPos[0],
                camPos[1],
                camPos[2],
                0.0,
                0.0,
                0.0,
                60.0,
                false,
                0
            );

            PointCamAtEntity(camera, ped, 0.0, 0.0, 0.0, false);
            SetCamActive(camera, true);
            RenderScriptCams(true, true, 1, true, true);
        }

        await wait(2000);

        this.inRace = false;
        this.nuiDispatch.dispatch('race', 'SetSplits', null);

        return result;
    }

    @OnEvent(ClientEvent.RACE_DELETE)
    public async onRaceServerDelete(raceId: number) {
        const race = this.raceRepository.find(raceId);
        if (race.npc) {
            await this.removeNpc(race);
        }

        this.raceRepository.deleteRace(raceId);
        if (this.nuiMenu.getOpened() == MenuType.RaceAdmin) {
            this.nuiMenu.closeAll();
            this.nuiMenu.openMenu(MenuType.RaceAdmin, Object.values(this.raceRepository.get()));
        }
    }

    @OnEvent(ClientEvent.RACE_ADD_UPDATE)
    public async onRaceServerUpdate(race: Race) {
        race = this.raceRepository.updateRace(race);

        if (race) {
            if (race.enabled) {
                await this.addNpc(race);
            } else {
                await this.removeNpc(race);
            }
        }

        if (
            this.nuiMenu.getOpened() == MenuType.RaceAdmin &&
            (this.currentAdminMenuRace == null || this.currentAdminMenuRace == race.id.toString())
        ) {
            this.nuiMenu.closeAll();
            this.nuiMenu.openMenu(MenuType.RaceAdmin, Object.values(this.raceRepository.get()), {
                subMenuId: this.currentAdminMenuRace,
            });
        }
    }

    private async addNpc(race: Race) {
        if (race.npc && DoesEntityExist(race.npc)) {
            SetEntityCoords(
                race.npc,
                race.npcPosition[0],
                race.npcPosition[1],
                race.npcPosition[2],
                false,
                false,
                false,
                false
            );
            SetEntityHeading(race.npc, race.npcPosition[3]);
        } else {
            race.npc = await this.pedFactory.createPed({
                model: npcModel,
                coords: toVector4Object(race.npcPosition),
                blockevents: true,
                freeze: true,
                invincible: true,
                scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
            });
        }

        const blibId = 'race' + race.id;
        if (this.blipFactory.exist(blibId)) {
            this.blipFactory.remove(blibId);
        }

        this.blipFactory.create(blibId, {
            coords: {
                x: race.npcPosition[0],
                y: race.npcPosition[1],
            },
            name: race.name,
            sprite: 309,
        });
    }

    private async removeNpc(race: Race) {
        if (race.npc && DoesEntityExist(race.npc)) {
            DeleteEntity(race.npc);
        }

        const blibId = 'race' + race.id;
        if (this.blipFactory.exist(blibId)) {
            this.blipFactory.remove(blibId);
        }
    }

    @Exportable('IsInRace')
    public isInRace() {
        return this.inRace;
    }
}
