import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitQBRpc } from '../../core/rpc';
import { PlayerCloakroomItem } from '../../shared/cloth';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { Err, Ok } from '../../shared/result';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { PlayerWardrobe } from '../player/player.wardrobe';

@Provider()
export class HousingMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @OnNuiEvent(NuiEvent.HousingAddRoommate)
    public async addRoommate({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const [playerId, distance] = this.playerService.getClosestPlayer();

        if (!playerId || distance > 2.0) {
            this.notifier.error("Personne n'est à portée de vous.");

            return;
        }

        TriggerServerEvent(ServerEvent.HOUSING_ADD_ROOMMATE, propertyId, apartmentId, playerId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingBell)
    public async bell({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.HOUSING_BELL_APARTMENT, propertyId, apartmentId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingBuy)
    public async buy({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.HOUSING_BUY_APARTMENT, propertyId, apartmentId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingEnter)
    public async enter({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.HOUSING_ENTER_APARTMENT, propertyId, apartmentId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingRemoveRoommate)
    public async removeRoommate({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.HOUSING_REMOVE_ROOMMATE, propertyId, apartmentId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingSell)
    public async sell({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        const confirm = await this.inputService.askConfirm('Voulez-vous vraiment vendre cet appartement ?');

        if (confirm) {
            TriggerServerEvent(ServerEvent.HOUSING_SELL_APARTMENT, propertyId, apartmentId);
        }

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingVisit)
    public async visit({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.HOUSING_VISIT_APARTMENT, propertyId, apartmentId);
    }

    @OnNuiEvent(NuiEvent.HousingCloakroomSave)
    public async saveCloakroom() {
        const name = await this.inputService.askInput(
            {
                title: 'Renommer la tenue',
                defaultValue: '',
                maxCharacters: 64,
            },
            value => {
                if (value.length < 1) {
                    return Err('Le nom de la tenue ne peut pas être vide.');
                }

                return Ok(true);
            }
        );

        if (name) {
            const saved = await emitQBRpc<string | null>('soz-character:server:SavePlayerClothe', name);

            if (saved === null) {
                this.notifier.notify(`La tenue ${name} a été enregistrée.`);
            } else {
                this.notifier.error(saved);
            }
        }

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingCloakroomApply)
    public async applyCloakroom({ item }: { item: PlayerCloakroomItem }) {
        const { completed } = await this.playerWardrobe.waitProgress(true);

        if (completed) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_CLOTHES, item.cloth);
        }

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingCloakroomRename)
    public async renameCloakroom({ item }: { item: PlayerCloakroomItem }) {
        const newName = await this.inputService.askInput(
            {
                title: 'Renommer la tenue',
                defaultValue: item.name,
                maxCharacters: 64,
            },
            value => {
                if (value.length < 1) {
                    return Err('Le nom de la tenue ne peut pas être vide.');
                }

                return Ok(true);
            }
        );

        if (newName) {
            const renamed = await emitQBRpc<boolean>('soz-character:server:RenamePlayerClothe', item.id, newName);

            if (renamed) {
                this.notifier.notify(`La tenue ${name} a été renommé.`);
            }
        }

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingCloakroomDelete)
    public async deleteCloakroom({ item }: { item: PlayerCloakroomItem }) {
        const deleted = await emitQBRpc<boolean>('soz-character:server:DeletePlayerClothe', item.id);

        if (deleted) {
            this.notifier.notify(`La tenue ${item.name} a été supprimée.`);
        }

        this.nuiMenu.closeMenu();
    }
}
