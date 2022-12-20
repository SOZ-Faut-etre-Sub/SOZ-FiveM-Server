import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { DrivingSchoolConfig } from '../../shared/driving-school';
import { ClientEvent } from '../../shared/event';
import { BlipFactory } from '../blip';
import { TargetFactory, TargetOptions } from '../target/target.factory';

@Provider()
export class DrivingSchoolProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        const secretaryPedConfig = DrivingSchoolConfig.peds.secretary;
        this.targetFactory.createForPed({
            ...secretaryPedConfig,
            target: { options: this.getTargetOptions(), distance: 2.5 },
        });

        const blipConfig = DrivingSchoolConfig.blip;
        this.blipFactory.create('displayDrivingSchoolBlip', {
            name: blipConfig.name,
            coords: secretaryPedConfig.coords,
            sprite: blipConfig.sprite,
            color: blipConfig.color,
            scale: blipConfig.scale,
        });
    }

    private getTargetOptions(): TargetOptions[] {
        const targetOptions: TargetOptions[] = [];
        const licensesConfig = DrivingSchoolConfig.licenses;

        Object.entries(licensesConfig).forEach(([licenseType, data]) => {
            targetOptions.push({
                license: licenseType,
                label: `${data.label} ($${data.price})`,
                icon: data.icon,
                event: ClientEvent.DRIVING_SCHOOL_START_EXAM,
                blackoutGlobal: true,
            });
        });

        return targetOptions;
    }
}
