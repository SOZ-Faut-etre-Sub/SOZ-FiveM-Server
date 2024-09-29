import { Provider } from '@core/decorators/provider';
import { Once, OnceStep, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '@public/core/decorators/repository';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { uuidv4 } from '@public/core/utils';
import { Door, DoorModels } from '@public/shared/door';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RepositoryType } from '@public/shared/repository';

import { defaultDrawDistance, defaultInteractionDistance } from '../../shared/interaction';
import { PositiveNumberValidator } from '../../shared/nui/input';
import { AnimationService } from '../animation/animation.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { InteractionDistanceProvider } from '../quick-interaction/interaction.distance.provider';
import { InteractionOffsetProvider } from '../quick-interaction/interaction.offset.provider';
import { InteractionProvider } from '../quick-interaction/interaction.provider';
import { DoorRepository } from '../repository/door.repository';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class DoorProvider {
    @Inject(DoorRepository)
    public doorRepository: DoorRepository;

    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(AnimationService)
    public animationService: AnimationService;

    @Inject(NuiMenu)
    public nuiMenu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(InteractionProvider)
    private readonly interactionProvider: InteractionProvider;

    @Inject(InteractionDistanceProvider)
    private readonly interactionDistanceProvider: InteractionDistanceProvider;

    @Inject(InteractionOffsetProvider)
    private readonly interactionOffsetProvider: InteractionOffsetProvider;

    private initDone = false;
    private idToAdd = null;

    private adminEnabled = false;
    private adminInteractionPreview: Door;

    private doorInteractionList = new Map<string, string[]>();

    @Once(OnceStep.RepositoriesLoaded)
    public async init() {
        const doors = this.doorRepository.get();
        for (const door of doors) {
            this.createDoor(door);
            this.createInteraction(door);
        }

        this.targetFactory.createForModel(
            DoorModels,
            [
                {
                    label: 'Admin: Ajouter une porte',
                    icon: 'door/door',
                    category: 'citizen',
                    canInteract: entity => {
                        if (!this.adminEnabled) {
                            return false;
                        }

                        const doors = this.doorRepository.get();

                        const player = this.playerService.getPlayer();
                        if (!['admin', 'staff'].includes(player.role)) {
                            return false;
                        }

                        if (doors.find(door => door.subdoors.map(elem => elem.entity).includes(entity))) {
                            return false;
                        }

                        return true;
                    },
                    action: entity => {
                        const id = uuidv4();
                        const coords = GetEntityCoords(entity);
                        const temp = uuidv4();
                        AddDoorToSystem(
                            temp,
                            GetEntityModel(entity),
                            coords[0],
                            coords[1],
                            coords[2],
                            false,
                            false,
                            false
                        );
                        DoorSystemSetOpenRatio(temp, 0.0, false, false);

                        const door: Door = {
                            coords: GetEntityCoords(entity) as Vector3,
                            lock: false,
                            id,
                            subdoors: [
                                {
                                    coords: GetEntityCoords(entity) as Vector3,
                                    hash: GetHashKey(id),
                                    model: GetEntityModel(entity),
                                },
                            ],
                            gangs: [],
                            jobs: [],
                            keyMetadata: [],
                        };
                        RemoveDoorFromSystem(temp);
                        TriggerServerEvent(ServerEvent.DOOR_ADD_UPDATE, door);
                    },
                },
                {
                    label: 'Admin: Ajouter un battant',
                    icon: 'door/double',
                    category: 'citizen',
                    canInteract: entity => {
                        if (!this.adminEnabled) {
                            return false;
                        }

                        if (!this.idToAdd) {
                            return false;
                        }

                        const door = this.doorRepository.find(this.idToAdd);
                        if (!door) {
                            return false;
                        }

                        const doors = this.doorRepository.get();

                        const player = this.playerService.getPlayer();
                        if (!['admin', 'staff'].includes(player.role)) {
                            return false;
                        }

                        if (doors.find(door => door.subdoors.map(elem => elem.entity).includes(entity))) {
                            return false;
                        }

                        return true;
                    },
                    action: entity => {
                        const door = this.doorRepository.find(this.idToAdd);
                        if (!door) {
                            return;
                        }

                        const id = uuidv4();
                        const coords = GetEntityCoords(entity);
                        const temp = uuidv4();
                        AddDoorToSystem(
                            temp,
                            GetEntityModel(entity),
                            coords[0],
                            coords[1],
                            coords[2],
                            false,
                            false,
                            false
                        );
                        DoorSystemSetOpenRatio(temp, 0.0, false, false);

                        door.subdoors.push({
                            coords: GetEntityCoords(entity) as Vector3,
                            hash: GetHashKey(id),
                            model: GetEntityModel(entity),
                        });

                        RemoveDoorFromSystem(temp);
                        TriggerServerEvent(ServerEvent.DOOR_ADD_UPDATE, door);
                        this.idToAdd = null;
                    },
                },
                {
                    label: 'Admin: Configurer la porte',
                    icon: 'door/cogwheel',
                    category: 'citizen',
                    canInteract: entity => {
                        if (!this.adminEnabled) {
                            return false;
                        }

                        const doors = this.doorRepository.get();

                        const player = this.playerService.getPlayer();
                        if (!['admin', 'staff'].includes(player.role)) {
                            return false;
                        }

                        if (!doors.find(door => door.subdoors.map(elem => elem.entity).includes(entity))) {
                            return false;
                        }

                        return true;
                    },
                    action: entity => {
                        const doors = this.doorRepository.get();
                        const door = doors.find(door => door.subdoors.map(elem => elem.entity).includes(entity));

                        this.nuiMenu.openMenu(MenuType.DoorAdmin, door.id);
                        this.adminInteractionPreview = door;
                    },
                },
            ],
            5
        );

        this.initDone = true;
    }

    private createInteraction(door: Door) {
        for (const subdoor of door.subdoors) {
            const lockId = this.interactionProvider.createInteractionForModels(
                subdoor.model,
                subdoor.coords,
                {
                    label: 'Verrouiller',
                    canInteract: entity => {
                        const [valid, locked] = this.canInterract(entity);
                        return valid && !locked;
                    },
                    action: async entity => {
                        const doors = this.doorRepository.get();
                        const door = doors.find(door => door.subdoors.map(elem => elem.entity).includes(entity));
                        door.lock = true;

                        this.animationService.playAnimation({
                            base: {
                                dictionary: 'missheistfbisetup1',
                                name: 'unlock_enter_janitor',
                                options: {
                                    onlyUpperBody: true,
                                },
                                playbackRate: 0.7,
                            },
                        });

                        TriggerServerEvent(ServerEvent.DOOR_ADD_UPDATE, door, true);
                    },
                },
                door.target?.interaction,
                door.target?.draw
            );

            const unlockId = this.interactionProvider.createInteractionForModels(
                subdoor.model,
                subdoor.coords,
                {
                    label: 'Déverrouiller',
                    canInteract: entity => {
                        const [valid, locked] = this.canInterract(entity);
                        return valid && locked;
                    },
                    action: async entity => {
                        const doors = this.doorRepository.get();
                        const door = doors.find(door => door.subdoors.map(elem => elem.entity).includes(entity));
                        door.lock = false;

                        this.animationService.playAnimation({
                            base: {
                                dictionary: 'missheistfbisetup1',
                                name: 'unlock_enter_janitor',
                                options: {
                                    onlyUpperBody: true,
                                },
                                playbackRate: 0.7,
                            },
                        });

                        TriggerServerEvent(ServerEvent.DOOR_ADD_UPDATE, door, false);
                    },
                },
                door.target?.interaction,
                door.target?.draw
            );

            this.doorInteractionList.set(door.id, [lockId, unlockId]);
        }
    }

    private canInterract(entity: number): [boolean, boolean] {
        const doors = this.doorRepository.get();
        const door = doors.find(door => door.subdoors.map(elem => elem.entity).includes(entity));

        if (!door) {
            return [false, false];
        }

        const player = this.playerService.getPlayer();
        if (door.gangs && door.gangs.includes(player.gang.id)) {
            return [true, door.lock];
        }

        if (door.jobs && door.jobs.includes(player.job.id)) {
            return [true, door.lock];
        }

        if (door.keyMetadata) {
            const item = this.inventoryManager.findItem(
                item => item.name == 'key' && door.keyMetadata.includes(item.metadata.keyid)
            );
            if (item) {
                return [true, door.lock];
            }
        }

        return [false, door.lock];
    }

    @Tick(500, 'door-loop')
    public doorLoop() {
        if (!this.initDone) {
            return;
        }

        const coords = GetEntityCoords(PlayerPedId()) as Vector3;

        const doors = this.doorRepository.get();
        for (const door of doors) {
            const subdoors = door.subdoors;
            const distance = getDistance(coords, door.coords);

            if (distance < 80) {
                for (const subdoor of subdoors) {
                    if (!subdoor.entity || !DoesEntityExist(subdoor.entity)) {
                        const entity = GetClosestObjectOfType(
                            subdoor.coords[0],
                            subdoor.coords[1],
                            subdoor.coords[2],
                            1.0,
                            subdoor.model,
                            false,
                            false,
                            false
                        );

                        if (entity != 0) {
                            subdoor.entity = entity;
                        }
                    }
                }
            } else {
                for (const subdoor of subdoors) {
                    subdoor.entity = null;
                }
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public adminDoorLoop() {
        if (!this.adminEnabled) return;
        if (!this.adminInteractionPreview) return;

        const drawDistance = this.adminInteractionPreview.target?.draw || defaultDrawDistance;
        const drawColor = [255, 255, 255, 20];
        const interactionDistance = this.adminInteractionPreview.target?.interaction || defaultInteractionDistance;
        const interactionColor = [3, 140, 255, 50];

        for (const subdoor of this.adminInteractionPreview.subdoors) {
            if (subdoor.entity) {
                const coords = this.interactionOffsetProvider.getEntityCoordsWithOffset(subdoor.entity);

                // draw marker
                DrawMarker(
                    28,
                    coords[0],
                    coords[1],
                    coords[2],
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    drawDistance,
                    drawDistance,
                    drawDistance,
                    drawColor[0],
                    drawColor[1],
                    drawColor[2],
                    drawColor[3],
                    false,
                    false,
                    2,
                    false,
                    null,
                    null,
                    false
                );

                // interaction marker
                DrawMarker(
                    28,
                    coords[0],
                    coords[1],
                    coords[2],
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    interactionDistance,
                    interactionDistance,
                    interactionDistance,
                    interactionColor[0],
                    interactionColor[1],
                    interactionColor[2],
                    interactionColor[3],
                    false,
                    false,
                    2,
                    false,
                    null,
                    null,
                    false
                );
            }
        }
    }

    public createDoor(door: Door) {
        const subdoors = door.subdoors;

        for (const subdoor of subdoors) {
            AddDoorToSystem(
                subdoor.hash,
                subdoor.model,
                subdoor.coords[0],
                subdoor.coords[1],
                subdoor.coords[2],
                false,
                false,
                false
            );
            DoorSystemSetDoorState(subdoor.hash, 4, false, false);
            DoorSystemSetDoorState(subdoor.hash, door.lock ? 1 : 0, false, false);
            /*
            if (door.doorRate || !door.auto) {
                DoorSystemSetAutomaticRate(subdoor.hash, door.doorRate || 10.0, false, false);
            }*/
        }
    }

    @RepositoryInsert(RepositoryType.Door)
    public async addDoor(door: Door) {
        this.createDoor(door);
        this.createInteraction(door);
    }

    @RepositoryUpdate(RepositoryType.Door)
    public async updateDoor(door: Door) {
        const subdoors = door.subdoors;

        for (const subdoor of subdoors) {
            if (!IsDoorRegisteredWithSystem(subdoor.hash)) {
                AddDoorToSystem(
                    subdoor.hash,
                    subdoor.model,
                    subdoor.coords[0],
                    subdoor.coords[1],
                    subdoor.coords[2],
                    false,
                    false,
                    false
                );
                DoorSystemSetDoorState(subdoor.hash, 4, false, false);
                /*
                if (door.doorRate || !door.auto) {
                    DoorSystemSetAutomaticRate(subdoor.hash, door.doorRate || 10.0, false, false);
                }*/
            }

            DoorSystemSetDoorState(subdoor.hash, door.lock ? 1 : 0, false, false);

            if (door.holdOpen) {
                DoorSystemSetHoldOpen(subdoor.hash, !door.lock);
            }
        }

        this.doorInteractionList.get(door.id).forEach(id => {
            this.interactionDistanceProvider.updateDrawDistance(id, door.target?.draw);
            this.interactionDistanceProvider.updateInteractionDistance(id, door.target?.interaction);
        });
    }

    @RepositoryDelete(RepositoryType.Door)
    public async deleteDoor(door: Door) {
        const subdoors = door.subdoors;
        for (const subdoor of subdoors) {
            if (IsDoorRegisteredWithSystem(subdoor.hash)) {
                RemoveDoorFromSystem(subdoor.hash);
            }
        }
    }

    @OnNuiEvent(NuiEvent.AdminDoorAddSub)
    public async addSub(doorId: string) {
        this.idToAdd = doorId;
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.AdminDoorSetState)
    public async doorUpdate(door: Door) {
        TriggerServerEvent(ServerEvent.DOOR_ADD_UPDATE, door);
    }

    @OnNuiEvent(NuiEvent.AdminDoorDelete)
    public async doorDelete(doorId: string) {
        TriggerServerEvent(ServerEvent.DOOR_DELETE, doorId);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.AdminSetDoorManagement)
    public async door(value: boolean) {
        this.adminEnabled = value;
    }

    @OnNuiEvent(NuiEvent.AdminDoorSetTarget)
    public async updateTargetDistance({ id, type }: { id: string; type: string }) {
        const door = this.doorRepository.find(id);
        if (!door) {
            return;
        }

        const value = await this.inputService.askInput(
            {
                maxCharacters: 10,
                title: 'Distance',
            },
            PositiveNumberValidator
        );

        if (!door.target) {
            door.target = {};
        }

        if (type === 'draw') {
            door.target.draw = value;
        } else {
            door.target.interaction = value;
        }

        TriggerServerEvent(ServerEvent.DOOR_ADD_UPDATE, door);
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onCloseMenu({ menuType }) {
        if (menuType !== MenuType.DoorAdmin) {
            return;
        }

        this.adminInteractionPreview = null;
    }

    public isAdminEnabled() {
        return this.adminEnabled;
    }
}
