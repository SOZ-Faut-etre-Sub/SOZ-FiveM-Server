import { fetchNui } from '@public/nui/fetch';
import { useAssetPath } from '@public/nui/hook/assets';
import { useBackspace } from '@public/nui/hook/control';
import { useNuiEvent, useNuiFocus } from '@public/nui/hook/nui';
import { PetOrder, petOrderMeta } from '@public/shared/animal';
import { NuiEvent } from '@public/shared/event/nui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { GameCanvasBox } from '../Styleguide/GameCanvasBox';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';
import { useHudColor } from './hooks/useHudColor';

export const PetManagement: React.FC = () => {
    const glassmorphism = useSelector((state: RootState) => state.hud.useGlassmorphism);

    const defaultLabel = '';
    const EXCLUDED_KEYS = ['z', 'q', 's', 'd', 'w', 'a'];
    const [hasAppeared, setHasAppeared] = useState(false);
    const [activeLabel, setActiveLabel] = useState<string>(defaultLabel);
    const [avalaibleOrders, setAvailableOrders] = useState<PetOrder[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const preventOpen = useRef(false);
    const preventOpenTimeout = useRef<NodeJS.Timeout | null>(null);
    const { getPath } = useAssetPath();
    useBackspace(() => {
        hideManager();
    });

    const triggerPreventOpen = () => {
        preventOpen.current = true;
        if (preventOpenTimeout.current) {
            clearTimeout(preventOpenTimeout.current);
        }
        preventOpenTimeout.current = setTimeout(() => {
            preventOpen.current = false;
            preventOpenTimeout.current = null;
        }, 200); // délai court pour laisser le clic se finir
    };

    useNuiFocus(isVisible, isVisible, false);

    useNuiEvent('pet_manager', 'ShowPetManager', data => {
        if (preventOpen.current && data?.open) return;

        preventOpen.current = false;

        setAvailableOrders(data?.actions || []);
        if (data?.open) {
            showManager();
        } else {
            hideManager();
        }
        setTimeout(() => setHasAppeared(true), 10);
    });

    const onKeyUpReceived = useCallback((event: KeyboardEvent) => {
        preventOpen.current = false; // toujours débloquer

        const key = event.key.toLowerCase();
        if (EXCLUDED_KEYS.includes(key)) return;

        hideManager();
    }, []);
    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    const showManager = () => {
        setIsVisible(true);
        setActiveLabel(defaultLabel);

        // Reset hasAppeared, puis set à true après un délai (50ms)
        setHasAppeared(false);
        setTimeout(() => {
            setHasAppeared(true);
        }, 50);
    };

    const hideManager = () => {
        setIsVisible(false);
        setHasAppeared(false);
        setActiveLabel(defaultLabel);
    };

    const giveOrder = async (order: PetOrder) => {
        preventOpen.current = true;
        await fetchNui(NuiEvent.PetAnimalOrder, order);
        hideManager();
    };

    const getInformations = async () => {
        triggerPreventOpen();
        await fetchNui(NuiEvent.PetDisplayState);
        hideManager();
    };

    const options = useMemo(() => {
        return avalaibleOrders.map(order => ({
            label: petOrderMeta[order]?.label,
            icon: petOrderMeta[order]?.icon,
            value: order,
        }));
    }, [avalaibleOrders]);

    const size = 500;
    const menuItems = useMemo(() => {
        const innerRadius = size / 3.3;
        const outerRadius = size / 2;
        const cx = size / 2;
        const cy = size / 2;
        const cornerRadius = 10;
        const n = options.length;
        const gap = 3;
        const anglePerSlice = 360 / n - gap;

        return options.map((opt, i) => {
            const baseAngle = -90;
            const startAngle = baseAngle + i * (360 / n) + gap / 2;
            const endAngle = startAngle + anglePerSlice;

            const startRad = (Math.PI / 180) * startAngle;
            const endRad = (Math.PI / 180) * endAngle;
            const d_angle_outer_rad = cornerRadius / outerRadius;
            const d_angle_inner_rad = cornerRadius / innerRadius;
            const startRadOuter = startRad + d_angle_outer_rad;
            const endRadOuter = endRad - d_angle_outer_rad;
            const startRadInner = startRad + d_angle_inner_rad;
            const endRadInner = endRad - d_angle_inner_rad;
            const p_outer_start_x = cx + outerRadius * Math.cos(startRadOuter);
            const p_outer_start_y = cy + outerRadius * Math.sin(startRadOuter);
            const p_outer_end_x = cx + outerRadius * Math.cos(endRadOuter);
            const p_outer_end_y = cy + outerRadius * Math.sin(endRadOuter);
            const p_inner_start_x = cx + innerRadius * Math.cos(startRadInner);
            const p_inner_start_y = cy + innerRadius * Math.sin(startRadInner);
            const p_inner_end_x = cx + innerRadius * Math.cos(endRadInner);
            const p_inner_end_y = cy + innerRadius * Math.sin(endRadInner);
            const p_corner_1_x = cx + (outerRadius - cornerRadius) * Math.cos(startRad);
            const p_corner_1_y = cy + (outerRadius - cornerRadius) * Math.sin(startRad);
            const p_corner_2_x = cx + (outerRadius - cornerRadius) * Math.cos(endRad);
            const p_corner_2_y = cy + (outerRadius - cornerRadius) * Math.sin(endRad);
            const p_corner_3_x = cx + (innerRadius + cornerRadius) * Math.cos(endRad);
            const p_corner_3_y = cy + (innerRadius + cornerRadius) * Math.sin(endRad);
            const p_corner_4_x = cx + (innerRadius + cornerRadius) * Math.cos(startRad);
            const p_corner_4_y = cy + (innerRadius + cornerRadius) * Math.sin(startRad);
            const largeArc = anglePerSlice > 180 ? 1 : 0;
            const pathData = `M ${p_corner_1_x} ${p_corner_1_y} A ${cornerRadius} ${cornerRadius} 0 0 1 ${p_outer_start_x} ${p_outer_start_y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${p_outer_end_x} ${p_outer_end_y} A ${cornerRadius} ${cornerRadius} 0 0 1 ${p_corner_2_x} ${p_corner_2_y} L ${p_corner_3_x} ${p_corner_3_y} A ${cornerRadius} ${cornerRadius} 0 0 1 ${p_inner_end_x} ${p_inner_end_y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${p_inner_start_x} ${p_inner_start_y} A ${cornerRadius} ${cornerRadius} 0 0 1 ${p_corner_4_x} ${p_corner_4_y} Z`;

            const midAngle = (startAngle + endAngle) / 2;
            const iconRadius = (innerRadius + outerRadius) / 2;
            const iconX = cx + iconRadius * Math.cos((Math.PI / 180) * midAngle);
            const iconY = cy + iconRadius * Math.sin((Math.PI / 180) * midAngle);

            return { ...opt, pathData, iconPosition: { x: iconX, y: iconY }, angle: midAngle };
        });
    }, [options]);

    const { glassmorphismColors, color } = useHudColor();
    const backgroundColor = glassmorphismColors.background;
    const hoverBackgroundColor = glassmorphismColors.background ?? glassmorphismColors.background;
    const borderColor = glassmorphismColors.border;

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center">
            <div
                className="absolute h-12 bottom-[10%] cursor-pointer"
                onClick={() => {
                    getInformations();
                }}
                onAuxClick={() => {
                    getInformations();
                }}
            >
                <GlassMorphismContainer
                    borderClassName="rounded-full"
                    className="flex items-center gap-3 px-5 h-12 w-fit"
                    rounded={34}
                    showBorderOnHover
                    disableBorder
                >
                    <div className="flex flex-col">
                        <span className="truncate" style={{ color: color }}>
                            État de l'animal
                        </span>
                    </div>
                </GlassMorphismContainer>
            </div>
            <div className="relative" style={{ width: size, height: size }}>
                <div
                    className="
    absolute top-1/2 left-1/2 z-[2] flex h-[50px] w-[180px]
    -translate-x-1/2 -translate-y-1/2 items-center justify-center
    rounded-[25px] text-[1.3em] text-white
    pointer-events-none text-center shadow-[0_2px_10px_rgba(0,0,0,0.08)]
    transition-colors duration-200
  "
                    style={{
                        textShadow: `
    0 0 10px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(0, 0, 0, 0.4),
    0 0 50px rgba(0, 0, 0, 0.3)
  `,
                    }}
                >
                    {activeLabel}
                </div>

                {menuItems.map((item, index) => {
                    return (
                        <div
                            key={`icon-${index}`}
                            className={`
      pointer-events-none absolute z-10
      transition-all duration-500 ease-out origin-center
      ${isVisible && hasAppeared ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
      drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]
    `}
                            style={{
                                left: `${item.iconPosition.x - 28}px`,
                                top: `${item.iconPosition.y - 28}px`,
                                transitionDelay: `${index * 80}ms`,
                            }}
                        >
                            <img className="size-14" src={getPath(`images/pet/${item.icon ?? 'missing'}.webp`)} />
                        </div>
                    );
                })}

                <GameCanvasBox blur={false} cantBeHidden>
                    <svg width={size} height={size} className="absolute top-0 left-0 pointer-events-none">
                        <defs>
                            {menuItems.map((item, index) => {
                                const angle = ((item.angle || 0) + 360) % 360;
                                const x1 = 50 - 50 * Math.cos((angle * Math.PI) / 180);
                                const y1 = 50 - 50 * Math.sin((angle * Math.PI) / 180);
                                const x2 = 50 + 50 * Math.cos((angle * Math.PI) / 180);
                                const y2 = 50 + 50 * Math.sin((angle * Math.PI) / 180);

                                return (
                                    <linearGradient
                                        key={`border-gradient-${index}`}
                                        id={`border-gradient-${index}`}
                                        x1={`${x1}%`}
                                        y1={`${y1}%`}
                                        x2={`${x2}%`}
                                        y2={`${y2}%`}
                                    >
                                        <stop offset="0%" stopColor={borderColor} stopOpacity="1" />
                                        <stop offset="25%" stopColor={borderColor} stopOpacity="0.2" />
                                        <stop offset="75%" stopColor={borderColor} stopOpacity="0.2" />
                                        <stop offset="100%" stopColor={borderColor} stopOpacity="1" />
                                    </linearGradient>
                                );
                            })}

                            {/* Backdrop blur clipPaths for each slice */}
                            {menuItems.map((item, index) => (
                                <clipPath key={`clip-slice-${index}`} id={`clip-slice-${index}`}>
                                    <path d={item.pathData} />
                                </clipPath>
                            ))}
                        </defs>

                        {menuItems.map((item, index) => (
                            <g
                                key={`slice-${index}`}
                                className={`
  pointer-events-auto cursor-pointer transition-all duration-500 ease-out origin-center
  ${hasAppeared ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
`}
                                style={{
                                    transitionDelay: !activeLabel && hasAppeared ? `${index * 60}ms` : '0ms',
                                }}
                                onMouseEnter={() => setActiveLabel(item.label)}
                                onMouseLeave={() => setActiveLabel(defaultLabel)}
                                onClick={() => {
                                    triggerPreventOpen();
                                    giveOrder(item.value as PetOrder);
                                    hideManager();
                                }}
                                onAuxClick={() => {
                                    triggerPreventOpen();
                                    giveOrder(item.value as PetOrder);
                                    hideManager();
                                }}
                            >
                                {/* Backdrop blur layer, clipped to the slice */}
                                {glassmorphism && (
                                    <foreignObject
                                        x={0}
                                        y={0}
                                        width={size}
                                        height={size}
                                        clipPath={`url(#clip-slice-${index})`}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                backdropFilter: 'blur(5px)',
                                                WebkitBackdropFilter: 'blur(5px)',
                                            }}
                                        />
                                    </foreignObject>
                                )}

                                {/* Fond */}
                                <path
                                    d={item.pathData}
                                    fill={activeLabel === item.label ? hoverBackgroundColor : backgroundColor}
                                    stroke="none"
                                />

                                {/* Bordure dynamique */}
                                <path
                                    d={item.pathData}
                                    fill="none"
                                    stroke={activeLabel === item.label ? `url(#border-gradient-${index})` : 'none'}
                                    strokeWidth={activeLabel === item.label ? 2 : 1}
                                    opacity={activeLabel === item.label ? 1 : 0.4}
                                    style={{
                                        transition: 'opacity 0.4s ease, stroke-width 0.4s ease',
                                    }}
                                />
                            </g>
                        ))}
                    </svg>
                </GameCanvasBox>
            </div>
        </div>
    );
};
