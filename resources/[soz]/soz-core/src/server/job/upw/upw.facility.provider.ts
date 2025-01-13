import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { BankService } from '@public/server/bank/bank.service';
import { PrismaService } from '@public/server/database/prisma.service';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ItemService } from '@public/server/item/item.service';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { ObjectProvider } from '@public/server/object/object.provider';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerStateService } from '@public/server/server.state.service';
import { Store } from '@public/server/store/store';
import { ClientEvent } from '@public/shared/event/client';
import { ServerEvent } from '@public/shared/event/server';
import { ADD_ERROR_MESSAGE, InventoryType, isInventoryItemExpired } from '@public/shared/inventory';
import { joaat } from '@public/shared/joaat';
import { JobType } from '@public/shared/job';
import {
    UpwBlackout,
    UpwBlackoutLevel,
    UpwConfig,
    UPWDefaultConf,
    UpwFacility,
    UpwFacilityType,
    UpwMetrics,
    UPWModels,
    UpwPollutionLevel,
    UPWWasteMultiplier,
} from '@public/shared/job/upw';
import { Zone } from '@public/shared/polyzone/box.zone';
import { Vector4 } from '@public/shared/polyzone/vector';
import { getRandomInt } from '@public/shared/random';
import { isErr } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { UpwPollutionProvider } from './upw.pollution.provider';

const MigrationItem = {
    fossil1: 'energy_cell_fossil',
    hydro1: 'energy_cell_hydro',
    wind1: 'energy_cell_wind',
    solar1: 'energy_cell_solar',
};
const WasteItem = {
    hydro1: 'seeweed_acid',
};

function createZoneFromLegacyData(data): Zone<never> {
    if (data == null) {
        return data;
    }

    return {
        center: [data.coords.x, data.coords.y, data.coords.z],
        length: data.sx,
        width: data.sy,
        heading: data.heading,
        minZ: data.minZ,
        maxZ: data.maxZ,
    };
}

@Provider()
export class UpwFacilityProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(UpwPollutionProvider)
    private upwPollutionProvider: UpwPollutionProvider;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(BankService)
    private bankService: BankService;

    @Inject('Store')
    private store: Store;

    private facilities: Record<string, UpwFacility> = {};
    private prodCoef: Record<string, number> = {};

    @Once(OnceStep.DatabaseConnected)
    public async onDBReady() {
        const dbFacilities = await this.prismaService.upw_facility.findMany({
            where: {
                type: {
                    not: 'pollution-manager',
                },
            },
        });

        for (const dbFacility of dbFacilities) {
            const data = JSON.parse(dbFacility.data);
            if (!dbFacility.config) {
                //Migration
                dbFacility.config = JSON.stringify({
                    maxCapacity: data.maxCapacity,
                    pollutionPerUnit: data.pollutionPerUnit,
                    productionPerMinute: data.productionPerMinute,
                    item: MigrationItem[dbFacility.identifier],
                    energyZone: createZoneFromLegacyData(data.zones?.energyZone),
                    wastePerMinute: data.wastePerMinute ? data.wastePerMinute : undefined,
                    wasteZone: createZoneFromLegacyData(data.zones?.wasteZone),
                    wasteItem: WasteItem[dbFacility.identifier],
                    maxWaste: data.maxWaste ? data.maxWaste : undefined,
                    job: data.job,
                    position: data.zone?.coords
                        ? [data.zone.coords.x, data.zone.coords.y, data.zone.coords.z, data.zone.heading]
                        : undefined,
                });
                dbFacility.type =
                    dbFacility.type === UpwFacilityType.terminal && data.scope === 'entreprise'
                        ? UpwFacilityType.jobTerminal
                        : dbFacility.type;

                await this.prismaService.upw_facility.update({
                    data: {
                        config: dbFacility.config,
                        type: dbFacility.type,
                        data: JSON.stringify({
                            waste: data.waste,
                            capacity: data.capacity,
                        }),
                    },
                    where: {
                        identifier: dbFacility.identifier,
                    },
                });
            }

            //Meteor
            if (dbFacility.identifier == 'inverter1656975380') {
                continue;
            }

            const config = JSON.parse(dbFacility.config);
            this.facilities[dbFacility.identifier] = {
                identifier: dbFacility.identifier,
                type: dbFacility.type as UpwFacilityType,
                capacity: data.capacity,
                waste: data.waste,
                maxCapacity: config.maxCapacity,
                energyZone: config.energyZone,
                wasteZone: config.wasteZone,
                position: config.position,
                pollutionPerUnit: config.pollutionPerUnit,
                wastePerMinute: config.wastePerMinute,
                job: config.job,
                productionPerMinute: config.productionPerMinute,
                wasteItem: config.wasteItem,
                item: config.item,
                maxWaste: config.maxWaste,
            };

            if (UPWModels[dbFacility.type]) {
                this.objectProvider.createObject({
                    id: dbFacility.identifier,
                    model: UPWModels[dbFacility.type],
                    position: this.facilities[dbFacility.identifier].position,
                    metadata: {
                        job: this.facilities[dbFacility.identifier].job,
                    },
                });
            }
        }
    }

    @Rpc(RpcServerEvent.UPW_GET_FACILITIES)
    async onGetFacilities(source: number, types: string[]) {
        return Object.values(this.facilities).filter(elem => types.includes(elem.type));
    }

    @Rpc(RpcServerEvent.UPW_GET_STORAGE_CAPACITY)
    async onGetCapacity(source: number, id: string) {
        const inv = await this.inventoryFactory.getOrCreate('inverter_' + id, InventoryType.Inverter);
        const energyItems = Object.values(inv.items()).filter(
            elem => elem.type == 'energy' && !isInventoryItemExpired(elem)
        );

        let value = 0;
        for (const item of energyItems) {
            const itemDef = this.itemService.getItem(item.name);
            value += itemDef.weight * item.amount;
        }

        return Math.ceil(value / 3_000);
    }

    @OnEvent(ServerEvent.UPW_GET_STORAGE_CAPACITY)
    async onPrintCapacity(source: number, id: string) {
        const facility = this.facilities[id];
        if (!facility) {
            return;
        }

        this.notifier.notify(
            source,
            `État d'énergie : ${Math.floor((facility.capacity / facility.maxCapacity) * 100)}%`,
            'info'
        );
    }

    public getBlackoutPercent() {
        const terminals = Object.values(this.facilities).filter(elem => elem.type === UpwFacilityType.terminal);
        let count = 0;
        for (const terminal of terminals) {
            const capacity = (terminal.capacity * 100) / terminal.maxCapacity;

            if (capacity >= 1) {
                count++;
            }
        }

        return Math.ceil((count / terminals.length) * 100);
    }

    public getBlackoutLevel() {
        const percent = this.getBlackoutPercent();

        for (const level of Object.values(UpwBlackout)) {
            if (
                UpwConfig.Blackout.Threshold[level].min <= percent &&
                percent < UpwConfig.Blackout.Threshold[level].max
            ) {
                return level;
            }
        }

        return UpwBlackout.Zero;
    }

    @Tick(UpwConfig.Consumption.Tick)
    public enrgyConsumptionLoop() {
        const connectedPlayers = this.serverStateService.getPlayers();
        const consumptionThisTick = Math.ceil(UpwConfig.Consumption.EnergyPerTick * connectedPlayers.length);

        const terminals = Object.values(this.facilities).filter(
            elem => elem.type === UpwFacilityType.terminal && elem.capacity > 1
        );
        for (let i = 0; i < consumptionThisTick; i++) {
            if (terminals.length == 0) {
                break;
            }

            const index = getRandomInt(0, terminals.length - 1);
            const terminal = terminals[index];
            terminal.capacity--;

            if (terminal.capacity < 1) {
                terminals.splice(index, 1);
            }
        }

        const newBlackoutLevel = this.getBlackoutLevel();
        const globalState = this.store.getState().global;

        // Blackout level has changed
        if (!globalState.blackoutOverride && globalState.blackoutLevel != UpwBlackoutLevel[newBlackoutLevel]) {
            this.store.dispatch.global.update({ blackoutLevel: UpwBlackoutLevel[newBlackoutLevel] });
        }

        const energies: Partial<Record<JobType, number>> = {};

        // Handle job terminal consumption
        for (const job of Object.values(JobType)) {
            const terminals = Object.values(this.facilities).filter(elem => elem.job === job);

            if (terminals.length > 0) {
                const terminal = terminals.find(elem => elem.capacity > 0);
                if (terminal) {
                    const count = connectedPlayers.filter(elem => elem.job.id == job && elem.job.onduty).length;
                    const consumptionJobThisTick = UpwConfig.Consumption.EnergyJobPerTick * count;
                    terminal.capacity = Math.max(0, terminal.capacity - consumptionJobThisTick);
                }

                const totalCapacity = terminals.reduce((acc, cur) => (acc += cur.capacity), 0);
                const totalMaxCapacity = terminals.reduce((acc, cur) => (acc += cur.maxCapacity), 0);

                energies[job] = Math.floor((totalCapacity * 100) / totalMaxCapacity);
            } else {
                energies[job] = 100;
            }
        }

        this.store.dispatch.global.setJobEnergies(energies);
    }

    @OnEvent(ServerEvent.UPW_CONSUME_RATIO)
    public onConsumeTerminalRatio(source: number, id: string, ratio: number) {
        const terminal = this.facilities[id];
        if (terminal) {
            terminal.capacity -= Math.floor(ratio * terminal.capacity);
        }
    }

    public emptyTerminal(id: string) {
        const terminal = this.facilities[id];
        if (terminal) {
            terminal.capacity = 0;
        }
    }

    public consumeJobTerminal(job: JobType, value: number) {
        const terminal = Object.values(this.facilities).find(elem => elem.job === job);
        if (terminal) {
            terminal.capacity = Math.max(0, terminal.capacity - value);
        }
    }

    public getMetrics(): UpwMetrics {
        const metrics: UpwMetrics = {
            pollution_level: UpwPollutionLevel[this.upwPollutionProvider.getPollutionLevel()],
            pollution_percent: this.upwPollutionProvider.getPollutionPercent(),
            blackout_level: UpwBlackoutLevel[this.getBlackoutLevel()],
            blackout_percent: this.getBlackoutPercent(),
            facilities: [],
        };

        // Facilities
        for (const facility of Object.values(this.facilities)) {
            metrics.facilities.push({
                identifier: facility.identifier,
                value: facility.capacity,
                type: facility.type,
                job: facility.job,
                scope: facility.type == UpwFacilityType.jobTerminal ? 'entreprise' : 'default',
            });
        }

        return metrics;
    }

    @Tick(TickInterval.EVERY_MINUTE)
    public async saveLoop() {
        for (const facility of Object.values(this.facilities)) {
            await this.prismaService.upw_facility.update({
                data: {
                    data: JSON.stringify({
                        capacity: facility.capacity,
                        waste: facility.waste,
                    }),
                },
                where: {
                    identifier: facility.identifier,
                },
            });
        }
    }

    @OnEvent(ServerEvent.UPW_ADD_FACILITY)
    public async onAddFacility(source: number, model: string, coords: Vector4, job: JobType) {
        for (const type of Object.values(UpwFacilityType)) {
            if (UPWModels[type] !== joaat(model)) {
                continue;
            }

            if (type === UpwFacilityType.jobTerminal && !job) {
                this.notifier.notify(source, "Pas d'entreprise sélectionnée", 'error');
                return;
            }

            const defaultConf = UPWDefaultConf[type];
            const facility: UpwFacility = {
                ...defaultConf,
                identifier: type + Date.now(),
                position: coords,
                job: job,
                type,
                waste: 0,
            };

            await this.prismaService.upw_facility.create({
                data: {
                    identifier: facility.identifier,
                    type,
                    config: JSON.stringify({
                        position: coords,
                        job,
                        maxCapacity: defaultConf.maxCapacity,
                    }),
                    data: JSON.stringify({
                        capacity: defaultConf.capacity,
                        waste: 0,
                    }),
                },
            });

            this.facilities[facility.identifier] = facility;

            this.objectProvider.createObject({
                id: facility.identifier,
                model: UPWModels[facility.type],
                position: this.facilities[facility.identifier].position,
                metadata: {
                    job: this.facilities[facility.identifier].job,
                },
            });

            this.notifier.notify(source, 'Objet UPW créé', 'success');

            TriggerClientEvent(ClientEvent.UPW_ADD_FACILITY, -1, facility);

            return;
        }

        this.notifier.notify(source, 'Invalid prop : ' + model, 'error');
    }

    @Tick(TickInterval.EVERY_HOUR)
    public onBoostLoop() {
        const boostWindPercent = getRandomInt(80, 160) / 100;
        this.prodCoef['wind1'] = boostWindPercent;
    }

    @Tick(UpwConfig.Production.Tick)
    public onProdLoop() {
        for (const facility of Object.values(this.facilities)) {
            if (!facility.productionPerMinute) {
                continue;
            }

            // Energy production is altered by the waste level
            const wasteMulitplier = this.getWasteMultiplier(facility);

            // Produce energy
            let prod = getRandomInt(facility.productionPerMinute.min, facility.productionPerMinute.max);
            prod *= this.prodCoef[facility.identifier] ?? 1.0;
            prod *= wasteMulitplier;

            const prev = facility.capacity;
            facility.capacity = Math.min(facility.maxCapacity, facility.capacity + prod);

            // Add pollution
            if (facility.capacity - prev > 0) {
                this.upwPollutionProvider.addPollution(prod * (facility.capacity - prev));
            }

            // Produce waste
            if (facility.wastePerMinute) {
                facility.waste += getRandomInt(facility.wastePerMinute.min, facility.wastePerMinute.max) * 0.5;
            }
        }
    }

    private getWasteMultiplier(facility: UpwFacility) {
        const wasteCoef = facility.waste / facility.maxWaste;

        for (const conf of UPWWasteMultiplier) {
            if (conf.min <= wasteCoef && wasteCoef < conf.max) {
                return conf.value;
            }
        }

        return 1;
    }

    @OnEvent(ServerEvent.UPW_HARVEST_WASTE)
    async onHarvestWaste(source: number, id: string) {
        const facility = this.facilities[id];
        if (!facility) {
            this.notifier.notify(source, `Cible ~r~inconnue~s~.`, 'error');
            return;
        }

        if (facility.waste < UpwConfig.Production.WastePerHarvest) {
            this.notifier.notify(source, 'Pas de déchets à collecter', 'error');
            return;
        }

        const inv = await this.inventoryFactory.getPlayerInventory(source);
        const count = 3;
        if (!inv.canCarryItem(facility.wasteItem, count)) {
            this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à récolter', 'info');

        do {
            if (!inv.canCarryItem(facility.wasteItem, count)) {
                this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                return;
            }

            const { completed } = await this.progressService.progress(
                source,
                'upw_waste_harvest',
                'Vous récoltez...',
                5000,
                {
                    name: 'action_a',
                    dictionary: 'anim@mp_radio@garage@low',
                    flags: 1,
                }
            );

            if (!completed) {
                this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de récolter.`, 'error');
                return;
            }

            if (facility.waste < UpwConfig.Production.WastePerHarvest) {
                this.notifier.notify(source, 'Pas de déchets à collecter', 'error');
                return;
            }

            const ret = inv.add(facility.wasteItem, count);
            if (isErr(ret)) {
                this.notifier.notify(source, ADD_ERROR_MESSAGE[ret.err], 'error');
                return;
            }

            facility.waste -= UpwConfig.Production.WastePerHarvest;

            const itemDef = this.itemService.getItem(facility.wasteItem);
            this.notifier.notify(source, `Vous avez récolté ~b~${count}~s~ ~g~${itemDef.label}~s~`, 'success');

            this.displayWaste(source, facility);

            this.monitor.traceEvent('job_upw_energy_collect', {
                player_source: source,
                item_id: facility.item,
                amount: count,
                facility_id: facility.identifier,
                facility_type: facility.type,
                facility_job: facility.job,
            });
        } while (facility.waste >= UpwConfig.Production.WastePerHarvest);
        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de récolter.', 'success');
    }

    @OnEvent(ServerEvent.UPW_HARVEST_ENERGY)
    async onHarvestEnergy(source: number, id: string) {
        const facility = this.facilities[id];
        if (!facility) {
            this.notifier.notify(source, `Cible ~r~inconnue~s~.`, 'error');
            return;
        }

        if (facility.capacity < UpwConfig.Production.EnergyPerCell[facility.item]) {
            this.notifier.notify(source, "Pénurie d'énergie", 'error');
            return;
        }

        const inv = await this.inventoryFactory.getPlayerInventory(source);
        const count = 1;
        if (!inv.canCarryItem(facility.item, count)) {
            this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à récolter', 'info');

        do {
            if (!inv.canCarryItem(facility.item, count)) {
                this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                return;
            }

            const { completed } = await this.progressService.progress(
                source,
                'upw_energy_harvest',
                'Vous récoltez...',
                5000,
                {
                    name: 'action_a',
                    dictionary: 'anim@mp_radio@garage@low',
                    flags: 1,
                }
            );

            if (!completed) {
                this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de récolter.`, 'error');
                return;
            }

            if (facility.capacity < UpwConfig.Production.EnergyPerCell[facility.item]) {
                this.notifier.notify(source, "Pénurie d'énergie", 'error');
                return;
            }

            const ret = inv.add(facility.item, count);
            if (isErr(ret)) {
                this.notifier.notify(source, ADD_ERROR_MESSAGE[ret.err], 'error');
                return;
            }

            facility.capacity -= UpwConfig.Production.EnergyPerCell[facility.item];

            const itemDef = this.itemService.getItem(facility.item);
            this.notifier.notify(source, `Vous avez récolté ~b~${count}~s~ ~g~${itemDef.label}~s~`, 'success');

            this.monitor.traceEvent('job_upw_energy_collect', {
                player_source: source,
                item_id: facility.item,
                amount: count,
                facility_id: facility.identifier,
                facility_type: facility.type,
                facility_job: facility.job,
            });
        } while (facility.capacity >= UpwConfig.Production.EnergyPerCell[facility.item]);

        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de récolter.', 'success');
    }

    @OnEvent(ServerEvent.UPW_REFILL_ENERGY)
    async onRefillEnergy(source: number, id: string) {
        const facility = this.facilities[id];
        if (!facility) {
            this.notifier.notify(source, `Cible ~r~inconnue~s~.`, 'error');
            return;
        }

        if (facility.capacity >= facility.maxCapacity) {
            this.notifier.notify(source, 'Borne pleine', 'error');
            return;
        }

        const inv = await this.inventoryFactory.getPlayerInventory(source);
        if (!Object.values(inv.items()).some(elem => elem.type == 'energy' && !isInventoryItemExpired(elem))) {
            this.notifier.notify(source, "Vous n'avez pas l'item requis", 'error');
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à déposer', 'info');

        do {
            if (!Object.values(inv.items()).some(elem => elem.type == 'energy' && !isInventoryItemExpired(elem))) {
                this.notifier.notify(source, "Vous n'avez pas l'item requis", 'error');
                return;
            }

            const { completed } = await this.progressService.progress(
                source,
                'upw_energy_harvest',
                'Vous déposez...',
                5000,
                {
                    name: 'action_a',
                    dictionary: 'anim@mp_radio@garage@low',
                    flags: 1,
                }
            );

            if (!completed) {
                this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de déposer.`, 'error');
                return;
            }

            if (facility.capacity >= facility.maxCapacity) {
                this.notifier.notify(source, 'Borne pleine', 'error');
                return;
            }

            const item = Object.values(inv.items()).find(
                elem => elem.type == 'energy' && !isInventoryItemExpired(elem)
            );
            if (!item) {
                this.notifier.notify(source, "Vous n'avez pas l'item requis", 'error');
                return;
            }

            const ret = inv.removeAtSlot(item.slot, 1);
            if (!ret) {
                this.notifier.notify(source, "Erreur d'inventaire", 'error');
                return;
            }

            facility.capacity = Math.min(
                facility.capacity + UpwConfig.Production.EnergyPerCell[item.name],
                facility.maxCapacity
            );
            const itemDef = this.itemService.getItem(item.name);
            this.notifier.notify(source, `Vous avez déposé ~b~1~s~ ~g~${itemDef.label}~s~`, 'success');

            if (facility.type === UpwFacilityType.terminal) {
                // Add payment from San Andreas State on default terminals only
                this.bankService.transferFarmMoney(
                    source,
                    UpwConfig.Order.farm,
                    UpwConfig.Order.safe,
                    UpwConfig.Resale.EnergyCellPriceGlobal[item.name],
                    'money'
                );
            }

            this.monitor.traceEvent('job_upw_energy_restock', {
                player_source: source,
                item_id: item.name,
                amount: 1,
                facility_id: facility.identifier,
                facility_type: facility.type,
                facility_job: facility.job,
            });
        } while (facility.capacity < facility.maxCapacity);

        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de déposer.', 'success');
    }

    private displayWaste(source: number, facility: UpwFacility) {
        const val = facility.waste / facility.maxWaste;
        let health = '';
        if (val > 0) {
            health += '1';
        } else {
            health += '0';
        }
        if (val > 0.25) {
            health += '1';
        } else {
            health += '0';
        }
        if (val > 0.5) {
            health += '1';
        } else {
            health += '0';
        }
        if (val > 0.75) {
            health += '1';
        } else {
            health += '0';
        }

        TriggerClientEvent(ClientEvent.UPW_DISPLAY_WASTE, source, health);
    }

    @OnEvent(ServerEvent.UPW_DISPLAY_WASTE)
    public onDisplayWaste(source: number, id: string) {
        const facility = this.facilities[id];
        if (!facility) {
            return;
        }

        this.displayWaste(source, facility);
    }
}
