import { Inject, Injectable } from '@core/decorators/injectable';
import { Logger } from '@core/logger';
import { wait } from '@core/utils';

import { Feature, isFeatureEnabled } from '../../shared/features';
import { joaat } from '../../shared/joaat';
import { WorldObject } from '../../shared/object';
import { ResourceLoader } from '../repository/resource.loader';

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

    public async createObject(object: WorldObject) {
        let model = object.model;

        if (isFeatureEnabled(Feature.Halloween)) {
            model = HalloweenMapping[model] || model;
        }

        if (!IsModelValid(model)) {
            this.logger.warn(`Model ${model} is not valid for ${object.id}`);

            return null;
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
        }

        if (object.rotation) {
            SetEntityRotation(entity, object.rotation[0], object.rotation[1], object.rotation[2], 0, false);
        }

        if (object.invisible) {
            SetEntityVisible(entity, false, false);
        }

        SetEntityCollision(entity, !object.noCollision, false);
        SetEntityInvincible(entity, true);

        RemoveParticleFxFromEntity(entity);
        if (object.vfx) {
            await this.resourceLoader.loadPtfxAsset(object.vfx.dictionary);
            UseParticleFxAsset(object.vfx.dictionary);
            const fx = StartParticleFxLoopedOnEntity(
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
                SetParticleFxLoopedColour(fx, object.vfx.rgb[0], object.vfx.rgb[1], object.vfx.rgb[2], true);
            }
            this.resourceLoader.unloadPtfxAsset(object.vfx.dictionary);
        }
    }

    public deleteObject(entity: number, object: WorldObject) {
        if (!DoesEntityExist(entity)) {
            this.logger.error('Attemp to delete an non existing entity');

            return false;
        }

        let model = object.model;

        if (isFeatureEnabled(Feature.Halloween)) {
            model = HalloweenMapping[model] || model;
        }

        if (GetEntityModel(entity) !== model) {
            this.logger.error(`Attemp to delete an entity of wrong model ${GetEntityModel(entity)} expected ${model}`);

            return false;
        }

        DeleteEntity(entity);

        return true;
    }

    public getEntityMatrix(entity: number): Float32Array {
        const [f, r, u, a] = GetEntityMatrix(entity);

        return new Float32Array([r[0], r[1], r[2], 0, f[0], f[1], f[2], 0, u[0], u[1], u[2], 0, a[0], a[1], a[2], 1]);
    }

    public applyEntityMatrix(entity: number, matrix: Float32Array) {
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

    public applyEntityNormalizedMatrix(entity: number, matrix: Float32Array) {
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
}
