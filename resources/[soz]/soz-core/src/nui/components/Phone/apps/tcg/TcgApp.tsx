import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { useTcgContacts, useTcgProfile } from './hooks/useTcg';
import { TcgCollection } from './pages/TcgCollection';
import { TcgContactCollection } from './pages/TcgContactCollection';
import { TcgContacts } from './pages/TcgContacts';
import { TcgHome } from './pages/TcgHome';
import { TcgSetup } from './pages/TcgSetup';
import { TcgShowcase } from './pages/TcgShowcase';
import { TcgTrades } from './pages/TcgTrades';
import { TcgViewer } from './pages/TcgViewer';

const TCG_LOGO = 'http://localhost:8080/static/game/images/society/tcg.webp';

const TcgHeader: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contacts, refresh } = useTcgContacts();

    useEffect(() => { refresh(); }, []);

    const isHome = location.pathname === '/tcg' || location.pathname === '/tcg/';
    const pendingContacts = contacts.filter(c => c.status === 'pending' && !c.isSender).length;

    const formatBadge = (count: number): string => {
        if (count <= 0) return '';
        if (count > 9) return '+';
        return count.toString();
    };

    return (
        <div className="flex items-center justify-between px-4 pt-1 pb-1">
            {/* Logo TCG — left */}
            <img src={TCG_LOGO} alt="TCG" className="h-14 object-contain" />

            {/* Center — back button on sub-pages, empty on home */}
            {isHome ? (
                <div />
            ) : (
                <button
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10"
                    onClick={() => navigate('/tcg')}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffb860" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                    <span className="text-[11px] font-semibold" style={{ color: '#ffb860' }}>Accueil</span>
                </button>
            )}

            {/* Contacts icon — right */}
            <div className="relative">
                <button
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ border: '1px solid rgba(255, 184, 96, 0.25)' }}
                    onClick={() => navigate('/tcg/contacts')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </button>
                {pendingContacts > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                        {formatBadge(pendingContacts)}
                    </span>
                )}
            </div>
        </div>
    );
};

const TcgApp: React.FC = () => {
    const { profile, loading, refresh } = useTcgProfile();
    const [ready, setReady] = useState(false);

    useEffect(() => { refresh(); }, []);
    useEffect(() => { if (!loading && profile !== null) setReady(true); }, [loading, profile]);

    if (!ready) return <AppContainer><div className="flex items-center justify-center h-full"><span className="text-sm text-gray-400">Chargement...</span></div></AppContainer>;
    if (!profile?.success) return <AppContainer><TcgSetup onComplete={() => refresh()} /></AppContainer>;

    return (
        <AppContainer>
            <TcgHeader />
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
