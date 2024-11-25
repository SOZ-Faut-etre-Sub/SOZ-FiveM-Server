import { ALL_LOCATIONS } from '../../../config/ceremony';
import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { uuidv4, wait } from '../../../core/utils';
import { ClientEvent } from '../../../shared/event/client';
import { add2Vector3, Vector3 } from '../../../shared/polyzone/vector';
import { CameraService } from '../../camera';
import { ObjectService } from '../../object/object.service';

@Provider()
export class Election2024CeremonyProvider {
    @Inject(CameraService)
    private readonly cameraService: CameraService;

    @Inject(ObjectService)
    private objectService: ObjectService;

    private skyOffset: Vector3 = [0, 0, 3000];

    private camera: number;

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(): Promise<void> {
        for (const location of ALL_LOCATIONS) {
            for (const firework of location.fireworks) {
                await this.objectService.createObject({
                    id: uuidv4(),
                    model: GetHashKey('ind_prop_firework_03'),
                    position: firework.trigger,
                    placeOnGround: true,
                });
            }
        }
    }

    @OnEvent(ClientEvent.CEREMONY_CREATE_CAMERA)
    async createCamera() {
        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;

        this.camera = this.cameraService.createCamera(add2Vector3(playerPosition, this.skyOffset));
        this.cameraService.setCameraPointAt(this.camera, playerPosition);

        this.cameraService.setCameraActive(this.camera, true);
        this.cameraService.renderCamera();
    }

    @OnEvent(ClientEvent.CEREMONY_SET_CAMERA)
    async setCamera(position: Vector3, target: Vector3) {
        DoScreenFadeOut(500);
        await wait(500);

        this.cameraService.setCameraPosition(this.camera, position);
        this.cameraService.setCameraPointAt(this.camera, target);
        this.cameraService.renderCamera();

        await wait(1_000);
        DoScreenFadeIn(500);
    }

    @OnEvent(ClientEvent.CEREMONY_MOVE_CAMERA)
    async moveCamera(position: Vector3, rotation: Vector3, duration: number) {
        this.cameraService.updateCameraPosition(this.camera, position, rotation, duration);
        this.cameraService.renderCamera();
    }

    @OnEvent(ClientEvent.CEREMONY_DELETE_CAMERA)
    async deleteCamera() {
        this.cameraService.deleteCamera();
    }
}
