import { Exportable } from '@core/decorators/exports';
import { Provider } from '@core/decorators/provider';

@Provider()
export class MockProvider {
    @Exportable('HasTemporaryCrimiWeight')
    public hasTemporaryCrimiWeight(): boolean {
        return false;
    }
}
