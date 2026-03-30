import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { useAssetPath } from '../../../../hook/assets';
import { useTcgContacts, useTcgDailyStatus, useTcgProfile, useTcgTrades } from './hooks/useTcg';
import { TcgCollection } from './pages/TcgCollection';
import { TcgContactCollection } from './pages/TcgContactCollection';
import { TcgContacts } from './pages/TcgContacts';
import { TcgHome } from './pages/TcgHome';
import { TcgHub } from './pages/TcgHub';
import { TcgMarket } from './pages/TcgMarket';
import { TcgProfile } from './pages/TcgProfile';
import { TcgSetup } from './pages/TcgSetup';
import { TcgViewer } from './pages/TcgViewer';

// ---- Header ----

const TcgHeader: React.FC<{ username: string }> = ({ username }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contacts, refresh: refreshContacts } = useTcgContacts();
    const { status, refresh: refreshStatus } = useTcgDailyStatus();
    const { trades, refresh: refreshTrades } = useTcgTrades();
    const { getPath } = useAssetPath();

    useEffect(() => {
        refreshContacts();
        refreshStatus();
        refreshTrades();
    }, []);

    const pendingContacts = contacts.filter(c => c.status === 'pending' && !c.isSender).length;
    const freeClaims = status?.availableClaims ?? 0;
    const pendingTrades = trades.filter(t => t.status === 'pending' && t.isReceiver).length;

    // Detect which tab is active
    const path = location.pathname;
    const isHome = path === '/tcg' || path === '/tcg/';
    const isSubPage = path.startsWith('/tcg/') && !isHome;
    const isHubOrDeep = path.startsWith('/tcg/hub') || path.startsWith('/tcg/market') || path.startsWith('/tcg/contacts')
        || path.startsWith('/tcg/collection') || path.startsWith('/tcg/view') || path.startsWith('/tcg/profile/');

    // Tabs state: managed via query param ?tab=
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') ?? 'global';

    const setTab = (tab: string) => {
        navigate(`/tcg?tab=${tab}`, { replace: true });
    };

    return (
        <div className="flex flex-col">
            {/* Top row: logo + card icon | course icon + contacts icon */}
            <div className="flex items-center justify-between px-3 pt-1 pb-0">
                {/* Left: logo + card icon (hub link) */}
                <div className="flex items-center gap-2">
                    <img
                        src={getPath('images/society/tcg.webp')}
                        alt="TCG"
                        className="h-10 object-contain cursor-pointer"
                        onClick={() => navigate('/tcg')}
                    />
                    {/* Card icon with dual notification bubbles */}
                    <div className="relative cursor-pointer" onClick={() => navigate('/tcg/hub')}>
                        <img
                            src={getPath('images/phone/apps/tcg/cards.webp')}
                            alt="Hub"
                            className="w-8 h-8 object-contain"
                        />
                        {/* Green bubble bottom-right: free claims */}
                        {freeClaims > 0 && (
                            <span
                                className="absolute -bottom-1 -right-1 min-w-[14px] h-[14px] rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center px-0.5"
                                style={{ lineHeight: 1 }}
                            >
                                {freeClaims > 9 ? '+' : freeClaims}
                            </span>
                        )}
                        {/* Red bubble top-right: pending trade requests */}
                        {pendingTrades > 0 && (
                            <span
                                className="absolute -top-1 -right-1 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center px-0.5"
                                style={{ lineHeight: 1 }}
                            >
                                {pendingTrades > 9 ? '+' : pendingTrades}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: course icon + contacts icon */}
                <div className="flex items-center gap-2">
                    {/* Course icon (golden chart) */}
                    <button
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ border: '1px solid rgba(251, 191, 36, 0.25)' }}
                        onClick={() => navigate('/tcg/market')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    </button>
                    {/* Contacts icon */}
                    <div className="relative">
                        <button
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ border: '1px solid rgba(255, 184, 96, 0.25)' }}
                            onClick={() => navigate('/tcg/contacts')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffb860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </button>
                        {pendingContacts > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center px-0.5">
                                {pendingContacts > 9 ? '+' : pendingContacts}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab bar — only on home */}
            {!isHubOrDeep && (
                <div className="flex border-b border-white/10 mt-1">
                    {[
                        { id: 'global', label: 'Vitrine Globale' },
                        { id: 'contacts', label: 'Vitrine Contacts' },
                        { id: 'profile', label: 'Mon Profil' },
                    ].map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                className={`flex-1 py-2 text-[10px] font-semibold tracking-wide transition-colors ${isActive ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500'}`}
                                onClick={() => setTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* No contextual buttons — collection access is in profile/collection pages */}
        </div>
    );
};

// ---- App ----

const TcgApp: React.FC = () => {
    const { profile, loading, refresh } = useTcgProfile();
    const [ready, setReady] = useState(false);

    useEffect(() => { refresh(); }, []);
    useEffect(() => { if (!loading && profile !== null) setReady(true); }, [loading, profile]);

    if (!ready) return <AppContainer><div className="flex items-center justify-center h-full"><span className="text-sm text-gray-400">Chargement...</span></div></AppContainer>;
    if (!profile?.success) return <AppContainer><TcgSetup onComplete={() => refresh()} /></AppContainer>;

    return (
        <AppContainer>
            <TcgHeader username={profile.username} />
            <Routes>
                <Route index element={<TcgHome username={profile.username} />} />
                <Route path="hub" element={<TcgHub username={profile.username} />} />
                <Route path="market" element={<TcgMarket />} />
                <Route path="collection" element={<TcgCollection />} />
                <Route path="view/:userCardId" element={<TcgViewer />} />
                <Route path="contacts" element={<TcgContacts />} />
                <Route path="contacts/:citizenid/collection" element={<TcgContactCollection />} />
                <Route path="profile/:citizenid" element={<TcgProfile />} />
            </Routes>
        </AppContainer>
    );
};

export default TcgApp;
