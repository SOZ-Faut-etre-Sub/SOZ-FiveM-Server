import { Once, OnceStep, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { RepositoryDelete, RepositoryUpdate } from '@public/core/decorators/repository';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { NotEmptyStringValidator, PositiveNumberValidator } from '@public/shared/nui/input';
import { MenuType } from '@public/shared/nui/menu';
import { RepositoryType } from '@public/shared/repository';
import { TravelingCamera, TravelingPoint } from '@public/shared/traveling';

import { DrawService } from '../draw.service';
import { HudStateProvider } from '../hud/hud.state.provider';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { ObjectEditorProvider } from '../object/object.editor.provider';
import { ObjectService } from '../object/object.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { CameraTravelingRepository } from '../repository/camera.traveling.repositoty';

@Provider()
export class TravelingCameraProvider {
    @Inject(ObjectEditorProvider)
    private objectEditorProvider: ObjectEditorProvider;

    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(CameraTravelingRepository)
    private cameraTravelingRepository: CameraTravelingRepository;

    @Inject(HudStateProvider)
    private hudStateProvider: HudStateProvider;

    @Inject(DrawService)
    private drawService: DrawService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private drawId: number = null;
    private entityIds: number[] = [];

    @OnNuiEvent(NuiEvent.MenuClosed)
    public async onClosed(type: MenuType) {
        if (type === MenuType.Traveling) {
            this.travelingStopEditing();
        }
    }

    @Once(OnceStep.Stop)
    public onStop() {
        for (const obj of this.entityIds.values()) {
            DeleteEntity(obj);
        }
    }

    @OnNuiEvent(NuiEvent.TravelingLaunch)
    public async traveling(id: number) {
        this.nuiMenu.closeMenu();
        this.hudStateProvider.setHudVisible(false);

        const inputs = this.cameraTravelingRepository.find(id).points;
        let prevCam = null;
        for (const point of inputs) {
            const newCam = CreateCamWithParams(
                'DEFAULT_SCRIPTED_CAMERA',
                point.position[0],
                point.position[1],
                point.position[2],
                -point.rotation[1],
                point.rotation[0],
                point.rotation[2] + 270,
                point.fov,
                false,
                2
            );
            if (prevCam) {
                SetCamActiveWithInterp(newCam, prevCam, point.wait, 1, 1);
            } else {
                SetCamActive(newCam, true);
                RenderScriptCams(true, true, 0, true, false);
            }
            SetFocusArea(point.position[0], point.position[1], point.position[2], 0, 0, 0);
            await wait(point.wait);
            if (prevCam) {
                DestroyCam(prevCam, true);
            }
            prevCam = newCam;
        }

        DestroyCam(prevCam, true);
        RenderScriptCams(false, false, 0, false, false);
        ClearFocus();

        this.nuiMenu.openMenu(MenuType.Traveling, null, {
            subMenuId: id.toString(),
        });
        this.hudStateProvider.setHudVisible(true);
    }

    @OnNuiEvent(NuiEvent.TravelingAdd)
    public async travelingAdd() {
        const name = await this.inputService.askInput(
            {
                title: 'Nom du traveling',
            },
            NotEmptyStringValidator
        );

        if (!name) {
            return;
        }

        TriggerServerEvent(ServerEvent.TRAVELING_ADD, name);
    }

    @OnNuiEvent(NuiEvent.TravelingDelete)
    public async travelingDelete(id: number) {
        const name = await this.inputService.askConfirm('Veuillez confimer la suppression du traveling (OUI)');

        if (!name) {
            return;
        }

        TriggerServerEvent(ServerEvent.TRAVELING_DELETE, id);
    }

    @OnNuiEvent(NuiEvent.TravelingPointAdd)
    public async travelingPointAdd({ id, index }: { id: number; index: number }) {
        const object = await this.objectEditorProvider.createOrUpdateObject(GetHashKey('prop_v_cam_01'), {
            snapToGround: false,
            collision: false,
            maxDistance: 50,
        });
        if (!object) {
            return;
        }

        TriggerServerEvent(ServerEvent.TRAVELING_POINT_ADD, id, index, {
            position: [object.position[0], object.position[1], object.position[2]],
            rotation: [object.rotation[0], object.rotation[1], object.rotation[2]],
            fov: 60,
            delay: 1000,
            wait: 1000,
        });
    }

    @OnNuiEvent(NuiEvent.TravelingPointUpdate)
    public async travelingUpdate({ id, index, option }: { id: number; index: number; option: string }) {
        const point: TravelingPoint = { ...this.cameraTravelingRepository.find(id).points[index] };
        switch (option) {
            case 'editPos': {
                const object = await this.objectEditorProvider.createOrUpdateObject(
                    GetHashKey('prop_v_cam_01'),
                    {
                        snapToGround: false,
                        collision: false,
                        maxDistance: 50,
                    },
                    {
                        id: 'fake',
                        model: GetHashKey('prop_v_cam_01'),
                        position: [point.position[0], point.position[1], point.position[2], 0],
                        rotation: [point.rotation[0], point.rotation[1], point.rotation[2]],
                        rotationOrder: 2,
                    }
                );
                if (!object) {
                    return;
                }

                point.position = [object.position[0], object.position[1], object.position[2]];
                point.rotation = [object.rotation[0], object.rotation[1], object.rotation[2]];

                break;
            }
            case 'editFov': {
                const fov = await this.inputService.askInput(
                    {
                        title: 'FOV',
                        defaultValue: point.fov.toString(),
                    },
                    PositiveNumberValidator
                );

                if (!fov) {
                    return;
                }

                point.fov = fov;

                break;
            }
            case 'editDelay': {
                const wait = await this.inputService.askInput(
                    {
                        title: 'Délai',
                        defaultValue: point.wait.toString(),
                    },
                    PositiveNumberValidator
                );

                if (wait == null) {
                    return;
                }

                point.wait = wait;

                break;
            }
            case 'delete': {
                TriggerServerEvent(ServerEvent.TRAVELING_POINT_DELETE, id, index);
                return;
            }
            case 'tp': {
                this.playerPositionProvider.teleportAdminToPosition([
                    point.position[0],
                    point.position[1],
                    point.position[2],
                    point.rotation[2],
                ]);
                return;
            }
        }

        TriggerServerEvent(ServerEvent.TRAVELING_POINT_UPDATE, id, index, point);
    }

    @OnNuiEvent(NuiEvent.TravelingStartEditing)
    public async travelingStartEditing(id: number) {
        const inputs = this.cameraTravelingRepository.find(id).points;

        for (const point of inputs) {
            const object = await this.objectService.createObject({
                id: 'fake',
                model: GetHashKey('prop_v_cam_01'),
                position: [point.position[0], point.position[1], point.position[2], 0],
                rotation: [point.rotation[0], point.rotation[1], point.rotation[2]],
                rotationOrder: 2,
                alpha: 180,
            });

            this.entityIds.push(object);
        }
        this.drawId = id;
    }

    @Tick()
    public travelingPointsDisplay() {
        if (!this.drawId) {
            return;
        }

        const traveling = this.cameraTravelingRepository.find(this.drawId);
        if (!traveling) {
            return;
        }

        const inputs = traveling.points;

        let i = 0;
        for (const point of inputs) {
            if (i != 0) {
                DrawLine(
                    inputs[i - 1].position[0],
                    inputs[i - 1].position[1],
                    inputs[i - 1].position[2],
                    point.position[0],
                    point.position[1],
                    point.position[2],
                    255,
                    0,
                    0,
                    255
                );
            }
            this.drawService.drawText3d(point.position, (++i).toString());
        }
    }

    @OnNuiEvent(NuiEvent.TravelingStopEditing)
    public async travelingStopEditing() {
        delete this.drawId;
        for (const obj of this.entityIds) {
            DeleteEntity(obj);
        }
        this.entityIds = [];
    }

    @OnNuiEvent(NuiEvent.TravelingRename)
    public async travelingRemane(id: number) {
        const traveling = this.cameraTravelingRepository.find(id);
        const newName = await this.inputService.askInput(
            {
                title: 'Nouveau nom',
                defaultValue: traveling.name,
            },
            NotEmptyStringValidator
        );

        if (!newName) {
            return;
        }

        TriggerServerEvent(ServerEvent.TRAVELING_RENAME, id, newName);
    }

    @RepositoryDelete(RepositoryType.Traveling)
    public async onDelete(traveling: TravelingCamera) {
        if (this.drawId == traveling.id) {
            this.travelingStopEditing();
        }
    }

    @RepositoryUpdate(RepositoryType.Traveling)
    public async onUpdate(traveling: TravelingCamera) {
        if (this.drawId == traveling.id) {
            await this.travelingStopEditing();
            await this.travelingStartEditing(traveling.id);
        }
    }
}
