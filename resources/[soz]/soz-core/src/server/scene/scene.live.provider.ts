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
        const element = JSON.parse(await request.body) as SceneLiveElement;

        await this.sceneLiveRepository.set(element.id, element);

        return new Response(204);
    }

    @Delete('/live/element')
    public async deleteElement(request: Request): Promise<Response> {
        const elementId = JSON.parse(await request.body) as string;
        this.sceneLiveRepository.delete(elementId);

        return new Response(204);
    }
}
