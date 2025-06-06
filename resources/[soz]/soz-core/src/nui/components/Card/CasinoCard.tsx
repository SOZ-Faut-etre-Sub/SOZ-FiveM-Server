import { FunctionComponent } from 'react';

import { useAssetPath } from '../../hook/assets';

type HealthCardProps = {
    type: 'standard' | 'premium';
    expiration: number;
    point: number;
};

export const CasinoCard: FunctionComponent<HealthCardProps> = ({ expiration, point }) => {
    const { getPath } = useAssetPath();

    return (
        <div
            style={{
                backgroundImage: `url(${getPath(`images/identity/bank.webp`)})`,
            }}
            className="transition bg-cover bg-no-repeat aspect-[855/539] h-[340px]"
        >
            <div className="flex pt-[33%] pl-[3.3vh] text-2xl uppercase text-[#4fd954] font-kreditblack">
                {expiration}
            </div>
            <p className="pl-[3.3vh] pt-[12%] uppercase italic font-bold text-white font-kreditback">{point}</p>
        </div>
    );
};
