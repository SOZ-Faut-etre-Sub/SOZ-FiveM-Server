import { HomeIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { FunctionComponent, useMemo } from 'react';

import { NuiEvent } from '../../../../../shared/event/nui';
import { ClothingShopCategory } from '../../../../../shared/shop';
import { fetchNui } from '../../../../fetch';

interface BreadcrumbProps {
    shopCategories: Record<number, ClothingShopCategory>;
    selectedCategory?: number;
    onNavigate: (categoryId?: number) => void;
}

export const Breadcrumb: FunctionComponent<BreadcrumbProps> = ({ shopCategories, selectedCategory, onNavigate }) => {
    const breadcrumbPath = useMemo(() => {
        const paths: ClothingShopCategory[] = [];

        if (!selectedCategory) {
            return paths;
        }

        let currentCategory = shopCategories[selectedCategory];

        while (currentCategory) {
            paths.unshift(currentCategory);
            currentCategory = currentCategory.parentId ? shopCategories[currentCategory.parentId] : null;
        }

        return paths;
    }, [shopCategories, selectedCategory]);

    const handleNavigate = (path: number | undefined) => {
        fetchNui(NuiEvent.ClothingShopBackspace);
        onNavigate(path);
    };

    return (
        <nav aria-label="Breadcrumb" className="flex mx-5 shrink-0">
            <ol role="list" className="flex items-center gap-2">
                <li>
                    <div>
                        <button
                            onClick={() => handleNavigate(undefined)}
                            className="transition-colors text-gray-200 hover:text-gray-300"
                        >
                            <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                        </button>
                    </div>
                </li>
                {breadcrumbPath.map((category, index) => (
                    <li key={category.id} className="h-full">
                        <div className="flex items-center">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                                className="size-5 shrink-0 text-gray-300"
                            >
                                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                            </svg>
                            <button
                                onClick={() => {
                                    if (index === breadcrumbPath.length - 1) {
                                        return;
                                    }
                                    handleNavigate(category.id);
                                }}
                                className={clsx('ml-2 text-sm transition-colors', {
                                    'text-white font-semibold': index === breadcrumbPath.length - 1,
                                    'text-gray-200 hover:text-gray-300 font-medium':
                                        index !== breadcrumbPath.length - 1,
                                })}
                                disabled={index === breadcrumbPath.length - 1}
                            >
                                {category.name}
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
