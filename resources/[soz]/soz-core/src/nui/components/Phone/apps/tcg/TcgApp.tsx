import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { useTcgProfile } from './hooks/useTcg';
import { TcgCollection } from './pages/TcgCollection';
import { TcgContactCollection } from './pages/TcgContactCollection';
import { TcgContacts } from './pages/TcgContacts';
import { TcgHome } from './pages/TcgHome';
import { TcgSetup } from './pages/TcgSetup';
import { TcgShowcase } from './pages/TcgShowcase';
import { TcgTrades } from './pages/TcgTrades';
import { TcgViewer } from './pages/TcgViewer';

const TcgApp: React.FC = () => {
    const { profile, loading, refresh } = useTcgProfile();
    const [ready, setReady] = useState(false);

    useEffect(() => { refresh(); }, []);
    useEffect(() => { if (!loading && profile !== null) setReady(true); }, [loading, profile]);

    if (!ready) return <AppContainer><div className="flex items-center justify-center h-full"><span className="text-sm text-gray-400">Chargement...</span></div></AppContainer>;
    if (!profile?.success) return <AppContainer><TcgSetup onComplete={() => refresh()} /></AppContainer>;

    return (
        <AppContainer>
            <Routes>
                <Route index element={<TcgHome username={profile.username} />} />
                <Route path="collection" element={<TcgCollection />} />
                <Route path="view/:userCardId" element={<TcgViewer />} />
                <Route path="contacts" element={<TcgContacts />} />
                <Route path="contacts/:citizenid/collection" element={<TcgContactCollection />} />
                <Route path="trades" element={<TcgTrades />} />
                <Route path="showcase" element={<TcgShowcase />} />
            </Routes>
        </AppContainer>
    );
};

export default TcgApp;
