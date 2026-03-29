import React, { useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useLocation, useNavigate } from 'react-router-dom';

import { TCG_SHOWCASE_DESC_MAX, TcgCollectionCard } from '../../../../../../shared/tcg/tcg.types';
import { useTcgShowcase, useTcgToggleProtected } from '../hooks/useTcg';

export const TcgViewer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { card: TcgCollectionCard; fromContact: boolean } | null;
    const card = state?.card ?? null;
    const fromContact = state?.fromContact ?? false;

    const { addShowcase, removeShowcase } = useTcgShowcase();
    const { toggle: toggleProtect, loading: protectLoading } = useTcgToggleProtected();
    const [message, setMessage] = useState<string | null>(null);
    const [isProtected, setIsProtected] = useState(card?.isProtected ?? false);
    const { getPath } = useAssetPath();

    // Showcase popup
    const [showExposePopup, setShowExposePopup] = useState(false);
    const [exposeDesc, setExposeDesc] = useState('');
    const [exposeLoading, setExposeLoading] = useState(false);

    if (!card) { navigate('/tcg/collection'); return null; }

    const handleBack = () => { fromContact ? navigate(-1) : navigate('/tcg/collection'); };

    const handleExpose = async () => {
        setExposeLoading(true);
        const res = await addShowcase(card.cardId, exposeDesc.trim());
        setExposeLoading(false);
        if (res?.success) {
            setShowExposePopup(false);
            setMessage('Carte exposée !');
        } else {
            setMessage(res?.message ?? 'Erreur');
        }
    };

    const handleRemoveShowcase = async () => {
        const res = await removeShowcase(card.cardId);
        if (res?.success) setMessage('Retirée de la vitrine');
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
                {!fromContact ? (
                    <div className="flex items-center gap-2 flex-wrap">
                        {card.isShowcase ? (
                            <button className="py-1.5 px-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-semibold" onClick={handleRemoveShowcase}>
                                Retirer vitrine
                            </button>
                        ) : (
                            <button className="py-1.5 px-3 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[11px] font-semibold" onClick={() => { setShowExposePopup(true); setExposeDesc(''); setMessage(null); }}>
                                Exposer
                            </button>
                        )}
                        {/* Protect toggle */}
                        <button
                            className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold border ${isProtected ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400'}`}
                            onClick={handleToggleProtect}
                            disabled={protectLoading}
                        >
                            {isProtected ? '🔒 Protégée' : '🔓 Protéger'}
                        </button>
                    </div>
                ) : <div />}
                <button className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white text-sm flex items-center justify-center" onClick={handleBack}>✕</button>
            </div>

            {/* Card image + tag + name */}
            <div className="flex-1 flex flex-col items-center justify-center px-4" onClick={e => e.stopPropagation()}>
                <div className="relative">
                    <img
                        src={getPath(card.image)}
                        alt={card.name}
                        className="max-w-full max-h-[75vh]"
                    />
                    {/* Archetype tag overlay */}
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
                <span className="mt-2 text-sm font-bold text-white text-center">{card.name}</span>
                {message && <span className="mt-1 text-[10px] text-gray-300">{message}</span>}
            </div>

            {/* Expose popup */}
            {showExposePopup && (
                <div className="absolute inset-0 bg-black/80 z-[60] flex items-center justify-center p-6" onClick={() => setShowExposePopup(false)}>
                    <div className="bg-gray-900 rounded-2xl p-5 w-full max-w-[280px] border border-white/10" onClick={e => e.stopPropagation()}>
                        <p className="text-sm text-white font-bold text-center mb-3">Exposer cette carte</p>
                        <p className="text-[10px] text-gray-400 text-center mb-3">Ajoute une description (optionnel, max {TCG_SHOWCASE_DESC_MAX} caractères)</p>
                        <input
                            type="text"
                            value={exposeDesc}
                            onChange={e => setExposeDesc(e.target.value)}
                            placeholder="Description..."
                            maxLength={TCG_SHOWCASE_DESC_MAX}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none text-center mb-1"
                            data-phone-input="true"
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
        </div>
    );
};
