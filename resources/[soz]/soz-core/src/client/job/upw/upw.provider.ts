import { BlipFactory } from '@public/client/blip';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { Notifier } from '@public/client/notifier';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { ObjectProvider } from '@public/client/object/object.provider';
import { PlayerInOutService } from '@public/client/player/player.inout.service';
import { PlayerService } from '@public/client/player/player.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { Blip } from '@public/shared/blip';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { InventoryType } from '@public/shared/inventory';
import { JobType } from '@public/shared/job';
import { UpwConfig, UpwFacility, UpwFacilityType, UPWModels } from '@public/shared/job/upw';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { UpwPollutionProvider } from './upw.pollution.provider';

@Provider()
export class UpwProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(UpwPollutionProvider)
    private upwPollutionProvider: UpwPollutionProvider;

    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private currentWasteZone: string;

    @Once()
    public async init() {
        this.targetFactory.createForBoxZone('UPW_resale', UpwConfig.Resale.Zone, [
            {
                label: "Vendre l'énergie",
                icon: 'upw/vendre',
                category: 'society',
                job: JobType.Upw,
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                action: () => {
                    TriggerServerEvent(ServerEvent.UPW_RESELL);
                },
            },
        ]);

        this.blipFactory.create('job_upw', UpwConfig.MainBlip);

        this.targetFactory.createForModel(
            ['soz_prop_elec01', 'soz_prop_elec01_hs2', 'soz_prop_elec02', 'soz_prop_elec02_hs2'],
            [
                {
                    label: "Déposer l'énergie",
                    icon: 'upw/deposer',
                    category: 'society',
                    job: JobType.Upw,
                    action: entity => {
                        const objId = this.objectProvider.getIdFromEntity(entity);

                        if (!objId) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.UPW_REFILL_ENERGY, objId);
                    },
                },
                {
                    label: "État d'énergie",
                    icon: 'fuel/battery',
                    category: 'society',
                    canInteract: entity => {
                        const objId = this.objectProvider.getIdFromEntity(entity);

                        if (!objId) {
                            return false;
                        }

                        const player = this.playerService.getPlayer();
                        if (!player.job.onduty) {
                            return false;
                        }

                        const obj = this.objectProvider.getObject(objId);
                        if (!obj) {
                            return;
                        }

                        return [JobType.Upw, obj.metadata.job].includes(player.job.id);
                    },
                    action: entity => {
                        const objId = this.objectProvider.getIdFromEntity(entity);

                        if (!objId) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.UPW_GET_STORAGE_CAPACITY, objId);
                    },
                },
            ]
        );

        this.targetFactory.createForModel(UPWModels.inverter, [
            {
                label: "Accéder à l'onduleur",
                icon: 'inventory/ouvrir_le_stockage',
                category: 'society',
                job: JobType.Upw,
                action: entity => {
                    const objId = this.objectProvider.getIdFromEntity(entity);

                    if (!objId) {
                        return;
                    }

                    const coords = GetEntityCoords(PlayerPedId()) as Vector3;
                    this.inventoryManager.openInventory(InventoryType.Inverter, 'inverter_' + objId, coords);
                },
            },
        ]);

        // Fetch facilities from database
        const types = [
            UpwFacilityType.plant,
            UpwFacilityType.inverter,
            UpwFacilityType.jobTerminal,
            UpwFacilityType.terminal,
        ];
        const facilities = await emitRpc<UpwFacility[]>(RpcServerEvent.UPW_GET_FACILITIES, types);

        for (const facility of facilities) {
            // Blip
            const blip_id = `job_upw_${facility.identifier}`;
            const blip: Blip = {
                ...UpwConfig.FacilitiesBlip[facility.type],
                position: facility.position || facility.energyZone.center,
            };
            this.blipFactory.create(blip_id, blip, false);

            if (facility.energyZone) {
                this.targetFactory.createForBoxZone('upw_harvest_' + facility.identifier, facility.energyZone, [
                    {
                        label: "Collecter l'énergie",
                        icon: 'upw/collecter',
                        category: 'society',
                        job: JobType.Upw,
                        action: () => TriggerServerEvent(ServerEvent.UPW_HARVEST_ENERGY, facility.identifier),
                    },
                    {
                        label: 'Taux de pollution',
                        icon: 'upw/pollution',
                        category: 'society',
                        job: JobType.Upw,
                        action: () =>
                            this.notifier.notify(
                                `Niveau de pollution : ${this.upwPollutionProvider.getPollutionPercent()}%`,
                                'info'
                            ),
                    },
                ]);
            }

            if (facility.wasteZone) {
                this.targetFactory.createForBoxZone('upw_waste_' + facility.identifier, facility.wasteZone, [
                    {
                        label: 'Collecter les déchets',
                        icon: 'upw/recyclage',
                        category: 'society',
                        job: JobType.Garbage,
                        action: () => TriggerServerEvent(ServerEvent.UPW_HARVEST_WASTE, facility.identifier),
                    },
                ]);

                this.playerInOutService.add(
                    'upw_waste_' + facility.identifier,
                    BoxZone.fromZone({
                        ...facility.wasteZone,
                        length: 100,
                        width: 100,
                    }),
                    isInside => {
                        if (isInside) {
                            this.currentWasteZone = facility.identifier;
                            TriggerServerEvent(ServerEvent.UPW_DISPLAY_WASTE, facility.identifier);
                        } else {
                            this.currentWasteZone = null;
                            this.nuiDispatch.dispatch('field', 'SetHealth');
                        }
                    }
                );
            }
        }

        // Resale zone
        this.blipFactory.create(
            'job_upw_resell',
            { ...UpwConfig.FacilitiesBlip['resell'], position: UpwConfig.Resale.Zone.center },
            false
        );
    }

    @Tick(TickInterval.EVERY_SECOND * 10)
    public async updateInverterTextureLoop() {
        const inverters = this.objectProvider.getLoadedObjects(obj => obj.model == UPWModels.inverter);
        for (const inverter of inverters) {
            const capacity = await emitRpc<number>(RpcServerEvent.UPW_GET_STORAGE_CAPACITY, inverter.id);
            if (capacity >= 100) {
                AddReplaceTexture('upwpiletex', 'UPW_Emit_100', 'upwpiletex', 'UPW_Emit_100');
            } else if (capacity >= 66) {
                AddReplaceTexture('upwpiletex', 'UPW_Emit_100', 'upwpiletex', 'UPW_Emit_66');
            } else if (capacity >= 33) {
                AddReplaceTexture('upwpiletex', 'UPW_Emit_100', 'upwpiletex', 'UPW_Emit_33');
            } else {
                AddReplaceTexture('upwpiletex', 'UPW_Emit_100', 'upwpiletex', 'UPW_Emit_0');
            }
        }
    }

    @OnEvent(ClientEvent.UPW_DISPLAY_WASTE)
    public onDisplayWaste(health: string) {
        if (this.currentWasteZone) {
            this.nuiDispatch.dispatch('field', 'SetHealth', [health, 'waste']);
        }
    }
}
