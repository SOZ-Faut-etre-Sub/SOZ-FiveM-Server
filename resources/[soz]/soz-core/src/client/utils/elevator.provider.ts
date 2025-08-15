import { CasinoVipService } from '@private/client/casino/casino.vip.service';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { RepositoryUpdate } from '@public/core/decorators/repository';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import {
    DynamicElevator,
    DynamicElevatorConfigs,
    DynamicElevatorParams,
    DynamicElevatorState,
    ElevatorDirection,
    ElevatorDirectionDisplay,
    ElevatorFloor,
    Elevators,
    Interior,
    InteriorsLocation,
} from '@public/shared/elevators';
import { ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import {
    add2Vector3,
    getDistance,
    multVector3,
    sub2Vector3,
    toVectorNorm,
    Vector3,
} from '@public/shared/polyzone/vector';
import { RepositoryType } from '@public/shared/repository';

import { Provider } from '../../core/decorators/provider';
import { TargetOption } from '../../shared/target';
import { AnimationService } from '../animation/animation.service';
import { FeatureProvider } from '../feature/feature.provider';
import { ObjectService } from '../object/object.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { ElevatorRepository } from '../repository/elevator.repository';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class ElevatorProvider {
    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(ObjectService)
    public objectService: ObjectService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(ResourceLoader)
    public resourceLoader: ResourceLoader;

    @Inject(ElevatorRepository)
    public elevatorRepository: ElevatorRepository;

    @Inject(AnimationService)
    public animationService: AnimationService;

    @Inject(CasinoVipService)
    public casinoVipService: CasinoVipService;

    @Inject(FeatureProvider)
    public featureProvider: FeatureProvider;

    private elevators = new Map<DynamicElevator, number>();
    private closeElevator = new Map<DynamicElevator, boolean>();
    private elevatorDimentions = new Map<number, [number[], number[]]>();
    private doors = new Map<string, number>();
    private doorsMovement = new Map<
        string,
        {
            offset: Vector3;
            target: Vector3;
            norm: number;
            interior: number;
            room: string;
        }
    >();
    private doorInternal = new Map<DynamicElevator, number[]>();
    private musicSound: number = -1;
    private interiorIds = new Map<Interior, number>();

    @Once()
    public onStart() {
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        for (const [id, value] of Object.entries(Elevators)) {
            this.targetFactory.createForBoxZone('Elevator:' + id, value.button, this.createTargetOptions(value), 3.0);
        }

        for (const elevator of Object.values(DynamicElevator)) {
            const config = DynamicElevatorConfigs[elevator];
            this.targetFactory.createForBoxZone(
                elevator + '_emergency',
                config.emergency,
                [
                    {
                        label: 'Sortie de secours',
                        category: 'citizen',
                        action: () => {
                            this.playerPositionProvider.teleportAdminToPosition(config.emergencyTarget);
                        },
                    },
                ],
                3.0
            );
        }
    }

    private createTargetOptions(elevator: ElevatorFloor) {
        const options: TargetOption[] = [];
        for (const direction of Object.values(ElevatorDirection)) {
            const destinations = elevator[direction];

            for (const destination of destinations) {
                if (destination) {
                    const display = ElevatorDirectionDisplay[direction];
                    const destinationFloor = Elevators[destination];
                    options.push({
                        icon: display.icon,
                        label: display.label + destinationFloor.label,
                        category: 'citizen',
                        action: () => {
                            this.playerPositionProvider.teleportAdminToPosition(destinationFloor.spawnPoint);
                        },
                        canInteract: destinationFloor.requireCasinoVip
                            ? () => this.casinoVipService.hasVipPremium()
                            : undefined,
                        job: destinationFloor.job,
                    });
                }
            }
        }

        return options;
    }

    @Once(OnceStep.RepositoriesLoaded)
    public async repoLoaded() {
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }
        for (const interior of Object.values(Interior)) {
            const coords = InteriorsLocation[interior];
            this.interiorIds.set(interior, GetInteriorAtCoords(coords[0], coords[1], coords[2]));
        }

        for (const elevator of Object.values(DynamicElevator)) {
            const config = DynamicElevatorConfigs[elevator];
            const state = this.elevatorRepository.find(elevator);

            const obj = await this.objectService.createObject({
                id: 'elevator' + elevator,
                model: GetHashKey(config.model),
                position: [config.position[0], config.position[1], config.floors[state.current].z, config.heading],
            });
            if (config.floors[state.current].interior) {
                ForceRoomForEntity(
                    obj,
                    this.interiorIds.get(config.floors[state.current].interior),
                    config.floors[state.current].room
                );
            }
            this.elevatorDimentions.set(GetHashKey(config.model), GetModelDimensions(GetEntityModel(obj)));

            this.elevators.set(elevator, obj);

            const doorInternalList = [];
            config.doorsInternal.map(async (doorInternal, doorInternalIndex) => {
                const id = 'elevator_doorInternal_' + elevator + '_' + doorInternalIndex;
                const entity = await this.objectService.createObject({
                    id,
                    model: GetHashKey(config.doormodel),
                    position: [
                        doorInternal.close[0],
                        doorInternal.close[1],
                        config.floors[state.current].doorz,
                        config.heading,
                    ],
                });
                doorInternalList.push(entity);
                this.doors.set(id, entity);
                if (config.floors[state.current].interior) {
                    ForceRoomForEntity(
                        entity,
                        this.interiorIds.get(config.floors[state.current].interior),
                        config.floors[state.current].room
                    );
                }
            });
            this.doorInternal.set(elevator, doorInternalList);

            config.floors.map(async (floor, floorIndex) => {
                floor.doors.map(async (door, doorIndex) => {
                    const id = 'elevator_door_' + elevator + '_' + floorIndex + '_' + doorIndex;
                    const entity = await this.objectService.createObject({
                        id,
                        model: GetHashKey(config.doormodel),
                        position: [door.close[0], door.close[1], floor.doorz, config.heading],
                    });
                    this.doors.set(id, entity);
                    if (floor.interior != null) {
                        ForceRoomForEntity(entity, this.interiorIds.get(floor.interior), floor.room);
                    }
                });

                this.targetFactory.createForBoxZone('elevator_button_' + elevator + '_' + floorIndex, floor.button, [
                    {
                        category: 'citizen',
                        label: "Appeler l'acenseur",
                        icon: 'elevators/monter',
                        action: async () => {
                            this.animationService.playAnimation({
                                base: {
                                    dictionary: 'mp_doorbell',
                                    name: 'ring_bell_b',
                                    options: {
                                        onlyUpperBody: true,
                                    },
                                },
                            });
                            TriggerServerEvent(ServerEvent.ELEVATOR_CALL, elevator, floorIndex);
                        },
                    },
                ]);
            });

            this.targetFactory.createForEntity(
                obj,
                config.floors.map((elem, index) => ({
                    category: 'citizen',
                    label: elem.label,
                    icon: 'elevators/monter',
                    order: elem.order,
                    canInteract: entity => this.isInside(entity),
                    action: async () => {
                        this.animationService.playAnimation({
                            base: {
                                dictionary: 'mp_doorbell',
                                name: 'ring_bell_b',
                                options: {
                                    onlyUpperBody: true,
                                },
                            },
                        });
                        await wait(3000);
                        TriggerServerEvent(ServerEvent.ELEVATOR_CALL, elevator, index);
                    },
                }))
            );
        }
    }

    @Tick(10_000)
    public findCloseElevator() {
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }
        const playerPed = PlayerPedId();
        const coords = GetEntityCoords(playerPed) as Vector3;
        for (const elevator of Object.values(DynamicElevator)) {
            const config = DynamicElevatorConfigs[elevator];
            this.closeElevator.set(elevator, getDistance(coords, config.position) < 100);
        }
    }

    @Tick()
    public elevatorTick() {
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }
        for (const elevator of Object.values(DynamicElevator)) {
            const obj = this.elevators.get(elevator);
            const state = this.elevatorRepository.find(elevator);
            if (!obj || !state) {
                continue;
            }

            if (!this.closeElevator.get(elevator)) {
                continue;
            }

            if (!state.inmotion && IsEntityPositionFrozen(obj)) {
                continue;
            }

            const config = DynamicElevatorConfigs[elevator];
            const targetZ = config.floors[state.current].z;

            SetEntityRotation(obj, 0, 0, config.heading, 0, false);

            const coords = GetEntityCoords(obj) as Vector3;

            if (coords[0] != config.position[0] || coords[1] != config.position[1]) {
                SetEntityCoordsNoOffset(obj, config.position[0], config.position[1], coords[2], false, false, true);
            }

            const delta = targetZ - coords[2];
            if (Math.abs(delta) < 0.01) {
                FreezeEntityPosition(obj, true);
                SetEntityCoordsNoOffset(obj, config.position[0], config.position[1], targetZ, false, false, false);
                this.doorInternal.get(elevator).forEach((entity, index) => {
                    DetachEntity(entity, false, false);
                    SetEntityCoordsNoOffset(
                        entity,
                        config.doorsInternal[index].close[0],
                        config.doorsInternal[index].close[1],
                        config.floors[state.current].doorz,
                        false,
                        false,
                        false
                    );
                    SetEntityHeading(entity, config.heading);
                });
                continue;
            }
            FreezeEntityPosition(obj, false);
            this.doorInternal.get(elevator).forEach((entity, index) => {
                if (!IsEntityAttached(entity)) {
                    AttachEntityToEntity(
                        entity,
                        obj,
                        0,
                        config.doorsInternal[index].offset[0],
                        config.doorsInternal[index].offset[1],
                        config.doorsInternal[index].offset[2],
                        0,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        true
                    );
                }
            });

            const speed = delta > 0 ? DynamicElevatorParams.speed : -DynamicElevatorParams.speed;
            SetEntityVelocity(obj, 0, 0, speed);
        }

        for (const [id, doorMovement] of this.doorsMovement.entries()) {
            const entity = this.doors.get(id);
            const current = GetEntityCoords(entity) as Vector3;
            const dist = getDistance(current, doorMovement.target);
            const target = add2Vector3(current, doorMovement.offset);
            const end = dist < doorMovement.norm || dist < getDistance(target, doorMovement.target);

            const coords = end ? doorMovement.target : target;

            SetEntityCoordsNoOffset(entity, coords[0], coords[1], coords[2], false, false, false);

            if (doorMovement.interior) {
                ForceRoomForEntity(entity, doorMovement.interior, doorMovement.room);
            } else {
                ClearInteriorForEntity(entity);
            }

            if (end) {
                this.doorsMovement.delete(id);
            }
        }

        for (const [elevator, value] of this.elevators.entries()) {
            if (!this.closeElevator.get(elevator)) {
                continue;
            }

            const playerPed = PlayerPedId();
            const interior = GetInteriorFromEntity(playerPed);
            const room = GetRoomKeyFromEntity(playerPed);
            if (interior) {
                ForceRoomForEntity(value, interior, room);
            } else {
                ClearInteriorForEntity(value);
            }
            for (const doorI of this.doorInternal.get(elevator)) {
                if (interior) {
                    ForceRoomForEntity(doorI, interior, room);
                } else {
                    ClearInteriorForEntity(doorI);
                }
            }
        }
    }

    private isInside(entity: number) {
        const coords = GetEntityCoords(entity) as Vector3;
        const dimentions = this.elevatorDimentions.get(GetEntityModel(entity));
        const zone = new BoxZone(coords, dimentions[1][1] * 2, dimentions[1][0] * 2, {
            minZ: coords[2] + dimentions[0][2],
            maxZ: coords[2] + dimentions[1][2],
            heading: GetEntityHeading(entity),
        });

        const pedCoords = GetEntityCoords(PlayerPedId()) as Vector3;
        return zone.isPointInside(pedCoords);
    }

    @Once(OnceStep.Stop)
    public unloadAllObjects(): void {
        for (const object of this.elevators.values()) {
            if (DoesEntityExist(object)) {
                DeleteEntity(object);
            }
        }
        this.elevators.clear();

        for (const object of this.doors.values()) {
            if (DoesEntityExist(object)) {
                DeleteEntity(object);
            }
        }
        this.doors.clear();
    }

    @RepositoryUpdate(RepositoryType.Elevator)
    public async elevatorUpdate(elevator: DynamicElevatorState, prev: DynamicElevatorState) {
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }
        if (elevator.doorState != prev.doorState) {
            const config = DynamicElevatorConfigs[elevator.id];
            const floor = config.floors[elevator.current];

            const elevatorEntity = this.elevators.get(elevator.id);
            if (floor.interior) {
                ForceRoomForEntity(elevatorEntity, this.interiorIds.get(floor.interior), floor.room);
            } else {
                ClearInteriorForEntity(elevatorEntity);
            }

            floor.doors.map(async (door, doorIndex) => {
                const dstCoords = elevator.doorState ? door.open : door.close;
                const srcCoords = elevator.doorState ? door.close : door.open;
                const id = 'elevator_door_' + elevator.id + '_' + elevator.current + '_' + doorIndex;
                const vect = sub2Vector3(
                    [dstCoords[0], dstCoords[1], floor.doorz],
                    [srcCoords[0], srcCoords[1], floor.doorz]
                );
                const offset = multVector3(vect, GetFrameTime() * toVectorNorm(vect) * DynamicElevatorParams.doorSpeed);
                this.doorsMovement.set(id, {
                    target: [dstCoords[0], dstCoords[1], floor.doorz],
                    offset,
                    norm: toVectorNorm(offset),
                    interior: this.interiorIds.get(floor.interior),
                    room: floor.room,
                });

                const entity = this.doors.get(id);
                this.playSound(entity, elevator.doorState ? 'elevator_door_opening' : 'elevator_door_closing');
            });

            this.doorInternal.get(elevator.id).forEach((entity, doorInternalIndex) => {
                if (!floor.doorsInternalIndex.includes(doorInternalIndex)) {
                    return;
                }
                const doorInternalConf = config.doorsInternal[doorInternalIndex];
                const dstCoords = elevator.doorState ? doorInternalConf.open : doorInternalConf.close;
                const srcCoords = elevator.doorState ? doorInternalConf.close : doorInternalConf.open;
                const id = 'elevator_doorInternal_' + elevator.id + '_' + doorInternalIndex;
                const vect = sub2Vector3(
                    [dstCoords[0], dstCoords[1], floor.doorz],
                    [srcCoords[0], srcCoords[1], floor.doorz]
                );
                const offset = multVector3(vect, GetFrameTime() * toVectorNorm(vect) * DynamicElevatorParams.doorSpeed);
                this.doorsMovement.set(id, {
                    target: [dstCoords[0], dstCoords[1], floor.doorz],
                    offset,
                    norm: toVectorNorm(offset),
                    interior: this.interiorIds.get(floor.interior),
                    room: floor.room,
                });
            });

            if (elevator.doorState) {
                this.playSound(elevatorEntity, 'elevator_ding');
                if (this.musicSound >= 0) {
                    StopSound(this.musicSound);
                    ReleaseSoundId(this.musicSound);
                    this.musicSound = -1;
                }
            }
        }

        if (elevator.current != prev.current && elevator.inmotion) {
            const entity = this.elevators.get(elevator.id);
            this.playSound(entity, 'elevator_start');
            if (this.isInside(entity)) {
                this.musicSound = GetSoundId();
                this.playSound(null, elevator.music, this.musicSound);
            }
        }
    }

    private async playSound(entity: number, sound: string, soundId = -1) {
        await this.resourceLoader.requestScriptAudioBank('audiodirectory/elevator');
        if (entity) {
            PlaySoundFromEntity(soundId, sound, entity, 'elevator_soundset', false, 0);
        } else {
            PlaySoundFrontend(soundId, sound, 'elevator_soundset', false);
        }
        this.resourceLoader.unloadScriptAudioBank('audiodirectory/elevator');
    }
}
