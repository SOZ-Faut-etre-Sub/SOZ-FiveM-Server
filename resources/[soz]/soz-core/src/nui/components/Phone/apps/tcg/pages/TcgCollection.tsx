import React, { useEffect, useMemo, useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useNavigate } from 'react-router-dom';

import { TCG_ARCHETYPES } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { useTcgCollection, useTcgProfile } from '../hooks/useTcg';

type SortMode = 'date' | 'archetype';
type FilterMode = string | null; // null = all

export const TcgCollection: React.FC = () => {
    const navigate = useNavigate();
    const { collection, loading, refresh } = useTcgCollection();
    const { profile, refresh: refreshProfile } = useTcgProfile();
    const { getPath } = useAssetPath();

    const [sortMode, setSortMode] = useState<SortMode>('date');
    const [filterArchetype, setFilterArchetype] = useState<FilterMode>(null);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => { refresh(); refreshProfile(); }, []);

    // Get unique archetypes present in the collection
    const availableArchetypes = useMemo(() => {
        const set = new Set<string>();
        for (const card of collection) {
            if (card.archetype) set.add(card.archetype);
        }
        // Maintain order from TCG_ARCHETYPES
        return TCG_ARCHETYPES.filter(a => set.has(a));
    }, [collection]);

    // Count per archetype
    const archetypeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const card of collection) {
            if (card.archetype) {
                counts[card.archetype] = (counts[card.archetype] ?? 0) + 1;
            }
        }
        return counts;
    }, [collection]);

    // Filter + sort
    const displayedCards = useMemo(() => {
        let cards = [...collection];

        // Search by card number or name
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            const num = parseInt(q, 10);
            cards = cards.filter(c =>
                (!isNaN(num) && c.cardId === num) || c.name.toLowerCase().includes(q)
            );
        }

        if (filterArchetype) {
            cards = cards.filter(c => c.archetype === filterArchetype);
        }

        if (sortMode === 'archetype') {
            cards.sort((a, b) => {
                const aArch = a.archetype ?? 'zzz';
                const bArch = b.archetype ?? 'zzz';
                if (aArch !== bArch) return aArch.localeCompare(bArch);
                return new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime();
            });
        }
        // date sort is already default from server (desc)

        return cards;
    }, [collection, filterArchetype, sortMode, searchQuery]);

    return (
        <>
            <div className="px-4 pt-1 pb-1 flex items-center justify-between relative">
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary, #e5e7eb)' }}>{`Ma Collection (${collection.length})`}</h2>
                {/* Avatar centered — retour profil */}
                <button
                    className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full overflow-hidden bg-gray-800 border border-white/10 flex-shrink-0"
                    onClick={() => navigate(`/tcg/profile/${profile?.username ?? ''}`)}
                >
                    {profile?.avatar ? (
                        profile.avatar.startsWith('data:image/') ? (
                            <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <img src={getPath(profile.avatar)} alt="" className="w-full h-full object-cover" />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><span className="text-[10px]">👤</span></div>
                    )}
                </button>
                <div className="flex gap-1.5 items-center">
                    {/* Search icon */}
                    <button
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${showSearch ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-gray-400'}`}
                        onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(''); }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                    {/* Sort toggle */}
                    <button
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${sortMode === 'archetype' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/10 text-gray-400'}`}
                        onClick={() => setSortMode(prev => prev === 'date' ? 'archetype' : 'date')}
                    >
                        {sortMode === 'date' ? 'Tri: Date' : 'Tri: Catégorie'}
                    </button>
                    {/* Filter button */}
                    <button
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${filterArchetype ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-400'}`}
                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                    >
                        {filterArchetype ? filterArchetype : 'Filtrer'}
                    </button>
                    {/* Clear filter button */}
                    {filterArchetype && (
                        <button
                            className="px-1.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/20 border border-red-500/40 text-red-400"
                            onClick={() => { setFilterArchetype(null); setShowFilterPanel(false); }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Search bar */}
            {showSearch && (
                <div className="px-3 pb-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        placeholder="Rechercher par n° ou nom de carte..."
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm placeholder-gray-500 outline-none"
                        style={{ color: 'var(--text-primary, #fff)' }}
                        data-phone-input="true"
                        autoFocus
                    />
                </div>
            )}

            {/* Filter panel */}
            {showFilterPanel && (
                <div className="px-3 pb-2">
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
                        <button
                            className={`px-2 py-1 rounded-md text-[9px] font-semibold border ${!filterArchetype ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-500'}`}
                            onClick={() => { setFilterArchetype(null); setShowFilterPanel(false); }}
                        >
                            Toutes ({collection.length})
                        </button>
                        {availableArchetypes.map(arch => (
                            <button
                                key={arch}
                                className={`px-2 py-1 rounded-md text-[9px] font-semibold border ${filterArchetype === arch ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-500'}`}
                                onClick={() => { setFilterArchetype(arch); setShowFilterPanel(false); }}
                            >
                                {arch} ({archetypeCounts[arch] ?? 0})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <AppContent>
                <div className="flex flex-col h-full p-3 overflow-hidden">
                    {loading ? (
                        <p className="text-sm text-gray-400 text-center mt-10">Chargement...</p>
                    ) : collection.length === 0 ? (
                        <div className="text-center mt-16 text-gray-500 text-sm leading-relaxed">
                            <p>Aucune carte pour le moment.</p>
                            <p>Récupère tes cartes du jour !</p>
                        </div>
                    ) : displayedCards.length === 0 ? (
                        <div className="text-center mt-16 text-gray-500 text-sm">
                            <p>Aucune carte dans cette catégorie.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2.5 overflow-y-auto flex-1 pb-4" style={{ alignContent: 'start' }}>
                            {displayedCards.map(card => (
                                <div
                                    key={card.userCardId}
                                    className="relative flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                                    onClick={() => navigate(`/tcg/view/${card.userCardId}`, { state: { card, fromContact: false } })}
                                >
                                    {/* Showcase badge - top left */}
                                    {card.isShowcase && (
                                        <div className="absolute top-1 left-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center z-10 text-[10px]">⭐</div>
                                    )}
                                    {/* Protected badge - top right */}
                                    {card.isProtected && (
                                        <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500/80 rounded-full flex items-center justify-center z-10 text-[10px]">🔒</div>
                                    )}
                                    <img src={getPath(card.image)} alt={card.name} className="w-full rounded-md border border-white/10" style={{ aspectRatio: '936 / 2000', objectFit: 'cover' }} />
                                    <span className="text-[9px] text-gray-400 text-center truncate w-full leading-tight">{card.name}</span>
                                    {card.archetype && <span className="text-[8px] text-purple-400 text-center truncate w-full leading-tight">{card.archetype}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AppContent>
        </>
    );
};