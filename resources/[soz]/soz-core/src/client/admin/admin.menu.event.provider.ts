import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { Item } from '../../shared/item';
import { NotEmptyStringValidator, NumberValidatorFactory } from '../../shared/nui/input';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { EventInfo } from '../../shared/scene';
import { ItemService } from '../item/item.service';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class AdminMenuEventProvider {
    @Inject(InputService)
    private input: InputService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @OnNuiEvent(NuiEvent.AdminMenuEventStart)
    public async startEvent({ eventId }: { eventId: number }): Promise<EventInfo | null> {
        return await emitRpc<EventInfo | null>(RpcServerEvent.WORLD_EVENT_START, eventId);
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventStop)
    public async stopEvent(): Promise<void> {
        TriggerServerEvent(ServerEvent.WORLD_EVENT_STOP);
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventCreate)
    public async createEvent(): Promise<void> {
        const name = await this.input.askInput(
            {
                title: "Nom de l'event",
            },
            NotEmptyStringValidator
        );

        if (!name) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_EVENT_CREATE, name);
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventDelete)
    public async deleteEvent({ eventId }: { eventId: string }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_EVENT_DELETE, eventId);

        this.nuiDispatch.dispatch('menu', 'Backspace');
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventAddReward)
    public async addEventReward({ eventId }: { eventId: string }): Promise<void> {
        const item = await this.input.askInput<Item>(
            {
                title: 'Identifiant (chaine) de la récompense',
            },
            value => {
                if (value === '') {
                    return Err('Vous devez entrer un identifiant');
                }

                const item = this.itemService.getItem(value);

                if (!item) {
                    return Err("Cet objet n'existe pas");
                }

                return Ok(item);
            }
        );

        if (!item) {
            return;
        }

        const chance = await this.input.askInput<number>(
            {
                title: 'Pourcentage de chance de drop',
                maxCharacters: 10,
            },
            NumberValidatorFactory(0, 100)
        );

        if (!chance) {
            return;
        }

        const min = await this.input.askInput<number>(
            {
                title: 'Quantité minimum',
                maxCharacters: 10,
            },
            NumberValidatorFactory(1)
        );

        if (!min) {
            return;
        }

        const max = await this.input.askInput<number>(
            {
                title: 'Quantité maximum',
                maxCharacters: 10,
            },
            NumberValidatorFactory(min)
        );

        if (!max) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_EVENT_ADD_REWARD, eventId, item.name, chance, min, max);
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventRemoveReward)
    public async removeEventReward({ index, eventId }: { index: number; eventId: string }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_EVENT_REMOVE_REWARD, eventId, index);
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventSetRewardChance)
    public async setRewardChance({ index, eventId }: { index: number; eventId: string }): Promise<void> {
        const chance = await this.input.askInput<number>(
            {
                title: 'Pourcentage de chance de drop',
                maxCharacters: 10,
            },
            NumberValidatorFactory(0, 100)
        );

        if (!chance) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_EVENT_SET_REWARD_CHANCE, eventId, index, chance);
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventSetRewardMin)
    public async setRewardMin({ index, eventId }: { index: number; eventId: string }): Promise<void> {
        const min = await this.input.askInput<number>(
            {
                title: 'Quantité minimum',
                maxCharacters: 10,
            },
            NumberValidatorFactory(1)
        );

        if (!min) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_EVENT_SET_REWARD_MIN, eventId, index, min);
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventSetRewardMax)
    public async setRewardMax({ index, eventId }: { index: number; eventId: string }): Promise<void> {
        const max = await this.input.askInput<number>(
            {
                title: 'Quantité maximum',
                maxCharacters: 10,
            },
            NumberValidatorFactory(1)
        );

        if (!max) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_EVENT_SET_REWARD_MAX, eventId, index, max);
    }

    @OnNuiEvent(NuiEvent.AdminMenuEventSetStartSound)
    public async setStartSound({ eventId, sound }: { eventId: string; sound: string | null }): Promise<void> {
        const startSound = await this.input.askInput<string>({
            title: 'Son de début',
            maxCharacters: 255,
            defaultValue: sound,
        });

        if (startSound === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_EVENT_SET_START_SOUND, eventId, startSound === '' ? null : startSound);
    }
}
