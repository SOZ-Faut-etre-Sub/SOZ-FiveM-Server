import React, { useEffect, useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useNavigate } from 'react-router-dom';

import { TCG_ARCHETYPES, TCG_SET_SIZE, TcgCardData } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { useTcgClaim, useTcgCollection, useTcgDailyStatus, useTcgSellSet, useTcgTrades } from '../hooks/useTcg';

interface Props {
    username: string;
}

export const TcgHome: React.FC<Props> = ({ username }) => {
    const navigate = useNavigate();
    const { status, loading: statusLoading, refresh } = useTcgDailyStatus();
    const { loading: claimLoading, claim } = useTcgClaim();
    const { trades, refresh: refreshTrades } = useTcgTrades();
    const { collection, refresh: refreshCollection } = useTcgCollection();
    const { loading: sellLoading, sellSet } = useTcgSellSet();
    const { getPath } = useAssetPath();
    const [obtained, setObtained] = useState<TcgCardData[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Sell Set state
    const [showSellPopup, setShowSellPopup] = useState(false);
    const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
    const [sellMessage, setSellMessage] = useState<string | null>(null);

    useEffect(() => {
        refresh();
        refreshTrades();
        refreshCollection();
    }, []);

    const handleClaim = async () => {
        setObtained([]); setError(null);
        const res = await claim();
        if (res) {
            if (res.success) setObtained(res.cards);
            else setError(res.message ?? 'Erreur');
            refresh();
        }
    };

    const canClaim = status && status.remainingToday > 0 && status.availableCards > 0;
    const noCardsLeft = status && status.availableCards === 0;

    const pendingTrades = trades.filter(t => t.status === 'pending').length;

    const formatBadge = (count: number): string => {
        if (count <= 0) return '';
        if (count > 9) return '+';
        return count.toString();
    };

    // Compute archetype counts (excluding protected) for sell set
    const archetypeCounts = React.useMemo(() => {
        const counts: Record<string, { total: number; unprotected: number }> = {};
        for (const card of collection) {
            if (!card.archetype) continue;
            if (!counts[card.archetype]) counts[card.archetype] = { total: 0, unprotected: 0 };
            counts[card.archetype].total++;
            if (!card.isProtected) counts[card.archetype].unprotected++;
        }
        return counts;
    }, [collection]);

    const availableArchetypesForSell = TCG_ARCHETYPES.filter(
        a => (archetypeCounts[a]?.unprotected ?? 0) >= TCG_SET_SIZE
    );

    const handleSellSet = async () => {
        if (!selectedArchetype) return;
        setSellMessage(null);
        const res = await sellSet(selectedArchetype);
        if (res?.success) {
            setSellMessage(res.message ?? 'Set vendu !');
            refreshCollection();
            refresh();
            setTimeout(() => { setShowSellPopup(false); setSellMessage(null); setSelectedArchetype(null); }, 2000);
        } else {
            setSellMessage(res?.message ?? 'Erreur');
        }
    };

    return (
        <AppContent>
            <div className="flex flex-col items-center h-full p-4 overflow-y-auto">
                <span className="text-xs font-semibold mb-4 tracking-wider" style={{ color: '#ffb860' }}>{username}</span>

                <div className="flex flex-col items-center gap-1 mb-5">
                    {statusLoading ? (
                        <p className="text-sm text-gray-400">Chargement...</p>
                    ) : status ? (
                        <>
                            <span className="text-5xl font-black text-cyan-400 leading-none">{noCardsLeft ? '0' : status.remainingToday}</span>
                            <span className="text-xs text-gray-400">{noCardsLeft ? 'Plus aucune carte disponible' : `carte${status.remainingToday !== 1 ? 's' : ''} disponible${status.remainingToday !== 1 ? 's' : ''}`}</span>
                            {!noCardsLeft && <span className="text-[10px] text-gray-500 mt-1">{status.availableCards} carte{status.availableCards !== 1 ? 's' : ''} restante{status.availableCards !== 1 ? 's' : ''} dans le monde</span>}
                        </>
                    ) : <p className="text-sm text-gray-400">Erreur de chargement</p>}
                </div>

                <button
                    className={`w-full max-w-[260px] py-3 px-6 rounded-xl text-sm font-bold uppercase tracking-wider ${!canClaim && !claimLoading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : ''}`}
                    style={canClaim || claimLoading ? { background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', color: '#ffb860' } : undefined}
                    onClick={handleClaim}
                    disabled={!canClaim || claimLoading}
                >
                    {claimLoading ? 'Ouverture...' : noCardsLeft ? 'Aucune carte dispo' : canClaim ? 'Ouvrir mes cartes' : 'Déjà récupérées'}
                </button>

                {error && <p className="text-xs text-red-400 mt-3 text-center">{error}</p>}

                {obtained.length > 0 && (
                    <div className="mt-6 w-full text-center">
                        <p className="text-sm font-bold text-yellow-400 mb-3 tracking-wider">Cartes obtenues !</p>
                        <div className="flex justify-center gap-3 flex-wrap">
                            {obtained.map((card, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <img src={getPath(card.image)} alt={card.name} className="w-[110px] object-cover rounded-lg border-2 border-purple-400/50" style={{ aspectRatio: '936 / 2000', boxShadow: '0 4px 20px rgba(185, 103, 255, 0.3)' }} />
                                    {card.archetype && <span className="text-[9px] text-purple-300 font-semibold">{card.archetype}</span>}
                                    <span className="text-[11px] text-gray-300">{card.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto mb-2 flex flex-col gap-2 w-full max-w-[260px]">
                    <button className="py-3 px-8 rounded-xl border border-cyan-500/30 text-cyan-400 text-sm font-semibold w-full" onClick={() => navigate(`/tcg/profile/${username}`)}>Mon Profil</button>
                    <button className="py-3 px-8 rounded-xl border border-pink-500/30 text-pink-400 text-sm font-semibold w-full" onClick={() => navigate('/tcg/showcase')}>Vitrine</button>
                    <button className="py-3 px-8 rounded-xl border border-white/15 text-gray-400 text-sm font-semibold w-full" onClick={() => navigate('/tcg/collection')}>Ma Collection</button>
                    <div className="relative">
                        <button className="py-3 px-8 rounded-xl border border-amber-500/30 text-amber-400 text-sm font-semibold w-full" onClick={() => navigate('/tcg/trades')}>Échanges</button>
                        {pendingTrades > 0 && (
                            <span className="absolute top-1/2 -translate-y-1/2 right-3 min-w-[18px] h-[18px] rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center px-1">
                                {formatBadge(pendingTrades)}
                            </span>
                        )}
                    </div>
                    {/* Sell Set button */}
                    <button
                        className="py-3 px-8 rounded-xl border border-emerald-500/30 text-emerald-400 text-sm font-semibold w-full"
                        onClick={() => { setShowSellPopup(true); setSelectedArchetype(null); setSellMessage(null); refreshCollection(); }}
                    >
                        Vendre un Set
                    </button>
                </div>
            </div>

            {/* Sell Set Popup */}
            {showSellPopup && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setShowSellPopup(false)} />
                    <div
                        className="fixed z-50 bg-gray-900 rounded-2xl p-5 w-full max-w-[300px] border border-white/10"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg leading-none" onClick={() => setShowSellPopup(false)}>✕</button>

                        <p className="text-sm text-white font-bold text-center mb-1">Vendre un Set</p>
                        <p className="text-[10px] text-gray-400 text-center mb-3">
                            Sélectionne une catégorie. {TCG_SET_SIZE} cartes non protégées seront remises en circulation.
                        </p>

                        {availableArchetypesForSell.length === 0 ? (
                            <p className="text-xs text-gray-500 text-center py-4">
                                Tu n'as aucune catégorie avec {TCG_SET_SIZE}+ cartes non protégées.
                            </p>
                        ) : (
                            <div className="max-h-[200px] overflow-y-auto flex flex-col gap-1.5 mb-3">
                                {availableArchetypesForSell.map(arch => {
                                    const info = archetypeCounts[arch];
                                    const isSelected = selectedArchetype === arch;
                                    return (
                                        <button
                                            key={arch}
                                            className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors ${isSelected ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-white/5 border-white/10'}`}
                                            onClick={() => setSelectedArchetype(arch)}
                                        >
                                            <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-300' : 'text-white'}`}>{arch}</span>
                                            <span className="text-[10px] text-gray-400">{info.unprotected} dispo / {info.total} total</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {sellMessage && (
                            <p className={`text-xs text-center mb-2 ${sellMessage.includes('vendu') ? 'text-emerald-400' : 'text-red-400'}`}>
                                {sellMessage}
                            </p>
                        )}

                        {selectedArchetype && !sellMessage?.includes('vendu') && (
                            <div className="flex flex-col gap-2">
                                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                    <p className="text-[10px] text-amber-300 text-center leading-relaxed">
                                        ⚠️ {TCG_SET_SIZE} cartes <span className="font-bold">{selectedArchetype}</span> non protégées seront choisies aléatoirement et remises en circulation. Cette action est irréversible.
                                    </p>
                                </div>
                                <button
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-sm font-bold uppercase"
                                    onClick={handleSellSet}
                                    disabled={sellLoading}
                                >
                                    {sellLoading ? '...' : `Vendre le Set ${selectedArchetype}`}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </AppContent>
    );
};
