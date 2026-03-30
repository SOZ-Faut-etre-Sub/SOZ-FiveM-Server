import React, { useEffect, useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useNavigate } from 'react-router-dom';

import {
    TCG_ARCHETYPES, TCG_SET_SIZE, TCG_STREAK_TARGET, TCG_TRADE_TAX_RATE,
    TcgCardData, TcgTradeOffer, computeTradeTax,
} from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import {
    useTcgClaim, useTcgCollection, useTcgDailyStatus, useTcgSellSet,
    useTcgTrades, useTcgWeeklyPack, useTcgMarket,
} from '../hooks/useTcg';

// ---- Group colors for linked trades ----
const GROUP_COLORS = [
    'border-cyan-500/60', 'border-pink-500/60', 'border-lime-500/60',
    'border-orange-500/60', 'border-violet-500/60', 'border-teal-500/60', 'border-rose-500/60',
];

interface Props {
    username: string;
}

export const TcgHub: React.FC<Props> = ({ username }) => {
    const navigate = useNavigate();
    const { getPath } = useAssetPath();

    // Claim
    const { status, loading: statusLoading, refresh: refreshStatus } = useTcgDailyStatus();
    const { loading: claimLoading, claim } = useTcgClaim();
    const [obtained, setObtained] = useState<TcgCardData[]>([]);
    const [claimError, setClaimError] = useState<string | null>(null);

    // Trades
    const { trades, loading: tradesLoading, refresh: refreshTrades, respondTrade, cancelTrade } = useTcgTrades();
    const [refuseTarget, setRefuseTarget] = useState<number | null>(null);
    const [refuseMessage, setRefuseMessage] = useState('');
    const [actionMessage, setActionMessage] = useState<Record<number, string>>({});

    // Sell
    const { collection, refresh: refreshCollection } = useTcgCollection();
    const { loading: sellLoading, sellSet } = useTcgSellSet();
    const { prices: marketPrices, refresh: refreshMarket } = useTcgMarket();
    const [showSellPopup, setShowSellPopup] = useState(false);
    const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
    const [sellMessage, setSellMessage] = useState<string | null>(null);

    // Weekly Pack
    const { status: packStatus, loading: packStatusLoading, refresh: refreshPack, buy: buyPack } = useTcgWeeklyPack();
    const [showPackPopup, setShowPackPopup] = useState(false);
    const [packLoading, setPackLoading] = useState(false);
    const [packResult, setPackResult] = useState<{ cards: TcgCardData[]; message: string } | null>(null);

    useEffect(() => {
        refreshStatus();
        refreshTrades();
        refreshCollection();
        refreshPack();
        refreshMarket();
    }, []);

    const formatPrice = (n: number) => n.toLocaleString('fr-FR');

    // ---- Claim ----
    const canClaim = status && status.availableClaims > 0 && status.availableCards > 0;
    const noCardsLeft = status && status.availableCards === 0;

    const handleClaim = async () => {
        setClaimError(null);
        const res = await claim();
        if (res) {
            if (res.success) setObtained(prev => [...prev, ...res.cards]);
            else setClaimError(res.message ?? 'Erreur');
            refreshStatus();
        }
    };

    // ---- Sell ----
    const archetypePriceMap = React.useMemo(() => {
        const map: Record<string, number> = {};
        for (const p of marketPrices) map[p.archetype] = p.setPrice;
        return map;
    }, [marketPrices]);

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
            refreshCollection(); refreshStatus();
            setTimeout(() => { setShowSellPopup(false); setSellMessage(null); setSelectedArchetype(null); }, 2000);
        } else {
            setSellMessage(res?.message ?? 'Erreur');
        }
    };

    // ---- Pack ----
    const handleBuyPack = async () => {
        setPackLoading(true); setPackResult(null);
        const res = await buyPack();
        setPackLoading(false);
        if (res) {
            if (res.success) {
                setPackResult({ cards: res.cards, message: res.message ?? '' });
                setObtained(prev => [...prev, ...res.cards]);
                refreshPack(); refreshCollection(); refreshStatus();
            } else {
                setPackResult({ cards: [], message: res.message ?? 'Erreur' });
            }
        }
    };

    // ---- Trades ----
    const groupColorMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        let ci = 0;
        for (const t of trades) {
            const k = `${t.requestedCardId}-${t.senderId}`;
            if (!map[k]) { map[k] = GROUP_COLORS[ci % GROUP_COLORS.length]; ci++; }
        }
        return map;
    }, [trades]);

    const groupCount = React.useMemo(() => {
        const c: Record<string, number> = {};
        for (const t of trades) { const k = `${t.requestedCardId}-${t.senderId}`; c[k] = (c[k] ?? 0) + 1; }
        return c;
    }, [trades]);

    const handleAccept = async (id: number) => { const r = await respondTrade({ tradeId: id, action: 'accept' }); setActionMessage(p => ({ ...p, [id]: r?.message ?? 'Erreur' })); refreshTrades(); };
    const handleRefuse = async (id: number) => { const r = await respondTrade({ tradeId: id, action: 'refuse', message: refuseMessage || undefined }); setActionMessage(p => ({ ...p, [id]: r?.message ?? 'Erreur' })); setRefuseTarget(null); setRefuseMessage(''); refreshTrades(); };
    const handleCancel = async (id: number) => { const r = await cancelTrade(id); setActionMessage(p => ({ ...p, [id]: r?.message ?? 'Erreur' })); refreshTrades(); };

    const openViewer = (cardId: number, name: string, image: string) => {
        navigate(`/tcg/view/${cardId}`, { state: { card: { userCardId: 0, cardId, name, image, obtainedAt: '', isShowcase: false }, fromContact: true } });
    };

    const renderOffer = (trade: TcgTradeOffer) => {
        if (trade.offerType === 'money') {
            const { gross, tax, net } = computeTradeTax(trade.offerAmount);
            return (
                <div className="flex flex-col items-center">
                    <span className="text-green-400 font-bold text-xs">${formatPrice(gross)}</span>
                    <span className="text-[7px] text-gray-500">taxe 7% : ${formatPrice(tax)}</span>
                    <span className="text-[8px] text-green-300">net : ${formatPrice(net)}</span>
                </div>
            );
        }
        if (trade.offerCardName) return (
            <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                onClick={() => openViewer(trade.offerCardId!, trade.offerCardName!, trade.offerCardImage!)}>
                {trade.offerCardImage && <img src={getPath(trade.offerCardImage)} alt="" className="w-10 rounded object-cover border border-purple-500/30" style={{ aspectRatio: '936 / 2000' }} />}
                <span className="text-purple-300 text-[7px] mt-0.5 truncate max-w-[50px]">{trade.offerCardName}</span>
            </div>
        );
        return <span className="text-gray-500 text-xs">-</span>;
    };

    const pendingTrades = trades.filter(t => t.status === 'pending');

    return (
        <AppContent>
            <div className="flex flex-col h-full overflow-y-auto">
                {/* ---- CLAIM SECTION ---- */}
                <div className="flex flex-col items-center p-4 pb-2">
                    {statusLoading ? (
                        <p className="text-sm text-gray-400">Chargement...</p>
                    ) : status ? (
                        <>
                            <span className="text-4xl font-black text-cyan-400 leading-none">{noCardsLeft ? '0' : status.availableClaims}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">{noCardsLeft ? 'Plus aucune carte disponible' : `carte${status.availableClaims !== 1 ? 's' : ''} gratuite${status.availableClaims !== 1 ? 's' : ''}`}</span>
                            {!noCardsLeft && status.nextCardIn && <span className="text-[9px] text-gray-500">Prochaine dans {status.nextCardIn}</span>}
                            {/* Streak */}
                            <div className="flex items-center gap-1 mt-1.5">
                                {Array.from({ length: TCG_STREAK_TARGET }).map((_, i) => (
                                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < status.streak ? 'bg-amber-400' : 'bg-white/10'}`}
                                        style={i < status.streak ? { boxShadow: '0 0 4px rgba(251,191,36,0.5)' } : undefined} />
                                ))}
                            </div>
                            <span className="text-[8px] text-gray-500 mt-0.5">
                                {status.isStreakBonus ? '🔥 Prochain claim = bonus !' : `Série : ${status.streak}/${TCG_STREAK_TARGET}`}
                            </span>
                        </>
                    ) : <p className="text-xs text-gray-400">Erreur</p>}

                    <button
                        className={`w-full max-w-[240px] py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider mt-2 ${!canClaim && !claimLoading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : ''}`}
                        style={canClaim || claimLoading ? { background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', color: '#ffb860' } : undefined}
                        onClick={handleClaim} disabled={!canClaim || claimLoading}
                    >
                        {claimLoading ? 'Ouverture...' : noCardsLeft ? 'Aucune carte dispo' : canClaim ? 'Ouvrir une carte' : 'Aucune carte gratuite'}
                    </button>

                    {claimError && <p className="text-[10px] text-red-400 mt-1">{claimError}</p>}

                    {obtained.length > 0 && (
                        <div className="mt-3 w-full text-center">
                            <p className="text-xs font-bold text-yellow-400 mb-2">Cartes obtenues !</p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {obtained.map((card, i) => (
                                    <div key={i} className="flex flex-col items-center gap-0.5">
                                        <img src={getPath(card.image)} alt={card.name} className="w-[70px] object-cover rounded-lg border border-purple-400/50" style={{ aspectRatio: '936 / 2000' }} />
                                        {card.archetype && <span className="text-[7px] text-purple-300">{card.archetype}</span>}
                                        <span className="text-[8px] text-gray-300 max-w-[70px] truncate">{card.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ---- PACK HEBDO + VENDRE SET (2 buttons side by side) ---- */}
                <div className="flex gap-2 px-4 pb-3">
                    <button
                        className="flex-1 py-2.5 rounded-xl border border-violet-500/30 text-violet-400 text-[10px] font-semibold"
                        onClick={() => { setShowPackPopup(true); setPackResult(null); refreshPack(); }}
                    >
                        Pack Hebdo
                        {packStatus && <span className="text-violet-300/60 ml-0.5">• ${formatPrice(packStatus.nextPrice)}</span>}
                    </button>
                    <button
                        className="flex-1 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold"
                        onClick={() => { setShowSellPopup(true); setSelectedArchetype(null); setSellMessage(null); refreshCollection(); refreshMarket(); }}
                    >
                        Vendre un Set
                    </button>
                </div>

                {/* ---- DIVIDER ---- */}
                <div className="border-t border-white/5 mx-4" />

                {/* ---- TRADES SECTION ---- */}
                <div className="flex flex-col p-3 gap-2">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Échanges ({pendingTrades.length} en attente)</span>

                    {tradesLoading ? <p className="text-xs text-gray-400 text-center py-4">Chargement...</p>
                    : trades.length === 0 ? <p className="text-xs text-gray-500 text-center py-4">Aucun échange en cours.</p>
                    : trades.map(trade => {
                        const gk = `${trade.requestedCardId}-${trade.senderId}`;
                        const isGrouped = groupCount[gk] > 1;
                        const bc = isGrouped ? groupColorMap[gk] : 'border-white/10';

                        return (
                            <div key={trade.id} className={`p-2.5 rounded-xl bg-white/5 border-2 flex flex-col gap-1.5 ${bc}`}>
                                {isGrouped && <span className="text-[8px] text-gray-400 italic">Proposition groupée</span>}
                                <div className="flex justify-between items-start">
                                    <p className="text-[9px] text-gray-500">{trade.senderName} → {trade.receiverName}</p>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${trade.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : trade.status === 'accepted' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {trade.status === 'pending' ? 'En attente' : trade.status === 'accepted' ? 'Accepté' : trade.status === 'cancelled' ? 'Annulé' : 'Refusé'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                                        onClick={() => openViewer(trade.requestedCardId, trade.requestedCardName, trade.requestedCardImage)}>
                                        <img src={getPath(trade.requestedCardImage)} alt="" className="w-10 rounded object-cover border border-amber-500/30" style={{ aspectRatio: '936 / 2000' }} />
                                        <span className="text-[7px] text-amber-300 mt-0.5 truncate max-w-[50px]">{trade.requestedCardName}</span>
                                    </div>
                                    <span className="text-gray-500">⇄</span>
                                    {renderOffer(trade)}
                                </div>
                                {trade.message && <p className="text-[9px] text-gray-400 italic bg-white/5 p-1.5 rounded">"{trade.message}"</p>}
                                {actionMessage[trade.id] && <p className="text-[9px] text-gray-300 text-center">{actionMessage[trade.id]}</p>}
                                {trade.status === 'pending' && (
                                    <div className="flex flex-col gap-1.5 mt-0.5">
                                        {trade.isReceiver && (
                                            refuseTarget === trade.id ? (
                                                <div className="flex flex-col gap-1.5">
                                                    <input type="text" value={refuseMessage} onChange={e => setRefuseMessage(e.target.value)} placeholder="Message (optionnel)..."
                                                        className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] placeholder-gray-500 outline-none" data-phone-input="true"
                                                        onKeyDown={e => e.stopPropagation()} />
                                                    <div className="flex gap-1.5">
                                                        <button className="flex-1 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-semibold" onClick={() => handleRefuse(trade.id)}>Confirmer refus</button>
                                                        <button className="py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px]" onClick={() => { setRefuseTarget(null); setRefuseMessage(''); }}>Annuler</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-1.5">
                                                    <button className="flex-1 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 text-[10px] font-semibold" onClick={() => handleAccept(trade.id)}>Accepter</button>
                                                    <button className="flex-1 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-semibold" onClick={() => setRefuseTarget(trade.id)}>Refuser</button>
                                                </div>
                                            )
                                        )}
                                        {!trade.isReceiver && (
                                            <button className="w-full py-1.5 rounded-lg bg-gray-500/20 border border-gray-500/40 text-gray-400 text-[10px] font-semibold" onClick={() => handleCancel(trade.id)}>Annuler ma demande</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ---- SELL SET POPUP ---- */}
            {showSellPopup && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setShowSellPopup(false)} />
                    <div className="fixed z-50 bg-gray-900 rounded-2xl p-5 w-full max-w-[300px] border border-white/10"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={e => e.stopPropagation()}>
                        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg leading-none" onClick={() => setShowSellPopup(false)}>✕</button>
                        <p className="text-sm text-white font-bold text-center mb-1">Vendre un Set</p>
                        <p className="text-[10px] text-gray-400 text-center mb-3">{TCG_SET_SIZE} cartes non protégées remises en circulation.</p>

                        {availableArchetypesForSell.length === 0 ? (
                            <p className="text-xs text-gray-500 text-center py-4">Aucune catégorie avec {TCG_SET_SIZE}+ cartes non protégées.</p>
                        ) : (
                            <div className="max-h-[200px] overflow-y-auto flex flex-col gap-1.5 mb-3">
                                {availableArchetypesForSell.map(arch => {
                                    const info = archetypeCounts[arch];
                                    const price = archetypePriceMap[arch];
                                    const sel = selectedArchetype === arch;
                                    return (
                                        <button key={arch} className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors ${sel ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-white/5 border-white/10'}`}
                                            onClick={() => setSelectedArchetype(arch)}>
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-semibold ${sel ? 'text-emerald-300' : 'text-white'}`}>{arch}</span>
                                                <span className="text-[9px] text-gray-500">{info.unprotected} dispo / {info.total} total</span>
                                            </div>
                                            {price !== undefined && <span className={`text-[10px] font-bold ${sel ? 'text-emerald-300' : 'text-emerald-400/70'}`}>${formatPrice(price)}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {sellMessage && <p className={`text-xs text-center mb-2 ${sellMessage.includes('versé') || sellMessage.includes('vendu') ? 'text-emerald-400' : 'text-red-400'}`}>{sellMessage}</p>}

                        {selectedArchetype && !sellMessage?.includes('vendu') && !sellMessage?.includes('versé') && (
                            <div className="flex flex-col gap-2">
                                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                    <p className="text-[10px] text-amber-300 text-center leading-relaxed">
                                        ⚠️ {TCG_SET_SIZE} cartes <span className="font-bold">{selectedArchetype}</span> aléatoires remises en circulation.
                                        {archetypePriceMap[selectedArchetype] !== undefined && <> Vous recevrez <span className="font-bold">${formatPrice(archetypePriceMap[selectedArchetype])}</span>.</>}
                                    </p>
                                </div>
                                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-sm font-bold uppercase"
                                    onClick={handleSellSet} disabled={sellLoading}>{sellLoading ? '...' : `Vendre le Set ${selectedArchetype}`}</button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ---- PACK HEBDO POPUP ---- */}
            {showPackPopup && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setShowPackPopup(false)} />
                    <div className="fixed z-50 bg-gray-900 rounded-2xl p-5 w-full max-w-[300px] border border-white/10"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={e => e.stopPropagation()}>
                        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg leading-none" onClick={() => setShowPackPopup(false)}>✕</button>
                        <p className="text-sm text-white font-bold text-center mb-1">Pack Hebdomadaire</p>
                        <p className="text-[10px] text-gray-400 text-center mb-4">7 cartes aléatoires. Reset chaque lundi.</p>

                        {packStatusLoading ? <p className="text-xs text-gray-400 text-center py-4">Chargement...</p>
                        : packStatus ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="text-center">
                                    <span className="text-3xl font-black" style={{ color: '#c084fc' }}>${formatPrice(packStatus.nextPrice)}</span>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {packStatus.packsBoughtThisWeek === 0 ? 'Premier pack (tarif réduit !)' : `${packStatus.packsBoughtThisWeek} pack(s) cette semaine`}
                                    </p>
                                    <p className="text-[9px] text-gray-500">{packStatus.availableCards} carte{packStatus.availableCards !== 1 ? 's' : ''} dispo</p>
                                </div>

                                {packResult ? (
                                    <div className="w-full text-center">
                                        {packResult.cards.length > 0 ? (
                                            <>
                                                <p className="text-xs font-bold text-violet-300 mb-2">{packResult.message}</p>
                                                <div className="flex justify-center gap-2 flex-wrap">
                                                    {packResult.cards.map((c, i) => (
                                                        <div key={i} className="flex flex-col items-center gap-0.5">
                                                            <img src={getPath(c.image)} alt={c.name} className="w-[55px] object-cover rounded-md border border-violet-400/40" style={{ aspectRatio: '936 / 2000' }} />
                                                            <span className="text-[7px] text-gray-400 max-w-[55px] truncate">{c.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : <p className="text-xs text-red-400">{packResult.message}</p>}
                                    </div>
                                ) : (
                                    <button
                                        className={`w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider ${!packStatus.canAfford || packStatus.availableCards < 7 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : ''}`}
                                        style={packStatus.canAfford && packStatus.availableCards >= 7 ? { background: 'linear-gradient(90deg, #7c3aed, #a855f7)', color: '#fff' } : undefined}
                                        onClick={handleBuyPack} disabled={packLoading || !packStatus.canAfford || packStatus.availableCards < 7}
                                    >
                                        {packLoading ? 'Achat...' : !packStatus.canAfford ? 'Fonds insuffisants' : packStatus.availableCards < 7 ? 'Pas assez de cartes' : `Acheter ($${formatPrice(packStatus.nextPrice)})`}
                                    </button>
                                )}
                            </div>
                        ) : <p className="text-xs text-gray-500 text-center">Erreur</p>}
                    </div>
                </>
            )}
        </AppContent>
    );
};
