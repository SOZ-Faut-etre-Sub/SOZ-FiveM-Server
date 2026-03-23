import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TcgContactCollectionCard, TcgCreateTradeInput } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { useTcgCollection, useTcgContactCollection, useTcgTrades } from '../hooks/useTcg';

export const TcgContactCollection: React.FC = () => {
    const navigate = useNavigate();
    const { citizenid } = useParams<{ citizenid: string }>();
    const { collection: contactCards, loading, fetch } = useTcgContactCollection();
    const { collection: myCards, refresh: refreshMyCards } = useTcgCollection();
    const { createTrade } = useTcgTrades();

    const [tradeCard, setTradeCard] = useState<TcgContactCollectionCard | null>(null);
    const [offerType, setOfferType] = useState<'money' | 'card'>('money');
    const [offerAmount, setOfferAmount] = useState('');
    const [offerCardId, setOfferCardId] = useState<number | null>(null);
    const [tradeMessage, setTradeMessage] = useState<string | null>(null);
    const [tradeLoading, setTradeLoading] = useState(false);

    useEffect(() => { if (citizenid) { fetch(citizenid); refreshMyCards(); } }, [citizenid]);

    const handlePropose = async () => {
        if (!citizenid || !tradeCard) return;
        setTradeLoading(true); setTradeMessage(null);
        const input: TcgCreateTradeInput = {
            receiverId: citizenid, requestedCardId: tradeCard.cardId, offerType,
            offerCardId: offerType === 'card' ? offerCardId : undefined,
            offerAmount: offerType === 'money' ? parseInt(offerAmount) || 0 : undefined,
        };
        const res = await createTrade(input);
        setTradeLoading(false);
        if (res?.success) { setTradeMessage('Proposition envoyée !'); setTimeout(() => { setTradeCard(null); setTradeMessage(null); }, 1500); }
        else { setTradeMessage(res?.message ?? 'Erreur'); }
    };

    return (
        <>
            <AppTitle title="Collection" onBackAction={() => navigate('/tcg/contacts')} />
            <AppContent>
                <div className="flex flex-col h-full p-3 overflow-hidden relative">
                    {loading ? (
                        <p className="text-sm text-gray-400 text-center mt-10">Chargement...</p>
                    ) : contactCards.length === 0 ? (
                        <div className="text-center mt-16 text-gray-500 text-sm"><p>Ce joueur n'a aucune carte.</p></div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1 pb-4">
                            {contactCards.map(card => (
                                <div key={card.cardId} className="flex flex-col items-center gap-1">
                                    <img src={card.image} alt={card.name} className="w-full rounded-md border border-white/10 cursor-pointer active:scale-95 transition-transform" style={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
                                        onClick={() => navigate(`/tcg/view/${card.cardId}`, { state: { card: { userCardId: 0, cardId: card.cardId, name: card.name, image: card.image, obtainedAt: card.obtainedAt, isWallpaper: false, isShowcase: false }, fromContact: true } })} />
                                    <span className="text-[9px] text-gray-400 text-center truncate w-full">{card.name}</span>
                                    <button className="w-full py-1.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-semibold"
                                        onClick={() => { setTradeCard(card); setOfferType('money'); setOfferAmount(''); setOfferCardId(null); setTradeMessage(null); }}>Proposer</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {tradeCard && (
                        <div className="absolute inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
                            <div className="bg-gray-900 rounded-2xl p-4 w-full max-w-[300px] border border-white/10" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-between items-start mb-3">
                                    <div><p className="text-xs text-gray-400">Tu veux la carte :</p><p className="text-sm text-white font-bold">{tradeCard.name}</p></div>
                                    <button className="w-7 h-7 rounded-full bg-white/10 text-white text-xs flex items-center justify-center" onClick={() => setTradeCard(null)}>✕</button>
                                </div>
                                <div className="flex gap-2 mb-3">
                                    <button className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${offerType === 'money' ? 'bg-green-500/20 border-green-500/40 text-green-300' : 'bg-white/5 border-white/10 text-gray-400'}`} onClick={() => setOfferType('money')}>Argent</button>
                                    <button className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${offerType === 'card' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/10 text-gray-400'}`} onClick={() => setOfferType('card')}>Carte</button>
                                </div>
                                {offerType === 'money' && (
                                    <div className="mb-3">
                                        <input type="number" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="Montant ($)..."
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none" min="1" data-phone-input="true" />
                                    </div>
                                )}
                                {offerType === 'card' && (
                                    <div className="mb-3 max-h-[150px] overflow-y-auto">
                                        {myCards.length === 0 ? <p className="text-xs text-gray-500 text-center py-2">Tu n'as aucune carte à proposer.</p> : (
                                            <div className="flex flex-col gap-1">
                                                {myCards.map(c => (
                                                    <button key={c.cardId} className={`flex items-center gap-2 p-2 rounded-lg border text-left ${offerCardId === c.cardId ? 'bg-purple-500/20 border-purple-500/40' : 'bg-white/5 border-white/10'}`} onClick={() => setOfferCardId(c.cardId)}>
                                                        <img src={c.image} alt={c.name} className="w-8 h-12 rounded object-cover" />
                                                        <span className="text-xs text-white truncate">{c.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {tradeMessage && <p className="text-xs text-center mb-2 text-gray-300">{tradeMessage}</p>}
                                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-bold uppercase" onClick={handlePropose}
                                    disabled={tradeLoading || (offerType === 'money' && !offerAmount) || (offerType === 'card' && !offerCardId)}>
                                    {tradeLoading ? '...' : 'Envoyer la proposition'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </AppContent>
        </>
    );
};
