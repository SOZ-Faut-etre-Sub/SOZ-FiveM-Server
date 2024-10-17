import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait, waitUntil } from '../../core/utils';
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

    private skyOffset: Vector3 = [0, 0, 3000];
    private southLocation: Vector3 = [-147.99, -961.44, 268.95];

    private locationSelected: string = null;

    @OnNuiEvent(NuiEvent.PickerSelect)
    public async onPickerSelect(id: string) {
        this.locationSelected = id;
    }

    public async showSouthLocationPicker(locations: MapPickerLocation[]): Promise<MapPickerLocation> {
        SetCloudHatOpacity(0.0);

        this.cameraService.deleteCamera();
        this.cameraService.setupCamera(add2Vector3(this.southLocation, this.skyOffset), this.southLocation);

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

    public hideLocationPicker() {
        SetCloudHatOpacity(1.0);
        this.locationSelected = null;
        this.nuiDispatch.dispatch('picker', 'map', []);
        this.cameraService.deleteCamera();
    }
}
