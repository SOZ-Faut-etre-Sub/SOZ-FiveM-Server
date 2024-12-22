import { LockClosedIcon } from '@heroicons/react/outline';
import { AppContent } from '@ui/components/AppContent';
import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UseDarkwebAPI } from '../hooks/useDarkwebApi';

export const DarkWebIntro = memo(() => {
    const navigate = useNavigate();
    const { getConversations } = UseDarkwebAPI();

    useEffect(() => {
        getConversations();
    }, []);

    return (
        <AppContent className="h-full w-full flex justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center">
                <h2 className="text-4xl text-teal-500 text-center font-black mb-8 uppercase">Connexion</h2>

                <LockClosedIcon
                    className={`text-teal-700 hover:text-teal-400 h-[6vh] w-[6vh] cursor-pointer`}
                    onClick={() => navigate('conversations/')}
                />
            </div>
        </AppContent>
    );
});
