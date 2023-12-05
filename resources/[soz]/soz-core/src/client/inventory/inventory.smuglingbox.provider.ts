import { Provider } from '@core/decorators/provider';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';

import { ObjectProvider } from '../object/object.provider';
import { TargetFactory } from '../target/target.factory';

const models = [
    'sm_prop_smug_crate_s_antiques',
    'sm_prop_smug_crate_s_bones',
    'sm_prop_smug_crate_s_fake',
    'sm_prop_smug_crate_s_hazard',
    'sm_prop_smug_crate_s_jewellery',
    'sm_prop_smug_crate_s_medical',
    'sm_prop_smug_crate_s_narc',
    'sm_prop_smug_crate_s_tobacco',
];

@Provider()
export class InventorySmugglingBoxProvider {
    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(ObjectProvider)
    public objectProvider: ObjectProvider;

    @Once(OnceStep.Start)
    public init() {
        this.targetFactory.createForModel(models, [
            {
                label: 'Ouvrir',
                icon: 'c:inventory/ouvrir_le_stockage.png',
                color: 'crimi',
                canInteract: entity => {
                    return !!this.objectProvider.getIdFromEntity(entity);
                },
                action: entity => {
                    const id = this.objectProvider.getIdFromEntity(entity);
                    TriggerServerEvent('inventory:server:openInventory', 'smuggling_box', id);
                },
            },
        ]);
    }
}
