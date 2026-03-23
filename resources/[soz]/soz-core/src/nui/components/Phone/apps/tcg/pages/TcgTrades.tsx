import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TcgTradeOffer } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { useTcgTrades } from '../hooks/useTcg';

export const TcgTrades: React.FC = () => {
    const navigate = useNavigate();
    const { trades, loading, refresh, respondTrade } = useTcgTrades();
    const [refuseTarget, setRefuseTarget] = useState<number | null>(null);
    const [refuseMessage, setRefuseMessage] = useState('');
    const [actionMessage, setActionMessage] = useState<Record<number, string>>({});

    useEffect(() => { refresh(); }, []);

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

    const renderOffer = (trade: TcgTradeOffer) => {
        if (trade.offerType === 'money') return <span className="text-green-400 font-bold">${trade.offerAmount}</span>;
        if (trade.offerCardName) return (
            <div className="flex items-center gap-1">
                {trade.offerCardImage && <img src={trade.offerCardImage} alt="" className="w-6 h-9 rounded object-cover" />}
                <span className="text-purple-300 text-xs">{trade.offerCardName}</span>
            </div>
        );
        return <span className="text-gray-500">-</span>;
    };

    return (
        <>
            <AppTitle title="Échanges" onBackAction={() => navigate('/tcg')} />
            <AppContent>
                <div className="flex flex-col h-full p-3 overflow-y-auto gap-4">
                    {loading ? <p className="text-sm text-gray-400 text-center mt-10">Chargement...</p>
                    : trades.length === 0 ? <p className="text-sm text-gray-500 text-center mt-10">Aucun échange en cours.</p>
                    : trades.map(trade => (
                        <div key={trade.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] text-gray-500">{trade.senderName} → {trade.receiverName}</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${trade.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : trade.status === 'accepted' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {trade.status === 'pending' ? 'En attente' : trade.status === 'accepted' ? 'Accepté' : 'Refusé'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center">
                                    <img src={trade.requestedCardImage} alt="" className="w-12 h-18 rounded object-cover border border-amber-500/30" />
                                    <span className="text-[8px] text-amber-300 mt-0.5 truncate max-w-[60px]">{trade.requestedCardName}</span>
                                    <span className="text-[8px] text-gray-500">demandée</span>
                                </div>
                                <span className="text-gray-500 text-lg">⇄</span>
                                <div className="flex flex-col items-center">
                                    {renderOffer(trade)}
                                    <span className="text-[8px] text-gray-500 mt-0.5">offert</span>
                                </div>
                            </div>
                            {trade.message && <p className="text-[10px] text-gray-400 italic bg-white/5 p-2 rounded">"{trade.message}"</p>}
                            {actionMessage[trade.id] && <p className="text-[10px] text-gray-300 text-center">{actionMessage[trade.id]}</p>}
                            {trade.status === 'pending' && (
                                <div className="flex flex-col gap-2 mt-1">
                                    {refuseTarget === trade.id ? (
                                        <div className="flex flex-col gap-2">
                                            <input type="text" value={refuseMessage} onChange={e => setRefuseMessage(e.target.value)} placeholder="Message (optionnel)..."
                                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 outline-none" data-phone-input="true" />
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
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </AppContent>
        </>
    );
};
