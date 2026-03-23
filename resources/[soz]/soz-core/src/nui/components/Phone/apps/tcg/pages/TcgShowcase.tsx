import React, { useCallback, useEffect, useRef, useState } from 'react';
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

    const [popup, setPopup] = useState<{ item: TcgShowcaseItem; type: 'ask' | 'sent' } | null>(null);
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
        if (isContact) {
            navigate(`/tcg/contacts/${item.citizenid}/collection`);
        } else {
            setPopup({ item, type: 'ask' });
        }
    };

    const handleAddContact = async () => {
        if (!popup) return;
        const res = await sendRequest(popup.item.username);
        if (res?.success) {
            setPopup({ ...popup, type: 'sent' });
            refreshContacts();
        } else {
            setPopup(null);
        }
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
                                        src={item.cardImage}
                                        alt={item.cardName}
                                        className="w-full rounded-xl border border-white/10"
                                        style={{ maxHeight: '55vh', objectFit: 'contain', boxShadow: '0 0 30px rgba(255, 140, 50, 0.15), 0 0 60px rgba(255, 80, 150, 0.1)' }}
                                    />
                                    <div className="mt-2 text-center">
                                        <span className="text-xs text-orange-400 font-bold cursor-pointer active:text-orange-300" onClick={() => handleUsernameClick(item)}>{item.username}</span>
                                        {item.description ? <span className="text-xs text-gray-400"> : {item.description}</span> : null}
                                    </div>
                                    <span className="text-[9px] text-gray-500 mt-0.5">{item.cardName}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {popup && (
                        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setPopup(null)}>
                            <div className="bg-gray-900 rounded-2xl p-5 w-full max-w-[280px] border border-white/10" onClick={e => e.stopPropagation()}>
                                {popup.type === 'ask' ? (
                                    <>
                                        <p className="text-sm text-white font-bold text-center mb-2">{popup.item.username}</p>
                                        <p className="text-xs text-gray-400 text-center mb-4">Vous n'avez pas cette personne dans vos contacts. Souhaitez-vous l'ajouter ?</p>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-semibold" onClick={handleAddContact}>Ajouter</button>
                                            <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm" onClick={() => setPopup(null)}>Annuler</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-green-400 font-bold text-center mb-2">Demande envoyée !</p>
                                        <p className="text-xs text-gray-400 text-center mb-4">{popup.item.username} recevra votre demande de contact.</p>
                                        <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm" onClick={() => setPopup(null)}>Fermer</button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </AppContent>
        </>
    );
};
