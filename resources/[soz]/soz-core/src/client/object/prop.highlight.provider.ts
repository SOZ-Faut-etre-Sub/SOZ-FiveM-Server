import { Provider } from '@public/core/decorators/provider';

@Provider()
export class PropHighlightProvider {
    private highlightedEntities: number[] = [];

    public async highlightEntities(entities: number[]) {
        SetEntityDrawOutlineColor(0, 180, 0, 255);
        SetEntityDrawOutlineShader(1);
        for (const entity of entities) {
            SetEntityDrawOutline(entity, true);
            this.highlightedEntities.push(entity);
        }
    }

    public async unhighlightAllEntities() {
        for (const entity of this.highlightedEntities) {
            SetEntityDrawOutline(entity, false);
        }
        this.highlightedEntities = [];
    }
}
