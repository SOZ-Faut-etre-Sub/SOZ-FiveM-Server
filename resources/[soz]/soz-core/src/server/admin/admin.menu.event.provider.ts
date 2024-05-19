import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event/server';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { WorldEventRepository } from '../repository/world.event.repository';

@Provider()
export class AdminMenuEventProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(WorldEventRepository)
    private worldEventRepository: WorldEventRepository;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    @OnEvent(ServerEvent.ADMIN_EVENT_CREATE)
    public async createEvent(source: number, name: string): Promise<void> {
        if (!this.permissionService.isHelper(source)) {
            return;
        }

        const event = await this.worldEventRepository.addEvent(name);

        this.notifier.notify(source, `Evenement ${event.name} crée`);
    }

    @OnEvent(ServerEvent.ADMIN_EVENT_DELETE)
    public async removeEvent(source: number, eventId: string): Promise<void> {
        if (!this.permissionService.isHelper(source)) {
            return;
        }

        const event = await this.worldEventRepository.remove(eventId);

        this.notifier.notify(source, `Evenement ${event.name} supprimée`);
    }

    @OnEvent(ServerEvent.ADMIN_EVENT_ADD_REWARD)
    public async addReward(
        source: number,
        eventId: string,
        itemId: string,
        chance: number,
        min: number,
        max: number
    ): Promise<void> {
        if (!this.permissionService.isHelper(source)) {
            return;
        }

        const item = this.itemService.getItem(itemId);

        if (!item) {
            this.notifier.notify(source, `L'item ${itemId} n'existe pas`, 'error');

            return;
        }

        const existingEvent = await this.worldEventRepository.getEvent(eventId);

        if (!existingEvent) {
            this.notifier.notify(source, `L'evenement ${eventId} n'existe pas`, 'error');

            return;
        }

        if (existingEvent.reward.find(reward => reward.item === itemId)) {
            this.notifier.notify(
                source,
                `L'item ${item.label} est déjà une récompense de l'evenement ${existingEvent.name}`,
                'error'
            );

            return;
        }

        const event = await this.worldEventRepository.addReward(eventId, {
            item: item.name,
            chance,
            min,
            max,
        });

        this.notifier.notify(source, `Récompense ${item.label} ajouter à l'evenement ${event.name}`);
    }

    @OnEvent(ServerEvent.ADMIN_EVENT_REMOVE_REWARD)
    public async removeReward(source: number, eventId: string, itemId: string): Promise<void> {
        if (!this.permissionService.isHelper(source)) {
            return;
        }

        const existingEvent = await this.worldEventRepository.getEvent(eventId);

        if (!existingEvent) {
            this.notifier.notify(source, `L'evenement ${eventId} n'existe pas`, 'error');

            return;
        }

        const event = await this.worldEventRepository.removeReward(eventId, itemId);

        this.notifier.notify(source, `Récompense ${itemId} supprimer de l'evenement ${event.name}`);
    }

    @OnEvent(ServerEvent.ADMIN_EVENT_SET_REWARD_CHANCE)
    public async setRewardChance(source: number, eventId: string, itemId: string, chance: number): Promise<void> {
        if (!this.permissionService.isHelper(source)) {
            return;
        }

        const existingEvent = await this.worldEventRepository.getEvent(eventId);

        if (!existingEvent) {
            this.notifier.notify(source, `L'evenement ${eventId} n'existe pas`, 'error');

            return;
        }

        await this.worldEventRepository.setRewardChance(eventId, itemId, chance);

        this.notifier.notify(
            source,
            `Récompense ${itemId} de l'evenement ${existingEvent.name} a maintenant ${chance}% de chance de drop`
        );
    }

    @OnEvent(ServerEvent.ADMIN_EVENT_SET_REWARD_MIN)
    public async setRewardMin(source: number, eventId: string, itemId: string, min: number): Promise<void> {
        if (!this.permissionService.isHelper(source)) {
            return;
        }

        const existingEvent = await this.worldEventRepository.getEvent(eventId);

        if (!existingEvent) {
            this.notifier.notify(source, `L'evenement ${eventId} n'existe pas`, 'error');

            return;
        }

        await this.worldEventRepository.setRewardMin(eventId, itemId, min);

        this.notifier.notify(
            source,
            `Récompense ${itemId} de l'evenement ${existingEvent.name} a maintenant un minimum de ${min}`
        );
    }

    @OnEvent(ServerEvent.ADMIN_EVENT_SET_REWARD_MAX)
    public async setRewardMax(source: number, eventId: string, itemId: string, max: number): Promise<void> {
        if (!this.permissionService.isHelper(source)) {
            return;
        }

        const existingEvent = await this.worldEventRepository.getEvent(eventId);

        if (!existingEvent) {
            this.notifier.notify(source, `L'evenement ${eventId} n'existe pas`, 'error');

            return;
        }

        await this.worldEventRepository.setRewardMax(eventId, itemId, max);

        this.notifier.notify(
            source,
            `Récompense ${itemId} de l'evenement ${existingEvent.name} a maintenant un maximum de ${max}`
        );
    }
}
