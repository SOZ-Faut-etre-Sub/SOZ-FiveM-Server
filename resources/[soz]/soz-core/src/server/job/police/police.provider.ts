import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { PlayerService } from '@public/server/player/player.service';
import { ProgressService } from '@public/server/player/progress.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem, Item } from '@public/shared/item';
import { RpcServerEvent } from '@public/shared/rpc';

import { PlayerStateService } from '../../player/player.state.service';

@Provider()
export class PoliceProvider {
    @Inject(ItemService)
    public itemService: ItemService;

    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Once(OnceStep.Start)
    public init() {
        this.itemService.setItemUseCallback('armor', this.useArmor.bind(this));
        this.itemService.setItemUseCallback('outfit', this.useOutfit.bind(this));
        this.itemService.setItemUseCallback('light_intervention_outfit', this.useOutfit.bind(this));
        this.itemService.setItemUseCallback('heavy_antiriot_outfit', this.useOutfit.bind(this));
        this.itemService.setItemUseCallback('mobile_radar', this.useMobileRadar.bind(this));
    }

    @OnEvent(ServerEvent.POLICE_TAKE_DOWN)
    public async takeDownTarget(source: number, target: number) {
        TriggerClientEvent(ClientEvent.TAKE_DOWN_TARGET, target);
    }

    public async useArmor(source: number, unused: Item, item: InventoryItem): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const armorType = item.metadata['type'] || 'unmark';

        const { completed } = await this.progressService.progress(
            source,
            'switch_clothes',
            "Changement d'habits...",
            5000,
            {
                name: 'male_shower_towel_dry_to_get_dressed',
                dictionary: 'anim@mp_yacht@shower@male@',
                options: {
                    cancellable: false,
                    enablePlayerControl: true,
                    onlyUpperBody: true,
                },
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
                canCancel: false,
                useAnimationService: true,
            }
        );

        if (!completed) {
            return;
        }

        if (this.inventoryManager.removeItemFromInventory(source, item.name, 1, item.metadata)) {
            this.playerService.setPlayerMetadata(source, 'armor', { current: 100, hidden: true });
            TriggerClientEvent(ClientEvent.POLICE_SETUP_ARMOR, source, armorType);
        }

        return;
    }

    public useOutfit(source: number, it: Item, item: InventoryItem): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!this.inventoryManager.removeItemFromInventory(player.source, item.name, 1, item.metadata)) {
            return;
        }

        if (item.name == 'heavy_antiriot_outfit' || item.name == 'light_intervention_outfit') {
            this.playerService.setPlayerMetadata(source, 'armor', { current: 100, hidden: true });
        }

        if (item.metadata['type'] == 'lspd' || item.metadata['type'] == 'bcso') {
            TriggerClientEvent(ClientEvent.POLICE_APPLY_OUTFIT, source, item.name, item.metadata['type']);
        } else if (item.metadata['type'] == 'lsmc') {
            TriggerClientEvent(ClientEvent.LSMC_APPLY_OUTFIT, source, item.metadata['type']);
        } else if (item.metadata['type'] == 'stonk') {
            TriggerClientEvent(ClientEvent.STONK_APPLY_OUTFIT, source);
        } else if (item.metadata['type'] == 'patient') {
            this.playerStateService.setClientState(source, {
                isWearingPatientOutfit: true,
            });

            TriggerClientEvent(ClientEvent.LSMC_APPLY_PATIENT_CLOTHING, source);
        }

        return;
    }

    public useMobileRadar(source: number): Promise<void> {
        TriggerClientEvent(ClientEvent.POLICE_MOBILE_RADAR, source);
        return;
    }

    @Rpc(RpcServerEvent.POLICE_ALCOOLLEVEL)
    public getAlcoolLevel(source: number, target: number) {
        this.inventoryManager.removeItemFromInventory(source, 'breathanalyzer', 1);
        const targetPlayer = this.playerService.getPlayer(target);
        TriggerClientEvent(ClientEvent.POLICE_BREATHANALYZER_TARGET, targetPlayer.source);
        return targetPlayer.metadata.alcohol;
    }

    @Rpc(RpcServerEvent.POLICE_DRUGLEVEL)
    public getDrugLevel(source: number, target: number) {
        this.inventoryManager.removeItemFromInventory(source, 'screening_test', 1);
        const targetPlayer = this.playerService.getPlayer(target);
        TriggerClientEvent(ClientEvent.POLICE_BREATHANALYZER_TARGET, targetPlayer.source);
        return targetPlayer.metadata.drug;
    }
}
