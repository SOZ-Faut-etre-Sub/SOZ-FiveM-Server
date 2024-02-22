import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Component, FfsComponent, Outfit, OutfitItem, Prop } from '../../../shared/cloth';
import { ClientEvent, NuiEvent, ServerEvent } from '../../../shared/event';
import { JobPermission } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { Vector3, Vector4 } from '../../../shared/polyzone/vector';
import { Err, Ok } from '../../../shared/result';
import { ffsClothConfig } from '../../../shared/FightForStyleShowRoom/ffsClothConfig';
import { CameraService } from '../../camera';
import { ClothingService } from '../../clothing/clothing.service';
import { PedFactory } from '../../factory/ped.factory';
import { JobService } from '../job.service';
import { InputService } from '../../nui/input.service';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { PlayerWardrobe } from '../../player/player.wardrobe';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class FightForStylShowRoomProvider {
    private readonly PED_POSITION: Vector4 = [-168.71, -298.66, 38.73, 219.85];

    private readonly CAMERA_TARGET: Vector3 = [-168.39, -298.7, 39.83];

    private readonly CAMERA_POSITION: Vector3 = [-166.93, -300.1, 40.13];

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(CameraService)
    private cameraService: CameraService;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @Inject(JobService)
    private jobService: JobService;

    private readonly defaultComponentAndProd = {
        mp_m_freemode_01: {
            Components: {
                3: { Drawable: 0, Texture: 0, Palette: 0 },
                8: { Drawable: 57, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        mp_f_freemode_01: {
            Components: {
                3: { Drawable: 0, Texture: 0, Palette: 0 },
                8: { Drawable: 2, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
    };

    private pedId = null;

    public async onShowRoomOpenMenu(outfitType: string, pedModel: string) {
        const player = this.playerService.getPlayer();
        const canCraft =
            this.playerService.isOnDuty() &&
            
            this.jobService.hasPermission(player.job.id, JobPermission.FfsCraftShowRoom);
        this.nuiMenu.openMenu(MenuType.FightForStyleShowRoomMenu, {
            state: {
                clothConfig: this.clothingService.getFfsClothSet(this.pedId),
                options: this.clothingService.getFfsOptions(pedModel),
            },
            canCraft: canCraft,
            defaultComponentAndProd: this.defaultComponentAndProd[pedModel],
            pedModel: pedModel,
            outfitType: outfitType,
        });
        FreezeEntityPosition(PlayerPedId(), true);
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async deletePNJ({ menuType }) {
        if (menuType !== MenuType.FightForStyleShowRoomMenu) {
            return;
        }

        DeletePed(this.pedId);
        this.pedId = null;
        FreezeEntityPosition(PlayerPedId(), false);
        this.cameraService.deleteCamera();
    }

    @OnNuiEvent(NuiEvent.FfsShowRoomChangeComponent)
    public async onSkinChangeComponent({
        componentIndex,
        component,
    }: {
        componentIndex: Component;
        component: OutfitItem;
    }) {
        this.clothingService.applyComponentToPed(this.pedId, componentIndex, component);
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.FfsShowRoomChangeProp)
    public async onSkinChangeProp({ propIndex, prop }: { propIndex: Prop; prop: OutfitItem }) {
        this.clothingService.applyPropToPed(this.pedId, propIndex, prop);
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.FfsMenuCraftOutfit)
    public async onCraftOutfit({
        currentCraft,
        shouldCraft,
        description,
        outfitType,
        pedModel,
    }: {
        currentCraft: Partial<Outfit>;
        shouldCraft: { Components: Partial<Record<FfsComponent, boolean>>; Props: Partial<Record<Prop, boolean>> };
        description: string;
        outfitType: string;
        pedModel: string;
    }) {
        const outfit = {
            ...currentCraft,
            label: description
        };
        Object.keys(outfit.Components).map(componentIndex => {
            if (!shouldCraft.Components?.[componentIndex]) delete outfit.Components[componentIndex];
        });
        Object.keys(outfit.Props).map(propIndex => {
            if (!shouldCraft.Props?.[propIndex]) delete outfit.Props[propIndex];
        });
        TriggerServerEvent(ServerEvent.FFS_SHOW_ROOM_CRAFTING, outfit, outfitType, pedModel);
    }

    @OnEvent(ClientEvent.PLAYER_SET_OUTFIT_FROM_ITEM)
    public async asyncchangeOutfit(outfit: object) {
        await this.playerWardrobe.waitProgress(false);
        TriggerServerEvent('soz-character:server:SetPlayerClothes', outfit);
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        const model = 's_f_y_clubbar_01';
        this.targetFactory.createForPed({
            model: model,
            coords: { x: -167.31, y: -301.77, z: 38.73, w: 346.78 },
            invincible: true,
            freeze: true,
            spawnNow: true,
            blockevents: true,
            animDict: 'anim@amb@casino@valet_scenario@pose_d@',
            anim: 'base_a_m_y_vinewood_01',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'Accéder au Show Room Homme',
                        icon: 'fas fa-shopping-cart',
                        color: 'ffs',
                        job: 'ffs',
                        action: async () => {
                            console.log(this.pedId);
                            if (this.pedId) return;
                            const pedModel = 'mp_m_freemode_01';
                            this.pedId = await this.pedFactory.createPed({
                                model: pedModel,
                                modelCustomization: { SkinMix: 0.5, ShapeMix: 0.15, Father: 20, Mother: 32 },
                                components: {
                                    3: [0, 0, 0],
                                    6: [0, 10, 0],
                                    8: [57, 0, 0],
                                    11: [0, 0, 0],
                                },
                                face: {
                                    CheeksBoneHigh: 0.0,
                                    NosePeakLength: 0.1,
                                    ChimpBoneWidth: -0.3,
                                    NoseWidth: -0.9,
                                    ChimpBoneLength: -0.1,
                                    ChimpHole: 0.0,
                                    JawBoneWidth: 0.0,
                                    Ageing: -1,
                                    EyebrowHigh: 0.0,
                                    NeckThickness: 0.0,
                                    NoseBoneHigh: 0.0,
                                    LipsThickness: 0.0,
                                    Moles: 3,
                                    ChimpBoneLower: -0.3,
                                    EyeColor: 11,
                                    NosePeakLower: 0.0,
                                    JawBoneBackLength: 0.0,
                                    CheeksWidth: 0.0,
                                    Complexion: -1,
                                    NoseBoneTwist: 0.0,
                                    CheeksBoneWidth: 0.0,
                                    Blemish: -1,
                                    EyebrowForward: 0.0,
                                    AddBodyBlemish: -1,
                                    EyesOpening: 0.2,
                                    BodyBlemish: -1,
                                    NosePeakHeight: 0.0,
                                },
                                hair: {
                                    BeardType: -1,
                                    HairColor: 31,
                                    EyebrowColor: 60,
                                    BeardColor: 0,
                                    BeardOpacity: 1.0,
                                    HairSecondaryColor: 33,
                                    ChestHairOpacity: 1.0,
                                    ChestHairColor: 0,
                                    ChestHairType: -1,
                                    EyebrowOpacity: 1.0,
                                    EyebrowType: 0,
                                    HairType: 33,
                                },
                                coords: {
                                    x: this.PED_POSITION[0],
                                    y: this.PED_POSITION[1],
                                    z: this.PED_POSITION[2],
                                    w: this.PED_POSITION[3],
                                },
                                invincible: true,
                                freeze: true,
                                blockevents: true,
                            });
                            this.cameraService.setupCamera(this.CAMERA_POSITION, this.CAMERA_TARGET);
                            await this.onShowRoomOpenMenu('ffs_crafted_outfit_m', pedModel);
                        },
                    },
                    {
                        label: 'Accéder au Show Room Femme',
                        icon: 'fas fa-shopping-cart',
                        color: 'ffs',
                        job: 'ffs',
                        action: async () => {
                            if (this.pedId) return;
                            const pedModel = 'mp_f_freemode_01';
                            this.pedId = await this.pedFactory.createPed({
                                model: pedModel,
                                modelCustomization: { SkinMix: 0.5, ShapeMix: 0.15, Father: 25, Mother: 26 },
                                components: {
                                    3: [0, 0, 0],
                                    6: [0, 0, 0],
                                    8: [2, 0, 0],
                                    11: [0, 0, 0],
                                },
                                face: {
                                    CheeksBoneHigh: 0.0,
                                    NosePeakLength: 0.1,
                                    ChimpBoneWidth: -0.3,
                                    NoseWidth: -0.9,
                                    ChimpBoneLength: -0.1,
                                    ChimpHole: 0.0,
                                    JawBoneWidth: 0.0,
                                    Ageing: -1,
                                    EyebrowHigh: 0.0,
                                    NeckThickness: 0.0,
                                    NoseBoneHigh: 0.0,
                                    LipsThickness: 0.0,
                                    Moles: 3,
                                    ChimpBoneLower: -0.3,
                                    EyeColor: 11,
                                    NosePeakLower: 0.0,
                                    JawBoneBackLength: 0.0,
                                    CheeksWidth: 0.0,
                                    Complexion: -1,
                                    NoseBoneTwist: 0.0,
                                    CheeksBoneWidth: 0.0,
                                    Blemish: -1,
                                    EyebrowForward: 0.0,
                                    AddBodyBlemish: -1,
                                    EyesOpening: 0.2,
                                    BodyBlemish: -1,
                                    NosePeakHeight: 0.0,
                                },
                                hair: {
                                    BeardType: -1,
                                    HairColor: 31,
                                    EyebrowColor: 60,
                                    BeardColor: 0,
                                    BeardOpacity: 1.0,
                                    HairSecondaryColor: 33,
                                    ChestHairOpacity: 1.0,
                                    ChestHairColor: 0,
                                    ChestHairType: -1,
                                    EyebrowOpacity: 1.0,
                                    EyebrowType: 0,
                                    HairType: 10,
                                },
                                coords: {
                                    x: this.PED_POSITION[0],
                                    y: this.PED_POSITION[1],
                                    z: this.PED_POSITION[2],
                                    w: this.PED_POSITION[3],
                                },
                                invincible: true,
                                freeze: true,
                                blockevents: true,
                            });
                            this.cameraService.setupCamera(this.CAMERA_POSITION, this.CAMERA_TARGET);
                            await this.onShowRoomOpenMenu('ffs_crafted_outfit_f', pedModel);
                        },
                    },
                ],
                distance: 1,
            },
        });
    }

    @OnNuiEvent(NuiEvent.FfsMenuLookAtDrawable)
    public async onSkinLookAtComponentDrawable({
        index,
        isComponent,
        pedModel,
    }: {
        index: FfsComponent | Prop;
        isComponent: boolean;
        pedModel: string;
    }) {
        const formattedIndex = Number(index);

        const maxDrawable = isComponent
            ? GetNumberOfPedDrawableVariations(this.pedId, formattedIndex)
            : GetNumberOfPedPropDrawableVariations(this.pedId, formattedIndex);
        const value = await this.inputService.askInput(
            {
                title: `Drawable id [0-${maxDrawable}] :`,
                defaultValue: '',
                maxCharacters: 5,
            },
            value => {
                if (!value) {
                    return Ok(true);
                }
                if (isNaN(Number(value))) {
                    return Err('Le drawable id doit être un nombre.');
                }
                if (Number(value) < 0 || Number(value) > maxDrawable) {
                    return Err(`Le numéro de vêtement doit être compris entre 0 et ${maxDrawable - 1}.`);
                }
                const type = isComponent ? 'Components' : 'Props';
                if (!ffsClothConfig[pedModel][type][formattedIndex][value]) {
                    return Err(`Le vêtement ${value} n'est pas disponible au Show Room.`);
                }
                return Ok(true);
            }
        );

        if (value !== null) {
            this.nuiDispatch.dispatch('ffs_skin_submenu', 'SetComponentDrawable', {
                index: index,
                drawable: Number(value),
                isComponent,
            });
        }

        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.FfsMenuChangeDescription)
    public async onChangeDescrptionText() {
        const value = await this.inputService.askInput({
            title: `Description de la tenue:`,
            defaultValue: '',
            maxCharacters: 64,
        });

        this.nuiDispatch.dispatch('ffs_skin_submenu', 'SetClotheDescription', {
            description: value || '',
        });

        return Ok(true);
    }
}