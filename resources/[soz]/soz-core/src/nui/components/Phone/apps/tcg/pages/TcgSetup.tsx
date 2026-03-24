import React, { useState } from 'react';

import { TCG_USERNAME_MAX, TCG_USERNAME_MIN, TCG_USERNAME_REGEX } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { useTcgProfile } from '../hooks/useTcg';

interface Props {
    onComplete: () => void;
}

export const TcgSetup: React.FC<Props> = ({ onComplete }) => {
    const { setUsername, loading } = useTcgProfile();
    const [name, setName] = useState('');
    const [step, setStep] = useState<'input' | 'confirm'>('input');
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validate = (value: string): string | null => {
        if (value.length < TCG_USERNAME_MIN) return `Minimum ${TCG_USERNAME_MIN} caractères.`;
        if (value.length > TCG_USERNAME_MAX) return `Maximum ${TCG_USERNAME_MAX} caractères.`;
        if (!TCG_USERNAME_REGEX.test(value)) return 'Lettres et chiffres uniquement.';
        return null;
    };

    const handleNext = () => {
        const err = validate(name);
        if (err) { setError(err); return; }
        setError(null);
        setStep('confirm');
    };

    const handleConfirm = async () => {
        if (confirmText !== 'OUI') { setError('Tapez exactement "OUI" pour confirmer.'); return; }
        setError(null);
        const res = await setUsername(name);
        if (res?.success) { onComplete(); }
        else { setError(res?.message ?? 'Erreur'); setStep('input'); setConfirmText(''); }
    };

    return (
        <>
            <AppTitle title="TCG — Bienvenue" />
            <AppContent>
                <div className="flex flex-col items-center h-full p-6 overflow-y-auto">
                    <div className="flex flex-col items-center gap-2 mb-8 mt-4">
                        <span className="text-2xl font-black text-cyan-400">Bienvenue !</span>
                        <span className="text-xs text-gray-400 text-center leading-relaxed">
                            Choisis ton pseudo TCG.{'\n'}Il sera visible par les autres joueurs.
                        </span>
                    </div>

                    {step === 'input' && (
                        <div className="flex flex-col gap-4 w-full max-w-[280px]">
                            <input
                                type="text"
                                value={name}
                                onChange={e => { setName(e.target.value); setError(null); }}
                                placeholder="Ton pseudo..."
                                maxLength={TCG_USERNAME_MAX}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none text-center"
                                data-phone-input="true"
                            />
                            <span className="text-[10px] text-gray-500 text-center">{name.length}/{TCG_USERNAME_MAX} — Lettres et chiffres uniquement</span>
                            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black text-sm font-bold uppercase tracking-wider" onClick={handleNext} disabled={!name.trim()}>Continuer</button>
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="flex flex-col gap-4 w-full max-w-[280px]">
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                <p className="text-xs text-amber-300 text-center leading-relaxed font-semibold">Attention, le pseudo n'est pas modifiable.</p>
                                <p className="text-sm text-white text-center mt-2 font-bold">{name}</p>
                                <p className="text-xs text-amber-300 text-center mt-3 leading-relaxed">Veuillez taper <span className="font-black">"OUI"</span> pour confirmer le pseudo.</p>
                            </div>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={e => { setConfirmText(e.target.value.toUpperCase()); setError(null); }}
                                placeholder='Tapez "OUI"'
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none text-center"
                                data-phone-input="true"
                            />
                            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black text-sm font-bold uppercase tracking-wider" onClick={handleConfirm} disabled={loading}>{loading ? '...' : 'Valider mon pseudo'}</button>
                            <button className="text-xs text-gray-500 text-center" onClick={() => { setStep('input'); setConfirmText(''); setError(null); }}>← Modifier</button>
                        </div>
                    )}
                </div>
            </AppContent>
        </>
    );
};
