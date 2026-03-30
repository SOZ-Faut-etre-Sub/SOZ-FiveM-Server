import React, { useEffect } from 'react';

import { TcgMarketTier } from '../../../../../../shared/tcg/tcg.types';
import { AppContent } from '../../../components/system/AppContent';
import { useTcgMarket } from '../hooks/useTcg';

const tierConfig: Record<TcgMarketTier, { label: string; color: string; bg: string }> = {
    RARE: { label: 'Rare', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
    COMMUNE_SURVEILLER: { label: 'À surveiller', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
    COMMUNE: { label: 'Commune', color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.1)' },
};

export const TcgMarket: React.FC = () => {
    const { prices, loading, refresh } = useTcgMarket();

    useEffect(() => { refresh(); }, []);

    const formatPrice = (n: number) => n.toLocaleString('fr-FR');

    return (
        <AppContent>
            <div className="flex flex-col h-full p-4 overflow-y-auto">
                {/* Header with golden chart icon */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <span className="text-sm font-bold tracking-wider" style={{ color: '#fbbf24' }}>Cours des Sets</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                </div>

                <p className="text-[10px] text-gray-500 text-center mb-4">
                    Prix de rachat pour un set de 7 cartes du même archétype
                </p>

                {loading ? (
                    <p className="text-sm text-gray-400 text-center py-8">Chargement...</p>
                ) : prices.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">Aucun cours disponible</p>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        {prices.map((p) => {
                            const tier = tierConfig[p.tier] ?? tierConfig.COMMUNE;
                            return (
                                <div
                                    key={p.archetype}
                                    className="flex items-center justify-between p-2.5 rounded-lg border"
                                    style={{ background: tier.bg, borderColor: `${tier.color}22` }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                                            style={{ background: `${tier.color}30`, color: tier.color }}
                                        >
                                            {p.rank}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary, #fff)', textShadow: '0 0 3px rgba(0,0,0,0.15)' }}>{p.archetype}</span>
                                            <span className="text-[9px]" style={{ color: tier.color }}>{tier.label}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold" style={{ color: tier.color }}>
                                        ${formatPrice(p.setPrice)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Legend */}
                <div className="mt-4 flex justify-center gap-4">
                    {Object.entries(tierConfig).map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                            <span className="text-[9px]" style={{ color: cfg.color }}>{cfg.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AppContent>
    );
};
