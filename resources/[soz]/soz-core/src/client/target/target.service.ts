import { Inject, Injectable } from '@core/decorators/injectable';
import { InteractionOption } from '@public/shared/interaction';

import { TargetOption } from '../../shared/target';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { PlayerProneProvider } from '../player/player.prone.provider';
import { PlayerService } from '../player/player.service';
import { StateGlobalProvider } from '../store/state.global.provider';

@Injectable()
export class TargetService {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(PlayerProneProvider)
    private readonly playerProneProvider: PlayerProneProvider;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject(ItemService)
    private readonly itemService: ItemService;

    @Inject(StateGlobalProvider)
    private readonly stateGlobalProvider: StateGlobalProvider;

    public async validateTarget(target: TargetOption, entity: number): Promise<boolean> {
        if (!this.globalCheck()) return false;

        if (target.job && !this.jobCheck(target.job)) return false;
        if (target.item && !this.itemCheck(target.item)) return false;
        if (target.blackoutGlobal && !this.blackoutGlobalCheck()) return false;
        if (target.blackoutJob && !this.blackoutJobCheck()) return false;
        if (target.canInteract) {
            const result = await target.canInteract(entity);

            if (!result) {
                return false;
            }
        }

        return true;
    }

    public async validateInteraction(interaction: InteractionOption): Promise<boolean> {
        if (!this.globalCheck()) return false;
        if (interaction.job && !this.jobCheck(interaction.job)) return false;
        if (interaction.item && !this.itemCheck(interaction.item)) return false;
        if (interaction.blackoutGlobal && !this.blackoutGlobalCheck()) return false;
        if (interaction.blackoutJob && !this.blackoutJobCheck()) return false;
        if (interaction.canInteract) {
            const result = await interaction.canInteract();
            if (!result) {
                return false;
            }
        }
        return true;
    }

    protected globalCheck(): boolean {
        const player = this.playerService.getPlayer();

        if (player.metadata.isdead || player.metadata.inlaststand || player.metadata.ishandcuffed) return false;
        if (this.playerProneProvider.isPlayerProne()) return false;
        if (exports['soz-phone'].isPhoneVisible()) return false;
        if (IsEntityAttached(PlayerPedId())) return false;

        return true;
    }

    protected jobCheck(job: TargetOption['job']): boolean {
        const player = this.playerService.getPlayer();

        if (typeof job === 'string') {
            return player.job.id === job && player.job.onduty;
        } else if (typeof job === 'object') {
            return job[player.job.id] && job[player.job.id] >= Number(player.job.grade) && player.job.onduty;
        }

        return false;
    }

    protected itemCheck(item: string): boolean {
        const inventoryItem = this.inventoryManager.findItem(i => i.name === item);
        if (!inventoryItem) return false;

        return inventoryItem.amount >= 1 && !this.itemService.isExpired(inventoryItem);
    }

    protected blackoutGlobalCheck(): boolean {
        return this.stateGlobalProvider.getGlobalState().blackoutLevel <= 3;
    }

    protected blackoutJobCheck(): boolean {
        const player = this.playerService.getPlayer();
        const jobEnergy = this.stateGlobalProvider.getGlobalState().jobEnergy[player.job.id] || 100;

        return jobEnergy > 1;
    }
}
