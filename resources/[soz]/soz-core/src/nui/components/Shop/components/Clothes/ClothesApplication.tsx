import { animated, useSpring } from '@react-spring/web';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';

import { NuiEvent } from '../../../../../shared/event/nui';
import { ClothingShopCategory } from '../../../../../shared/shop';
import { fetchNui } from '../../../../fetch';
import { useAssetPath } from '../../../../hook/assets';
import { useMinimap } from '../../../../hook/data';
import { GlassMorphismContainer } from '../../../Styleguide/GlassMorphismContainer';
import { Breadcrumb } from './Breadcrumb';
import { ContentWrapper } from './ContentWrapper';

interface ClothesApplicationProps extends PropsWithChildren {
    shopBrand: string;
    shopCategories?: Record<number, ClothingShopCategory>;
    selectedCategory?: number;
    onNavigate?: (categoryId?: number) => void;
}

export const ClothesApplication: FunctionComponent<ClothesApplicationProps> = ({
    children,
    shopBrand,
    shopCategories,
    selectedCategory,
    onNavigate,
}) => {
    const minimap = useMinimap();
    const { getPath } = useAssetPath();

    const [freeCamera, setFreeCamera] = useState<boolean>(false);

    const contentStyles = useSpring({
        from: {
            x: 50,
            opacity: 0,
        },
        to: {
            x: 0,
            right: `${(minimap.left + 0.005) * 100}vw`,
            opacity: 0.99999,
        },
    });

    const handleToggleFreeCamera = () => {
        setFreeCamera(prev => {
            const newState = !prev;

            fetchNui(NuiEvent.ClothShopToggleCamera, newState);
            return newState;
        });
    };

    return (
        <div className="absolute font-prompt flex justify-end items-center h-full w-full z-10 overflow-hidden">
            <animated.div style={contentStyles} className="relative">
                <GlassMorphismContainer borderClassName="rounded-lg" className="flex flex-col  h-[800px] w-[600px]">
                    <header className="h-32 flex flex-col justify-between">
                        <div
                            className="bg-no-repeat bg-contain bg-center grow m-4"
                            style={{ backgroundImage: `url(${getPath(`images/shop/${shopBrand}/logo.webp`)})` }}
                        />

                        {shopCategories && onNavigate && (
                            <Breadcrumb
                                shopCategories={shopCategories}
                                selectedCategory={selectedCategory}
                                onNavigate={onNavigate}
                            />
                        )}
                    </header>

                    <ContentWrapper>{children}</ContentWrapper>

                    <footer className="px-4 py-2">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleToggleFreeCamera}>
                            <div className="relative">
                                <div className="border border-white size-4 rounded-full bg-black/20">
                                    {freeCamera && (
                                        <div className="absolute top-0.5 left-0.5 size-3 rounded-full bg-white" />
                                    )}
                                </div>
                            </div>

                            <h3 className="text-white">Libérer la caméra</h3>
                        </div>
                    </footer>
                </GlassMorphismContainer>
            </animated.div>
        </div>
    );
};
