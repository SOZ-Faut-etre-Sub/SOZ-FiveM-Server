import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContent } from '../../../components/system/AppContent';
import { useTcgContacts } from '../hooks/useTcg';

export const TcgContacts: React.FC = () => {
    const navigate = useNavigate();
    const { contacts, loading, refresh, sendRequest, acceptContact, rejectContact, removeContact } = useTcgContacts();
    const [targetUsername, setTargetUsername] = useState('');
    const [step, setStep] = useState<'search' | 'message'>('search');
    const [contactMessage, setContactMessage] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => { refresh(); }, []);

    const handleSearch = async () => {
        if (!targetUsername.trim()) return;
        setMessage(null);

        // On tente d'envoyer sans message juste pour vérifier si l'utilisateur existe
        // Si le backend retourne une erreur "introuvable", on affiche l'erreur
        // Sinon on passe à l'étape message
        // Pour éviter un double envoi, on peut faire une recherche dédiée si tu as un endpoint,
        // sinon on passe directement à l'étape message (le vrai check se fera à l'envoi)
        setStep('message');
    };

    const handleSendRequest = async () => {
        if (!targetUsername.trim()) return;
        setMessage(null);
        const res = await sendRequest(targetUsername.trim(), contactMessage.trim() || undefined);
        if (res?.success) {
            setMessage({ text: 'Demande envoyée !', type: 'success' });
            setTargetUsername('');
            setContactMessage('');
            setStep('search');
            refresh();
        } else {
            // L'utilisateur n'existe pas ou autre erreur → retour à la recherche avec message d'erreur
            setMessage({ text: res?.message ?? `Pseudo "${targetUsername}" introuvable.`, type: 'error' });
            setStep('search');
            setContactMessage('');
        }
    };

    const handleCancelMessage = () => {
        setStep('search');
        setContactMessage('');
        setMessage(null);
    };

    const accepted = contacts.filter(c => c.status === 'accepted');
    const pendingReceived = contacts.filter(c => c.status === 'pending' && !c.isSender);
    const pendingSent = contacts.filter(c => c.status === 'pending' && c.isSender);

    return (
        <>
            <h2 className="px-4 pt-1 pb-2 text-lg font-semibold text-gray-200">Contacts TCG</h2>
            <AppContent>
                <div className="flex flex-col h-full p-3 overflow-y-auto gap-4">

                    {/* Bloc ajout contact */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Ajouter un contact</span>

                        {step === 'search' && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={targetUsername}
                                    onChange={e => { setTargetUsername(e.target.value); setMessage(null); }}
                                    onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') handleSearch(); }}
                                    placeholder="Pseudo du joueur..."
                                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none"
                                    data-phone-input="true"
                                />
                                <button
                                    className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold"
                                    onClick={handleSearch}
                                    disabled={!targetUsername.trim()}
                                >
                                    Suivant
                                </button>
                            </div>
                        )}

                        {step === 'message' && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-xs text-gray-400">Pour :</span>
                                    <span className="text-xs text-cyan-300 font-semibold">{targetUsername}</span>
                                    <button className="ml-auto text-[10px] text-gray-500 hover:text-gray-300" onClick={handleCancelMessage}>← Modifier</button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength={50}
                                        value={contactMessage}
                                        onChange={e => setContactMessage(e.target.value)}
                                        onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') handleSendRequest(); }}
                                        placeholder="Ajouter un message..."
                                        autoFocus
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500/50"
                                        data-phone-input="true"
                                    />
                                    <button
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
                                        onClick={handleSendRequest}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <span className="text-[10px] text-gray-600">{contactMessage.length}/50</span>
                                </div>
                            </div>
                        )}

                        {message && (
                            <p className={`text-xs ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>

                    {pendingReceived.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Demandes reçues ({pendingReceived.length})</span>
                            {pendingReceived.map(contact => (
                                <div key={contact.id} className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white font-medium">{contact.displayName}</span>
                                        <div className="flex gap-2">
                                            <button
                                                className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 flex items-center justify-center text-base"
                                                onClick={() => { acceptContact(contact.id); refresh(); }}
                                            >
                                                ✔️
                                            </button>
                                            <button
                                                className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 flex items-center justify-center text-base"
                                                onClick={() => { rejectContact(contact.id); refresh(); }}
                                            >
                                                ✖️
                                            </button>
                                        </div>
                                    </div>
                                    {contact.message && (
                                        <p className="text-[10px] text-gray-400 italic bg-white/5 px-2 py-1 rounded">"{contact.message}"</p>
                                    )}
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
