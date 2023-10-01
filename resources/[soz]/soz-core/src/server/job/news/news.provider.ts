import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { uuidv4 } from '../../../core/utils';
import { ServerEvent } from '../../../shared/event';
import { Vector4 } from '../../../shared/polyzone/vector';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Notifier } from '../../notifier';
import { ObjectProvider } from '../../object/object.provider';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class NewsProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.NEWS_PLACE_OBJECT)
    public async onPlaceObject(source: number, item: string, object: string, position: Vector4) {
        if (!this.inventoryManager.removeItemFromInventory(source, item)) {
            this.notifier.error(source, 'Vous ne possédez pas cet objet.');

            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'spawn_object',
            'Disposition en cours',
            2500,
            {
                dictionary: 'anim@narcotics@trash',
                name: 'drop_front',
                options: {
                    onlyUpperBody: true,
                },
            },
            {
                disableMouse: false,
                disableMovement: true,
                disableCombat: true,
                disableCarMovement: true,
            }
        );

        if (!completed) {
            this.inventoryManager.addItemToInventory(source, item);

            return;
        }

        this.objectProvider.createObject({
            id: uuidv4(),
            model: GetHashKey(object),
            position,
        });
    }
}
