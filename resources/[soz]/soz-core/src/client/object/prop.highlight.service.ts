import { Injectable } from '@public/core/decorators/injectable';

@Injectable()
export class PropHighlightService {
    private highlightedEntities: number[] = [];

    public highlightEntities(entities: number[]) {
        SetEntityDrawOutlineColor(0, 180, 0, 255);
        SetEntityDrawOutlineShader(1);
        for (const entity of entities) {
            SetEntityDrawOutline(entity, true);
            this.highlightedEntities.push(entity);
        }
    }

    public unhighlightAllEntities() {
        for (const entity of this.highlightedEntities) {
            SetEntityDrawOutline(entity, false);
        }
        this.highlightedEntities = [];
    }
}
