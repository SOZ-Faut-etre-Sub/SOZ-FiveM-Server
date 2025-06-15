import { Delete, Post } from '../../core/decorators/http';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Request } from '../../core/http/request';
import { Response } from '../../core/http/response';
import { SceneLiveElement } from '../../shared/scene';
import { SceneLiveRepository } from '../repository/scene.live.repository';

@Provider()
export class SceneLiveProvider {
    @Inject(SceneLiveRepository)
    private sceneLiveRepository: SceneLiveRepository;

    @Post('/live/element')
    public async setElement(request: Request): Promise<Response> {
        const elements = JSON.parse(await request.body) as SceneLiveElement[];
        const elementsMap = {};

        for (const element of elements) {
            elementsMap[element.id] = {
                ...element,
                timestamp: new Date().getTime(),
            };
        }

        await this.sceneLiveRepository.mset(elementsMap);

        return new Response(204);
    }

    @Delete('/live/element')
    public async deleteElements(request: Request): Promise<Response> {
        const elementIds = JSON.parse(await request.body) as string[];

        for (const elementId of elementIds) {
            this.sceneLiveRepository.delete(elementId);
        }

        return new Response(204);
    }
}
