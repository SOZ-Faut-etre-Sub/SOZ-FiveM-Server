import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TCG_SHOWCASE_DESC_MAX, TcgCollectionCard } from '../../../../../../shared/tcg/tcg.types';
import { useSettingsChange } from '../../../system/config/hooks/useSettingsChange';
import { useTcgShowcase, useTcgWallpaper } from '../hooks/useTcg';

export const TcgViewer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { card: TcgCollectionCard; fromContact: boolean } | null;
    const card = state?.card ?? null;
    const fromContact = state?.fromContact ?? false;

    const { setWallpaper, removeWallpaper, loading: wpLoading } = useTcgWallpaper();
    const { addShowcase, removeShowcase } = useTcgShowcase();
    const { handleSettingChange } = useSettingsChange();
    const [message, setMessage] = useState<string | null>(null);

    // Showcase popup
    const [showExposePopup, setShowExposePopup] = useState(false);
    const [exposeDesc, setExposeDesc] = useState('');
    const [exposeLoading, setExposeLoading] = useState(false);

    if (!card) { navigate('/tcg/collection'); return null; }

    const handleBack = () => { fromContact ? navigate(-1) : navigate('/tcg/collection'); };

    const handleSetWallpaper = async () => {
        setMessage(null);
        const res = await setWallpaper(card.cardId);
        if (res?.success && res.image) {
            handleSettingChange('wallpaper', { label: card.name, value: res.image });
            setMessage('Fond d\'écran défini !');
        } else { setMessage(res?.message ?? 'Erreur'); }
    };

    const handleRemoveWallpaper = async () => {
        setMessage(null);
        const res = await removeWallpaper();
        if (res?.success) {
            handleSettingChange('wallpaper', { label: 'SoZ 1', value: 'back1.webp' });
            setMessage('Fond d\'écran retiré');
        }
    };

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

    return (
        <div className="absolute inset-0 flex flex-col items-center bg-black/92 z-50" onClick={handleBack}>
            {/* Top bar */}
            <div className="w-full flex items-center justify-between px-4 pt-12 pb-2 z-50" onClick={e => e.stopPropagation()}>
                {!fromContact ? (
                    <div className="flex items-center gap-2 flex-wrap">
                        {card.isWallpaper ? (
                            <button className="py-1.5 px-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-semibold" onClick={handleRemoveWallpaper} disabled={wpLoading}>
                                {wpLoading ? '...' : 'Retirer fond'}
                            </button>
                        ) : (
                            <button className="py-1.5 px-3 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-semibold" onClick={handleSetWallpaper} disabled={wpLoading}>
                                {wpLoading ? '...' : 'Fond d\'écran'}
                            </button>
                        )}
                        {card.isShowcase ? (
                            <button className="py-1.5 px-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-semibold" onClick={handleRemoveShowcase}>
                                Retirer vitrine
                            </button>
                        ) : (
                            <button className="py-1.5 px-3 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[11px] font-semibold" onClick={() => { setShowExposePopup(true); setExposeDesc(''); setMessage(null); }}>
                                Exposer
                            </button>
                        )}
                    </div>
                ) : <div />}
                <button className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white text-sm flex items-center justify-center" onClick={handleBack}>✕</button>
            </div>

            {/* Card image + name */}
            <div className="flex-1 flex flex-col items-center justify-center px-4" onClick={e => e.stopPropagation()}>
                <img
                    src={card.image}
                    alt={card.name}
                    className="max-w-full max-h-[75vh] rounded-xl"
                    style={{ objectFit: 'contain', boxShadow: '0 0 40px rgba(185, 103, 255, 0.2), 0 0 80px rgba(0, 240, 255, 0.1)' }}
                />
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
