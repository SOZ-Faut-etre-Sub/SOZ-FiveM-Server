import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { BankMoneyType, TaxType } from '../../shared/bank';
import { EntityType } from '../../shared/entity';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { ScreenSelectMode } from '../../shared/hud';
import { DEFAULT_MAX_INVENTORY_DISTANCE, InventoryItem, InventorySort } from '../../shared/inventory';
import { Item } from '../../shared/item';
import { NumberValidatorFactory, PositiveNumberValidator, ValidateInput } from '../../shared/nui/input';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { CartElement } from '../../shared/shop/superette';
import { PedFactory } from '../factory/ped.factory';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { ScreenService } from '../screen.service';
import { InventoryDragAndDropProvider } from './inventory.draganddrop.provider';
import { InventoryManager } from './inventory.manager';

type MoveItemData = {
    sourceInventoryId: string;
    sourceSlot: number;
    sourceAmount: number;
    targetInventoryId: string;
    targetSlot: number;
    modifier: 'ctrl' | 'shift' | 'alt' | null;
};

@Provider()
export class InventoryProvider {
    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(InputService)
    public inputService: InputService;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(ScreenService)
    public screenService: ScreenService;

    @Inject(PedFactory)
    public pedFactory: PedFactory;

    @Inject(NuiDispatch)
    public nuiDispatch: NuiDispatch;

    @Inject(InventoryDragAndDropProvider)
    public inventoryDragAndDropProvider: InventoryDragAndDropProvider;

    @OnNuiEvent(NuiEvent.InventoryMoveItem)
    public async onInventoryMoveItem({
        sourceInventoryId,
        sourceSlot,
        sourceAmount,
        targetInventoryId,
        targetSlot,
        modifier,
    }: MoveItemData) {
        let amount = null;

        if (modifier !== null) {
            amount = sourceAmount;

            if (modifier === 'ctrl') {
                amount = 1;
            }

            if (modifier === 'shift') {
                amount = Math.max(Math.floor(sourceAmount / 2), 1);
            }

            if (modifier === 'alt') {
                const result = await this.inputService.askInput(
                    {
                        title: 'Quantité :',
                        defaultValue: Math.max(Math.floor(sourceAmount / 2), 1).toString(),
                        maxCharacters: 5,
                    },
                    NumberValidatorFactory(1, sourceAmount)
                );

                if (result === null) {
                    return;
                }

                amount = result;
            }
        }

        TriggerServerEvent(
            ServerEvent.INVENTORY_MOVE_ITEM,
            sourceInventoryId,
            sourceSlot,
            targetInventoryId,
            targetSlot,
            amount
        );
    }

    @OnNuiEvent(NuiEvent.InventorySort)
    public async onInventorySort({ id, sort }: { id: string; sort: InventorySort }) {
        TriggerServerEvent(ServerEvent.INVENTORY_SORT, id, sort);
    }

    @OnNuiEvent(NuiEvent.InventoryClose)
    public async onInventoryClose() {
        this.inventoryManager.unsubscribeInventory();
    }

    @OnNuiEvent(NuiEvent.InventoryActionUse)
    public async onInventoryActionUse({
        inventoryId,
        inventoryItem,
    }: {
        inventoryItem: InventoryItem;
        inventoryId: string;
    }) {
        this.nuiDispatch.closeEverything();

        TriggerServerEvent(ServerEvent.INVENTORY_USE_ITEM, inventoryId, inventoryItem.slot);
    }

    @OnNuiEvent(NuiEvent.InventoryActionDrop)
    public async onInventoryActionDrop({
        inventoryId,
        inventoryItem,
    }: {
        inventoryItem: InventoryItem;
        inventoryId: string;
    }) {
        TriggerServerEvent(ServerEvent.INVENTORY_DROP_ITEM, inventoryId, inventoryItem.slot);
    }

    @OnNuiEvent(NuiEvent.InventoryActionShowItem)
    public async onInventoryActionShowItem({
        inventoryId,
        inventoryItem,
    }: {
        inventoryItem: InventoryItem;
        inventoryId: string;
    }) {
        const [playerId, distance] = this.playerService.getClosestPlayer();

        if (playerId !== null && distance < DEFAULT_MAX_INVENTORY_DISTANCE) {
            TriggerServerEvent(ServerEvent.INVENTORY_ITEM_SHOW, playerId, inventoryId, inventoryItem.slot);

            return;
        }

        this.notifier.error("Personne n'est à portée de vous.");
    }

    @OnNuiEvent(NuiEvent.InventoryActionGive)
    public async onInventoryActionGive({
        inventoryId,
        inventoryItem,
        item,
        mode,
    }: {
        inventoryItem: InventoryItem;
        inventoryId: string;
        item: Item | null;
        mode: ScreenSelectMode;
    }) {
        const [playerId, , distance] = await this.getPlayerFromMode(mode);
        const selfPlayerId = GetPlayerServerId(PlayerId());

        if (playerId && playerId !== selfPlayerId && distance < DEFAULT_MAX_INVENTORY_DISTANCE) {
            await this.giveItemToPlayer(playerId, inventoryId, inventoryItem, item);

            return;
        }

        this.notifier.error("Personne n'est à portée de vous");
    }

    @OnNuiEvent(NuiEvent.InventoryActionItemOnScreen)
    public async onInventoryItemOnScreen({
        inventoryId,
        inventoryItem,
        item,
    }: {
        inventoryItem: InventoryItem;
        inventoryId: string;
        item: Item | null;
    }) {
        const [entity, position] = await this.screenService.getEntityOnMousePosition();
        const entityType = entity ? GetEntityType(entity) : null;
        const entityPlayerId = IsPedAPlayer(entity) ? GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)) : null;
        const selfPosition = GetEntityCoords(PlayerPedId()) as Vector3;
        const selfPlayerId = GetPlayerServerId(PlayerId());

        // Case where the player is trying to drop an item on a player
        if (
            entityPlayerId !== null &&
            entityPlayerId !== selfPlayerId &&
            getDistance(position, selfPosition) < DEFAULT_MAX_INVENTORY_DISTANCE
        ) {
            await this.giveItemToPlayer(entityPlayerId, inventoryId, inventoryItem, item);

            return;
        }

        // Case where the player is trying to drop an item on a ped with a dropItemCallback
        if (entity && entityType === EntityType.Ped) {
            const ped = this.pedFactory.getPedByEntity(entity);

            if (ped !== null && ped.dropItemCallback) {
                const amount = await this.inputService.askInput(
                    {
                        title: 'Quantité :',
                        defaultValue: inventoryItem.amount.toString(),
                        maxCharacters: 5,
                    },
                    inventoryItem instanceof Object
                        ? NumberValidatorFactory(1, inventoryItem.amount)
                        : PositiveNumberValidator
                );

                if (amount === null) {
                    return;
                }

                ped.dropItemCallback(inventoryId, inventoryItem, amount);

                return;
            }
        }

        // Case where there is a drag and drop provider for the entity
        if (await this.inventoryDragAndDropProvider.dragAndDrop(entity, position, inventoryItem)) {
            return;
        }

        this.notifier.error('Aucune intéraction possible.');
    }

    private async giveItemToPlayer(
        playerId: number,
        inventoryId: string,
        inventoryItem: InventoryItem,
        item: Item | null
    ) {
        const state = this.playerService.getState();
        const amount =
            !item?.unique && inventoryItem.amount > 1
                ? await this.inputService.askInput(
                      {
                          title: 'Quantité :',
                          defaultValue: inventoryItem.amount.toString(),
                          maxCharacters: 5,
                      },
                      inventoryItem instanceof Object
                          ? NumberValidatorFactory(1, inventoryItem.amount)
                          : PositiveNumberValidator
                  )
                : 1;

        if (amount === null) {
            return;
        }

        if (state.isInHub) {
            this.notifier.error("Pas d'échange dans le Hub.");
        }

        TriggerServerEvent(ServerEvent.INVENTORY_GIVE_ITEM, playerId, inventoryId, inventoryItem.slot, amount);

        return;
    }

    @OnNuiEvent(NuiEvent.InventoryActionRename)
    public async onInventoryActionRename({
        inventoryId,
        inventoryItem,
        item,
    }: {
        inventoryItem: InventoryItem;
        inventoryId: string;
        item: Item | null;
    }) {
        const label = await this.inputService.askInput({
            title: 'Étiquette',
            maxCharacters: 40,
            defaultValue: inventoryItem.metadata.label || item?.label,
        });

        TriggerServerEvent(ServerEvent.INVENTORY_RENAME_ITEM, inventoryId, inventoryItem.slot, label);
    }

    @OnNuiEvent(NuiEvent.InventoryActionGiveMoney)
    public async onInventoryActionGiveMoney({ mode, money }: { mode: ScreenSelectMode; money: BankMoneyType }) {
        const player = this.playerService.getState();

        if (player.isInHub) {
            this.notifier.error("Pas d'échange dans le Hub.");
        }

        const [targetId, , distance] = await this.getPlayerFromMode(mode);
        const selfPlayerId = GetPlayerServerId(PlayerId());

        if (targetId && targetId !== selfPlayerId && distance < DEFAULT_MAX_INVENTORY_DISTANCE) {
            const amount = await this.inputService.askInput<number>(
                {
                    title: 'Montant :',
                    defaultValue: '',
                    maxCharacters: 10,
                },
                ((input: string) => {
                    const inputNumber = Number(input);

                    if (isNaN(inputNumber) || inputNumber <= 0) {
                        return Err('Veuillez entrer un nombre positif');
                    }

                    if (Math.round(inputNumber) !== inputNumber) {
                        return Err('Veuillez entrer un nombre entier');
                    }

                    return Ok(inputNumber);
                }) as ValidateInput<number>
            );

            if (amount === null) {
                return;
            }

            if (amount <= 0) {
                return;
            }

            TriggerServerEvent(ServerEvent.INVENTORY_GIVE_MONEY, targetId, amount, money);

            return;
        }

        this.notifier.error("Personne n'est à portée de vous.");
    }

    @OnNuiEvent(NuiEvent.InventoryActionForceConsume)
    public async onInventoryForceConsume({
        inventoryId,
        inventoryItem,
    }: {
        inventoryItem: InventoryItem;
        inventoryId: string;
    }) {
        TriggerServerEvent(ServerEvent.INVENTORY_FORCE_CONSUME, inventoryId, inventoryItem);
    }

    @OnNuiEvent(NuiEvent.InventoryShopValidate)
    public async onInventoryShopValidate({
        items,
        tax,
        rpcServerEvent,
        moneyType,
        shopId,
    }: {
        items: CartElement[];
        tax?: TaxType;
        rpcServerEvent: RpcServerEvent;
        moneyType: 'money' | 'marked_money';
        shopId: string;
    }) {
        const isOk = await emitRpc<boolean>(rpcServerEvent, items, moneyType, tax, shopId);

        if (isOk) {
            this.nuiDispatch.dispatch('inventory', 'CloseShop');
        }
    }

    @OnNuiEvent(NuiEvent.InventoryActionOpen)
    public async onInventoryActionOpen({
        inventoryId,
        inventoryItem,
    }: {
        inventoryItem: InventoryItem;
        inventoryId: string;
    }) {
        TriggerServerEvent(ServerEvent.INVENTORY_OPEN_SUB_INVENTORY, inventoryId, inventoryItem.slot);
    }

    public async getPlayerFromMode(mode: ScreenSelectMode): Promise<[number, Vector3, number]> {
        if (mode === 'screen' || mode === 'screen_fallback_closest') {
            const [entity, position] = await this.screenService.getEntityOnMousePosition();

            if (entity !== null && entity > 0) {
                const entityPlayerId = IsPedAPlayer(entity)
                    ? GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    : null;
                const currentPos = GetEntityCoords(PlayerPedId()) as Vector3;

                if (entityPlayerId !== null) {
                    return [entityPlayerId, position, getDistance(position, currentPos)];
                }
            }

            if (mode === 'screen') {
                return [null, null, null];
            }
        }

        const [entity, distance] = this.playerService.getClosestPlayer();
        const playerId = GetPlayerServerId(entity);
        const position = GetEntityCoords(entity) as Vector3;

        return [playerId, position, distance];
    }
}
