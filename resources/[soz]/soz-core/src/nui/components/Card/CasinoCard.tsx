import { FunctionComponent } from 'react';

import { useAssetPath } from '../../hook/assets';

type HealthCardProps = {
    type: 'standard' | 'premium';
    expiration: number;
    point: number;
};

export const CasinoCard: FunctionComponent<HealthCardProps> = ({ type, expiration, point }) => {
    const { getPath } = useAssetPath();

    return (
        <div
            style={{
                backgroundImage: `url(${getPath(`images/identity/casino_vip_${type}.webp`)})`,
            }}
            className="transition bg-cover bg-no-repeat aspect-[481/303] h-[340px]"
        >
            <p className="flex justify-between px-[3.3vh] pt-[55%] uppercase italic font-semibold text-white/70 font-kreditback">
                <span>
                    {new Date(expiration).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                    })}
                </span>
                <span>
                    {point} point{point > 1 && 's'}
                </span>
            </p>
        </div>
    );
};
