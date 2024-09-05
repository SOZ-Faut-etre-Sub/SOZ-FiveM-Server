import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event/nui';
import { TargetOption } from '../../../../shared/target';
import { fetchNui } from '../../../fetch';
import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

export const TargetItem: FunctionComponent<TargetOption> = ({ id, label }) => {
    const handleClick = async () => {
        await fetchNui(NuiEvent.TargetSelect, id);
    };

    return (
        <div className="h-12 w-fit cursor-pointer" onClick={handleClick}>
            <GlassMorphismContainer
                borderClassName="rounded-full"
                className="flex items-center gap-2 px-5 h-12 w-fit"
                disableBorder
                showBorderOnHover
            >
                {label}
            </GlassMorphismContainer>
        </div>
    );
};
