import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { BlipType } from '../../../shared/blip';
import { ClientEvent } from '../../../shared/event/client';
import { NuiEvent } from '../../../shared/event/nui';
import { MenuType } from '../../../shared/nui/menu';
import { Vector3 } from '../../../shared/polyzone/vector';
import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';

const PAWL_FIELDS = [
    {
        position: [-573.26, 6242.43, 10.11],
        radius: 70.0,
    },
    {
        position: [-1525.97, 4721.1, 553.18],
        radius: 200.0,
    },
    {
        position: [-866.77, 1928.964, 150.5528],
        radius: 200.0,
    },
    {
        position: [545.7898, 4193.535, 42.58311],
        radius: 150.0,
    },
    {
        position: [-938.01, 2574.81, 77.93],
        radius: 150.0,
    },
    {
        position: [1713.7, 5150.39, 126.54],
        radius: 150.0,
    },
    {
        position: [509.6548, 2234.974, 64.58481],
        radius: 150.0,
    },
];

@Provider()
export class PawlMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private showFields = false;
    private showResell = false;

    @Once(OnceStep.PlayerLoaded)
    public setupPawlBlips() {
        for (let i = 0; i < PAWL_FIELDS.length; i++) {
            const field = PAWL_FIELDS[i];

            this.blipFactory.create(`pawl_field_${i}`, {
                name: 'Forêt',
                type: BlipType.Radius,
                radius: field.radius,
                position: field.position as Vector3,
                color: 0,
                alpha: 128,
                sprite: 9,
                group: 'pawl_field',
            });
        }

        this.blipFactory.create(`pawl_resell`, {
            name: 'Zone de revente',
            position: [955.87, -2176.36, 30.15] as Vector3,
            sprite: 607,
            scale: 0.8,
        });

        this.blipFactory.hideGroup('pawl_field', true);
        this.blipFactory.hide('pawl_resell', true);
    }

    @OnEvent(ClientEvent.PAWL_OPEN_SOCIETY_MENU)
    public onOpenPawlSocietyMeny() {
        if (this.nuiMenu.getOpened() === MenuType.JobPawl) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.JobPawl, {
            showFields: this.showFields,
            showResell: this.showResell,
        });
    }

    @OnNuiEvent(NuiEvent.PawlShowFields)
    public async setShowOilFields({ value }: { value: boolean }) {
        this.showFields = value;
        this.blipFactory.hideGroup('pawl_field', !this.showFields);
    }

    @OnNuiEvent(NuiEvent.PawlShowResell)
    public async setShowRefinery({ value }: { value: boolean }) {
        this.showResell = value;
        this.blipFactory.hide('pawl_resell', !this.showResell);
    }
}
