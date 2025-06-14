import { AnimalProvider } from '@public/client/animal/animal.provider';
import { AnimationService } from '@public/client/animation/animation.service';
import { CameraService } from '@public/client/camera';
import { InputService } from '@public/client/nui/input.service';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import {
    PetDrawable,
    petInShop,
    petShopCameraOffset,
    petShopCameraTargetOffset,
    petShopSpawnPosition,
    PetVariation,
} from '@public/shared/animal';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3 } from '@public/shared/polyzone/vector';

@Provider()
export class AnimalShopProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(CameraService)
    private cameraService: CameraService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(AnimalProvider)
    private animalProvider: AnimalProvider;

    private lastPetShow: number;

    public async openShop() {
        await this.setupShop();

        this.nuiMenu.openMenu(MenuType.PetShop);
    }

    private async setupShop() {
        const ped = PlayerPedId();
        FreezeEntityPosition(ped, true);

        // Setup cam
        const [x, y, z] = petShopSpawnPosition;
        const [xOff, yOff, zOff] = petShopCameraOffset;
        this.cameraService.setupCamera(
            [x + xOff + 2, y + yOff, z + zOff] as Vector3,
            [x, y, z + petShopCameraTargetOffset] as Vector3
        );

        const animDict = 'anim@heists@heist_corona@team_idles@male_c';
        this.resourceLoader.loadAnimationDictionary(animDict);
        ClearPedTasksImmediately(ped);
        TaskPlayAnim(ped, animDict, 'idle', 1.0, 1.0, -1, 1, 1, false, false, false);
    }

    @OnEvent(ClientEvent.PET_SHOP_ABANDON_ANIMAL)
    public async onAbandonAnimal(): Promise<void> {
        const confirm = await this.inputService.askConfirm(
            'Êtes vous sur de vouloir abandon votre animal de compagnie ? Entrez OUI pour confirmer'
        );

        if (!confirm) {
            return;
        }
        TriggerServerEvent(ServerEvent.PET_SHOP_ABANDON_ANIMAL);
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType }) {
        if (menuType !== MenuType.PetShop) {
            return;
        }

        if (this.lastPetShow) {
            this.deleteCurrentPetShow();
        }
        this.cameraService.deleteAllCameras();
        await this.animationService.clearShopAnimations(PlayerPedId());
        FreezeEntityPosition(PlayerPedId(), false);
    }

    @OnNuiEvent<{ pet: petInShop }>(NuiEvent.PetShopShowAnimal)
    public async showAnimal({ pet }): Promise<void> {
        if (!pet) return;
        if (this.lastPetShow) {
            if (GetEntityModel(this.lastPetShow) === GetHashKey(pet.model)) return;
            this.deleteCurrentPetShow();
        }

        if (!(await this.resourceLoader.loadModel(pet.model))) {
            return;
        }

        if (this.lastPetShow) {
            this.resourceLoader.unloadModel(pet.model);

            return;
        }

        const [x, y, z] = petShopSpawnPosition;
        const pedSpawned = CreatePed(0, pet.model, x, y, z, 180, false, false);
        FreezeEntityPosition(pedSpawned, true);
        SetEntityInvincible(pedSpawned, true);
        SetBlockingOfNonTemporaryEvents(pedSpawned, true);

        this.lastPetShow = pedSpawned;
        for (const type of Object.keys(PetVariation[pet.model])) {
            const petDrawables: PetDrawable[] = Object.values(PetVariation[pet.model][type]);
            await this.onChangeTexture(petDrawables[0]);
        }
        this.resourceLoader.unloadModel(pedSpawned);
    }

    @OnNuiEvent<{ component: number; drawable: number; texture: number }>(NuiEvent.PetShopChangeTexture)
    public async onChangeTexture({ component, drawable, texture }): Promise<void> {
        SetPedComponentVariation(this.lastPetShow, component, drawable, texture, 0);
    }

    @OnNuiEvent<{ pet: petInShop }>(NuiEvent.PetShopBuyAnimal)
    public async onBuyAnimal({ pet }): Promise<void> {
        const petDrawables: PetDrawable[] = [];
        for (const type of Object.keys(PetVariation[pet.model])) {
            const allPetDrawables: PetDrawable[] = Object.values(PetVariation[pet.model][type]);
            const componentId = allPetDrawables[0].component;

            petDrawables.push({
                component: componentId,
                drawable: GetPedDrawableVariation(this.lastPetShow, componentId),
                texture: GetPedTextureVariation(this.lastPetShow, componentId),
            });
        }
        TriggerServerEvent(ServerEvent.PET_SHOP_BUY_ANIMAL, pet, petDrawables);
        this.nuiMenu.closeMenu();
    }

    private deleteCurrentPetShow() {
        SetEntityAsMissionEntity(this.lastPetShow, true, true);
        DeletePed(this.lastPetShow);

        this.lastPetShow = null;
    }
}
