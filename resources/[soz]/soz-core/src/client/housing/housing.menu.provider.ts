import { ProgressService } from '@public/client/progress.service';

import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitQBRpc } from '../../core/rpc';
import { PlayerCloakroomItem } from '../../shared/cloth';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { NotEmptyStringValidator } from '../../shared/nui/input';
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

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnNuiEvent(NuiEvent.HousingChangePrincipalApartement)
    public async changePrincipalApartement({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        TriggerServerEvent(ServerEvent.HOUSING_CHANGE_PRINCIPAL_APARTMENT, propertyId, apartmentId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingAddTenant)
    public async addTenant({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const [playerId, distance] = this.playerService.getClosestPlayer();

        if (!playerId || playerId < 0 || distance > 2.0) {
            this.notifier.error("Personne n'est à portée de vous.");

            return;
        }

        TriggerServerEvent(ServerEvent.HOUSING_ADD_TENANT, propertyId, apartmentId, GetPlayerServerId(playerId));

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingAddRoommate)
    public async addRoommate({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const [playerId, distance] = this.playerService.getClosestPlayer();

        if (!playerId || playerId < 0 || distance > 2.0) {
            this.notifier.error("Personne n'est à portée de vous.");

            return;
        }

        TriggerServerEvent(ServerEvent.HOUSING_ADD_ROOMMATE, propertyId, apartmentId, GetPlayerServerId(playerId));

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

    @OnNuiEvent(NuiEvent.HousingRemoveTenant)
    public async removeTenant({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.HOUSING_REMOVE_TENANT, propertyId, apartmentId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingRemoveRoommate)
    public async removeRoommate({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.HOUSING_REMOVE_ROOMMATE, propertyId, apartmentId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingSell)
    public async sell({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        const confirm = await this.inputService.askConfirm(
            'Voulez-vous vraiment vendre cette habitation ? Entrez OUI pour confirmer.'
        );

        if (confirm) {
            TriggerServerEvent(ServerEvent.HOUSING_SELL_APARTMENT, propertyId, apartmentId);
        }

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingVisit)
    public async visit({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.HOUSING_VISIT_APARTMENT, propertyId, apartmentId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.HousingCloakroomSave)
    public async saveCloakroom() {
        const name = await this.inputService.askInput(
            {
                title: 'Nommer la tenue',
                maxCharacters: 64,
            },
            NotEmptyStringValidator
        );

        if (name) {
            const savedError = await emitQBRpc<string | null>('soz-character:server:SavePlayerClothe', name);

            if (!savedError) {
                this.notifier.notify(`La tenue ${name} a été enregistrée.`);
            } else {
                this.notifier.error(savedError);
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
            NotEmptyStringValidator
        );

        if (newName) {
            const renamed = await emitQBRpc<boolean>('soz-character:server:RenamePlayerClothe', item.id, newName);

            if (renamed) {
                this.notifier.notify(`La tenue ${newName} a été renommé.`);
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

    @OnNuiEvent(NuiEvent.HousingStore)
    public async storeFournitureInApartment({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        const { completed } = await this.progressService.progress(
            'store_fourntiure',
            'Rangement des meubles...',
            2500,
            {
                dictionary: 'anim@narcotics@trash',
                name: 'drop_front',
                options: {
                    onlyUpperBody: true,
                },
            },
            {
                disableMovement: true,
                useWhileDead: false,
                canCancel: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );
        if (!completed) {
            return;
        }
        TriggerServerEvent(ServerEvent.HOUSING_STORE_FOURNITURE, apartmentId, propertyId);
    }
}
