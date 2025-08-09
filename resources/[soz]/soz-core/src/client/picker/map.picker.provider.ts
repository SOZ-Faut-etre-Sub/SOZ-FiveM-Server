import { OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { wait, waitUntil } from '@core/utils';

import { NuiEvent } from '../../shared/event/nui';
import { MapPickerLocation, NuiMapPickerLocation } from '../../shared/picker';
import { add2Vector3, Vector3 } from '../../shared/polyzone/vector';
import { CameraService } from '../camera';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ScreenService } from '../screen.service';

@Provider()
export class MapPickerProvider {
    @Inject(CameraService)
    private readonly cameraService: CameraService;

    @Inject(ScreenService)
    private readonly screenService: ScreenService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private centerPosition: Vector3 = [533.75, 2383.51, 48.18];
    private centerSkyOffset: Vector3 = [0, 0, 2000];

    private southPosition: Vector3 = [-147.99, -961.44, 268.95];
    private southSkyOffset: Vector3 = [0, 0, 3000];

    private globalPosition: Vector3 = [0, 1555.414, 324.8574];
    private globalSkyOffset: Vector3 = [-1, 0, 2500];

    private locationSelected: string = null;

    @OnNuiEvent(NuiEvent.PickerSelect)
    public async onPickerSelect(id: string) {
        this.locationSelected = id;
    }

    public async showGlobalLocationPicker(locations: MapPickerLocation[]): Promise<MapPickerLocation> {
        return this.showLocationPicker(locations, this.globalPosition, this.globalSkyOffset);
    }

    public async showCenterLocationPicker(locations: MapPickerLocation[]): Promise<MapPickerLocation> {
        return this.showLocationPicker(locations, this.centerPosition, this.centerSkyOffset);
    }

    public async showSouthLocationPicker(locations: MapPickerLocation[]): Promise<MapPickerLocation> {
        return this.showLocationPicker(locations, this.southPosition, this.southSkyOffset);
    }

    private async showLocationPicker(locations: MapPickerLocation[], position: Vector3, skyOffset: Vector3) {
        SetCloudHatOpacity(0.0);

        this.cameraService.deleteAllCameras();
        const cam = this.cameraService.setupCamera(add2Vector3(position, skyOffset), position);
        this.cameraService.setCameraFov(cam, 100);
        this.cameraService.renderCamera();

        await wait(2000);

        this.nuiDispatch.dispatch(
            'picker',
            'map',
            locations.map(
                location =>
                    ({
                        ...location,
                        coords: this.screenService.world3DToScreen2D(location.coords),
                    }) as NuiMapPickerLocation
            )
        );

        await waitUntil(async () => this.locationSelected !== null);
        const location = locations.find(location => location.id === this.locationSelected);

        this.hideLocationPicker();
        return location;
    }

    private hideLocationPicker() {
        SetCloudHatOpacity(1.0);
        this.locationSelected = null;
        this.nuiDispatch.dispatch('picker', 'map', []);
        this.cameraService.deleteAllCameras();
    }
}
