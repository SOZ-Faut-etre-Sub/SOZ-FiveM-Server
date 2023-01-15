import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React, { memo } from 'react';

import card from '../assets/satellite.png';
import EmergencyLSMCContainer from './EmergencyLSMCContainer';
import EmergencyUniteHUContainer from './EmergencyUniteHUContainer';

export const EmergencyModal = memo(() => {
    return (
        <FullPageWithHeader className="bg-black bg-opacity-90">
            <div style={{ fontFamily: 'Prompt' }}>
                <img className="m-auto pt-8" src={card} alt="" />
                <div className="flex flex-col justify-center items-center mt-10 text-white">
                    <div className="text-3xl font-light max-w-[90%] truncate">Urgences SOS</div>
                    <div className="text-3xl font-light max-w-[90%] truncate">Via Satellite</div>
                    <ul style={{ listStyleType: 'circle' }} className="text-1xl font-light w-3/4 mt-5 pl-5">
                        <li>L'envoi est instantané</li>
                        <li>Les médecins seront alertés</li>
                        <li>L'Unité Hospitalière d'Urgence est disponible après 15 minutes</li>
                    </ul>
                </div>
                <div className="text-base flex flex-col justify-center items-center mt-10 text-white">
                    Votre position sera envoyée.
                </div>
                <EmergencyLSMCContainer />
                <EmergencyUniteHUContainer />
            </div>
        </FullPageWithHeader>
    );
});
