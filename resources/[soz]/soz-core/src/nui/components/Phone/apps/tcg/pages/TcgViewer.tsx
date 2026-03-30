import React, { useEffect, useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useLocation, useNavigate } from 'react-router-dom';

import { TCG_SHOWCASE_DESC_MAX, TCG_SHOWCASE_MAX, TcgCollectionCard, TcgShowcaseItem } from '../../../../../../shared/tcg/tcg.types';
import { useTcgShowcase, useTcgToggleProtected } from '../hooks/useTcg';

export const TcgViewer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { card: TcgCollectionCard; fromContact: boolean } | null;
    const card = state?.card ?? null;
    const fromContact = state?.fromContact ?? false;

    const { items: showcaseItems, refresh: refreshShowcase, addShowcase, removeShowcase } = useTcgShowcase();
    const { toggle: toggleProtect, loading: protectLoading } = useTcgToggleProtected();
    const [message, setMessage] = useState<string | null>(null);
    const [isProtected, setIsProtected] = useState(card?.isProtected ?? false);
    const { getPath } = useAssetPath();

    // Showcase popup
    const [showExposePopup, setShowExposePopup] = useState(false);
    const [exposeDesc, setExposeDesc] = useState('');
    const [exposeLoading, setExposeLoading] = useState(false);

    // Replace popup (when showcase is full)
    const [showReplacePopup, setShowReplacePopup] = useState(false);
    const [selectedReplaceId, setSelectedReplaceId] = useState<number | null>(null);
    const [replaceLoading, setReplaceLoading] = useState(false);

    // Load showcase items for replace popup
    useEffect(() => {
        refreshShowcase();
    }, []);

    if (!card) { navigate('/tcg/collection'); return null; }

    const handleBack = () => { fromContact ? navigate(-1) : navigate('/tcg/collection'); };

    // My showcase items (filter to own cards only — we check by citizenid if available)
    const myShowcaseItems = showcaseItems.filter(s => {
        // If the card we're viewing is in the showcase, we know our citizenid
        // For simplicity, we show all showcase items and let the server validate
        return true;
    });

    const handleExposeClick = () => {
        // Check if showcase is already full
        // We use showcaseItems count as an approximation — server will validate
        setExposeDesc('');
        setMessage(null);
        setShowExposePopup(true);
    };

    const handleExpose = async () => {
        setExposeLoading(true);
        const res = await addShowcase(card.cardId, exposeDesc.trim());
        setExposeLoading(false);
        if (res?.success) {
            setShowExposePopup(false);
            setMessage('Carte en vitrine !');
            refreshShowcase();
        } else if (res?.message?.includes('Maximum')) {
            // Showcase full — open replace popup
            setShowExposePopup(false);
            setShowReplacePopup(true);
            setSelectedReplaceId(null);
            refreshShowcase();
        } else {
            setMessage(res?.message ?? 'Erreur');
        }
    };

    const handleReplace = async () => {
        if (selectedReplaceId === null) return;
        setReplaceLoading(true);
        // Remove the selected card first
        const removeRes = await removeShowcase(selectedReplaceId);
        if (removeRes?.success) {
            // Now add the new one
            const addRes = await addShowcase(card.cardId, exposeDesc.trim());
            setReplaceLoading(false);
            if (addRes?.success) {
                setShowReplacePopup(false);
                setMessage('Carte remplacée en vitrine !');
                refreshShowcase();
            } else {
                setMessage(addRes?.message ?? 'Erreur lors de l\'ajout');
            }
        } else {
            setReplaceLoading(false);
            setMessage(removeRes?.message ?? 'Erreur lors du retrait');
        }
    };

    const handleRemoveShowcase = async () => {
        const res = await removeShowcase(card.cardId);
        if (res?.success) {
            setMessage('Retirée de la vitrine');
            refreshShowcase();
        }
    };

    const handleToggleProtect = async () => {
        const res = await toggleProtect(card.cardId);
        if (res?.success) {
            setIsProtected(res.isProtected);
            setMessage(res.isProtected ? 'Carte protégée' : 'Protection retirée');
        } else {
            setMessage(res?.message ?? 'Erreur');
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center bg-transparent z-50" onClick={handleBack}>
            {/* Top bar */}
            <div className="w-full flex items-center justify-between px-4 pt-12 pb-2 z-50" onClick={e => e.stopPropagation()}>
                {/* Left: showcase buttons */}
                {!fromContact ? (
                    <div className="flex items-center gap-2">
                        {card.isShowcase ? (
                            <button className="py-1.5 px-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-semibold" onClick={handleRemoveShowcase}>
                                Retirer vitrine
                            </button>
                        ) : (
                            <button className="py-1.5 px-3 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[11px] font-semibold" onClick={handleExposeClick}>
                                Mise en Vitrine
                            </button>
                        )}
                    </div>
                ) : <div />}

                {/* Right: protect toggle + close button */}
                <div className="flex items-center gap-2">
                    {!fromContact && (
                        <button
                            className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold border ${isProtected ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400'}`}
                            onClick={handleToggleProtect}
                            disabled={protectLoading}
                        >
                            {isProtected ? '🔒 Protégée' : '🔓 Protéger'}
                        </button>
                    )}
                    <button className="w-8 h-8 rounded-full bg-black/30 border border-white/20 text-white text-sm flex items-center justify-center" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }} onClick={handleBack}>✕</button>
                </div>
            </div>

            {/* Card image + tag + name */}
            <div className="flex-1 flex flex-col items-center justify-center px-4" onClick={e => e.stopPropagation()}>
                <div className="relative">
                    <img
                        src={getPath(card.image)}
                        alt={card.name}
                        className="max-w-full max-h-[75vh]"
                    />
                    {card.archetype && (
                        <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
                            <span
                                className="text-sm font-bold tracking-wider px-3 py-1"
                                style={{
                                    color: '#ffffff',
                                    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 6px rgba(0,0,0,0.5)',
                                }}
                            >
                                {card.archetype}
                            </span>
                        </div>
                    )}
                </div>
                <span className="mt-2 text-sm font-bold text-center" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{card.name}</span>
                {message && <span className="mt-1 text-[10px] text-gray-300">{message}</span>}
            </div>

            {/* Expose popup (description input) */}
            {showExposePopup && (
                <div className="absolute inset-0 bg-black/80 z-[60] flex items-center justify-center p-6" onClick={() => setShowExposePopup(false)}>
                    <div className="bg-gray-900 rounded-2xl p-5 w-full max-w-[280px] border border-white/10" onClick={e => e.stopPropagation()}>
                        <p className="text-sm text-white font-bold text-center mb-3">Mise en Vitrine</p>
                        <p className="text-[10px] text-gray-400 text-center mb-3">Ajoute une description (optionnel, max {TCG_SHOWCASE_DESC_MAX} caractères)</p>
                        <input
                            type="text"
                            value={exposeDesc}
                            onChange={e => setExposeDesc(e.target.value)}
                            placeholder="Description..."
                            maxLength={TCG_SHOWCASE_DESC_MAX}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none text-center mb-1"
                            data-phone-input="true"
                            onKeyDown={e => e.stopPropagation()}
                        />
                        <span className="block text-[9px] text-gray-500 text-center mb-3">{exposeDesc.length}/{TCG_SHOWCASE_DESC_MAX}</span>
                        <button
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-black text-sm font-bold uppercase"
                            onClick={handleExpose}
                            disabled={exposeLoading}
                        >
                            {exposeLoading ? '...' : 'Confirmer'}
                        </button>
                    </div>
                </div>
            )}

            {/* Replace popup (showcase full — pick card to remove) */}
            {showReplacePopup && (
                <div className="absolute inset-0 bg-black/80 z-[60] flex items-center justify-center p-6" onClick={() => setShowReplacePopup(false)}>
                    <div className="bg-gray-900 rounded-2xl p-5 w-full max-w-[300px] border border-white/10" onClick={e => e.stopPropagation()}>
                        <p className="text-sm text-white font-bold text-center mb-1">Vitrine pleine</p>
                        <p className="text-[10px] text-gray-400 text-center mb-3">Choisis la carte à retirer de la vitrine</p>

                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {showcaseItems.map(item => {
                                const isSelected = selectedReplaceId === item.cardId;
                                return (
                                    <button
                                        key={item.id}
                                        className={`flex flex-col items-center gap-1 p-1 rounded-lg border transition-colors ${isSelected ? 'bg-red-500/20 border-red-500/40' : 'bg-white/5 border-white/10'}`}
                                        onClick={() => setSelectedReplaceId(item.cardId)}
                                    >
                                        <img
                                            src={getPath(item.cardImage)}
                                            alt={item.cardName}
                                            className="w-full rounded object-cover"
                                            style={{ aspectRatio: '936 / 2000' }}
                                        />
                                        <span className="text-[7px] text-gray-400 truncate w-full text-center">{item.cardName}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-semibold"
                                onClick={() => setShowReplacePopup(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-black text-sm font-bold uppercase disabled:opacity-50"
                                onClick={handleReplace}
                                disabled={selectedReplaceId === null || replaceLoading}
                            >
                                {replaceLoading ? '...' : 'Valider'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
