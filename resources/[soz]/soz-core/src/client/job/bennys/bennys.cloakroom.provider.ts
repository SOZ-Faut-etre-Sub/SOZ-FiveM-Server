import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Component, WardrobeConfig } from '../../../shared/cloth';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { PlayerService } from '../../player/player.service';
import { PlayerWardrobe } from '../../player/player.wardrobe';
import { ProgressService } from '../../progress.service';
import { JobGradeRepository } from '../../resources/job.grade.repository';

const BENNYS_CLOAKROOM: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Patron']: {
            Components: {
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 146, Texture: 6, Palette: 0 },
            },
            Props: {},
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Patron']: {
            Components: {
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
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
    },
};

@Provider()
export class BennysCloakroomProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ClientEvent.BENNYS_OPEN_CLOAKROOM)
    public async openCloakroom(storageIdToSave) {
        const outfitSelection = await this.playerWardrobe.selectOutfit(BENNYS_CLOAKROOM, 'Tenue civile');

        if (outfitSelection.canceled) {
            return;
        }

        await this.progressService.progress(
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
