import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Once, OnEvent } from '@public/core/decorators/event';
import { Rpc } from '@public/core/decorators/rpc';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { PlayerStateService } from '@public/server/player/player.state.service';
import { ProgressService } from '@public/server/player/progress.service';
import { VehicleStateService } from '@public/server/vehicle/vehicle.state.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem, Item } from '@public/shared/item';
import { StretcherFoldedModel, StretcherModel, WheelChairModel } from '@public/shared/job/lsmc';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class LSMCItemProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    private usedMorphine = new Set<string>();

    @Once()
    public async onInit() {
        this.item.setItemUseCallback('tissue', this.useTissue.bind(this));
        this.item.setItemUseCallback('antibiotic', this.useAntibiotic.bind(this));
        //this.item.setItemUseCallback('pommade', this.usePommade.bind(this));
        this.item.setItemUseCallback('ifaks', this.useIfaks.bind(this));
        this.item.setItemUseCallback('painkiller', this.usePainkiller.bind(this));
        this.item.setItemUseCallback('stretcher', this.useStretcher.bind(this));
        this.item.setItemUseCallback('wheelchair', this.useWheelChair.bind(this));
        this.item.setItemUseCallback('naloxone', this.useNaloxone.bind(this));
        this.item.setItemUseCallback('morphine', this.useMorphine.bind(this));
    }

    private async useTissue(source: number, _item: Item, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            if (player.metadata.disease == 'rhume') {
                this.notifier.notify(source, 'Vous utilisez un mouchoir et vous vous sentez mieux !');
                this.playerService.setPlayerDisease(source, false);
            } else {
                this.notifier.notify(source, 'Vous utilisez un mouchoir, mais rien ne sort !');
            }
        }
    }

    private async useAntibiotic(source: number, _item: Item, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            if (player.metadata.disease == 'intoxication') {
                this.notifier.notify(source, 'Vous utilisez un antibiotique et vous vous sentez mieux !');
                this.playerService.setPlayerDisease(source, false);
            } else {
                this.notifier.notify(source, 'Vous utilisez un antibiotique, mais rien ne change !');
            }
        }
    }

    private async usePainkiller(source: number, _item: Item, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            if (player.metadata.disease == 'backpain') {
                this.notifier.notify(source, 'Vous utilisez un anti-douleur et vous vous sentez mieux !');
                this.playerService.setPlayerDisease(source, false);
            } else {
                this.notifier.notify(source, 'Vous utilisez un anti-douleur, mais rien ne change !');
            }
        }
    }

    private async useIfaks(source: number, _item: Item, inventoryItem: InventoryItem) {
        if (!this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            return;
        }
        this.playerService.setPlayerMetaDatas(source, {
            hunger: 100,
            thirst: 100,
        });

        TriggerClientEvent(ClientEvent.LSMC_HEAL, source, 100);
    }

    private async useStretcher(source: number, _item: Item, inventoryItem: InventoryItem) {
        const { completed } = await this.progressService.progress(
            source,
            'use_stretcher',
            'Vous dépliez le brancard...',
            3000,
            {
                dictionary: 'mp_common',
                name: 'givetake2_a',
                blendInSpeed: 8.0,
                blendOutSpeed: 8.0,
                options: {
                    enablePlayerControl: true,
                    onlyUpperBody: true,
                },
            },
            {}
        );

        if (!completed) {
            return;
        }

        if (this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            TriggerClientEvent(ClientEvent.LSMC_STRETCHER_USE, source);
        }
    }

    @OnEvent(ServerEvent.LSMC_STRETCHER_RETRIEVE)
    public onStretcherRetrieve(source: number, netId: number) {
        if (!this.inventoryManager.canCarryItem(source, 'stretcher', 1)) {
            this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
            return;
        }

        const entity = NetworkGetEntityFromNetworkId(netId);
        if (!DoesEntityExist(entity) || ![StretcherModel, StretcherFoldedModel].includes(GetEntityModel(entity))) {
            return;
        }

        DeleteEntity(entity);
        this.inventoryManager.addItemToInventory(source, 'stretcher', 1);

        this.notifier.notify(source, 'Tu as ramassé un brancard');
    }

    @OnEvent(ServerEvent.LSMC_STRETCHER_PUT_ON)
    public onPutOnStretcher(source: number, netId: number) {
        const playerState = this.playerStateService.getClientState(source);
        if (!playerState || !playerState.isEscorting || !playerState.escorting) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(playerState.escorting);

        if (player && target && player != target) {
            this.playerStateService.setClientState(target.source, { isEscorted: false });
            this.playerStateService.setClientState(player.source, { isEscorting: false, escorting: null });
            TriggerClientEvent(ClientEvent.LSMC_STRETCHER_PUT_ON, target.source, netId);
        }
    }

    @OnEvent(ServerEvent.LSMC_STRETCHER_ON_AMBULANCE)
    public onAmbulanceStretcher(
        source: number,
        target: number,
        netId: number,
        vehNetId: number,
        newStretcherNetID: number
    ) {
        const entity = NetworkGetEntityFromNetworkId(netId);
        if (!DoesEntityExist(entity) || GetEntityModel(entity) != StretcherModel) {
            return;
        }

        DeleteEntity(entity);

        this.vehicleStateService.updateVehicleVolatileState(vehNetId, {
            ambulanceAttachedStretcher: newStretcherNetID,
        });

        if (target) {
            TriggerClientEvent(ClientEvent.LSMC_STRETCHER_PUT_ON, target, newStretcherNetID);
        }
    }

    @OnEvent(ServerEvent.LSMC_STRETCHER_RETRIEVE_AMBULANCE)
    public onAmbulanceretrieveStretcher(
        source: number,
        target: number,
        netId: number,
        vehNetId: number,
        newStretcherNetID: number
    ) {
        const entity = NetworkGetEntityFromNetworkId(netId);
        if (!DoesEntityExist(entity) || GetEntityModel(entity) != StretcherFoldedModel) {
            return;
        }

        DeleteEntity(entity);

        this.vehicleStateService.updateVehicleVolatileState(vehNetId, {
            ambulanceAttachedStretcher: null,
        });

        if (target) {
            TriggerClientEvent(ClientEvent.LSMC_STRETCHER_PUT_ON, target, newStretcherNetID);
        }
    }

    @Rpc(RpcServerEvent.LSMC_STRETCHER_AMBULANCE_STATUS)
    public getAmbulanceStretcherStatus(source: number, vehicleNetworkId: number) {
        return this.vehicleStateService.getVehicleState(vehicleNetworkId).volatile.ambulanceAttachedStretcher;
    }

    private async useWheelChair(source: number, _item: Item, inventoryItem: InventoryItem) {
        const { completed } = await this.progressService.progress(
            source,
            'use_wheelchair',
            'Vous dépliez la chaise roulante...',
            3000,
            {
                dictionary: 'mp_common',
                name: 'givetake2_a',
                blendInSpeed: 8.0,
                blendOutSpeed: 8.0,
                options: {
                    enablePlayerControl: true,
                    onlyUpperBody: true,
                },
            },
            {}
        );

        if (!completed) {
            return;
        }

        if (this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            TriggerClientEvent(ClientEvent.LSMC_WHEELCHAIR_USE, source);
        }
    }

    @OnEvent(ServerEvent.LSMC_WHEELCHAIR_RETRIEVE)
    public onWheelChairRetrieve(source: number, netId: number) {
        if (!this.inventoryManager.canCarryItem(source, 'wheelchair', 1)) {
            this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
            return;
        }

        const entity = NetworkGetEntityFromNetworkId(netId);
        if (!DoesEntityExist(entity) || GetEntityModel(entity) != WheelChairModel) {
            return;
        }

        DeleteEntity(entity);
        this.inventoryManager.addItemToInventory(source, 'wheelchair', 1);

        this.notifier.notify(source, 'Tu as ramassé une chaisse roulante');
    }

    public async useNaloxone(source: number, item: Item, inventoryItem: InventoryItem): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const progress = await this.progressService.progress(
            source,
            'use_naloxone',
            'Injection de Naloxone...',
            10000,
            {
                name: 'miranda_shooting_up',
                dictionary: 'rcmpaparazzo1ig_4',
                options: {
                    onlyUpperBody: true,
                },
                playbackRate: 0.4,
            },
            {
                firstProp: {
                    model: 'prop_syringe_01',
                    bone: 28422,
                    coords: { x: 0.0, y: 0.0, z: -0.045 },
                    rotation: { x: 0, y: 0, z: 0 },
                },
            }
        );

        if (!progress.completed) {
            return;
        }

        this.playerService.setPlayerMetadata(source, 'drug', Math.max(0, player.metadata.drug - 50));
        this.inventoryManager.removeInventoryItem(source, inventoryItem, 1);

        this.notifier.notify(
            source,
            'Vous vous êtes injecté une dose de ~g~Naloxone~s~, vous êtes désormais désintoxiqué.'
        );
    }

    @OnEvent(ServerEvent.LSMC_NALOXONE)
    public async onNaloxone(source: number, target: number) {
        const { completed } = await this.progressService.progress(
            source,
            'use_naloxone',
            'Injection de Naloxone...',
            10000,
            {
                name: 'miranda_shooting_up',
                dictionary: 'rcmpaparazzo1ig_4',
                options: {
                    onlyUpperBody: true,
                },
                playbackRate: 0.4,
            },
            {
                firstProp: {
                    model: 'prop_syringe_01',
                    bone: 28422,
                    coords: { x: 0.0, y: 0.0, z: -0.045 },
                    rotation: { x: 0, y: 0, z: 0 },
                },
            }
        );

        if (!completed) {
            return;
        }

        if (!this.inventoryManager.removeNotExpiredItem(source, 'naloxone')) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(target);
        this.playerService.setPlayerMetadata(target, 'drug', Math.max(0, targetPlayer.metadata.drug - 50));

        this.notifier.notify(source, 'Vous avez injecté une dose de ~g~Naloxone~s~.');
        this.notifier.notify(target, 'Vous recu une dose de ~g~Naloxone~s~, vous êtes désormais désintoxiqué.');
    }

    public async useMorphine(source: number, item: Item, inventoryItem: InventoryItem): Promise<void> {
        this.onMorphine(source, source, inventoryItem);
    }

    @OnEvent(ServerEvent.LSMC_MORPHINE)
    public async onMorphine(source: number, target: number, item: InventoryItem) {
        const player = this.playerService.getPlayer(target);
        if (!player) {
            return;
        }

        if (!item) {
            item = this.inventoryManager.findItem(
                source,
                item => item.name == 'morphine' && !this.item.isItemExpired(item)
            );
            if (!item) {
                return;
            }
        }

        const { completed } = await this.progressService.progress(
            source,
            'use_naloxone',
            'Injection de Morphine...',
            10000,
            {
                name: 'miranda_shooting_up',
                dictionary: 'rcmpaparazzo1ig_4',
                options: {
                    onlyUpperBody: true,
                },
                playbackRate: 0.4,
            },
            {
                firstProp: {
                    model: 'prop_syringe_01',
                    bone: 28422,
                    coords: { x: 0.0, y: 0.0, z: -0.045 },
                    rotation: { x: 0, y: 0, z: 0 },
                },
            }
        );

        if (!completed) {
            return;
        }

        if (!this.inventoryManager.removeInventoryItem(source, item)) {
            return;
        }

        this.playerService.incrementMetadata(target, 'drug', 10, 0, 110);

        if (this.usedMorphine.has(player.citizenid)) {
            this.notifier.notify(source, 'Vous avez déjà pris de la morphine.', 'error');
        } else {
            this.playerService.incrementMetadata(target, 'stress_level', -20, 0, 100);
            this.usedMorphine.add(player.citizenid);
        }

        if (target != source) {
            this.notifier.notify(source, 'Vous avez injecté une dose de ~g~Morphine~s~.');
            this.notifier.notify(target, 'Vous recu une dose de ~g~Morphine~s~');
        } else {
            this.notifier.notify(source, 'Vous vous êtes injecté une dose de ~g~Morphine~s~.');
        }
    }
}
