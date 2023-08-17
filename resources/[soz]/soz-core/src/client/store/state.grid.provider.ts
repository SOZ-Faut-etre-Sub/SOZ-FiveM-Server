import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { getGridChunks } from '../../shared/grid';
import { Vector3 } from '../../shared/polyzone/vector';
import { Store } from './store';

@Provider()
export class StateGridProvider {
    @Inject('Store')
    private store: Store;

    @Tick(1000)
    public checkGridChunks() {
        const currentChunks = this.store.getState().grid;
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const newChunks = getGridChunks(position);

        const diffAdded = newChunks.filter(chunk => !currentChunks.includes(chunk));
        const diffRemoved = currentChunks.filter(chunk => !newChunks.includes(chunk));

        if (diffAdded.length > 0 || diffRemoved.length > 0) {
            this.store.dispatch.grid.set(newChunks);
        }
    }
}
