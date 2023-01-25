import { PlayerWardrobe } from '@public/client/player/player.wardrobe';
import { ProgressService } from '@public/client/progress.service';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Component, Prop, WardrobeConfig } from '@public/shared/cloth';
import { ClientEvent, ServerEvent } from '@public/shared/event';

const UPW_CLOAKROOM: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ["Tenue d'apprenti pour été"]: {
            Components: {
                [Component.Torso]: { Drawable: 41, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 12, Texture: 5, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 146, Texture: 6, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'apprenti pour hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 42, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 12, Texture: 5, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 2, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 244, Texture: 4, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'électricien pour été"]: {
            Components: {
                [Component.Torso]: { Drawable: 41, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 12, Texture: 5, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 22, Texture: 1, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 1, Palette: 0 } },
        },
        ["Tenue d'électricien pour hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 42, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 12, Texture: 5, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 2, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 244, Texture: 6, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 1, Palette: 0 } },
        },
        ['Tenue de chef électricien pour été']: {
            Components: {
                [Component.Torso]: { Drawable: 41, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 12, Texture: 5, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 241, Texture: 2, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 2, Palette: 0 } },
        },
        ['Tenue de chef électricien pour hiver']: {
            Components: {
                [Component.Torso]: { Drawable: 42, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 12, Texture: 5, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 2, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 244, Texture: 7, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 2, Palette: 0 } },
        },
        ['Tenue de la Direction']: {
            Components: {
                [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 56, Texture: 1, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 32, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 294, Texture: 7, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 3, Palette: 0 } },
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ["Tenue d'apprentie pour été"]: {
            Components: {
                [Component.Torso]: { Drawable: 57, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 60, Texture: 2, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 101, Texture: 9, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 141, Texture: 1, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'apprentie pour hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 46, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 60, Texture: 2, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 213, Texture: 5, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 252, Texture: 4, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'électricienne pour été"]: {
            Components: {
                [Component.Torso]: { Drawable: 57, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 60, Texture: 2, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 101, Texture: 9, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 286, Texture: 1, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 1, Palette: 0 } },
        },
        ["Tenue d'électricienne pour hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 46, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 60, Texture: 2, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 213, Texture: 5, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 252, Texture: 6, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 1, Palette: 0 } },
        },
        ['Tenue de cheffe électricienne pour été']: {
            Components: {
                [Component.Torso]: { Drawable: 57, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 60, Texture: 2, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 101, Texture: 9, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 249, Texture: 2, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 2, Palette: 0 } },
        },
        ['Tenue de cheffe électricienne pour hiver']: {
            Components: {
                [Component.Torso]: { Drawable: 46, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 60, Texture: 2, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 213, Texture: 5, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 252, Texture: 7, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 2, Palette: 0 } },
        },
        ['Tenue de la Direction']: {
            Components: {
                [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 133, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 27, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 217, Texture: 6, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 6, Texture: 2, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 3, Palette: 0 } },
        },
    },
};

@Provider()
export class UpwCloakroomProvider {
    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ClientEvent.UPW_OPEN_CLOAKROOM)
    public async openCloakroom(storageIdToSave) {
        const outfitSelection = await this.playerWardrobe.selectOutfit(UPW_CLOAKROOM, 'Tenue civile');
        if (outfitSelection.canceled) {
            return;
        }

        const progress = await this.progressService.progress(
            'switch_clothes',
            "Changement d'habits...",
            5000,
            {
                name: 'male_shower_towel_dry_to_get_dressed',
                dictionary: 'anim@mp_yacht@shower@male@',
                options: {
                    cancellable: false,
                    enablePlayerControl: false,
                },
            },
            {
                disableCombat: true,
                disableMovement: true,
            }
        );

        if (!progress.completed) {
            return;
        }

        if (outfitSelection.outfit) {
            if (storageIdToSave) {
                TriggerServerEvent(ServerEvent.JOBS_USE_WORK_CLOTHES, storageIdToSave);
            }

            TriggerServerEvent('soz-character:server:SetPlayerJobClothes', outfitSelection.outfit);
        } else {
            TriggerServerEvent('soz-character:server:SetPlayerJobClothes', null);
        }
    }
}
