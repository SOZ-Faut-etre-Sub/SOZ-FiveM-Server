import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAssetPath } from '../../../../../hook/assets';
import { AppContent } from '../../../components/system/AppContent';
import { useTcgContacts } from '../hooks/useTcg';

// ---- Small avatar component ----
const ContactAvatar: React.FC<{ avatar: string | null; getPath: (p: string) => string; size?: string }> = ({ avatar, getPath, size = 'w-10 h-10' }) => (
    <div className={`${size} rounded-full overflow-hidden flex items-center justify-center bg-gray-800 border border-white/10 flex-shrink-0`}>
        {avatar ? (
            avatar.startsWith('data:image/') ? (
                <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
                <img src={getPath(avatar)} alt="" className="w-full h-full object-cover" />
            )
        ) : (
            <span className="text-xs">👤</span>
        )}
    </div>
);

export const TcgContacts: React.FC = () => {
    const navigate = useNavigate();
    const { getPath } = useAssetPath();
    const { contacts, loading, refresh, acceptContact, rejectContact, removeContact } = useTcgContacts();
    const [targetUsername, setTargetUsername] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);

    useEffect(() => { refresh(); }, []);

    const handleSearch = () => {
        if (!targetUsername.trim()) return;
        setMessage(null);
        navigate(`/tcg/profile/${targetUsername.trim()}`);
    };

    const accepted = contacts.filter(c => c.status === 'accepted');
    const pendingReceived = contacts.filter(c => c.status === 'pending' && !c.isSender);
    const pendingSent = contacts.filter(c => c.status === 'pending' && c.isSender);

    return (
        <>
            <h2 className="px-4 pt-1 pb-2 text-lg font-semibold" style={{ color: 'var(--text-primary, #e5e7eb)', textShadow: '0 0 3px rgba(0,0,0,0.2)' }}>Contacts TCG</h2>
            <AppContent>
                <div className="flex flex-col h-full p-3 overflow-y-auto gap-4">

                    {/* Search block */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Rechercher un joueur</span>
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
                                Voir profil
                            </button>
                        </div>

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
                                        <div
                                            className="flex items-center gap-2 cursor-pointer active:opacity-80"
                                            onClick={() => {
                                                const otherId = contact.isSender ? contact.targetId : contact.citizenid;
                                                navigate(`/tcg/profile/${otherId}`);
                                            }}
                                        >
                                            <ContactAvatar avatar={contact.avatar} getPath={getPath} />
                                            <span className="text-sm text-white font-medium">{contact.displayName}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 flex items-center justify-center text-base"
                                                onClick={async () => { await acceptContact(contact.id); refresh(); }}
                                            >
                                                ✔️
                                            </button>
                                            <button
                                                className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 flex items-center justify-center text-base"
                                                onClick={async () => { await rejectContact(contact.id); refresh(); }}
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
                                <div key={contact.id} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div
                                        className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer active:opacity-80"
                                        onClick={() => {
                                            const otherId = contact.isSender ? contact.targetId : contact.citizenid;
                                            navigate(`/tcg/profile/${otherId}`);
                                        }}
                                    >
                                        <ContactAvatar avatar={contact.avatar} getPath={getPath} />
                                        <span className="text-sm text-white flex-1">{contact.displayName}</span>
                                    </div>
                                    <span className="text-xs text-orange-300 flex-shrink-0">En attente...</span>
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
                                <div key={contact.id} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div
                                        className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer active:opacity-80"
                                        onClick={() => {
                                            const otherId = contact.isSender ? contact.targetId : contact.citizenid;
                                            navigate(`/tcg/profile/${otherId}`);
                                        }}
                                    >
                                        <ContactAvatar avatar={contact.avatar} getPath={getPath} />
                                        <span className="text-sm text-white font-medium truncate">{contact.displayName}</span>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button className="px-3 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold" onClick={() => { const otherId = contact.isSender ? contact.targetId : contact.citizenid; navigate(`/tcg/contacts/${otherId}/collection`); }}>Collection</button>
                                        <button className="px-3 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold" onClick={() => setConfirmRemoveId(contact.id)}>✕</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </AppContent>

            {/* Confirm remove popup */}
            {confirmRemoveId !== null && (() => {
                const contact = accepted.find(c => c.id === confirmRemoveId);
                if (!contact) return null;
                return (
                    <>
                        <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setConfirmRemoveId(null)} />
                        <div
                            className="fixed z-50 bg-gray-900 rounded-2xl p-5 w-full max-w-[280px] border border-white/10"
                            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <p className="text-sm text-white font-bold text-center mb-2">Supprimer un contact</p>
                            <p className="text-xs text-gray-400 text-center mb-4">
                                Voulez-vous vraiment supprimer <span className="text-orange-400 font-semibold">{contact.displayName}</span> de vos contacts ?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-semibold"
                                    onClick={() => setConfirmRemoveId(null)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-bold"
                                    onClick={async () => { await removeContact(contact.id); setConfirmRemoveId(null); refresh(); }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </>
                );
            })()}
        </>
    );
};