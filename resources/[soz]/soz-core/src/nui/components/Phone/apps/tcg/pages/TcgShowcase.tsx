import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAssetPath } from '../../../../../hook/assets';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import { AppContent } from '../../../components/system/AppContent';
import { useTcgShowcase } from '../hooks/useTcg';

export const TcgShowcase: React.FC = () => {
    const navigate = useNavigate();
    const { items, loading, refresh } = useTcgShowcase();
    const { getPath } = useAssetPath();

    const [relaxSent, setRelaxSent] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        refresh();
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
                                    {/* Info row: avatar left, text right */}
                                    <div
                                        className="mt-2 flex items-center gap-3 cursor-pointer active:opacity-80"
                                        onClick={() => navigate(`/tcg/profile/${item.citizenid}`)}
                                    >
                                        {/* Avatar (40px) */}
                                        <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-white/10">
                                                {item.avatar ? (
                                                    item.avatar.startsWith('data:image/') ? (
                                                        <img src={item.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <img src={getPath(item.avatar)} alt="" className="w-full h-full object-cover" />
                                                    )
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center"><span className="text-sm">👤</span></div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Text block */}
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-orange-400 font-bold">{item.username}</span>
                                                {item.description ? <span className="text-xs text-cyan-400">{item.description}</span> : null}
                                            </div>
                                            <span className="text-[9px] text-gray-500">{item.cardName}</span>
                                            {item.cardArchetype && <span className="text-[8px] text-purple-400">{item.cardArchetype}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AppContent>
        </>
    );
};