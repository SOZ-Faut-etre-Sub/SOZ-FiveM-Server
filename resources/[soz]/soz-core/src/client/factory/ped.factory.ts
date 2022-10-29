import { Once, OnceStep } from '../../core/decorators/event';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { ResourceLoader } from '../resources/resource.loader';

export type Ped = {
    model: number | string;
    coords: { x: number; y: number; z: number; w: number };

    components?: { [key: number]: [number, number, number] };
    props?: { [key: number]: [number, number, number] };
    face?: { [key: string]: number };
    hair?: { [key: string]: number };
    makeup?: { [key: string]: number };
    modelCustomization?: { [key: string]: number };
    tattoos?: {collection: number, overlay: number}[];
    freeze?: boolean;
    invincible?: boolean;
    blockevents?: boolean;
    scenario?: string;
    animDict?: string;
    anim?: string;
    flag?: number;
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

@Injectable()
export class PedFactory {
    private peds: { [id: number]: any } = {};

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    public async createPed(ped: Ped): Promise<number> {
        const hash = typeof ped.model === 'string' ? GetHashKey(ped.model) : ped.model;

        await this.resourceLoader.loadModel(hash);

        const pedId = CreatePed(0, hash, ped.coords.x, ped.coords.y, ped.coords.z, ped.coords.w, false, false);

        SetPedDefaultComponentVariation(pedId);

        if (ped.components) {
            for (const [key, value] of Object.entries(ped.components)) {
                SetPedComponentVariation(pedId, Number(key), value[0], value[1], value[2]);
            }
        }

        if (ped.props) {
            for (const [key, value] of Object.entries(ped.props)) {
                SetPedPropIndex(pedId, Number(key), value[0], value[1], true);
            }
        }

        if (ped.tattoos) {
            Object.entries(ped.tattoos).forEach(([, tattoo]) => {
                AddPedDecorationFromHashes(pedId, tattoo.collection, tattoo.overlay);
            });
        }

        if (ped.modelCustomization) {
            SetPedHeadBlendData(pedId, ped.modelCustomization.Father, ped.modelCustomization.Mother, 0, ped.modelCustomization.Father, ped.modelCustomization.Mother, 0, ped.modelCustomization.ShapeMix, ped.modelCustomization.SkinMix, 0, false);
        }

        if (ped.face) {
            SetPedEyeColor(pedId, ped.face['EyeColor']);

            Object.entries(ped.face).forEach(([key, value]) => {
                if (PedHeadOverlay[key]) {
                    SetPedHeadOverlay(pedId, PedHeadOverlay[key], Number(value), 1.0);
                }
                if (PedFaceFeature[key]) {
                    SetPedFaceFeature(pedId, PedFaceFeature[key], Number(value));
                }
            });
        }

        if (ped.hair) {
            SetPedComponentVariation(pedId, 2, ped.hair.HairType, 0, 0);
            SetPedHairColor(pedId, ped.hair.HairColor, ped.hair.HairSecondaryColor || 0);
            SetPedHeadOverlay(pedId, 2, ped.hair.EyebrowType, ped.hair.EyebrowOpacity || 1.0);
            SetPedHeadOverlayColor(pedId, 2, 1, ped.hair.EyebrowColor, 0);
            SetPedHeadOverlay(pedId, 1, ped.hair.BeardType, ped.hair.BeardOpacity || 1.0);
            SetPedHeadOverlayColor(pedId, 1, 1, ped.hair.BeardColor, 0);
            SetPedHeadOverlay(pedId, 10, ped.hair.ChestHairType, ped.hair.ChestHairOpacity || 1.0);
            SetPedHeadOverlayColor(pedId, 10, 1, ped.hair.ChestHairColor, 0);
        }

        if (ped.makeup) {
            SetPedHeadOverlay(pedId, 8, ped.makeup.LipstickType, ped.makeup.LipstickOpacity || 1.0);
            SetPedHeadOverlayColor(pedId, 8, 2, ped.makeup.LipstickColor, 0);
            SetPedHeadOverlay(pedId, 5, ped.makeup.BlushType, ped.makeup.BlushOpacity || 1.0);
            SetPedHeadOverlayColor(pedId, 5, 2, ped.makeup.BlushColor, 0);
            SetPedHeadOverlay(pedId, 4, ped.makeup.FullMakeupType, ped.makeup.FullMakeupOpacity || 1.0);

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

        this.peds[pedId] = true;
        return pedId;
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        for (const pedId in this.peds) {
            DeletePed(Number(pedId));
        }
        this.peds = {};
    }
}
