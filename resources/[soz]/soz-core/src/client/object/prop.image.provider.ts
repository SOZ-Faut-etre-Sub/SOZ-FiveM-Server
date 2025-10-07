import { Command } from '@public/core/decorators/command';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ClothingFields } from '@public/shared/cloth';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { joaat } from '@public/shared/joaat';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector4 } from '@public/shared/polyzone/vector';

import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';
import { ObjectService } from './object.service';

/*
const props = {
    COMPONENT_PISTOL_CLIP_01: 'w_pi_pistol_mag1',
    COMPONENT_PISTOL_CLIP_02: 'w_pi_pistol_mag2',
    COMPONENT_AT_PI_FLSH: 'w_at_pi_flsh',
    COMPONENT_AT_PI_SUPP: 'w_at_pi_supp',
    COMPONENT_PISTOL_MK2_CLIP_01: 'w_pi_pistolmk2_mag1',
    COMPONENT_PISTOL_MK2_CLIP_02: 'w_pi_pistolmk2_mag2',
    COMPONENT_AT_PI_RAIL: 'w_at_pi_rail_1',
    COMPONENT_AT_PI_FLSH_02: 'w_at_pi_flsh_2',
    COMPONENT_AT_PI_SUPP_02: 'w_at_pi_supp_2',
    COMPONENT_AT_PI_COMP: 'w_at_pi_comp_2',
    COMPONENT_AT_SIGHTS: 'w_at_sights_1',
    COMPONENT_AT_SCOPE_MACRO_MK2: 'w_at_scope_macro',
    COMPONENT_AT_PI_COMP_03: 'w_at_pi_comp_3',
    COMPONENT_COMBATPISTOL_CLIP_02: 'w_pi_combatpistol_mag2',
    COMPONENT_COMBATPISTOL_CLIP_01: 'w_pi_combatpistol_mag1',
    COMPONENT_APPISTOL_CLIP_01: 'w_pi_appistol_mag1',
    COMPONENT_APPISTOL_CLIP_02: 'w_pi_appistol_mag2',
    COMPONENT_PISTOL50_CLIP_01: 'W_PI_PISTOL50_Mag1',
    COMPONENT_PISTOL50_CLIP_02: 'W_PI_PISTOL50_Mag2',
    COMPONENT_AT_AR_SUPP_02: 'w_at_ar_supp_02',
    COMPONENT_SNSPISTOL_CLIP_01: 'w_pi_sns_pistol_mag1',
    COMPONENT_SNSPISTOL_CLIP_02: 'w_pi_sns_pistol_mag2',
    COMPONENT_HEAVYPISTOL_CLIP_01: 'w_pi_heavypistol_mag1',
    COMPONENT_HEAVYPISTOL_CLIP_02: 'w_pi_heavypistol_mag2',
    COMPONENT_VINTAGEPISTOL_CLIP_01: 'w_pi_vintage_pistol_mag1',
    COMPONENT_VINTAGEPISTOL_CLIP_02: 'w_pi_vintage_pistol_mag2',
    COMPONENT_SNSPISTOL_MK2_CLIP_01: 'w_pi_sns_pistolmk2_mag1',
    COMPONENT_SNSPISTOL_MK2_CLIP_02: 'w_pi_sns_pistolmk2_mag2',
    COMPONENT_AT_PI_RAIL_02: 'w_at_pi_rail_2',
    COMPONENT_AT_PI_FLSH_03: 'w_at_pi_snsmk2_flsh_1',
    COMPONENT_PISTOLXM3_SUPP: 'W_PI_Pistol_XM3_Supp',
    COMPONENT_MICROSMG_CLIP_01: 'w_sb_microsmg_mag1',
    COMPONENT_MICROSMG_CLIP_02: 'w_sb_microsmg_mag2',
    COMPONENT_AT_SCOPE_MACRO: 'w_at_scope_macro',
    COMPONENT_SMG_CLIP_01: 'w_sb_smg_mag1',
    COMPONENT_SMG_CLIP_02: 'w_sb_smg_mag2',
    COMPONENT_SMG_CLIP_03: 'w_sb_smg_boxmag',
    COMPONENT_AT_AR_FLSH: 'w_at_ar_flsh',
    COMPONENT_AT_SCOPE_MACRO_02: 'w_at_scope_macro_2',
    COMPONENT_ASSAULTSMG_CLIP_01: 'W_SB_ASSAULTSMG_Mag1',
    COMPONENT_ASSAULTSMG_CLIP_02: 'W_SB_ASSAULTSMG_Mag2',
    COMPONENT_COMBATPDW_CLIP_01: 'W_SB_PDW_Mag1',
    COMPONENT_COMBATPDW_CLIP_02: 'W_SB_PDW_Mag2',
    COMPONENT_COMBATPDW_CLIP_03: 'w_sb_pdw_boxmag',
    COMPONENT_AT_AR_AFGRIP: 'w_at_ar_afgrip',
    COMPONENT_AT_SCOPE_SMALL: 'w_at_scope_small',
    COMPONENT_SMG_MK2_CLIP_01: 'w_sb_smgmk2_mag1',
    COMPONENT_SMG_MK2_CLIP_02: 'w_sb_smgmk2_mag2',
    COMPONENT_AT_SIGHTS_SMG: 'w_at_sights_smg',
    COMPONENT_AT_SCOPE_MACRO_02_SMG_MK2: 'w_at_scope_macro_2_mk2',
    COMPONENT_AT_SCOPE_SMALL_SMG_MK2: 'w_at_scope_small_mk2',
    COMPONENT_MACHINEPISTOL_CLIP_01: 'w_sb_compactsmg_mag1',
    COMPONENT_MACHINEPISTOL_CLIP_02: 'w_sb_compactsmg_mag2',
    COMPONENT_MACHINEPISTOL_CLIP_03: 'w_sb_compactsmg_boxmag',
    COMPONENT_MINISMG_CLIP_01: 'w_sb_minismg_mag1',
    COMPONENT_MINISMG_CLIP_02: 'w_sb_minismg_mag2',
    COMPONENT_TECPISTOL_CLIP_01: 'W_PI_PistolSMG_M31_Mag1',
    COMPONENT_TECPISTOL_CLIP_02: 'W_PI_PistolSMG_M31_Mag2',
    COMPONENT_ASSAULTRIFLE_CLIP_01: 'w_ar_assaultrifle_mag1',
    COMPONENT_ASSAULTRIFLE_CLIP_02: 'w_ar_assaultrifle_mag2',
    COMPONENT_ASSAULTRIFLE_CLIP_03: 'w_ar_assaultrifle_boxmag',
    COMPONENT_ASSAULTRIFLE_MK2_CLIP_01: 'w_ar_assaultriflemk2_mag1',
    COMPONENT_ASSAULTRIFLE_MK2_CLIP_02: 'w_ar_assaultriflemk2_mag2',
    COMPONENT_AT_AR_AFGRIP_02: 'w_at_afgrip_2',
    COMPONENT_AT_SCOPE_MEDIUM_MK2: 'w_at_scope_medium_2',
    COMPONENT_CARBINERIFLE_CLIP_01: 'w_ar_carbinerifle_mag1',
    COMPONENT_CARBINERIFLE_CLIP_02: 'w_ar_carbinerifle_mag2',
    COMPONENT_CARBINERIFLE_CLIP_03: 'w_ar_carbinerifle_boxmag',
    COMPONENT_AT_SCOPE_MEDIUM: 'w_at_scope_medium',
    COMPONENT_AT_AR_SUPP: 'w_at_ar_supp',
    COMPONENT_CARBINERIFLE_MK2_CLIP_01: 'w_ar_carbineriflemk2_mag1',
    COMPONENT_CARBINERIFLE_MK2_CLIP_02: 'w_ar_carbineriflemk2_mag2',
    COMPONENT_ADVANCEDRIFLE_CLIP_01: 'w_ar_advancedrifle_mag1',
    COMPONENT_ADVANCEDRIFLE_CLIP_02: 'w_ar_advancedrifle_mag2',
    COMPONENT_SPECIALCARBINE_CLIP_01: 'w_ar_specialcarbine_mag1',
    COMPONENT_SPECIALCARBINE_CLIP_02: 'w_ar_specialcarbine_mag2',
    COMPONENT_SPECIALCARBINE_CLIP_03: 'w_ar_specialcarbine_boxmag',
    COMPONENT_BULLPUPRIFLE_CLIP_01: 'w_ar_bullpuprifle_mag1',
    COMPONENT_BULLPUPRIFLE_CLIP_02: 'w_ar_bullpuprifle_mag2',
    COMPONENT_COMPACTRIFLE_CLIP_01: 'w_ar_assaultrifle_smg_mag1',
    COMPONENT_COMPACTRIFLE_CLIP_02: 'w_ar_assaultrifle_smg_mag2',
    COMPONENT_COMPACTRIFLE_CLIP_03: 'w_ar_assaultrifle_boxmag',
    COMPONENT_SPECIALCARBINE_MK2_CLIP_01: 'w_ar_specialcarbinemk2_mag1',
    COMPONENT_SPECIALCARBINE_MK2_CLIP_02: 'w_ar_specialcarbinemk2_mag2',
    COMPONENT_BULLPUPRIFLE_MK2_CLIP_01: 'w_ar_bullpupriflemk2_mag1',
    COMPONENT_BULLPUPRIFLE_MK2_CLIP_02: 'w_ar_bullpupriflemk2_mag2',
    COMPONENT_AT_SCOPE_MACRO_02_MK2: 'w_at_scope_macro_2',
    COMPONENT_AT_SCOPE_SMALL_MK2: 'w_at_scope_small',
    COMPONENT_MILITARYRIFLE_CLIP_01: 'w_ar_bullpuprifleh4_mag1',
    COMPONENT_MILITARYRIFLE_CLIP_02: 'w_ar_bullpuprifleh4_mag2',
    COMPONENT_MILITARYRIFLE_SIGHT_01: 'w_ar_bullpuprifleh4_sight',
    COMPONENT_HEAVYRIFLE_CLIP_01: 'W_AR_SpecialCarbine_mag1',
    COMPONENT_HEAVYRIFLE_CLIP_02: 'W_AR_SpecialCarbine_mag2',
    COMPONENT_TACTICALRIFLE_CLIP_01: 'w_ar_carbinerifle_mag1',
    COMPONENT_TACTICALRIFLE_CLIP_02: 'w_ar_carbinerifle_mag2',
    COMPONENT_AT_AR_FLSH_REH: 'W_AT_AR_Flsh_REH',
    COMPONENT_BATTLERIFLE_CLIP_01: 'W_SL_BattleRifle_M32_Mag1',
    COMPONENT_BATTLERIFLE_CLIP_02: 'W_SL_BattleRifle_M32_Mag2',
    COMPONENT_AT_SR_SUPP: 'w_at_sr_supp_2',
    COMPONENT_ASSAULTSHOTGUN_CLIP_01: 'w_sg_assaultshotgun_mag1',
    COMPONENT_ASSAULTSHOTGUN_CLIP_02: 'w_sg_assaultshotgun_mag2',
    COMPONENT_HEAVYSHOTGUN_CLIP_01: 'w_sg_heavyshotgun_mag1',
    COMPONENT_HEAVYSHOTGUN_CLIP_02: 'w_sg_heavyshotgun_mag2',
    COMPONENT_HEAVYSHOTGUN_CLIP_03: 'w_sg_heavyshotgun_boxmag',
    COMPONENT_AT_SR_SUPP_03: 'w_at_sr_supp3',
    COMPONENT_AT_MUZZLE_08: 'w_at_muzzle_8_xm17',
    COMPONENT_MG_CLIP_01: 'w_mg_mg_mag1',
    COMPONENT_MG_CLIP_02: 'w_mg_mg_mag2',
    COMPONENT_AT_SCOPE_SMALL_02: 'w_at_scope_small_2',
    COMPONENT_COMBATMG_CLIP_02: 'w_mg_combatmg_mag2',
    COMPONENT_GUSENBERG_CLIP_01: 'w_sb_gusenberg_mag1',
    COMPONENT_GUSENBERG_CLIP_02: 'w_sb_gusenberg_mag2',
    COMPONENT_COMBATMG_MK2_CLIP_01: 'w_mg_combatmgmk2_mag1',
    COMPONENT_COMBATMG_MK2_CLIP_02: 'w_mg_combatmgmk2_mag2',
    COMPONENT_AT_SCOPE_LARGE: 'w_at_scope_large',
    COMPONENT_AT_SCOPE_MAX: 'w_at_scope_max',
    COMPONENT_HEAVYSNIPER_MK2_CLIP_01: 'w_sr_heavysnipermk2_mag1',
    COMPONENT_HEAVYSNIPER_MK2_CLIP_02: 'w_sr_heavysnipermk2_mag2',
    COMPONENT_AT_SCOPE_LARGE_MK2: 'w_at_scope_large',
    COMPONENT_AT_SCOPE_NV: 'w_at_scope_nv',
    COMPONENT_AT_SCOPE_THERMAL: 'w_at_scope_nv',
    COMPONENT_MARKSMANRIFLE_CLIP_01: 'w_sr_marksmanrifle_mag1',
    COMPONENT_MARKSMANRIFLE_CLIP_02: 'w_sr_marksmanrifle_mag2',
    COMPONENT_AT_SCOPE_LARGE_FIXED_ZOOM: 'w_at_scope_large',
    COMPONENT_MARKSMANRIFLE_MK2_CLIP_01: 'w_sr_marksmanriflemk2_mag1',
    COMPONENT_MARKSMANRIFLE_MK2_CLIP_02: 'w_sr_marksmanriflemk2_mag2',
    COMPONENT_AT_SCOPE_LARGE_FIXED_ZOOM_MK2: 'w_at_scope_large',
};
*/

const weapons = ['weapon_smg', 'weapon_pistol_mk2', 'weapon_revolver_mk2', 'weapon_pumpshotgun'];

@Provider()
export class PropImageProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private send = false;
    private ready = false;
    private box: BoxZone = null;
    private circle: Vector4 = null;

    @Command('image')
    public async image() {
        const player = this.playerService.getPlayer();

        if (player.role != 'admin') {
            return;
        }

        this.nuiDispatch.dispatch('screenshot', 'ready', true);
        this.ready = true;

        const target = [-1264.03, -2982.03, -48.49];
        SetEntityCoords(PlayerPedId(), target[0], target[1], target[2], false, false, false, false);

        const camera = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
        SetCamParams(camera, -1264.03, -2974.03, -47.49, 0, 0, 180, 10, 0, 1, 3, 0);
        RenderScriptCams(true, false, 0, false, false);
        await wait(0);

        const light = await this.objectService.createObject({
            id: 'light',
            model: joaat('prop_spot_01'),
            position: [-1264.03 - 1, -2974.03, -47.49 + 1, 20],
        });

        //for (const [name, model] of Object.entries(props)) {
        for (const name of weapons) {
            this.send = false;
            await wait(20);

            const hash = GetHashKey(name);
            const model = GetWeapontypeModel(hash);
            await this.resourceLoader.loadWeaponAsset(hash);
            await this.resourceLoader.loadModel(model);

            const [mins, maxs] = GetModelDimensions(model);

            const mids = [maxs[0] + mins[0], maxs[1] + mins[1], maxs[2] + mins[2]];
            const size = [maxs[0] - mins[0], maxs[1] - mins[1], maxs[2] - mins[2]];
            const max = Math.max(size[0], size[1], size[2]);

            this.circle = [-1264.03 - mids[0] / 2, -2978.03, -47.49 - mids[2] / 2, 0];

            const item = CreateWeaponObject(name, 0, this.circle[0], this.circle[1], this.circle[2], true, 1, 0);
            /*
            const item = await this.objectService.createObject({
                id: name,
                model: joaat(model),
                position: this.circle,
            });
            */
            this.resourceLoader.unloadModel(model);
            this.resourceLoader.unloadWeaponAsset(hash);

            this.box = new BoxZone([-1264.03, -2976.03, -47.49], size[1], size[0], {
                heading: 0,
                minZ: -47.49 - size[2] / 2,
                maxZ: -47.49 + size[2] / 2,
            });

            await wait(50);
            SetEntityCoordsNoOffset(item, this.circle[0], this.circle[1], this.circle[2], false, false, false);
            SetEntityRotation(item, 0, -10, 45, 2, false);
            SetCamFov(camera, 15 * max);
            await wait(50);

            this.nuiDispatch.dispatch('screenshot', 'screenshot', name);

            await wait(500);
            while (!this.send) {
                await wait(0);
            }

            DeleteEntity(item);
        }

        RenderScriptCams(false, false, 0, false, false);
        DestroyCam(camera, true);
        DeleteEntity(light);

        this.nuiDispatch.dispatch('screenshot', 'ready', false);
        this.ready = false;
        this.box = null;
        this.circle = null;
    }

    @Command('vet')
    public async vet() {
        //in F8
        //allowEmptyHeadDrawable true
        const player = this.playerService.getPlayer();

        if (player.role != 'admin') {
            return;
        }

        this.nuiDispatch.dispatch('screenshot', 'ready', true);
        this.ready = true;

        const target = [-1264.03, -2978.03, -49.49];
        SetEntityCoords(PlayerPedId(), target[0], target[1], target[2], false, false, false, false);

        const camera = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
        SetCamParams(camera, target[0], target[1], target[2] + 4, 0, 0, 180, 10, 0, 1, 3, 0);
        RenderScriptCams(true, false, 0, false, false);
        await wait(0);

        const light = await this.objectService.createObject({
            id: 'light',
            model: joaat('prop_spot_01'),
            position: [-1264.03 - 1, -2974.03, -47.49 + 1, 20],
        });

        for (const model of [/*'mp_m_freemode_01',*/ 'mp_f_freemode_01']) {
            await this.resourceLoader.loadModel(model);
            SetPlayerModel(PlayerId(), model);
            await wait(1000);
            const ped = PlayerPedId();
            FreezeEntityPosition(ped, true);
            SetEntityCoords(ped, target[0], target[1], target[2] + 2, false, false, false, false);
            SetEntityHeading(ped, 0);

            await wait(1000);

            const nbCollection = GetPedCollectionsCount(ped);

            for (const field of ClothingFields) {
                SetPedComponentVariation(ped, 0, -1, 0, 0);
                for (const resetfield of ClothingFields) {
                    if (resetfield.type == 'comp') {
                        SetPedComponentVariation(ped, resetfield.componentId, resetfield.reset[joaat(model)], 0, 0);
                    } else {
                        ClearPedProp(ped, resetfield.propId);
                    }
                }
                console.log('After reset');
                SetEntityHeading(ped, field.camOffset[3]);
                SetCamParams(
                    camera,
                    target[0] + field.camOffset[0],
                    target[1] + field.camOffset[1],
                    target[2] + field.camOffset[2],
                    0,
                    0,
                    180,
                    field.fov,
                    0,
                    1,
                    3,
                    0
                );
                await wait(1000);

                for (let dlcIndex = 0; dlcIndex < nbCollection; dlcIndex++) {
                    const dlcname = GetPedCollectionName(ped, dlcIndex);
                    const max =
                        field.type == 'comp'
                            ? GetNumberOfPedCollectionDrawableVariations(ped, field.componentId, dlcname)
                            : GetNumberOfPedCollectionPropDrawableVariations(ped, field.propId, dlcname);
                    for (let drawable = 0; drawable < max; drawable++) {
                        const isGen9 =
                            field.type == 'comp' &&
                            IsPedCollectionComponentVariationGen9Exclusive(ped, field.componentId, dlcname, drawable);
                        if (isGen9) {
                            continue;
                        }

                        const numTexture =
                            field.type == 'comp'
                                ? GetNumberOfPedCollectionTextureVariations(ped, field.componentId, dlcname, drawable)
                                : GetNumberOfPedCollectionPropTextureVariations(ped, field.propId, dlcname, drawable);

                        for (let texture = 0; texture < numTexture; texture++) {
                            if (field.type == 'comp') {
                                SetPedCollectionComponentVariation(
                                    ped,
                                    field.componentId,
                                    dlcname,
                                    drawable,
                                    texture,
                                    0
                                );
                            } else {
                                SetPedCollectionPropIndex(ped, field.propId, dlcname, drawable, texture, true);
                            }

                            this.send = false;
                            const name = `${model}/${field.type}_${field.type == 'comp' ? field.componentId : field.propId}/${dlcname === '' ? 'base' : dlcname}/${drawable}/${texture}`;
                            console.log(name);
                            await wait(100);
                            this.nuiDispatch.dispatch('screenshot', 'screenshot', name);
                            while (!this.send) {
                                await wait(0);
                            }
                        }
                    }
                }
            }
            break;
        }

        RenderScriptCams(false, false, 0, false, false);
        DestroyCam(camera, true);
        DeleteEntity(light);
        FreezeEntityPosition(PlayerPedId(), false);

        this.nuiDispatch.dispatch('screenshot', 'ready', false);
        this.ready = false;
    }

    @Tick()
    public screenshotTick() {
        if (this.ready) {
            DrawPoly(-1268.03, -2979.03, -51, -1268.03, -2979.03, -36, -1260.03, -2979.03, -51, 0, 255, 0, 255);
            DrawPoly(-1268.03, -2979.03, -36, -1260.03, -2979.03, -36, -1260.03, -2979.03, -51, 0, 255, 0, 255);

            SetIkTarget(PlayerPedId(), 1, PlayerPedId(), 12844, 0.0, 0.0, 0.0, 0, -1, -1); // Kill head to cam heading movement
            ForcePedMotionState(PlayerPedId(), `MotionState_None`, false, 1, true);
        }
        /*
        if (this.box) {
            this.box.draw([255, 0, 0], 120);
        }
        
        if (this.circle) {
            DrawLine(
                this.circle[0],
                this.circle[1],
                this.circle[2],
                -1264.03 + 1,
                -2976.03 + 1,
                -47.49 + 1,
                0,
                0,
                255,
                255
            );
            DrawLine(-1264.03, -2976.03, -47.49, -1264.03 + 1, -2976.03 + 1, -47.49 + 1, 255, 0, 255, 255);
        }
        */
    }

    @OnNuiEvent(NuiEvent.Screenshot)
    public async onScreenShot({ name, data }) {
        TriggerLatentServerEvent(ServerEvent.SCREENSHOT, 1024 * 1024 * 1024, name, data);
        this.send = true;
    }
}
