import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { TcgShowcaseItem } from '../../../../../../shared/tcg/tcg.types';
import { fetchNui } from '../../../../../fetch';
import { AppContent } from '../../../components/system/AppContent';
import { useTcgContacts, useTcgShowcase } from '../hooks/useTcg';

export const TcgShowcase: React.FC = () => {
    const navigate = useNavigate();
    const { items, loading, refresh } = useTcgShowcase();
    const { contacts, refresh: refreshContacts, sendRequest } = useTcgContacts();
    const { getPath } = useAssetPath();

    const [popup, setPopup] = useState<{ item: TcgShowcaseItem; type: 'ask' | 'message' | 'sent' | 'contact' } | null>(null);
    const [message, setMessage] = useState('');
    const [relaxSent, setRelaxSent] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        refresh();
        refreshContacts();
    }, []);

    const handleScroll = useCallback(() => {
        if (relaxSent || !scrollRef.current || items.length === 0) return;
        const el = scrollRef.current;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
        if (atBottom) {
            setRelaxSent(true);
            fetchNui(NuiEvent.PhoneAppTcgShowcaseRelax);
        }
    }, [relaxSent, items]);

    const handleUsernameClick = (item: TcgShowcaseItem) => {
        const isContact = contacts.some(c => {
            const otherId = c.isSender ? c.targetId : c.citizenid;
            return otherId === item.citizenid && c.status === 'accepted';
        });
        setMessage('');
        if (isContact) {
            setPopup({ item, type: 'contact' });
        } else {
            setPopup({ item, type: 'ask' });
        }
    };

    const handleAddContact = async () => {
        if (!popup) return;
        const res = await sendRequest(popup.item.username, message.trim() || undefined);
        if (res?.success) {
            setPopup({ ...popup, type: 'sent' });
            refreshContacts();
        } else {
            setPopup(null);
        }
    };

    const handleClosePopup = () => {
        setPopup(null);
        setMessage('');
    };

    return (
        <>
            <h2 className="px-4 pt-1 pb-2 text-lg font-semibold text-gray-200">Vitrine</h2>
            <AppContent>
                <div
                    ref={scrollRef}
                    className="flex flex-col h-full overflow-y-auto relative"
                    onScroll={handleScroll}
                >
                    {loading ? (
                        <p className="text-sm text-gray-400 text-center mt-10">Chargement...</p>
                    ) : items.length === 0 ? (
                        <div className="text-center mt-16 text-gray-500 text-sm leading-relaxed">
                            <p>La vitrine est vide pour le moment.</p>
                            <p className="text-[10px] mt-1">Expose tes cartes depuis ta collection !</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 p-3 pb-6">
                            {items.map(item => (
                                <div key={item.id} className="flex flex-col items-center">
                                    <img
                                        src={getPath(item.cardImage)}
                                        alt={item.cardName}
                                        className="w-full rounded-xl border border-white/10"
                                        style={{ maxHeight: '55vh', objectFit: 'contain', boxShadow: '0 0 30px rgba(255, 140, 50, 0.15), 0 0 60px rgba(255, 80, 150, 0.1)' }}
                                    />
                                    <div className="mt-2 text-center">
                                        <span
                                            className="text-xs text-orange-400 font-bold cursor-pointer active:text-orange-300"
                                            onClick={() => handleUsernameClick(item)}
                                        >
                                            {item.username}
                                        </span>
                                        {item.description ? <span className="text-xs text-gray-400"> : {item.description}</span> : null}
                                    </div>
                                    <span className="text-[9px] text-gray-500 mt-0.5">{item.cardName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AppContent>

            {popup && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-40" onClick={handleClosePopup} />

                    <div
                        className="fixed z-50 bg-gray-900 rounded-2xl p-5 w-full max-w-[280px] border border-white/10"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg leading-none"
                            onClick={handleClosePopup}
                        >
                            ✕
                        </button>

                        {popup.type === 'ask' && (
                            <>
                                <p className="text-sm text-white font-bold text-center mb-2">{popup.item.username}</p>
                                <p className="text-xs text-gray-400 text-center mb-4">Vous n'avez pas cette personne dans vos contacts. Souhaitez-vous l'ajouter ?</p>
                                <div className="flex gap-2">
                                    <button
                                        className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-semibold"
                                        onClick={() => setPopup({ ...popup, type: 'message' })}
                                    >
                                        Oui
                                    </button>
                                    <button
                                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm"
                                        onClick={handleClosePopup}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </>
                        )}

                        {popup.type === 'message' && (
                            <>
                                <p className="text-sm text-white font-bold text-center mb-3">{popup.item.username}</p>
                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength={50}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') handleAddContact(); }}
                                        placeholder="Ajouter un message..."
                                        autoFocus
                                        data-phone-input="true"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 pr-10 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500/50"
                                    />
                                    <button
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 disabled:text-gray-600"
                                        onClick={handleAddContact}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex justify-end mt-1">
                                    <span className="text-[10px] text-gray-600">{message.length}/50</span>
                                </div>
                            </>
                        )}

                        {popup.type === 'contact' && (
                            <>
                                <p className="text-sm text-white font-bold text-center mb-1">{popup.item.username}</p>
                                <p className="text-xs text-gray-400 text-center mb-4">
                                    Vous avez déjà <span className="text-orange-400 font-semibold">{popup.item.username}</span> dans vos contacts. Que souhaitez-vous faire ?
                                </p>
                                <div className="flex flex-col gap-2">
                                    <button
                                        className="w-full py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-semibold"
                                        onClick={() => {
                                            handleClosePopup();
                                            navigate(`/tcg/contacts/${popup.item.citizenid}/collection`, {
                                                state: {
                                                    preselectedTrade: {
                                                        cardId: popup.item.cardId,
                                                        name: popup.item.cardName,
                                                        image: popup.item.cardImage,
                                                        obtainedAt: popup.item.createdAt,
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        🔄 Demander un échange
                                    </button>
                                    <button
                                        className="w-full py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-semibold"
                                        onClick={() => {
                                            handleClosePopup();
                                            navigate(`/tcg/contacts/${popup.item.citizenid}/collection`);
                                        }}
                                    >
                                        👁️ Voir sa collection
                                    </button>
                                </div>
                            </>
                        )}

                        {popup.type === 'sent' && (
                            <>
                                <p className="text-sm text-green-400 font-bold text-center mb-2">Demande envoyée !</p>
                                <p className="text-xs text-gray-400 text-center mb-4">{popup.item.username} recevra votre demande de contact.</p>
                                <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm" onClick={handleClosePopup}>Fermer</button>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};
