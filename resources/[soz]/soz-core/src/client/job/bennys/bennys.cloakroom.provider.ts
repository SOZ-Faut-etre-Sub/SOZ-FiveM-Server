import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Component, WardrobeConfig } from '../../../shared/cloth';
import { ClientEvent } from '../../../shared/event';
import { JobCloakroomProvider } from '../job.cloakroom.provider';

export const BENNYS_CLOAKROOM: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Patron']: {
            Components: {
                [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 17, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 351, Texture: 9, Palette: 0 },
            },
            Props: {},
        },
        ["Chef d'atelier"]: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 146, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano confirmé']: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 64, Texture: 13, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 146, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano']: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 0, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano novice']: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 64, Texture: 13, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 208, Texture: 18, Palette: 0 },
            },
            Props: {},
        },
        ['Apprenti']: {
            Components: {
                [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 39, Texture: 1, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 66, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ["Responsable d'atelier"]: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 47, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 22, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 31, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 139, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Patron']: {
            Components: {
                [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 17, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 377, Texture: 5, Palette: 0 },
            },
            Props: {},
        },
        ["Chef d'atelier"]: {
            Components: {
                [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 338, Texture: 7, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano confirmé']: {
            Components: {
                [Component.Torso]: { Drawable: 31, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 67, Texture: 13, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 141, Texture: 5, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano']: {
            Components: {
                [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 331, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano novice']: {
            Components: {
                [Component.Torso]: { Drawable: 31, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 67, Texture: 13, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 212, Texture: 18, Palette: 0 },
            },
            Props: {},
        },
        ['Apprenti']: {
            Components: {
                [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 39, Texture: 1, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 60, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ["Responsable d'atelier"]: {
            Components: {
                [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 338, Texture: 9, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 23, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 30, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 103, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
    },
};

@Provider()
export class BennysCloakroomProvider {
    @Inject(JobCloakroomProvider)
    private jobCloakroomProvider: JobCloakroomProvider;

    @OnEvent(ClientEvent.BENNYS_OPEN_CLOAKROOM)
    public async openCloakroom(storageIdToSave: string) {
        await this.jobCloakroomProvider.openCloakroom(storageIdToSave, BENNYS_CLOAKROOM);
    }
}
