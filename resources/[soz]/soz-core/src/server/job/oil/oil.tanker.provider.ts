import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { ServerEvent } from '../../../shared/event/server';
import { JobType } from '../../../shared/job';
import { OIL_FIELDS } from '../../../shared/job/oil';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { RpcServerEvent } from '../../../shared/rpc';
import { VehicleClass } from '../../../shared/vehicle/vehicle';
import { BankService } from '../../bank/bank.service';
import { FieldProvider } from '../../farm/field.provider';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

const MAX_PEOPLE_BY_TANKER = 2;
const HARVEST_AMOUNT = 11;

@Provider()
export class OilTankerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(FieldProvider)
    private fieldProvider: FieldProvider;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Monitor)
    private monitor: Monitor;

    private lockedTankers = new Map<number, Set<number>>();

    private tankerUsed = new Map<number, number>();

    @Once(OnceStep.RepositoriesLoaded)
    public async initTankerField() {
        for (const fieldKey of Object.keys(OIL_FIELDS)) {
            const field = OIL_FIELDS[fieldKey];

            await this.fieldProvider.createField({
                identifier: fieldKey,
                owner: JobType.Oil,
                item: 'petroleum',
                capacity: field.production.max,
                refill: {
                    delay: field.delay,
                    amount: field.production,
                },
                maxCapacity: field.production.max,
                harvest: {
                    delay: 0,
                    amount: HARVEST_AMOUNT,
                },
            });
        }
    }

    @Rpc(RpcServerEvent.OIL_LOCK_TANKER)
    public async lockTanker(source: number, entityNetId: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        const players = this.lockedTankers.get(entityNetId) || new Set<number>();

        for (const player of players) {
            if (!this.playerService.getPlayer(player)) {
                players.delete(player);
            }
        }

        if (players.size >= MAX_PEOPLE_BY_TANKER) {
            return false;
        }

        players.add(source);
        this.lockedTankers.set(entityNetId, players);

        return true;
    }

    @OnEvent(ServerEvent.OIL_UNLOCK_TANKER)
    public onUnlockTanker(source: number, entityNetId: number): void {
        const players = this.lockedTankers.get(entityNetId) || new Set<number>();

        players.delete(source);

        if (players.size === 0) {
            this.lockedTankers.delete(entityNetId);
        } else {
            this.lockedTankers.set(entityNetId, players);
        }
    }

    @OnEvent(ServerEvent.OIL_REFILL_TANKER)
    public async onRefillTanker(
        source: number,
        entityNetId: number,
        model: number,
        vehicleClass: VehicleClass,
        field: string
    ) {
        const tanker = NetworkGetEntityFromNetworkId(entityNetId) as number;
        const plate = GetVehicleNumberPlateText(tanker);
        const inventory = this.inventoryManager.getOrCreateInventory('tanker', plate, {
            class: vehicleClass,
            model,
        });

        if (!inventory) {
            this.notifier.error(source, "Le tanker n'a pas d'inventaire.");

            return;
        }

        if (this.tankerUsed.has(source)) {
            this.notifier.error(source, 'Vous utilisez deja le tanker.');

            return;
        }

        try {
            this.tankerUsed.set(source, entityNetId);

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const canRefillTanker = this.inventoryManager.canCarryItem(inventory.id, 'petroleum', HARVEST_AMOUNT);

                if (!canRefillTanker) {
                    this.notifier.notify(source, 'Le tanker est plein.');

                    break;
                }

                const { completed } = await this.progressService.progress(
                    source,
                    'fill_tanker',
                    'Vous remplissez...',
                    12000,
                    {
                        dictionary: 'timetable@gardener@filling_can',
                        name: 'gar_ig_5_filling_can',
                        options: {
                            repeat: true,
                        },
                    },
                    {
                        disableMovement: true,
                        disableCombat: true,
                    }
                );

                if (!completed) {
                    break;
                }

                const isHarvested = await this.fieldProvider.harvestField(field, HARVEST_AMOUNT);

                if (!isHarvested) {
                    this.notifier.error(source, 'Le champ est vide.');

                    break;
                }

                if (!this.inventoryManager.addItemToInventoryNotPlayer(inventory.id, 'petroleum', HARVEST_AMOUNT)) {
                    this.notifier.error(source, 'Votre remorque ~r~ne peut plus~s~ recevoir de pétrole.');

                    break;
                }

                this.notifier.notify(source, `Vous avez ~g~rempli~s~ ${HARVEST_AMOUNT}L de pétrole.`);

                this.monitor.traceEvent('job_mtp_fill_oil_tanker', {
                    player_source: source,
                    amount: HARVEST_AMOUNT,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                });
            }
        } finally {
            this.tankerUsed.delete(source);
        }
    }

    @OnEvent(ServerEvent.OIL_REFINE_TANKER)
    public async onRefineTanker(source: number, entityNetId: number, model: number, vehicleClass: VehicleClass) {
        const tanker = NetworkGetEntityFromNetworkId(entityNetId) as number;
        const plate = GetVehicleNumberPlateText(tanker);
        const inventory = this.inventoryManager.getOrCreateInventory('tanker', plate, {
            class: vehicleClass,
            model,
        });

        if (!inventory) {
            this.notifier.error(source, "Le tanker n'a pas d'inventaire.");

            return;
        }

        if (this.tankerUsed.has(source)) {
            this.notifier.error(source, 'Vous utilisez deja le tanker.');

            return;
        }

        if (this.inventoryManager.getItemCount(inventory.id, 'petroleum') < HARVEST_AMOUNT) {
            this.notifier.notify(source, 'Votre remorque ~r~ne contient pas~s~ assez de pétrole.');

            return;
        }

        try {
            this.tankerUsed.set(source, entityNetId);

            this.notifier.notify(source, 'Vous avez ~g~relié~s~ le Tanker à ~g~la raffinerie~s~.');

            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (this.inventoryManager.getItemCount(inventory.id, 'petroleum') < HARVEST_AMOUNT) {
                    this.notifier.notify(source, 'Votre remorque ~r~ne contient pas~s~ assez de pétrole.');

                    return;
                }

                const { completed } = await this.progressService.progress(
                    source,
                    'refine_tanker',
                    'Vous raffinez...',
                    10000,
                    {
                        dictionary: 'timetable@gardener@filling_can',
                        name: 'gar_ig_5_filling_can',
                        options: {
                            repeat: true,
                        },
                    },
                    {
                        disableMovement: true,
                        disableCombat: true,
                    }
                );

                if (!completed) {
                    break;
                }

                if (
                    !this.inventoryManager.canSwapItems(
                        inventory.id,
                        [
                            {
                                name: 'petroleum',
                                amount: HARVEST_AMOUNT,
                                metadata: {},
                            },
                        ],
                        [
                            {
                                name: 'petroleum_refined',
                                amount: 3 * HARVEST_AMOUNT,
                                metadata: {},
                            },
                            {
                                name: 'petroleum_residue',
                                amount: HARVEST_AMOUNT,
                                metadata: {},
                            },
                        ]
                    )
                ) {
                    this.notifier.notify(source, 'Votre remorque ~r~ne peut plus~s~ recevoir de pétrole raffiné.');

                    return;
                }

                if (!this.inventoryManager.removeItemFromInventory(inventory.id, 'petroleum', HARVEST_AMOUNT)) {
                    this.notifier.notify(source, 'Votre remorque ~r~ne peut plus~s~ recevoir de pétrole raffiné.');

                    return;
                }

                this.inventoryManager.addItemToInventory(inventory.id, 'petroleum_refined', 3 * HARVEST_AMOUNT);
                this.inventoryManager.addItemToInventory(inventory.id, 'petroleum_residue', HARVEST_AMOUNT);

                this.notifier.notify(source, `Vous avez ~g~raffiné~s~ ${HARVEST_AMOUNT}L de pétrole.`);

                this.monitor.traceEvent('job_mtp_refining_oil', {
                    player_source: source,
                    amount: HARVEST_AMOUNT,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                });
            }
        } finally {
            this.tankerUsed.delete(source);
        }
    }

    @OnEvent(ServerEvent.OIL_RESELL_TANKER)
    public async onResellTanker(source: number, entityNetId: number, model: number, vehicleClass: VehicleClass) {
        const tanker = NetworkGetEntityFromNetworkId(entityNetId) as number;
        const plate = GetVehicleNumberPlateText(tanker);
        const inventory = this.inventoryManager.getOrCreateInventory('tanker', plate, {
            class: vehicleClass,
            model,
        });

        if (!inventory) {
            this.notifier.error(source, "Le tanker n'a pas d'inventaire.");

            return;
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const essenceItemAmount = this.inventoryManager.getItemCount(inventory.id, 'essence');
            const keroseneItemAmount = this.inventoryManager.getItemCount(inventory.id, 'kerosene');

            if (essenceItemAmount < 10 && keroseneItemAmount < 10) {
                this.notifier.error(source, "Vous n'avez pas de carburant à vendre.");

                return;
            }

            const { completed } = await this.progressService.progress(
                source,
                'resell_tanker',
                'Vous remplissez...',
                3_000,
                {
                    dictionary: 'timetable@gardener@filling_can',
                    name: 'gar_ig_5_filling_can',
                    options: {
                        repeat: true,
                    },
                },
                {
                    disableMovement: true,
                    disableCombat: true,
                }
            );

            if (!completed) {
                return;
            }

            if (this.inventoryManager.removeItemFromInventory(inventory.id, 'essence', 10)) {
                await this.bankService.transferFarmMoney(source, 'farm_mtp', 'safe_oil', 500);

                this.monitor.traceEvent('job_mtp_sell_oil', {
                    player_source: source,
                    type: 'essence',
                    amount: 10,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                });

                this.notifier.notify(source, "Vous avez ~g~revendu~s~ 100L d'essence.");
            } else if (this.inventoryManager.removeItemFromInventory(inventory.id, 'kerosene', 10)) {
                await this.bankService.transferFarmMoney(source, 'farm_mtp', 'safe_oil', 500);

                this.monitor.traceEvent('job_mtp_sell_oil', {
                    player_source: source,
                    type: 'kerosene',
                    amount: 10,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                });

                this.notifier.notify(source, 'Vous avez ~g~revendu~s~ 100L de kérosène.');
            }
        }
    }
}
