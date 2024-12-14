import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { uuidv4 } from '@core/utils';
import { AnimationProps } from '@public/shared/animation';
import { Outfit, Prop } from '@public/shared/cloth';
import { ClientEvent } from '@public/shared/event/client';
import { getChunkId } from '@public/shared/grid';
import { InventoryItem } from '@public/shared/inventory';
import { Skin } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';

import { ClothingService } from '../clothing/clothing.service';
import { ResourceLoader } from '../repository/resource.loader';

export type Ped = {
    model: number | string;
    coords: { x: number; y: number; z: number; w: number };

    id?: string;
    components?: { [key: number]: [number, number, number] };
    props?: { [key: number]: [number, number, number] };
    outfit?: Outfit;
    face?: { [key: string]: number };
    hair?: { [key: string]: number | any };
    makeup?: { [key: string]: number };
    modelCustomization?: { [key: string]: number };
    tattoos?: { collection: number; overlay: number }[];
    skin?: Skin;
    freeze?: boolean;
    invincible?: boolean;
    blockevents?: boolean;
    scenario?: string;
    animDict?: string;
    anim?: string;
    flag?: number;
    network?: boolean;
    isScriptHostPed?: boolean;
    isRandomClothes?: boolean;
    animprops?: AnimationProps[];
    weapon?: string;
    alpha?: number;
    dropItemCallback?: (inventoryId: string, inventoryItem: InventoryItem, amount: number) => void | Promise<void>;
};

export type GridPed = Ped & {
    id: string;
};

export enum PedFaceFeature {
    NoseWidth = 0,
    NosePeakHeight = 1,
    NosePeakLength = 2,
    NoseBoneHigh = 3,
    NosePeakLowering = 4,
    NoseBoneTwist = 5,
    EyebrowHigh = 6,
    EyebrowForward = 7,
    CheeksBoneHigh = 8,
    CheeksBoneWidth = 9,
    CheeksWidth = 10,
    EyesOpening = 11,
    LipsThickness = 12,
    JawBoneWidth = 13,
    JawBoneBackLength = 14,
    ChimpBoneLowering = 15,
    ChimpBoneLength = 16,
    ChimpBoneWidth = 17,
    ChimpHole = 18,
    NeckThickness = 19,
}

export enum PedHeadOverlay {
    Blemishes = 0,
    FacialHair = 1,
    Eyebrows = 2,
    Ageing = 3,
    Makeup = 4,
    Blush = 5,
    Complexion = 6,
    SunDamage = 7,
    Lipstick = 8,
    Moles = 9,
    ChestHair = 10,
    BodyBlemishes = 11,
    AddBodyBlemishes = 12,
}

type SpawnedPed = {
    entity: number;
    ped: GridPed;
};

@Provider()
export class PedFactory {
    private pedProps = new Map<number, number[]>();

    private loadedPeds: Record<string, SpawnedPed> = {};

    private pedsByChunk = new Map<number, GridPed[]>();

    private currentChunks: number[] = [];

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    public getPedByEntity(entity: number): GridPed | null {
        for (const ped of Object.values(this.loadedPeds)) {
            if (ped.entity === entity) {
                return ped.ped;
            }
        }

        return null;
    }

    public async createPedOnGrid(ped: Ped): Promise<string> {
        const position = [ped.coords.x, ped.coords.y, ped.coords.z] as Vector3;
        const chunk = getChunkId(position);
        const gridPed = {
            ...ped,
            id: ped.id || uuidv4(),
        };

        if (!this.pedsByChunk.has(chunk)) {
            this.pedsByChunk.set(chunk, []);
        }

        this.pedsByChunk.get(chunk).push(gridPed);

        if (this.currentChunks.includes(chunk)) {
            await this.spawnPed(gridPed);
        }

        return gridPed.id;
    }

    public async deletePedOnGrid(id: string) {
        for (const peds of this.pedsByChunk.values()) {
            const index = peds.findIndex(ped => ped.id == id);
            if (index >= 0) {
                peds.splice(index, 1);
            }
        }

        this.unspawnPed(id);
    }

    public findLoadedPed(id: string) {
        return this.loadedPeds[id];
    }

    public findPed(id: string) {
        for (const peds of this.pedsByChunk.values()) {
            const ped = peds.find(ped => ped.id == id);
            if (ped) {
                return ped;
            }
        }
    }

    public isPedLoaded(id: string) {
        const spawned = this.loadedPeds[id];

        if (!spawned) {
            return false;
        }

        if (!DoesEntityExist(spawned.entity)) {
            return false;
        }

        return true;
    }

    private async spawnPed(ped: GridPed) {
        if (!this.loadedPeds[ped.id]) {
            const entity = await this.createPed(ped);

            this.loadedPeds[ped.id] = {
                entity,
                ped,
            };
        }
    }

    private unspawnPed(id: string): void {
        const spawned = this.loadedPeds[id];

        if (!spawned) {
            return;
        }

        if (!DoesEntityExist(spawned.entity)) {
            return;
        }

        const props = this.pedProps.get(spawned.entity);

        if (props) {
            for (const prop of props) {
                DeleteObject(prop);
            }
        }

        this.pedProps.delete(spawned.entity);

        DeletePed(spawned.entity);
        delete this.loadedPeds[id];
    }

    public unspawnEntity(entity: number): void {
        const props = this.pedProps.get(entity);

        if (props) {
            for (const prop of props) {
                DeleteObject(prop);
            }
        }

        this.pedProps.delete(entity);

        DeletePed(entity);
    }

    public async updateSpawnPedOnGridChange(grid: number[]) {
        const removedChunks = this.currentChunks.filter(chunk => !grid.includes(chunk));
        const addedChunks = grid.filter(chunk => !this.currentChunks.includes(chunk));

        this.currentChunks = grid;

        // Unload objects from removed chunks
        for (const chunk of removedChunks) {
            if (this.pedsByChunk.has(chunk)) {
                for (const ped of this.pedsByChunk.get(chunk)) {
                    this.unspawnPed(ped.id);
                }
            }
        }

        // Load objects from added chunks
        for (const chunk of addedChunks) {
            if (this.pedsByChunk.has(chunk)) {
                for (const ped of this.pedsByChunk.get(chunk)) {
                    await this.spawnPed(ped);
                }
            }
        }
    }

    public async createPed(ped: Ped): Promise<number> {
        const hash = typeof ped.model === 'string' ? GetHashKey(ped.model) : ped.model;

        if (!(await this.resourceLoader.loadModel(hash))) {
            return 0;
        }

        const pedId = CreatePed(
            0,
            hash,
            ped.coords.x,
            ped.coords.y,
            ped.coords.z,
            ped.coords.w,
            ped.network,
            ped.isScriptHostPed || false
        );

        this.resourceLoader.unloadModel(hash);

        await this.configurePed(pedId, ped);

        return pedId;
    }

    public async configurePed(pedId: number, ped: Ped) {
        // if (ped.isRandomClothes) {
        //     SetPedRandomComponentVariation(pedId, 0);
        // } else {
        //     SetPedDefaultComponentVariation(pedId);
        // }
        // @TODO Temporary disabled random variation as it's seems there is too much memory involved when doing that
        // @TODO We should add a grid system to load only the peds around the player (and unload the others)
        SetPedDefaultComponentVariation(pedId);

        if (ped.components) {
            for (const [key, value] of Object.entries(ped.components)) {
                this.clothingService.applyPedComponentWithFix(pedId, Number(key), {
                    Drawable: value[0],
                    Texture: value[1],
                    Palette: value[2],
                });
            }
        }

        if (ped.props) {
            for (const [key, value] of Object.entries(ped.props)) {
                this.clothingService.applyPedProp(pedId, key as Prop, {
                    Drawable: value[0],
                    Texture: value[1],
                });
            }
        }

        if (ped.outfit) {
            this.clothingService.applyPedOutfit(pedId, ped.outfit);
        }

        if (ped.skin) {
            if (ped.skin.Tattoos) {
                Object.entries(ped.skin.Tattoos).forEach(([, tattoo]) => {
                    AddPedDecorationFromHashes(pedId, tattoo.Collection, tattoo.Overlay);
                });
            }

            if (ped.skin.Model) {
                SetPedHeadBlendData(
                    pedId,
                    ped.skin.Model.Father,
                    ped.skin.Model.Mother,
                    0,
                    ped.skin.Model.Father,
                    ped.skin.Model.Mother,
                    0,
                    ped.skin.Model.ShapeMix,
                    ped.skin.Model.SkinMix,
                    0,
                    false
                );
            }

            if (ped.skin.FaceTrait) {
                SetPedEyeColor(pedId, ped.skin.FaceTrait.EyeColor);

                SetPedHeadOverlay(pedId, PedHeadOverlay.Blemishes, ped.skin.FaceTrait.Blemish, 1.0);
                SetPedHeadOverlay(pedId, PedHeadOverlay.Ageing, ped.skin.FaceTrait.Ageing, 1.0);
                SetPedHeadOverlay(pedId, PedHeadOverlay.Complexion, ped.skin.FaceTrait.Complexion, 1.0);
                SetPedHeadOverlay(pedId, PedHeadOverlay.Moles, ped.skin.FaceTrait.Moles, 1.0);
                SetPedHeadOverlay(pedId, PedHeadOverlay.BodyBlemishes, ped.skin.FaceTrait.BodyBlemish, 1.0);
                SetPedHeadOverlay(pedId, PedHeadOverlay.AddBodyBlemishes, ped.skin.FaceTrait.AddBodyBlemish, 1.0);

                SetPedFaceFeature(pedId, PedFaceFeature.EyebrowHigh, ped.skin.FaceTrait.EyebrowHigh);
                SetPedFaceFeature(pedId, PedFaceFeature.EyebrowForward, ped.skin.FaceTrait.EyebrowForward);
                SetPedFaceFeature(pedId, PedFaceFeature.EyesOpening, ped.skin.FaceTrait.EyesOpening);
                SetPedFaceFeature(pedId, PedFaceFeature.CheeksBoneHigh, ped.skin.FaceTrait.CheeksBoneHigh);
                SetPedFaceFeature(pedId, PedFaceFeature.CheeksBoneWidth, ped.skin.FaceTrait.CheeksBoneWidth);
                SetPedFaceFeature(pedId, PedFaceFeature.CheeksWidth, ped.skin.FaceTrait.CheeksWidth);
                SetPedFaceFeature(pedId, PedFaceFeature.ChimpBoneLength, ped.skin.FaceTrait.ChimpBoneLength);
                SetPedFaceFeature(pedId, PedFaceFeature.ChimpBoneLowering, ped.skin.FaceTrait.ChimpBoneLower);
                SetPedFaceFeature(pedId, PedFaceFeature.ChimpBoneWidth, ped.skin.FaceTrait.ChimpBoneWidth);
                SetPedFaceFeature(pedId, PedFaceFeature.ChimpHole, ped.skin.FaceTrait.ChimpHole);
                SetPedFaceFeature(pedId, PedFaceFeature.JawBoneBackLength, ped.skin.FaceTrait.JawBoneBackLength);
                SetPedFaceFeature(pedId, PedFaceFeature.JawBoneWidth, ped.skin.FaceTrait.JawBoneWidth);
                SetPedFaceFeature(pedId, PedFaceFeature.LipsThickness, ped.skin.FaceTrait.LipsThickness);
                SetPedFaceFeature(pedId, PedFaceFeature.NeckThickness, ped.skin.FaceTrait.NeckThickness);
                SetPedFaceFeature(pedId, PedFaceFeature.NoseBoneHigh, ped.skin.FaceTrait.NoseBoneHigh);
                SetPedFaceFeature(pedId, PedFaceFeature.NoseBoneTwist, ped.skin.FaceTrait.NoseBoneTwist);
                SetPedFaceFeature(pedId, PedFaceFeature.NosePeakLength, ped.skin.FaceTrait.NosePeakLength);
                SetPedFaceFeature(pedId, PedFaceFeature.NosePeakLowering, ped.skin.FaceTrait.NosePeakLower);
                SetPedFaceFeature(pedId, PedFaceFeature.NosePeakHeight, ped.skin.FaceTrait.NosePeakHeight);
                SetPedFaceFeature(pedId, PedFaceFeature.NoseWidth, ped.skin.FaceTrait.NoseWidth);
            }

            if (ped.skin.Hair) {
                if (ped.skin.Hair.Collection) {
                    SetPedCollectionComponentVariation(
                        pedId,
                        2,
                        ped.skin.Hair.Collection,
                        ped.skin.Hair.HairType,
                        0,
                        0
                    );
                } else {
                    SetPedComponentVariation(pedId, 2, ped.skin.Hair.HairType, 0, 0);
                }
                SetPedHairColor(pedId, ped.skin.Hair.HairColor, ped.skin.Hair.HairSecondaryColor || 0);
                SetPedHeadOverlay(pedId, 2, ped.skin.Hair.EyebrowType, ped.skin.Hair.EyebrowOpacity || 1.0);
                SetPedHeadOverlayColor(pedId, 2, 1, ped.skin.Hair.EyebrowColor, 0);
                SetPedHeadOverlay(pedId, 1, ped.skin.Hair.BeardType, ped.skin.Hair.BeardOpacity || 1.0);
                SetPedHeadOverlayColor(pedId, 1, 1, ped.skin.Hair.BeardColor, 0);
                SetPedHeadOverlay(pedId, 10, ped.skin.Hair.ChestHairType, ped.skin.Hair.ChestHairOpacity || 1.0);
                SetPedHeadOverlayColor(pedId, 10, 1, ped.skin.Hair.ChestHairColor, 0);

                if (ped.skin.Hair.Scalp) {
                    AddPedDecorationFromHashes(pedId, ped.skin.Hair.Scalp.Collection, ped.skin.Hair.Scalp.Overlay);
                }
            }

            if (ped.skin.Makeup) {
                SetPedHeadOverlay(
                    pedId,
                    PedHeadOverlay.Lipstick,
                    ped.skin.Makeup.LipstickType,
                    ped.skin.Makeup.LipstickOpacity || 1.0
                );
                SetPedHeadOverlayColor(pedId, PedHeadOverlay.Lipstick, 2, ped.skin.Makeup.LipstickColor, 0);
                SetPedHeadOverlay(
                    pedId,
                    PedHeadOverlay.Blush,
                    ped.skin.Makeup.BlushType,
                    ped.skin.Makeup.BlushOpacity || 1.0
                );
                SetPedHeadOverlayColor(pedId, PedHeadOverlay.Blush, 2, ped.skin.Makeup.BlushColor, 0);
                SetPedHeadOverlay(
                    pedId,
                    PedHeadOverlay.Makeup,
                    ped.skin.Makeup.FullMakeupType,
                    ped.skin.Makeup.FullMakeupOpacity || 1.0
                );

                if (ped.skin.Makeup.FullMakeupDefaultColor) {
                    SetPedHeadOverlayColor(pedId, PedHeadOverlay.Makeup, 0, 0, 0);
                } else {
                    SetPedHeadOverlayColor(
                        pedId,
                        PedHeadOverlay.Makeup,
                        2,
                        ped.skin.Makeup.FullMakeupPrimaryColor,
                        ped.skin.Makeup.FullMakeupSecondaryColor
                    );
                }
            }
        }

        if (ped.freeze) {
            FreezeEntityPosition(pedId, true);
        }

        if (ped.invincible) {
            SetEntityInvincible(pedId, true);
        }

        if (ped.blockevents) {
            SetBlockingOfNonTemporaryEvents(pedId, true);
        }

        if (ped.animDict && ped.anim) {
            await this.resourceLoader.loadAnimationDictionary(ped.animDict);
            TaskPlayAnim(pedId, ped.animDict, ped.anim, 8.0, 0, -1, ped.flag || 1, 0, false, false, false);
        }

        if (ped.scenario) {
            TaskStartScenarioInPlace(pedId, ped.scenario, 0, true);
        }

        if (ped.animprops) {
            const pedprops = [];
            for (const prop of ped.animprops) {
                const model = Array.isArray(prop.model)
                    ? prop.model[Math.floor(Math.random() * prop.model.length)]
                    : prop.model;
                if (!(await this.resourceLoader.loadModel(model))) {
                    continue;
                }

                const playerOffset = GetOffsetFromEntityInWorldCoords(pedId, 0.0, 0.0, 0.0) as Vector3;
                const propId = CreateObject(
                    GetHashKey(model),
                    playerOffset[0],
                    playerOffset[1],
                    playerOffset[2],
                    false,
                    false,
                    false
                );

                this.resourceLoader.unloadModel(model);

                AttachEntityToEntity(
                    propId,
                    pedId,
                    GetPedBoneIndex(pedId, prop.bone),
                    prop.position[0],
                    prop.position[1],
                    prop.position[2],
                    prop.rotation[0],
                    prop.rotation[1],
                    prop.rotation[2],
                    true,
                    true,
                    false,
                    true,
                    0,
                    true
                );
                pedprops.push(propId);
            }
            this.pedProps.set(pedId, pedprops);
        }

        if (ped.weapon) {
            GiveWeaponToPed(pedId, ped.weapon, 0, false, true);
            SetCurrentPedWeapon(pedId, ped.weapon, true);
        }

        if (ped.alpha) {
            SetEntityAlpha(pedId, ped.alpha, false);
        }

        return pedId;
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        for (const ped of Object.keys(this.loadedPeds)) {
            this.unspawnPed(ped);
        }

        this.loadedPeds = {};
    }

    @OnEvent(ClientEvent.PED_RELEASE)
    public onPedRelease(netId: number) {
        if (!NetworkDoesNetworkIdExist(netId)) {
            return;
        }

        const ped = NetworkGetEntityFromNetworkId(netId);

        if (!DoesEntityExist(ped)) {
            return;
        }

        SetEntityAsNoLongerNeeded(ped);
        return;
    }
}
