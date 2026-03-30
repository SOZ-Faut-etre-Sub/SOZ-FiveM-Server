import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useNavigate, useLocation } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import { TcgShowcaseItem } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { useTcgShowcase, useTcgShowcaseContacts, useTcgProfilePage } from '../hooks/useTcg';
import { TcgScrollContainer } from '../TcgScrollContainer';

interface Props {
    username: string;
}

// ---- Showcase feed (reusable for global and contacts) ----

const ShowcaseFeed: React.FC<{
    items: TcgShowcaseItem[];
    loading: boolean;
    onRefresh: () => void;
    emptyMessage: string;
    emptySubMessage?: string;
    getPath: (p: string) => string;
    navigate: (path: string, opts?: any) => void;
}> = ({ items, loading, onRefresh, emptyMessage, emptySubMessage, getPath, navigate }) => {
    const [relaxSent, setRelaxSent] = useState(false);

    const handleScrollEnd = useCallback(() => {
        if (relaxSent || items.length === 0) return;
        setRelaxSent(true);
        fetchNui(NuiEvent.PhoneAppTcgShowcaseRelax);
    }, [relaxSent, items]);

    const handleRefreshClick = () => {
        onRefresh();
        setRelaxSent(false);
    };

    return (
        <TcgScrollContainer className="flex flex-col h-full" onScrollEnd={handleScrollEnd}>
            {/* Refresh button */}
            <div className="flex justify-center py-2">
                <button
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px]"
                    onClick={handleRefreshClick}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Rafraîchir
                </button>
            </div>

            {loading ? (
                <p className="text-sm text-gray-400 text-center mt-10">Chargement...</p>
            ) : items.length === 0 ? (
                <div className="text-center mt-12 text-gray-500 text-sm leading-relaxed">
                    <p>{emptyMessage}</p>
                    {emptySubMessage && <p className="text-[10px] mt-1">{emptySubMessage}</p>}
                </div>
            ) : (
                <div className="flex flex-col gap-4 px-3 pb-6">
                    {items.map(item => (
                        <div key={item.id} className="flex flex-col items-center">
                            <img
                                src={getPath(item.cardImage)}
                                alt={item.cardName}
                                className="w-full rounded-xl border border-white/10"
                                style={{ maxHeight: '55vh', objectFit: 'contain', boxShadow: '0 0 30px rgba(255, 140, 50, 0.15), 0 0 60px rgba(255, 80, 150, 0.1)' }}
                            />
                            <div
                                className="mt-2 flex items-center gap-3 cursor-pointer active:opacity-80"
                                onClick={() => navigate(`/tcg/profile/${item.citizenid}`)}
                            >
                                <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-white/10">
                                        {item.avatar ? (
                                            item.avatar.startsWith('data:image/') ? (
                                                <img src={item.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={getPath(item.avatar)} alt="" className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><span className="text-sm">👤</span></div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-orange-400 font-bold">{item.username}</span>
                                        {item.description ? <span className="text-xs text-cyan-400">{item.description}</span> : null}
                                    </div>
                                    <span className="text-[9px] text-gray-500">{item.cardName}</span>
                                    {item.cardArchetype && <span className="text-[8px] text-purple-400">{item.cardArchetype}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </TcgScrollContainer>
    );
};

// ---- Embedded profile tab ----

const ProfileTab: React.FC<{ username: string; getPath: (p: string) => string; navigate: (path: string, opts?: any) => void }> = ({ username, getPath, navigate }) => {
    const { profilePage, loading, fetch } = useTcgProfilePage();

    useEffect(() => { fetch(username); }, [username]);

    if (loading) return <div className="flex items-center justify-center h-full"><span className="text-sm text-gray-400">Chargement...</span></div>;
    if (!profilePage) return <div className="flex items-center justify-center h-full"><span className="text-sm text-gray-400">Erreur de chargement</span></div>;

    // Badges: highest earned per category
    const badgesByCategory: Record<string, any[]> = {};
    const displayBadges = profilePage.allBadges ?? profilePage.badges;
    for (const badge of displayBadges) {
        if (!badgesByCategory[badge.category]) badgesByCategory[badge.category] = [];
        badgesByCategory[badge.category].push(badge);
    }
    const highestEarned: any[] = [];
    for (const cat of ['collector', 'trader', 'merchant'] as const) {
        const catBadges = badgesByCategory[cat];
        if (!catBadges) continue;
        const earned = catBadges.filter((b: any) => b.earned);
        if (earned.length > 0) highestEarned.push(earned[earned.length - 1]);
    }


    return (
        <TcgScrollContainer className="flex flex-col h-full p-4 gap-4">
            {/* Avatar row: avatar centered, Ma Collection to the right */}
            <div className="flex items-center justify-center gap-4">
                {/* Spacer left for centering */}
                <div style={{ width: 80 }} />

                <div className="flex flex-col items-center">
                    {profilePage.border ? (
                        <div className="relative" style={{ width: 110, height: 110 }}>
                            <div className="absolute rounded-full overflow-hidden bg-gray-800" style={{ width: 100, height: 100, top: 5, left: 5 }}>
                                {profilePage.avatar ? (
                                    profilePage.avatar.startsWith('data:image/') ? (
                                        <img src={profilePage.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={getPath(profilePage.avatar)} alt="avatar" className="w-full h-full object-cover" />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><span className="text-2xl">👤</span></div>
                                )}
                            </div>
                            <img src={getPath(profilePage.border.image)} alt={profilePage.border.name} className="absolute inset-0 w-full h-full pointer-events-none" />
                        </div>
                    ) : (
                        <div className="rounded-full overflow-hidden flex items-center justify-center bg-gray-800 border-2" style={{ width: 90, height: 90, borderColor: 'rgba(255,255,255,0.1)' }}>
                            {profilePage.avatar ? (
                                profilePage.avatar.startsWith('data:image/') ? (
                                    <img src={profilePage.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <img src={getPath(profilePage.avatar)} alt="avatar" className="w-full h-full object-cover" />
                                )
                            ) : (
                                <span className="text-2xl">👤</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Ma Collection button */}
                <button
                    className="px-3 py-2 rounded-xl border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold"
                    style={{ width: 80 }}
                    onClick={() => navigate('/tcg/collection')}
                >
                    Ma Collection
                </button>
            </div>

            {/* Username + bio */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-black tracking-wider" style={{ color: '#ffb860' }}>{profilePage.username}</span>
                {profilePage.bio && <p className="text-xs text-gray-300 italic text-center">"{profilePage.bio}"</p>}
            </div>

            {/* Showcase */}
            {profilePage.showcase.length > 0 && (
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(profilePage.showcase.length, 4)}, 1fr)` }}>
                    {profilePage.showcase.map(item => (
                        <div key={item.id} className="flex flex-col items-center gap-1">
                            <img
                                src={getPath(item.cardImage)}
                                alt={item.cardName}
                                className="w-full rounded-lg border border-white/10 cursor-pointer active:scale-95 transition-transform"
                                style={{ aspectRatio: '936 / 2000', objectFit: 'cover', boxShadow: '0 0 15px rgba(255, 140, 50, 0.15)' }}
                                onClick={() => navigate(`/tcg/view/${item.cardId}`, {
                                    state: { card: { userCardId: 0, cardId: item.cardId, name: item.cardName, image: item.cardImage, archetype: item.cardArchetype, obtainedAt: item.createdAt, isShowcase: false, isProtected: false }, fromContact: true }
                                })}
                            />
                            {item.description && <span className="text-[7px] text-gray-500 text-center w-full truncate">{item.description}</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* Badges */}
            {highestEarned.length > 0 && (
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider text-center">Badges</span>
                    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(highestEarned.length, 3)}, 1fr)` }}>
                        {highestEarned.map((badge: any) => (
                            <div key={badge.id} className="flex flex-col items-center">
                                {badge.image ? (
                                    <img src={getPath(badge.image)} alt={badge.label} className="w-full object-contain" style={{ maxHeight: 100 }} />
                                ) : (
                                    <div className="w-full flex items-center justify-center" style={{ height: 80 }}>
                                        <span className="text-4xl">{badge.icon}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit profile button */}
            <div className="mt-auto">
                <button
                    className="w-full py-2.5 rounded-xl border border-cyan-500/30 text-cyan-300 text-sm font-semibold"
                    onClick={() => navigate(`/tcg/profile/${profilePage.citizenid}`)}
                >
                    Éditer mon profil
                </button>
            </div>
        </TcgScrollContainer>
    );
};

// ---- Main Home ----

export const TcgHome: React.FC<Props> = ({ username }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getPath } = useAssetPath();

    // Read tab from URL query param
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') ?? 'global';

    // Showcase global
    const { items: globalItems, loading: globalLoading, refresh: refreshGlobal } = useTcgShowcase();
    // Showcase contacts
    const { items: contactItems, loading: contactLoading, refresh: refreshContacts } = useTcgShowcaseContacts();

    useEffect(() => {
        refreshGlobal();
        refreshContacts();
    }, []);

    return (
        <AppContent>
            {activeTab === 'global' && (
                <ShowcaseFeed
                    items={globalItems}
                    loading={globalLoading}
                    onRefresh={refreshGlobal}
                    emptyMessage="La vitrine est vide pour le moment."
                    emptySubMessage="Expose tes cartes depuis ta collection !"
                    getPath={getPath}
                    navigate={navigate}
                />
            )}
            {activeTab === 'contacts' && (
                <ShowcaseFeed
                    items={contactItems}
                    loading={contactLoading}
                    onRefresh={refreshContacts}
                    emptyMessage="Aucune carte en vitrine chez tes contacts."
                    emptySubMessage="Ajoute des contacts TCG pour voir leurs vitrines !"
                    getPath={getPath}
                    navigate={navigate}
                />
            )}
            {activeTab === 'profile' && (
                <ProfileTab username={username} getPath={getPath} navigate={navigate} />
            )}
        </AppContent>
    );
};
