import { RepositoryDelete, RepositoryInsert } from '@public/core/decorators/repository';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { ModelSwap } from '@public/shared/modelswap';
import { NotEmptyStringValidator, PositiveNumberValidator } from '@public/shared/nui/input';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RepositoryType } from '@public/shared/repository';

import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { InputService } from '../nui/input.service';
import { ObjectProvider } from '../object/object.provider';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { ModelSwapRepository } from '../repository/modelswap.repository';

@Provider()
export class ModelSwapProvider {
    @Inject(ModelSwapRepository)
    private modelSwapRepository: ModelSwapRepository;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Once(OnceStep.RepositoriesLoaded)
    public async onStartModelSwap() {
        const swaps = this.modelSwapRepository.get();
        this.modelSwapRepository.load();

        for (const swap of swaps) {
            this.createSwap(swap);
        }

        await this.objectProvider.setupObjects();
    }

    @RepositoryInsert(RepositoryType.ModelSwap)
    public async onInsert(swap: ModelSwap) {
        this.createSwap(swap);

        await this.objectProvider.createSwap(swap);
    }

    private createSwap(swap: ModelSwap) {
        this.modelSwapRepository.addSwap(swap);
        if (swap.target) {
            CreateModelSwap(
                swap.position[0],
                swap.position[1],
                swap.position[2],
                (swap.range * swap.range) / 160 - 4, //For some reasons, the radius is non linear
                swap.source,
                swap.target,
                true
            );
        } else {
            CreateModelHide(swap.position[0], swap.position[1], swap.position[2], swap.range, swap.source, true);
        }
    }

    @RepositoryDelete(RepositoryType.ModelSwap)
    public async onDelete(swap: ModelSwap) {
        this.modelSwapRepository.removeSwap(swap);
        if (swap.target) {
            RemoveModelSwap(
                swap.position[0],
                swap.position[1],
                swap.position[2],
                (swap.range * swap.range) / 160 - 4,
                swap.source,
                swap.target,
                false
            );
        } else {
            RemoveModelHide(swap.position[0], swap.position[1], swap.position[2], swap.range, swap.source, false);
        }

        await this.objectProvider.removeSwap(swap);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperModelSwapAdd)
    public async onAdminSwapAdd() {
        const source = await this.inputService.askInput(
            {
                title: 'Modèle à remplacer',
            },
            NotEmptyStringValidator
        );

        if (!source) {
            return;
        }

        const target = await this.inputService.askInput({
            title: 'Modèle de remplacement ou vide pour cacher',
        });

        const range = await this.inputService.askInput(
            {
                title: 'Portée',
            },
            PositiveNumberValidator
        );

        if (!range) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_SWAPMODEL_ADD, source, target, range, GetEntityCoords(PlayerPedId()));
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperModelSwapDelete)
    public async onAdminSwapDelete(id: number) {
        TriggerServerEvent(ServerEvent.ADMIN_SWAPMODEL_DELETE, id);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperModelSwapTeleport)
    public async onAdminSwapTeleport(coords: Vector3) {
        this.playerPositionProvider.teleportAdminToPosition([coords[0], coords[1], coords[2], 0]);
    }
}
