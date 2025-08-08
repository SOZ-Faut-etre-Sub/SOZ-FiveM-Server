import clsx from 'clsx';
import { useSelector } from 'react-redux';

import { useAssetPath } from '../../../../hook/assets';
import { RootState } from '../../../../store';
import { AppContainer } from '../../components/system/AppContainer';
import { LSMCButton } from './components/LSMCButton';
import { UHUButton } from './components/UHUButton';
import { useDeathReason } from './emergency.atom';

export const EmergencyApp = () => {
    const { getPath } = useAssetPath();

    const whatIf2Enabled = useSelector((state: RootState) => state.features.WhatIfSecondEpisode);

    const deathReason = useDeathReason();
    const isDead = Boolean(deathReason?.length);

    return (
        <AppContainer
            className={clsx('font-prompt text-white', {
                'bg-red-500/90': isDead,
                'bg-black/90': !isDead,
            })}
            disableBackground
            forceControlColor="light"
        >
            <img
                alt=""
                className="w-4/5 mx-auto p-8"
                src={getPath(`images/phone/apps/emergency/${isDead ? 'dead' : 'satellite'}.webp`)}
            />

            <div className="flex flex-col justify-between h-full pb-20">
                {isDead ? (
                    <div className="flex flex-col justify-center items-center text-white">
                        <div className="text-3xl font-light max-w-[90%] truncate">Status : MORT</div>
                        <div className="text-xl font-light max-w-[90%] truncate">Cause : {deathReason}</div>
                        <ul style={{ listStyleType: 'circle' }} className="text-1xl font-light w-3/4 mt-5 pl-5">
                            <li>Les services administratifs ont été prévenus</li>
                            <li>Les médecins seront alertés</li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center text-white">
                        <div className="text-3xl font-light max-w-[90%] truncate">Urgences SOS</div>
                        <div className="text-3xl font-light max-w-[90%] truncate">Via Satellite</div>
                        {!whatIf2Enabled && (
                            <ul style={{ listStyleType: 'circle' }} className="text-1xl font-light w-3/4 mt-5 pl-5">
                                <li>L'envoi est instantané</li>
                                <li>Les médecins seront alertés</li>
                                <li>L'Unité Hospitalière d'Urgence est disponible après 15 minutes</li>
                            </ul>
                        )}
                    </div>
                )}

                <div>
                    {!whatIf2Enabled && (
                        <div className="text-base flex flex-col justify-center items-center text-white">
                            Votre position sera envoyée.
                        </div>
                    )}

                    <div className="flex flex-col justify-center items-center gap-2 mx-5">
                        <LSMCButton />
                        {!isDead && <UHUButton />}
                    </div>
                </div>
            </div>
        </AppContainer>
    );
};
