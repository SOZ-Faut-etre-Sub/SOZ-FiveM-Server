import React, { useEffect, useMemo, useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useNavigate } from 'react-router-dom';

import { TcgTradeOffer } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { useTcgTrades } from '../hooks/useTcg';

// Palette de couleurs pour grouper les propositions liées à la même carte
const GROUP_COLORS = [
    'border-cyan-500/60',
    'border-pink-500/60',
    'border-lime-500/60',
    'border-orange-500/60',
    'border-violet-500/60',
    'border-teal-500/60',
    'border-rose-500/60',
];

export const TcgTrades: React.FC = () => {
    const navigate = useNavigate();
    const { trades, loading, refresh, respondTrade, cancelTrade } = useTcgTrades();
    const { getPath } = useAssetPath();
    const [refuseTarget, setRefuseTarget] = useState<number | null>(null);
    const [refuseMessage, setRefuseMessage] = useState('');
    const [actionMessage, setActionMessage] = useState<Record<number, string>>({});

    useEffect(() => { refresh(); }, []);

    // Associer une couleur à chaque groupe (requestedCardId + senderId)
    const groupColorMap = useMemo(() => {
        const map: Record<string, string> = {};
        let colorIndex = 0;
        for (const trade of trades) {
            const key = `${trade.requestedCardId}-${trade.senderId}`;
            if (!map[key]) {
                map[key] = GROUP_COLORS[colorIndex % GROUP_COLORS.length];
                colorIndex++;
            }
        }
        return map;
    }, [trades]);

    // Compter les trades par groupe pour savoir lesquels ont plusieurs propositions
    const groupCount = useMemo(() => {
        const count: Record<string, number> = {};
        for (const trade of trades) {
            const key = `${trade.requestedCardId}-${trade.senderId}`;
            count[key] = (count[key] ?? 0) + 1;
        }
        return count;
    }, [trades]);

    const handleAccept = async (tradeId: number) => {
        const res = await respondTrade({ tradeId, action: 'accept' });
        setActionMessage(prev => ({ ...prev, [tradeId]: res?.message ?? 'Erreur' }));
        refresh();
    };

    const handleRefuse = async (tradeId: number) => {
        const res = await respondTrade({ tradeId, action: 'refuse', message: refuseMessage || undefined });
        setActionMessage(prev => ({ ...prev, [tradeId]: res?.message ?? 'Erreur' }));
        setRefuseTarget(null); setRefuseMessage(''); refresh();
    };

    const handleCancel = async (tradeId: number) => {
        const res = await cancelTrade(tradeId);
        setActionMessage(prev => ({ ...prev, [tradeId]: res?.message ?? 'Erreur' }));
        refresh();
    };

    const openViewer = (cardId: number, name: string, image: string) => {
        navigate(`/tcg/view/${cardId}`, {
            state: {
                card: { userCardId: 0, cardId, name, image, obtainedAt: '', isShowcase: false },
                fromContact: true,
            }
        });
    };

    const renderOffer = (trade: TcgTradeOffer) => {
        if (trade.offerType === 'money') return <span className="text-green-400 font-bold">${trade.offerAmount}</span>;
        if (trade.offerCardName) return (
            <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                onClick={() => openViewer(trade.offerCardId!, trade.offerCardName!, trade.offerCardImage!)}>
                {trade.offerCardImage && <img src={getPath(trade.offerCardImage)} alt="" className="w-12 rounded object-cover border border-purple-500/30" style={{ aspectRatio: '936 / 2000' }} />}
                <span className="text-purple-300 text-[8px] mt-0.5 truncate max-w-[60px]">{trade.offerCardName}</span>
                <span className="text-[8px] text-gray-500">offert</span>
            </div>
        );
        return <span className="text-gray-500">-</span>;
    };

    return (
        <>
            <h2 className="px-4 pt-1 pb-2 text-lg font-semibold text-gray-200">Échanges</h2>
            <AppContent>
                <div className="flex flex-col h-full p-3 overflow-y-auto gap-3">
                    {loading ? <p className="text-sm text-gray-400 text-center mt-10">Chargement...</p>
                    : trades.length === 0 ? <p className="text-sm text-gray-500 text-center mt-10">Aucun échange en cours.</p>
                    : trades.map(trade => {
                        const groupKey = `${trade.requestedCardId}-${trade.senderId}`;
                        const isGrouped = groupCount[groupKey] > 1;
                        const borderColor = isGrouped ? groupColorMap[groupKey] : 'border-white/10';

                        return (
                            <div key={trade.id} className={`p-3 rounded-xl bg-white/5 border-2 flex flex-col gap-2 ${borderColor}`}>
                                {/* Badge groupe */}
                                {isGrouped && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-[9px] text-gray-400 italic">Proposition groupée</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-start">
                                    <p className="text-[10px] text-gray-500">{trade.senderName} → {trade.receiverName}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${trade.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : trade.status === 'accepted' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {trade.status === 'pending' ? 'En attente' : trade.status === 'accepted' ? 'Accepté' : trade.status === 'cancelled' ? 'Annulé' : 'Refusé'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Carte demandée — cliquable */}
                                    <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                                        onClick={() => openViewer(trade.requestedCardId, trade.requestedCardName, trade.requestedCardImage)}>
                                        <img src={getPath(trade.requestedCardImage)} alt="" className="w-12 rounded object-cover border border-amber-500/30" style={{ aspectRatio: '936 / 2000' }} />
                                        <span className="text-[8px] text-amber-300 mt-0.5 truncate max-w-[60px]">{trade.requestedCardName}</span>
                                        <span className="text-[8px] text-gray-500">demandée</span>
                                    </div>
                                    <span className="text-gray-500 text-lg">⇄</span>
                                    {/* Carte offerte — cliquable si c'est une carte */}
                                    {renderOffer(trade)}
                                </div>
                                {trade.message && <p className="text-[10px] text-gray-400 italic bg-white/5 p-2 rounded">"{trade.message}"</p>}
                                {actionMessage[trade.id] && <p className="text-[10px] text-gray-300 text-center">{actionMessage[trade.id]}</p>}
                                {trade.status === 'pending' && (
                                    <div className="flex flex-col gap-2 mt-1">
                                        {trade.isReceiver && (
                                            <>
                                                {refuseTarget === trade.id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <input type="text" value={refuseMessage} onChange={e => setRefuseMessage(e.target.value)} placeholder="Message (optionnel)..."
                                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 outline-none" data-phone-input="true"
                                                            onKeyDown={e => e.stopPropagation()} />
                                                        <div className="flex gap-2">
                                                            <button className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold" onClick={() => handleRefuse(trade.id)}>Confirmer le refus</button>
                                                            <button className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs" onClick={() => { setRefuseTarget(null); setRefuseMessage(''); }}>Annuler</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button className="flex-1 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-semibold" onClick={() => handleAccept(trade.id)}>Accepter</button>
                                                        <button className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold" onClick={() => setRefuseTarget(trade.id)}>Refuser</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {!trade.isReceiver && (
                                            <button className="w-full py-2 rounded-lg bg-gray-500/20 border border-gray-500/40 text-gray-400 text-xs font-semibold" onClick={() => handleCancel(trade.id)}>
                                                Annuler ma demande
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </AppContent>
        </>
    );
};
