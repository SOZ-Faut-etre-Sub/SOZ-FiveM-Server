import { AnimalProvider } from '@public/client/animal/animal.provider';
import { AnimationService } from '@public/client/animation/animation.service';
import { CameraService } from '@public/client/camera';
import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { NoZoneShopBrand, NoZonesShopConfig } from '@public/config/shops';
import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import {
    JobFixPetVariation,
    KennelJobPet,
    PetDrawable,
    petInShop,
    petShopCameraOffset,
    petShopCameraTargetOffset,
    petShopContent,
    petShopSpawnPosition,
    PetVariation,
} from '@public/shared/animal';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3 } from '@public/shared/polyzone/vector';
import { Err, Ok } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

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

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private lastPetShow: number;

    public async openShop() {
        await this.setupShop();

        this.nuiMenu.openMenu(MenuType.PetShop, {
            job: null,
            pets: Object.values(petShopContent)
                .filter(petShop => !petShop?.jobs?.length)
                .sort((a, b) => b.price - a.price),
        });
    }

    public async openJobShop() {
        await this.setupShop();
        const player = this.playerService.getPlayer();

        this.nuiMenu.openMenu(MenuType.PetShop, {
            job: player.job.id,
            pets: Object.values(petShopContent)
                .filter(petShop => petShop.jobs && petShop.jobs.includes(player.job.id))
                .sort((a, b) => b.price - a.price),
        });
    }

    public async openKennelMenu() {
        const pets = await emitRpc<Array<KennelJobPet>>(RpcServerEvent.PET_LIST_JOB_ANIMALS);
        this.nuiMenu.openMenu(
            MenuType.PetJobKennel,
            { pets },
            {
                position: {
                    position: [
                        NoZonesShopConfig[NoZoneShopBrand.Pet].ped.coords.x,
                        NoZonesShopConfig[NoZoneShopBrand.Pet].ped.coords.y,
                        NoZonesShopConfig[NoZoneShopBrand.Pet].ped.coords.z,
                    ],
                    distance: 5.0,
                },
            }
        );
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

    @OnEvent(ClientEvent.PET_SHOP_NAME_ANIMAL)
    public async onNameAnimal(): Promise<void> {
        const pet = this.animalProvider.getCurrentPet();
        if (!pet) {
            this.notifier.notify(
                "~b~Montre moi~s~ l'animal que tu veux nommer ! Je ne vais pas deviner tout seul.",
                'info'
            );
            return;
        } else if (!this.animalProvider.isNamed(pet)) {
            this.notifier.notify(
                "Tu veux ~b~nommer~s~ ton animal ? Je suis sur qu'il en sera ~g~très content~s~.",
                'info'
            );
        } else {
            this.notifier.notify(
                "Tu veux ~b~re-nommer~s~ ton animal ? Il risque de prendre ~y~un peu de temps~s~ avant de s'habituer à son nouveau nom.",
                'info'
            );
        }

        const input = await this.inputService.askInput(
            {
                title: `Nom de l'animal`,
                maxCharacters: 32,
            },
            name => {
                if (!name || (name.length >= 2 && name.length <= 32)) {
                    return Ok(name);
                }
                return Err(`Le nom n'est pas valide.`);
            }
        );
        if (!input) return;

        TriggerServerEvent(ServerEvent.PET_NAME_ANIMAL, input, pet.isPetJob);
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

    @OnNuiEvent<{ pet: petInShop; job: JobType }>(NuiEvent.PetShopShowAnimal)
    public async showAnimal({ pet, job }): Promise<void> {
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
        if (job && JobFixPetVariation?.[job]?.[pet.model]) {
            for (const petDrawable of JobFixPetVariation[job][pet.model]) {
                await this.onChangeTexture(petDrawable);
            }
        }
        this.resourceLoader.unloadModel(pedSpawned);
    }

    @OnNuiEvent<{ component: number; drawable: number; texture: number }>(NuiEvent.PetShopChangeTexture)
    public async onChangeTexture({ component, drawable, texture }): Promise<void> {
        SetPedComponentVariation(this.lastPetShow, component, drawable, texture, 0);
    }

    @OnNuiEvent<{ pet: petInShop; job: JobType }>(NuiEvent.PetShopBuyAnimal)
    public async onBuyAnimal({ pet, job }): Promise<void> {
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
        TriggerServerEvent(ServerEvent.PET_SHOP_BUY_ANIMAL, pet, petDrawables, job);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent<{ pet: KennelJobPet; action: string }>(NuiEvent.PetKennelAction)
    public async onPetKennelAction({ pet, action }): Promise<void> {
        if (action === 'take') {
            TriggerServerEvent(ServerEvent.PET_KENNEL_TAKE, pet.id);
        } else if (action === 'remove') {
            TriggerServerEvent(ServerEvent.PET_KENNEL_REMOVE, pet.id);
        } else if (action === 'abandon') {
            const confirm = await this.inputService.askConfirm(
                `Êtes vous sur de vouloir abandon ${pet.name ? pet.name : `cet animal`} ? Entrez OUI pour confirmer`
            );

            if (!confirm) {
                return;
            }
            TriggerServerEvent(ServerEvent.PET_KENNEL_ABANDON, pet.id);
        } else if (action === 'recall') {
            TriggerServerEvent(ServerEvent.PET_KENNEL_RECALL, pet.id);
        }
        this.nuiMenu.closeMenu();
    }

    private deleteCurrentPetShow() {
        SetEntityAsMissionEntity(this.lastPetShow, true, true);
        DeletePed(this.lastPetShow);

        this.lastPetShow = null;
    }
}
