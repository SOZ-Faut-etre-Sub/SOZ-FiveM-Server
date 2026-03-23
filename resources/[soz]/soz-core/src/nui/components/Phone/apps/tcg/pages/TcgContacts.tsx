import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContent } from '../../../components/system/AppContent';
import { useTcgContacts } from '../hooks/useTcg';

export const TcgContacts: React.FC = () => {
    const navigate = useNavigate();
    const { contacts, loading, refresh, sendRequest, acceptContact, rejectContact, removeContact } = useTcgContacts();
    const [targetUsername, setTargetUsername] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => { refresh(); }, []);

    const handleSendRequest = async () => {
        if (!targetUsername.trim()) return;
        setMessage(null);
        const res = await sendRequest(targetUsername.trim());
        if (res?.success) { setMessage('Demande envoyée !'); setTargetUsername(''); refresh(); }
        else { setMessage(res?.message ?? 'Erreur'); }
    };

    const accepted = contacts.filter(c => c.status === 'accepted');
    const pendingReceived = contacts.filter(c => c.status === 'pending' && !c.isSender);
    const pendingSent = contacts.filter(c => c.status === 'pending' && c.isSender);

    return (
        <>
            <h2 className="px-4 pt-1 pb-2 text-lg font-semibold text-gray-200">Contacts TCG</h2>
            <AppContent>
                <div className="flex flex-col h-full p-3 overflow-y-auto gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Ajouter un contact</span>
                        <div className="flex gap-2">
                            <input type="text" value={targetUsername} onChange={e => setTargetUsername(e.target.value)} placeholder="Pseudo du joueur..."
                                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none" data-phone-input="true" />
                            <button className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold" onClick={handleSendRequest}>Envoyer</button>
                        </div>
                        {message && <p className="text-xs text-gray-300">{message}</p>}
                    </div>

                    {pendingReceived.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Demandes reçues ({pendingReceived.length})</span>
                            {pendingReceived.map(contact => (
                                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                    <span className="text-sm text-white font-medium">{contact.displayName}</span>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 rounded-md bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-semibold" onClick={() => { acceptContact(contact.id); refresh(); }}>Accepter</button>
                                        <button className="px-3 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold" onClick={() => { rejectContact(contact.id); refresh(); }}>Refuser</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {pendingSent.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Demandes envoyées ({pendingSent.length})</span>
                            {pendingSent.map(contact => (
                                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                    <span className="text-sm text-white">{contact.displayName}</span>
                                    <span className="text-xs text-orange-300">En attente...</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Contacts ({accepted.length})</span>
                        {loading ? (
                            <p className="text-sm text-gray-400 text-center mt-4">Chargement...</p>
                        ) : accepted.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center mt-4">Aucun contact pour le moment.</p>
                        ) : (
                            accepted.map(contact => (
                                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                    <span className="text-sm text-white font-medium">{contact.displayName}</span>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold" onClick={() => { const otherId = contact.isSender ? contact.targetId : contact.citizenid; navigate(`/tcg/contacts/${otherId}/collection`); }}>Collection</button>
                                        <button className="px-3 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold" onClick={() => { removeContact(contact.id); refresh(); }}>✕</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </AppContent>
        </>
    );
};
