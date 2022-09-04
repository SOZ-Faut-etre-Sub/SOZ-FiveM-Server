import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { TargetFactory } from './target.factory';

@Provider()
export class TargetProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.Stop)
    stop(): void {}
}
