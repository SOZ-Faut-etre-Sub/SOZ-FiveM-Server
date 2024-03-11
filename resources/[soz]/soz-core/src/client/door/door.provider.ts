import { Provider } from '@core/decorators/provider';
import { Once, OnceStep, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '@public/core/decorators/repository';
import { Tick } from '@public/core/decorators/tick';
import { uuidv4 } from '@public/core/utils';
import { Door, DoorModels } from '@public/shared/door';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RepositoryType } from '@public/shared/repository';

import { AnimationService } from '../animation/animation.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
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

    private initDone = false;
    private idToAdd = null;

    @Once(OnceStep.RepositoriesLoaded)
    public async init() {
        const doors = this.doorRepository.get();
        for (const door of doors) {
            this.createDoor(door);
        }

        this.targetFactory.createForModel(
            DoorModels,
            [
                {
                    label: 'Admin: Ajouter une porte',
                    icon: 'c:door/door.png',
                    canInteract: entity => {
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
                    icon: 'c:door/double.png',
                    canInteract: entity => {
                        if (!this.idToAdd) {
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

                        const door = this.doorRepository.find(this.idToAdd);
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
                    icon: 'c:door/cogwheel.png',
                    canInteract: entity => {
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
                    },
                },
                {
                    label: 'Vérouiller',
                    icon: 'c:door/lock.png',
                    canInteract: entity => {
                        const [valid, locked] = this.canInterract(entity);
                        return valid && !locked;
                    },
                    action: entity => {
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
                            },
                        });

                        TriggerServerEvent(ServerEvent.DOOR_ADD_UPDATE, door);
                    },
                },
                {
                    label: 'Dévérouiller',
                    icon: 'c:door/unlock.png',
                    canInteract: entity => {
                        const [valid, locked] = this.canInterract(entity);
                        return valid && locked;
                    },
                    action: entity => {
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
                            },
                        });

                        TriggerServerEvent(ServerEvent.DOOR_ADD_UPDATE, door);
                    },
                },
            ],
            3.5
        );

        this.initDone = true;
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

        if (door.jobs && door.jobs.includes(player.job.id) && player.job.onduty) {
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
                    if (!subdoor.entity && IsModelValid(subdoor.model)) {
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
}
