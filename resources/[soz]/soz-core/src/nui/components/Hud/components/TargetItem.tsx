import { FunctionComponent, useMemo } from 'react';

import { NuiEvent } from '../../../../shared/event/nui';
import { TargetOption } from '../../../../shared/target';
import { fetchNui } from '../../../fetch';
import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

export const TargetItem: FunctionComponent<TargetOption & { onSelect: () => void }> = ({
    id,
    icon,
    label,
    subLabel,
    onSelect,
}) => {
    const handleClick = async () => {
        onSelect();
        await fetchNui(NuiEvent.TargetSelect, id);
    };

    const imageUrl = useMemo(() => {
        if (!icon) return null;

        return `/public/images/target/${icon}.webp`;
    }, [icon]);

    return (
        <div className="h-12 w-full cursor-pointer" onClick={handleClick}>
            <GlassMorphismContainer
                borderClassName="rounded-full"
                className="flex items-center gap-3 px-5 h-12 w-fit"
                disableBorder
                showBorderOnHover
            >
                {imageUrl && <img className="size-8" src={imageUrl} alt="" />}

                <div className="flex flex-col">
                    <span className="truncate">{label}</span>
                    {subLabel && <span className="text-sm opacity-75">{subLabel}</span>}
                </div>
            </GlassMorphismContainer>
        </div>
    );
};
