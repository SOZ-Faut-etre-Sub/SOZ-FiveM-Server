import { Inject, Injectable } from '@core/decorators/injectable';
import { Logger } from '@core/logger';
import { wait } from '@core/utils';
import { FeatureProvider } from '@public/client/feature/feature.provider';
import { billboardOffsets, getScreenModel } from '@public/shared/billboard';
import { BLACK_SCREEN_URL } from '@public/shared/global';
import { applyOffset, Vector4 } from '@public/shared/polyzone/vector';

import { Feature } from '../../shared/features';
import { joaat } from '../../shared/joaat';
import { WorldObject } from '../../shared/object';
import { ModelSwapRepository } from '../repository/modelswap.repository';
import { ResourceLoader } from '../repository/resource.loader';
import { TextureReplacerProvider } from './texture.replacer.provider';

const HalloweenMapping: Record<number, number> = {
    [GetHashKey('soz_prop_bb_bin')]: GetHashKey('soz_hw_bin_1'),
    [GetHashKey('soz_prop_bb_bin_hs2')]: GetHashKey('soz_hw_bin_2'),
    [GetHashKey('soz_prop_bb_bin_hs3')]: GetHashKey('soz_hw_bin_3'),
};

const OBJECT_MODELS_NO_FREEZE = [joaat('prop_cardbordbox_03a')];

@Injectable()
export class ObjectService {
    @Inject(Logger)
    private logger: Logger;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(ModelSwapRepository)
    private modelSwapRepository: ModelSwapRepository;

    @Inject(TextureReplacerProvider)
    private textureReplacerProvider: TextureReplacerProvider;

    private duiObjects: Map<string, { dui: number; textureId: string }> = new Map();
    private textureDict = 0;

    public async createObject(object: WorldObject) {
        let model = object.model;

        if (this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            model = HalloweenMapping[model] || model;
        }

        if (!IsModelValid(model)) {
            this.logger.warn(`Model ${model} is not valid for ${object.id}`);

            return null;
        }

        const swap = this.modelSwapRepository.findSwap(model, object.position);
        if (swap) {
            if (!swap.target) {
                return null;
            }
            model = joaat(swap.target);
        }

        if (!(await this.resourceLoader.loadModel(model))) {
            this.logger.error(`Failed to load model ${model} for ${object.id}`);

            return null;
        }

        let entity = CreateObjectNoOffset(
            model,
            object.position[0],
            object.position[1],
            object.position[2],
            false,
            false,
            false
        );

        if (!DoesEntityExist(entity)) {
            await wait(10);

            entity = CreateObjectNoOffset(
                model,
                object.position[0],
                object.position[1],
                object.position[2],
                false,
                false,
                false
            );
            if (!DoesEntityExist(entity)) {
                this.resourceLoader.unloadModel(model);
                this.logger.error(`Failed to create object ${object.id}`);

                return null;
            }
        }

        this.resourceLoader.unloadModel(model);

        await this.updateObject(entity, object);

        return entity;
    }

    public async updateObject(entity: number, object: WorldObject) {
        const model = GetEntityModel(entity);

        SetEntityHeading(entity, object.position[3]);

        if (!OBJECT_MODELS_NO_FREEZE.includes(model)) {
            FreezeEntityPosition(entity, true);
        }

        if (object.placeOnGround) {
            PlaceObjectOnGroundProperly(entity);
        }

        if (object.rotation) {
            SetEntityRotation(
                entity,
                object.rotation[0],
                object.rotation[1],
                object.rotation[2],
                object.rotationOrder ?? 0,
                false
            );
        }

        if (object.matrix) {
            if (object.placeOnGround) {
                const [success, z] = GetGroundZFor_3dCoord_2(
                    object.position[0],
                    object.position[1],
                    object.position[2],
                    false
                );
                if (success) {
                    object.matrix[14] = z + 0.01;
                }
            }

            this.applyEntityMatrix(entity, object.matrix);
        } else if (object.growth) {
            this.computeGrowth(entity, object);
        }

        if (object.invisible) {
            SetEntityVisible(entity, false, false);
        }

        if (object.highlight) {
            SetEntityDrawOutlineColor(0, 180, 0, 255);
            SetEntityDrawOutlineShader(1);
            SetEntityDrawOutline(entity, true);
        } else {
            SetEntityDrawOutline(entity, false);
        }

        SetEntityCollision(entity, !object.noCollision, false);
        SetEntityInvincible(entity, true);

        RemoveParticleFxFromEntity(entity);
        if (object.vfx) {
            await this.resourceLoader.loadPtfxAsset(object.vfx.dictionary);
            UseParticleFxAsset(object.vfx.dictionary);
            object.vfx.id = StartParticleFxLoopedOnEntity(
                object.vfx.name,
                entity,
                object.vfx.position[0],
                object.vfx.position[1],
                object.vfx.position[2],
                object.vfx.rotation[0],
                object.vfx.rotation[1],
                object.vfx.rotation[2],
                object.vfx.scale,
                false,
                false,
                false
            );
            if (object.vfx.rgb) {
                SetParticleFxLoopedColour(object.vfx.id, object.vfx.rgb[0], object.vfx.rgb[1], object.vfx.rgb[2], true);
            }
            this.resourceLoader.unloadPtfxAsset(object.vfx.dictionary);
        }

        if (object.permanent) {
            SetEntityLodDist(entity, 0xfff);
        } else {
            SetEntityLodDist(entity, 0x200);
        }

        if (object.alpha) {
            SetEntityAlpha(entity, object.alpha, false);
        }

        if (object.textureVariation) {
            SetObjectTextureVariation(entity, object.textureVariation);
        }

        if (object.dynamicTexture && object.dynamicTexture.url) {
            const conf = billboardOffsets[object.dynamicTexture.baseModel];
            if (conf) {
                const oriTxd = getScreenModel(object.dynamicTexture.baseModel, object.dynamicTexture.index);
                for (const texture of conf.textures) {
                    this.textureReplacerProvider.replaceTexture({
                        baseDict: oriTxd,
                        baseTexture: texture,
                        url: object.dynamicTexture.url,
                    });
                }
            }
        }
    }

    public deleteObject(entity: number, object: WorldObject) {
        if (!DoesEntityExist(entity)) {
            this.logger.error('Attemp to delete an non existing entity');

            return false;
        }

        let model = object.model;

        if (this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            model = HalloweenMapping[model] || model;
        }

        const swap = this.modelSwapRepository.findSwap(model, object.position);
        let model2 = null;
        if (swap) {
            if (!swap.target) {
                return false;
            }
            model2 = joaat(swap.target);
        }

        if (![model, model2].includes(GetEntityModel(entity))) {
            this.logger.error(
                `Attemp to delete an entity of wrong model ${GetEntityModel(entity)} expected ${model} or ${model2} for ${object.id}`
            );

            return false;
        }

        DeleteEntity(entity);
        if (object.dynamicTexture && object.dynamicTexture.url) {
            const conf = billboardOffsets[object.dynamicTexture.baseModel];
            if (conf) {
                const oriTxd = getScreenModel(object.dynamicTexture.baseModel, object.dynamicTexture.index);
                for (const texture of conf.textures) {
                    RemoveReplaceTexture(oriTxd, texture);
                }

                const duiObject = this.duiObjects.get(object.id);
                if (duiObject) {
                    SetDuiUrl(duiObject.dui, BLACK_SCREEN_URL);
                }
            }
        }

        return true;
    }

    public getEntityMatrix(entity: number): number[] {
        const [f, r, u, a] = GetEntityMatrix(entity);

        return [r[0], r[1], r[2], 0, f[0], f[1], f[2], 0, u[0], u[1], u[2], 0, a[0], a[1], a[2], 1];
    }

    public applyEntityMatrix(entity: number, matrix: number[]) {
        SetEntityMatrix(
            entity,
            matrix[4],
            matrix[5],
            matrix[6], // Right
            matrix[0],
            matrix[1],
            matrix[2], // Forward
            matrix[8],
            matrix[9],
            matrix[10], // Up
            matrix[12],
            matrix[13],
            matrix[14] // Position
        );
    }

    public applyEntityNormalizedMatrix(entity: number, matrix: number[]) {
        const norm_F = Math.sqrt(matrix[0] ** 2 + matrix[1] ** 2);
        SetEntityMatrix(
            entity,
            -matrix[1] / norm_F,
            matrix[0] / norm_F,
            0, // Right
            matrix[0] / norm_F,
            matrix[1] / norm_F,
            0, // Forward
            0,
            0,
            1, // Up
            matrix[12],
            matrix[13],
            matrix[14] // Position
        );
    }

    public computeGrowth(entity: number, object: WorldObject) {
        let ratio = object.growth.endSize;
        if (Date.now() < object.growth.beginTime) {
            ratio = object.growth.beginSize;
        } else if (Date.now() < object.growth.endTime) {
            ratio =
                ((Date.now() - object.growth.beginTime) / (object.growth.endTime - object.growth.beginTime)) *
                    (object.growth.endSize - object.growth.beginSize) +
                object.growth.beginSize;
        }
        const matrix = this.getEntityMatrix(entity);
        matrix[0] = ratio;
        matrix[5] = ratio;
        matrix[10] = ratio;

        SetEntityMatrix(
            entity,
            matrix[4],
            matrix[5],
            matrix[6], // Right
            matrix[0],
            matrix[1],
            matrix[2], // Forward
            matrix[8],
            matrix[9],
            matrix[10], // Up
            matrix[12],
            matrix[13],
            matrix[14] // Position
        );
    }

    public updateObjectTexture(entity: number, textureUrl: string) {
        if (!DoesEntityExist(entity) || !textureUrl) return;

        const coords = GetEntityCoords(entity, false);
        const model = GetEntityModel(entity);

        function computeCorners(coordsWithHeading: Vector4): Vector4[] {
            return billboardOffsets[model].offsets.map(offset => applyOffset(coordsWithHeading, offset));
        }

        function drawQuad(c1: Vector4, c2: Vector4, c3: Vector4, c4: Vector4, textureName: string) {
            DrawTexturedPoly(
                c1[0],
                c1[1],
                c1[2],
                c3[0],
                c3[1],
                c3[2],
                c2[0],
                c2[1],
                c2[2],
                255,
                255,
                255,
                255,
                'dynamic_prop_textures',
                textureName,
                1,
                0,
                1,
                0,
                0,
                1,
                1,
                1,
                1
            );
            DrawTexturedPoly(
                c3[0],
                c3[1],
                c3[2],
                c4[0],
                c4[1],
                c4[2],
                c2[0],
                c2[1],
                c2[2],
                255,
                255,
                255,
                255,
                'dynamic_prop_textures',
                textureName,
                0,
                0,
                1,
                0,
                1,
                1,
                1,
                1,
                1
            );
        }

        const baseHeading = GetEntityHeading(entity);
        const headings = [baseHeading];

        if (model === GetHashKey('soz_news_billboard_02')) {
            headings.push(baseHeading + 120, baseHeading - 120);
        }

        headings.forEach(heading => {
            const coordsWithHeading = [...coords, heading] as Vector4;
            const [c1, c2, c3, c4] = computeCorners(coordsWithHeading);
            drawQuad(c1, c2, c3, c4, `${textureUrl}_texture`);
        });
    }
}
