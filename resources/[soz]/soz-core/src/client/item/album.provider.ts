import { MenuType } from '@public/shared/nui/menu';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { BlipFactory } from '../blip';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { AudioService } from '../nui/audio.service';
import { NuiMenu } from '../nui/nui.menu';
import { TargetFactory } from '../target/target.factory';
import { ItemService } from './item.service';

const AlbumTracks: Record<string, string[]> = {
    '900k_album': [
        '01 - Copyright-moi',
        '02 - Anonyme',
        '03 - Imagine',
        '04 - Oui',
        '05 - Katoum',
        '06 - Ralentis',
        '07 - The_Void',
        '08 - Librestyle',
        '09 - C.D.F',
        '10 - Lyrics',
        '11 - Overtime',
        '12 - i say',
        '13 - Decennies',
    ],
};

@Provider()
export class AlbumProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(AudioService)
    private audioService: AudioService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private audioId = null;
    private volume = 5;

    @Once(OnceStep.Start)
    async onStart(): Promise<void> {
        const products = [{ name: '900k_album', price: 500, amount: 200000 }];

        const shopProducts = products.map((product, id) => {
            return {
                ...this.itemService.getItem(product.name),
                ...product,
                slot: id + 1,
            };
        });

        const model = 'csb_thornton';
        this.targetFactory.createForPed({
            model: model,
            coords: { x: -840.71, y: -230.52, z: 36.26, w: 299.97 },
            invincible: true,
            freeze: true,
            spawnNow: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
            target: {
                options: [
                    {
                        label: 'Liste des Albums',
                        icon: 'c:/magasin/album.png',
                        action: () => {
                            this.inventoryManager.openShopInventory(shopProducts, 'menu_shop_music');
                        },
                    },
                ],
                distance: 2.5,
            },
        });

        const id = 'misic_shop';
        if (!this.blipFactory.exist(id)) {
            this.blipFactory.create(id, {
                coords: { x: -840.71, y: -230.52, z: 37.26 },
                sprite: 136,
                name: 'Magasin de musique',
            });
        }
    }

    @OnEvent(ClientEvent.ITEM_ALBUM_USE)
    async onAlbum(albumName: string): Promise<void> {
        const tracks = AlbumTracks[albumName];

        if (!tracks) {
            this.notifier.notify('Pas de musique dans cette album', 'error');
            return;
        }

        const nuitracks: Record<string, string> = {};
        tracks.forEach((track, index) => (nuitracks[track] = albumName + '/' + (index + 1).toString()));

        this.nuiMenu.openMenu(MenuType.Album, {
            tracks: nuitracks,
            volume: this.volume,
        });
    }

    @OnNuiEvent(NuiEvent.AlbumPlay)
    public async albumPlay(trackPath: string) {
        if (this.audioId) {
            this.audioService.stopAudio(this.audioId);
        }

        if (trackPath) {
            this.audioId = this.audioService.playAudio(`audio/album/${trackPath}.mp3`, this.volume / 10);
        }
    }

    @OnNuiEvent(NuiEvent.AlbumVolume)
    public async albumVolume(volume: number) {
        this.volume = volume;
        if (this.audioId) {
            this.audioService.volumeAudio({
                id: this.audioId,
                volume: this.volume / 10,
                path: null,
            });
        }
    }
}
