import { fetchNui } from '@public/nui/fetch';
import { useBackspace } from '@public/nui/hook/control';
import { useItem, useItems } from '@public/nui/hook/data';
import { useNuiEvent, useNuiFocus } from '@public/nui/hook/nui';
import { CraftsList } from '@public/shared/craft/craft';
import { NuiEvent } from '@public/shared/event';
import cn from 'classnames';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useHudColor } from '../Hud/hooks/useHudColor';
import {
    ApplicationButton,
    ApplicationCard,
    ApplicationCheckbox,
    ApplicationContainer,
    ApplicationContent,
} from '../Styleguide/Application';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';
import { ItemIcon } from './ItemIcon';

export type Selected = {
    id: string;
    category: string;
    outputItem: string;
};

export const CraftApp: FunctionComponent = () => {
    const [title, setTitle] = useState<null | string>(null);
    const [subtitle, setSubTitle] = useState<null | string>(null);
    const [craftList, setCraftList] = useState<null | CraftsList>(null);
    const [selected, setSelected] = useState<null | Selected>(null);
    const [showUnavailable, setShowUnavailable] = useState<boolean>(true);
    const [isCrafting, setIsCrafting] = useState<boolean>(false);

    useNuiFocus(craftList !== null, craftList !== null, craftList !== null, [], craftList !== null);

    useNuiEvent('craft', 'ShowCraft', data => {
        const firstCategory = Object.keys(data.categories)[0] || null;
        const firstItem = firstCategory ? Object.keys(data.categories[firstCategory].recipes)[0] : null;
        setSelected({
            id: firstItem,
            category: Object.keys(data.categories)[0],
            outputItem: data.categories[firstCategory].recipes[firstItem].outputItem ?? firstItem,
        });
        setCraftList(data);
        setTitle(data.title);
        setSubTitle(data.subtitle);
    });

    useBackspace(() => {
        setCraftList(null);
    });

    const doCraft = useCallback(
        async (amount: number) => {
            if (!selected) {
                return;
            }

            setIsCrafting(true);

            let list: CraftsList = null;

            for (let i = 0; i < amount; i++) {
                list = await fetchNui<any, CraftsList>(NuiEvent.CraftDoRecipe, {
                    craftId: selected.id,
                    category: selected.category,
                    type: craftList.type,
                });

                setCraftList(state => {
                    if (!state) {
                        return null;
                    }

                    return list;
                });

                if (!list.categories[selected.category].recipes[selected.id].canCraft || list.cancelled) {
                    break;
                }
            }

            setIsCrafting(false);

            setCraftList(state => {
                if (!state) {
                    return null;
                }

                return list;
            });
        },
        [selected]
    );

    if (!craftList || !selected) {
        return null;
    }

    return (
        <ApplicationContainer size="full" onClickOutside={() => setCraftList(null)}>
            <ApplicationContent open={Boolean(craftList)}>
                <div className="flex flex-col gap-5 w-full text-white">
                    <header className="flex gap-10">
                        <div className="flex justify-between items-center w-4/5">
                            <div>
                                <h1 className="uppercase text-base font-light">{subtitle}</h1>
                                <h2 className="uppercase text-2xl font-semibold">{title}</h2>
                            </div>
                            <div className="flex items-center gap-1">
                                <ApplicationCheckbox
                                    checked={showUnavailable}
                                    onChange={() => setShowUnavailable(show => !show)}
                                />
                                <label className="ml-2">Afficher les objets indisponibles</label>
                            </div>
                        </div>
                        <div className="flex justify-end items-center w-1/5">
                            <ApplicationButton variant="secondary" onClick={() => setCraftList(null)}>
                                Fermer
                            </ApplicationButton>
                        </div>
                    </header>
                    <section className="flex gap-10 min-h-0">
                        <div className="flex flex-col w-4/5 gap-5 overflow-y-auto h-full pr-4 scrollbar scrollbar-w-1.5 scrollbar-thumb-white scrollbar-track-[#111111CC] scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                            {Object.keys(craftList.categories)
                                .sort((a, b) => a.localeCompare(b))
                                .map(item => (
                                    <ItemTierList
                                        key={'craft_' + item}
                                        craftList={craftList}
                                        selected={selected}
                                        setSelected={setSelected}
                                        category={item}
                                        showUnavailable={showUnavailable}
                                    />
                                ))}
                        </div>
                        <div className="flex justify-end items-center w-1/5">
                            <SelectedItem
                                isCrafting={isCrafting}
                                craftList={craftList}
                                doCraft={doCraft}
                                selected={selected}
                            />
                        </div>
                    </section>
                </div>
            </ApplicationContent>
        </ApplicationContainer>
    );
};

type ItemTierListProps = {
    selected: Selected;
    setSelected: (selected: Selected) => void;
    craftList: CraftsList;
    category: string;
    showUnavailable: boolean;
};

const ItemTierList: FunctionComponent<ItemTierListProps> = ({
    selected,
    setSelected,
    craftList,
    category,
    showUnavailable,
}) => {
    return (
        <>
            <h3 className="font-light uppercase text-lg">{category}</h3>
            <div className="flex flex-wrap gap-5">
                {Object.entries(craftList.categories[category].recipes)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([crafId, recipe]) => (
                        <ItemTier
                            key={crafId}
                            category={category}
                            crafId={crafId}
                            item={recipe.outputItem ?? crafId}
                            canCraft={recipe.canCraft}
                            selected={selected}
                            setSelected={setSelected}
                            showUnavailable={showUnavailable}
                        />
                    ))}
            </div>
        </>
    );
};

interface ItemTierProps {
    category: string;

    crafId: string;
    item: string;
    canCraft: boolean;

    selected: Selected;
    setSelected: (selected: Selected) => void;

    showUnavailable: boolean;
}

const ItemTier: FunctionComponent<ItemTierProps> = ({
    category,
    crafId,
    item,
    canCraft,
    selected,
    setSelected,
    showUnavailable,
}) => {
    const itemDef = useItem(item);
    const isSelected = selected.id === crafId && selected.category === category;

    if (!itemDef) {
        return null;
    }

    if (!showUnavailable && !canCraft) {
        return null;
    }

    return (
        <div
            className="size-40 rounded-xl cursor-pointer"
            onClick={() =>
                setSelected({
                    id: crafId,
                    category: category,
                    outputItem: item,
                })
            }
        >
            <GlassMorphismContainer disableGameClone={true} borderClassName="rounded-xl" disableBorder={!isSelected}>
                <ItemIcon
                    item={itemDef}
                    className={cn('size-40', {
                        grayscale: !canCraft,
                    })}
                />
            </GlassMorphismContainer>
        </div>
    );
};

type SelectedItemProps = {
    selected: Selected;
    craftList: CraftsList;
    doCraft: (amount: number) => void;
    isCrafting: boolean;
};

type CraftInputs = {
    amount: number;
};

const SelectedItem: FunctionComponent<SelectedItemProps> = ({ selected, craftList, doCraft, isCrafting }) => {
    const items = useItems();

    const { glassmorphismColors, isDaltonism, card } = useHudColor();

    const selectedItem = items.find(i => i.name === (selected.outputItem ?? selected.id));
    const recipe = craftList.categories[selected.category].recipes[selected.id];

    const canCraft = Object.values(recipe.inputs).every(
        input => input.checkAmount >= 0 && input.checkAmount >= input.count
    );

    const maxCraftableItem = useMemo(() => {
        return Object.values(recipe.inputs).reduce((acc, input) => {
            if (input.checkAmount <= 0) {
                return 0;
            }

            return Math.min(acc, Math.floor(input.checkAmount / input.count));
        }, Number.MAX_VALUE);
    }, [recipe]);

    const cancelDrugTransform = async () => {
        if (isCrafting) {
            fetchNui(NuiEvent.CraftCancel);
        }
    };

    const { register, handleSubmit, watch, reset, getValues, setValue } = useForm<CraftInputs>({
        mode: 'onChange',
        defaultValues: { amount: maxCraftableItem },
    });

    const increaseAmount = useCallback(() => {
        setValue('amount', getValues('amount') + 1);
    }, [getValues, setValue, maxCraftableItem]);

    const decreaseAmount = useCallback(() => {
        const amount = getValues('amount');
        if (amount <= 0) {
            return;
        }
        setValue('amount', amount - 1);
    }, [getValues, setValue, maxCraftableItem]);

    const submitForm: SubmitHandler<CraftInputs> = async data => {
        if (data.amount <= 0) {
            return;
        }

        doCraft(data.amount);
    };

    const resetForm = useCallback(() => {
        reset();
        setValue('amount', maxCraftableItem);
    }, [reset, setValue, maxCraftableItem]);

    useEffect(resetForm, [recipe, maxCraftableItem]);

    if (!selectedItem) {
        return null;
    }

    return (
        <div className="flex flex-col gap-5 h-full w-full justify-between">
            <ApplicationCard>
                <ItemIcon item={selectedItem} className="aspect-square w-full object-contain" />
            </ApplicationCard>

            <ApplicationCard className="flex flex-col gap-5 h-full min-h-0">
                <h2>
                    {selectedItem.label} x{recipe.amount}
                </h2>
                <section className="space-y-2.5 overflow-y-auto h-full pr-2.5 scrollbar scrollbar-w-1.5 scrollbar-thumb-white scrollbar-track-[#111111CC] scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                    {Object.entries(recipe.inputs)
                        .sort(([, a], [, b]) => a.checkAmount - b.checkAmount)
                        .sort(([, a], [, b]) => Number(a.check) - Number(b.check))
                        .map(([name, input]) => {
                            const requiredItem = items.find(i => i.name === name);
                            const itemAmount = watch('amount') * input.count;

                            return (
                                <div key={name} className="flex items-center gap-2">
                                    <ItemIcon item={requiredItem} className="size-8" />

                                    <span className="grow">
                                        {input.count}x {requiredItem.label}
                                    </span>

                                    <div className="flex flex-col items-end">
                                        <span
                                            className={cn('leading-4', {
                                                'text-[#AD1F1F]':
                                                    !isDaltonism &&
                                                    (input.checkAmount === 0 || input.checkAmount < itemAmount),
                                                'text-[#268116]':
                                                    !isDaltonism &&
                                                    (input.checkAmount !== 0 || input.checkAmount >= itemAmount),
                                                'text-[#B314E8]':
                                                    isDaltonism &&
                                                    (input.checkAmount === 0 || input.checkAmount < itemAmount),
                                                'text-[#00FFFF]':
                                                    isDaltonism &&
                                                    (input.checkAmount !== 0 || input.checkAmount >= itemAmount),
                                            })}
                                        >
                                            {input.checkAmount}
                                        </span>
                                        <span className="leading-4">/{itemAmount}</span>
                                    </div>
                                </div>
                            );
                        })}
                </section>
            </ApplicationCard>

            <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
                <div className="flex gap-2.5">
                    <ApplicationButton
                        type="button"
                        variant="secondary"
                        btnClassName="h-full aspect-square"
                        onClick={decreaseAmount}
                        disabled={watch('amount') <= 0}
                    >
                        -
                    </ApplicationButton>
                    <input
                        type="number"
                        style={{
                            boxShadow: `${card} 0px 0px 0px 0px inset, ${card} 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`,
                            backgroundColor: glassmorphismColors.background,
                        }}
                        className="block text-right w-full rounded-xl border-0 py-1.5 px-3 shadow-sm focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 placeholder:text-inherit placeholder:opacity-50"
                        {...register('amount')}
                    />
                    <ApplicationButton
                        type="button"
                        variant="secondary"
                        btnClassName="h-full aspect-square"
                        onClick={increaseAmount}
                    >
                        +
                    </ApplicationButton>
                    <ApplicationButton type="button" variant="secondary" onClick={resetForm}>
                        Tout
                    </ApplicationButton>
                </div>

                {isCrafting ? (
                    <ApplicationButton
                        variant="secondary"
                        type="reset"
                        onClick={cancelDrugTransform}
                        btnClassName="text-xl uppercase py-4"
                    >
                        Annuler
                    </ApplicationButton>
                ) : (
                    <ApplicationButton type="submit" disabled={!canCraft} btnClassName="text-xl uppercase py-4">
                        Fabriquer
                    </ApplicationButton>
                )}
            </form>
        </div>
    );
};
