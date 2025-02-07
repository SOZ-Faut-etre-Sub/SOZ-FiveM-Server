import { Exportable } from '@core/decorators/exports';
import { Provider } from '@core/decorators/provider';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { BaunCraftProvider } from '@public/client/job/baun/baun.craft.provider';
import { JobCloakroomProvider } from '@public/client/job/job.cloakroom.provider';
import { JobService } from '@public/client/job/job.service';
import { PlayerService } from '@public/client/player/player.service';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event/server';
import { InventoryType, isInventoryItemExpired } from '@public/shared/inventory';
import { JobType } from '@public/shared/job';
import { computeBinId } from '@public/shared/job/garbage';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { JOB_INVENTORIES } from '@public/shared/storage/job';
import { TargetOption } from '@public/shared/target';

import { AnimationStopReason } from '../../shared/animation';
import { AnimationService } from '../animation/animation.service';
import { SoundService } from '../sound.service';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class InventoryOpenProvider {
    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(AnimationService)
    public animationService: AnimationService;

    @Inject(SoundService)
    public soundService: SoundService;

    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(JobCloakroomProvider)
    private jobCloakroomProvider: JobCloakroomProvider;

    @Inject(BaunCraftProvider)
    private baunCraftProvider: BaunCraftProvider;

    @Inject(JobService)
    private jobService: JobService;

    public getBinModels() {
        return [
            GetHashKey('soz_prop_bb_bin'),
            GetHashKey('soz_prop_bb_bin_hs2'),
            GetHashKey('soz_hw_bin_1'), //Halloween
            GetHashKey('soz_hw_bin_2'), //Halloween
        ];
    }

    @Once(OnceStep.Start)
    public initOpenInventoryTarget() {
        this.targetFactory.createForModel(
            this.getBinModels(),
            [
                {
                    label: 'Fouiller',
                    icon: 'inventory/ouvrir_la_poubelle',
                    category: 'citizen',
                    action: async (entity: number) => {
                        const id = computeBinId(entity);
                        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 800);
                        await wait(800);

                        PlaySoundFrontend(-1, 'Collect_Pickup', 'DLC_IE_PL_Player_Sounds', true);
                        const cancelled = await this.animationService.playScenario({
                            name: 'PROP_HUMAN_BUM_BIN',
                            duration: 4000,
                        });

                        if (
                            cancelled === AnimationStopReason.Finished &&
                            (await emitRpc<boolean>(RpcServerEvent.BIN_IS_NOT_LOCKED, id))
                        ) {
                            const playerPed = PlayerPedId();
                            const coords = GetEntityCoords(playerPed);

                            this.inventoryManager.openInventory(InventoryType.Bin, id, coords as Vector3);
                        }
                    },
                    canInteract: async (entity: number) => {
                        const id = computeBinId(entity);
                        return emitRpc<boolean>(RpcServerEvent.BIN_IS_NOT_LOCKED, id);
                    },
                },
            ],
            1.3
        );

        for (const job of Object.keys(JOB_INVENTORIES)) {
            const inventories = JOB_INVENTORIES[job as JobType];

            for (const inventory of inventories) {
                // For cloakroom, only Pawl can open it
                const openJob = inventory.data.type === InventoryType.Cloakroom ? JobType.Pawl : (job as JobType);
                const options: TargetOption[] = [
                    {
                        label: 'Ouvrir',
                        icon: 'inventory/ouvrir_le_stockage',
                        category: 'society',
                        job: openJob,
                        canInteract: () => {
                            if (!inventory.data.permission) {
                                return true;
                            }

                            return this.jobService.hasPermission(openJob, inventory.data.permission);
                        },
                        action: async () => {
                            const playerPed = PlayerPedId();
                            const coords = GetEntityCoords(playerPed);

                            this.inventoryManager.openInventory(
                                inventory.data.type,
                                inventory.data.storage,
                                coords as Vector3
                            );
                        },
                    },
                ];

                if (inventory.data.type === InventoryType.Cloakroom) {
                    options.push({
                        label: 'Ouvrir mon casier',
                        icon: 'inventory/archive',
                        category: 'society',
                        canInteract: async () => {
                            const player = this.playerService.getPlayer();

                            if (!player) {
                                return false;
                            }

                            return player.job.id === job;
                        },
                        action: async () => {
                            const player = this.playerService.getPlayer();

                            if (!player) {
                                return false;
                            }

                            const playerPed = PlayerPedId();
                            const coords = GetEntityCoords(playerPed);

                            this.inventoryManager.openInventory(
                                InventoryType.Stash,
                                `stash_${player.job.id}_${player.citizenid}`,
                                coords as Vector3
                            );
                        },
                    });
                }

                if (inventory.data.type === InventoryType.Cloakroom) {
                    options.push({
                        label: 'Se changer',
                        icon: 'jobs/habiller',
                        category: 'society',
                        canInteract: async () => {
                            const player = this.playerService.getPlayer();

                            if (!player) {
                                return false;
                            }

                            return player.job.id === job;
                        },
                        action: async () => {
                            await this.jobCloakroomProvider.openJobCloakroom(inventory.data.storage, job as JobType);
                        },
                    });

                    options.push({
                        label: 'Vérifier le stock',
                        icon: 'jobs/check-stock',
                        category: 'society',
                        job: job as JobType,
                        action: async () => {
                            await this.jobCloakroomProvider.checkCloakroomStorage(inventory.data.storage);
                        },
                    });
                }

                if (job === JobType.Baun) {
                    if (inventory.data.type === InventoryType.Storage) {
                        options.push({
                            category: 'society',
                            label: 'Créer un assortiment de cocktails',
                            icon: 'baun/createCocktailBox',
                            job: job as JobType,
                            blackoutGlobal: true,
                            blackoutJob: job as JobType,
                            canInteract: async () => {
                                const player = this.playerService.getPlayer();

                                if (!player) {
                                    return false;
                                }

                                const numberOfCocktails = this.inventoryManager
                                    .getItems()
                                    .filter(item => item.type === 'cocktail' && !isInventoryItemExpired(item))
                                    .reduce((acc, item) => acc + item.amount, 0);

                                return player.job.onduty && numberOfCocktails >= 10;
                            },
                            action: async () => {
                                TriggerServerEvent(ServerEvent.BAUN_CREATE_COCKTAIL_BOX);
                            },
                        });
                    }

                    if (inventory.data.type === InventoryType.IceMachine) {
                        options.push({
                            category: 'society',
                            label: 'Faire des glaçons',
                            icon: 'baun/ice',
                            job: job as JobType,
                            blackoutGlobal: true,
                            blackoutJob: job as JobType,
                            canInteract: async () => {
                                const player = this.playerService.getPlayer();

                                if (!player) {
                                    return false;
                                }

                                const numberOfWaterBottle = this.inventoryManager
                                    .getItems()
                                    .filter(item => item.name === 'water_bottle')
                                    .reduce((acc, item) => acc + item.amount, 0);
                                return player.job.onduty && numberOfWaterBottle >= 1;
                            },
                            action: async () => {
                                await this.baunCraftProvider.craftIceCube();
                            },
                        });
                    }

                    if (
                        inventory.data.type === InventoryType.SnackStorage ||
                        inventory.data.type === InventoryType.LiquorStorage ||
                        inventory.data.type === InventoryType.FlavorStorage ||
                        inventory.data.type === InventoryType.FurnitureStorage
                    ) {
                        options.push({
                            label: 'Restocker',
                            icon: 'jobs/demonter',
                            category: 'society',
                            job: job as JobType,
                            blackoutGlobal: true,
                            blackoutJob: job as JobType,
                            canInteract: async () => {
                                const player = this.playerService.getPlayer();

                                if (!player) {
                                    return false;
                                }

                                return player.job.onduty;
                            },
                            action: async () => {
                                let item = 'snack_crate';

                                if (inventory.data.type === InventoryType.LiquorStorage) {
                                    item = 'liquor_crate';
                                } else if (inventory.data.type === InventoryType.FlavorStorage) {
                                    item = 'flavor_crate';
                                } else if (inventory.data.type === InventoryType.FurnitureStorage) {
                                    item = 'furniture_crate';
                                }

                                TriggerServerEvent(ServerEvent.BAUN_RESTOCK, inventory.data.storage, item);
                            },
                        });
                    }
                }

                this.targetFactory.createForBoxZone(`inventory_${inventory.data.storage}`, inventory, options);
            }
        }
    }

    @Exportable('OpenInventory')
    public openInventory(type: InventoryType, storage: string) {
        const coords = GetEntityCoords(PlayerPedId()) as Vector3;

        this.inventoryManager.openInventory(type, storage, coords);
    }
}
