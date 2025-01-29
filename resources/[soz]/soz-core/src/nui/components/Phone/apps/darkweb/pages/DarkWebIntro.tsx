import { FingerPrintIcon } from '@heroicons/react/solid';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppWrapper } from '../../../components/system/AppWrapper';
import { MatrixRainingEffect } from '../components/MatrixRainingEffect';
import { useDarkWebAPI } from '../hooks/useDarkwebApi';

export const DarkWebIntro = () => {
    const navigate = useNavigate();

    return (
        <AppWrapper>
            <MatrixRainingEffect />

            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col justify-center items-center bg-black/50 rounded-2xl p-4 w-4/5">
                    <h2 className="text-4xl text-teal-500 text-center font-black mb-8 uppercase">Connexion</h2>

                    <FingerPrintIcon
                        className="text-teal-700 hover:text-teal-600 size-16 cursor-pointer animate-pulse"
                        onClick={() => navigate('conversations/')}
                    />
                </div>
            </div>
        </AppWrapper>
    );
};
