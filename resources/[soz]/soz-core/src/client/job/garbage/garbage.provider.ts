import { OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { ObjectProvider } from '../../object/object.provider';
import { PlayerService } from '../../player/player.service';

@Provider()
export class GarbageProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private displayBinBlip = false;

    @OnNuiEvent(NuiEvent.GarbageDisplayBlip)
    public async onDisplayBlip({ value }: { value: boolean }) {
        this.displayBinBlip = value;

        const binModels = [
            GetHashKey('soz_prop_bb_bin'),
            GetHashKey('soz_prop_bb_bin_hs2'),
            GetHashKey('soz_prop_bb_bin_hs3'),
        ];

        const colorModels: Record<any, number> = {
            [GetHashKey('soz_prop_bb_bin')]: 68,
            [GetHashKey('soz_prop_bb_bin_hs2')]: 70,
            [GetHashKey('soz_prop_bb_bin_hs3')]: 49,
        };

        const bins = this.objectProvider.getObjects(object => binModels.includes(object.model));
        for (const bin of bins) {
            if (value) {
                this.blipFactory.create(bin.id, {
                    name: 'Point de collecte',
                    coords: {
                        x: bin.position[0],
                        y: bin.position[1],
                        z: bin.position[2],
                    },
                    sprite: 365,
                    color: colorModels[bin.model],
                });
            } else {
                this.blipFactory.remove(bin.id);
            }
        }
    }

    @OnEvent(ClientEvent.JOBS_GARBAGE_OPEN_SOCIETY_MENU)
    public onOpenGarbageSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.GarbageJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.GarbageJobMenu, {
            displayBinBlip: this.displayBinBlip,
            onDuty: this.playerService.isOnDuty(),
        });
    }
}
