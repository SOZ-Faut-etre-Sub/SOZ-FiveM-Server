import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Zone } from '../../shared/polyzone/box.zone';
import { TargetOption } from '../../shared/target';
import { TargetFactory } from './target.factory';

@Provider()
export class TargetFactoryProvider {
    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Exportable('AddBoxZone')
    public addBoxZone(id: string, zone: Zone<any>, targets: TargetOption[], distance?: number) {
        this.targetFactory.createForBoxZone(id, zone, targets, distance);
    }

    @Exportable('RemoveZone')
    public removeZone(id: string) {
        this.targetFactory.removeBoxZone(id);
    }

    @Exportable('AddTargetModel')
    public addTargetModel(prop: string, targets: TargetOption[], distance?: number) {
        this.targetFactory.createForModel(prop, targets, distance);
    }
}
