import { Inject, Injectable } from '@core/decorators/injectable';
import { FeatureProvider } from '@public/client/feature/feature.provider';
import { PhoneService } from '@public/client/phone/phone.service';
import { VampireGameStateProvider } from '@public/client/story/vampire.game.state.provider';
import { Feature } from '@public/shared/features';
import { Interaction } from '@public/shared/interaction';
import { JobType } from '@public/shared/job';

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

    @Inject(PhoneService)
    private readonly phoneService: PhoneService;

    @Inject(StateGlobalProvider)
    private readonly stateGlobalProvider: StateGlobalProvider;

    @Inject(VampireGameStateProvider)
    private readonly vampireGameStateProvider: VampireGameStateProvider;

    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    public async validateTarget(target: TargetOption, entity: number): Promise<boolean> {
        if (!this.globalCheck()) return false;
        if (!this.attachedCheckTarget()) return false;
        if (!this.eventCheck(target.event)) return false;

        if (target.job && !this.jobCheck(target.job)) return false;
        if (target.item && !this.itemCheck(target.item)) return false;
        if (target.blackoutGlobal && !this.blackoutGlobalCheck(target.blackoutJob)) return false;
        if (target.blackoutJob && !this.blackoutJobCheck()) return false;
        if (target.canInteract) {
            const result = await target.canInteract(entity);
            if (!result) return false;
        }

        return true;
    }

    public async validateInteraction(interaction: Interaction, entity?: number): Promise<boolean> {
        if (!this.globalCheck()) return false;
        if (!this.attachedCheckInteraction(interaction.attached)) return false;
        if (!this.eventCheck(interaction.event)) return false;

        if (interaction.job && !this.jobCheck(interaction.job)) return false;
        if (interaction.item && !this.itemCheck(interaction.item)) return false;
        if (interaction.blackoutGlobal && !this.blackoutGlobalCheck(interaction.blackoutJob)) return false;
        if (interaction.blackoutJob && !this.blackoutJobCheck()) return false;
        if (interaction.canInteract) {
            const result = await interaction.canInteract(entity);
            if (!result) return false;
        }

        return true;
    }

    protected globalCheck(): boolean {
        const player = this.playerService.getPlayer();

        if (player.metadata.isdead || player.metadata.inlaststand || player.metadata.ishandcuffed) return false;
        if (this.playerProneProvider.isPlayerProne()) return false;
        if (this.phoneService.isPhoneVisible()) return false;

        return true;
    }

    protected attachedCheckTarget(): boolean {
        if (IsEntityAttached(PlayerPedId())) return false;

        return true;
    }

    protected attachedCheckInteraction(model: string | null): boolean {
        const ped = PlayerPedId();
        if (!model && IsEntityAttached(ped)) return false;

        const entity = GetEntityAttachedTo(ped);
        if (entity && GetEntityModel(entity) !== GetHashKey(model)) return false;

        return true;
    }

    protected eventCheck(event: string): boolean {
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return event === 'all' || event === 'whatif:2';
        }

        if (this.vampireGameStateProvider.isGameRunning()) {
            return event === 'all' || event === 'vampire:game';
        }

        return true;
    }

    protected jobCheck(job: TargetOption['job']): boolean {
        const player = this.playerService.getPlayer();

        if (typeof job === 'string') {
            return player.job.id === job && player.job.onduty;
        } else if (typeof job === 'object') {
            if (job[player.job.id] === undefined) return false;
            return Number(player.job.grade) >= job[player.job.id] && player.job.onduty;
        }

        return false;
    }

    protected itemCheck(item: string): boolean {
        const inventoryItem = this.inventoryManager.findItem(i => i.name === item && !this.itemService.isExpired(i));
        if (!inventoryItem) return false;

        return inventoryItem.amount >= 1;
    }

    protected blackoutGlobalCheck(blackoutJob: JobType): boolean {
        const limit = [JobType.LSMC, JobType.BCSO, JobType.LSPD].includes(blackoutJob) ? 4 : 3;
        return this.stateGlobalProvider.getGlobalState().blackoutLevel <= limit;
    }

    protected blackoutJobCheck(): boolean {
        const player = this.playerService.getPlayer();
        const jobEnergy = this.stateGlobalProvider.getGlobalState().jobEnergy[player.job.id] || 100;

        return jobEnergy > 1;
    }
}
