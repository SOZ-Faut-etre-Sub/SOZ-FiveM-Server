import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent } from '../../../shared/event/client';
import { NuiEvent } from '../../../shared/event/nui';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';

@Provider()
export class OilMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private showOilFields = false;
    private showRefinery = false;
    private showReseller = false;

    @Once(OnceStep.PlayerLoaded)
    public setupOilBlips() {
        this.blipFactory.create(
            'oil_field_1',
            {
                name: 'Point de récolte',
                position: [585.93, 2901.68, 39.72],
                sprite: 436,
                scale: 0.9,
            },
            this.showOilFields
        );

        this.blipFactory.create(
            'oil_field_2',
            {
                name: 'Point de récolte',
                position: [1435.49, -2284.8, 71.37],
                sprite: 436,
                scale: 0.9,
            },
            this.showOilFields
        );

        this.blipFactory.create(
            'oil_refinery',
            {
                name: 'Point de raffinage',
                position: [2793.73, 1524.45, 24.52],
                sprite: 436,
                scale: 0.9,
            },
            this.showRefinery
        );

        this.blipFactory.create(
            'oil_reseller',
            {
                name: 'Point de vente',
                position: [263.41, -2979.47, 4.93],
                sprite: 436,
                scale: 0.9,
            },
            this.showReseller
        );
    }

    @OnEvent(ClientEvent.JOBS_OIL_OPEN_SOCIETY_MENU)
    public onOpenOilSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.JobOil) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.JobOil, {
            showOilFields: this.showOilFields,
            showRefinery: this.showRefinery,
            showReseller: this.showReseller,
        });
    }

    @OnNuiEvent(NuiEvent.OilShowOilFields)
    public async setShowOilFields({ value }: { value: boolean }) {
        this.showOilFields = value;
        this.blipFactory.hide('oil_field_1', !this.showOilFields);
        this.blipFactory.hide('oil_field_2', !this.showOilFields);
    }

    @OnNuiEvent(NuiEvent.OilShowRefinery)
    public async setShowRefinery({ value }: { value: boolean }) {
        this.showRefinery = value;
        this.blipFactory.hide('oil_refinery', !this.showRefinery);
    }

    @OnNuiEvent(NuiEvent.OilShowReseller)
    public async setShowReseller({ value }: { value: boolean }) {
        this.showReseller = value;
        this.blipFactory.hide('oil_reseller', !this.showReseller);
    }
}
