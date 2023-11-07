import { fetchNui } from '@public/nui/fetch';
import { useBackspace } from '@public/nui/hook/control';
import { useItems } from '@public/nui/hook/data';
import { useNuiEvent, useNuiFocus } from '@public/nui/hook/nui';
import { useOutside } from '@public/nui/hook/outside';
import { CraftsList } from '@public/shared/craft/craft';
import { NuiEvent } from '@public/shared/event';
import { Item } from '@public/shared/item';
import classNames from 'classnames';
import { FunctionComponent, useCallback, useState } from 'react';

export type Selected = {
    id: string;
    category: string;
};

const itemIcon = (item: Item) => {
    return `https://cfx-nui-soz-core/public/images/items/${item.name}.webp`;
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
        });
        setCraftList(data);
        setTitle(data.title);
        setSubTitle(data.subtitle);
    });

    const refOutside = useOutside({
        click: () => setCraftList(null),
    });

    useBackspace(() => {
        setCraftList(null);
    });

    const doCraft = useCallback(async () => {
        if (!selected) {
            return;
        }

        setIsCrafting(true);

        let list: CraftsList = null;
        do {
            list = await fetchNui<any, CraftsList>(NuiEvent.CraftDoRecipe, {
                itemId: selected.id,
                category: selected.category,
                type: craftList.type,
            });
        } while (list.categories[selected.category].recipes[selected.id].canCraft && !list.cancelled);

        setIsCrafting(false);

        setCraftList(state => {
            if (!state) {
                return null;
            }

            return list;
        });
    }, [selected]);

    if (!craftList || !selected) {
        return null;
    }

    return (
        <div className="absolute flex flex-col px-80 py-40 pb-60 aspect-[16/9] w-full h-full">
            <div ref={refOutside} className="relative w-full h-full bg-black/80 rounded-lg p-4 flex text-white">
                <div className="w-1/4 flex flex-col justify-between">
                    <SelectedItem
                        isCrafting={isCrafting}
                        craftList={craftList}
                        doCraft={doCraft}
                        selected={selected}
                        title={title}
                    />
                </div>
                <div className="ml-8 w-3/4 pb-20">
                    <div className="flex justify-between">
                        <h2 className="uppercase font-bold mb-4 text-xl">{subtitle}</h2>
                        <div>
                            <input
                                id="showUnavailable"
                                type={'checkbox'}
                                checked={showUnavailable}
                                onChange={() => setShowUnavailable(!showUnavailable)}
                            />
                            <label htmlFor="showUnavailable" className="ml-2">
                                Afficher les objets indisponibles
                            </label>
                        </div>
                    </div>
                    <div className="overflow-y-auto h-full pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                        {Object.keys(craftList.categories)
                            .sort((a, b) => a.localeCompare(b))
                            .map(item => {
                                return (
                                    <ItemTierList
                                        craftList={craftList}
                                        itemIcon={itemIcon}
                                        selected={selected}
                                        setSelected={setSelected}
                                        category={item}
                                        key={'craft_' + item}
                                        showUnavailable={showUnavailable}
                                    />
                                );
                            })}
                    </div>
                </div>
                <button onClick={() => setCraftList(null)} className="absolute bottom-0 right-0 p-4 uppercase text-xl">
                    Fermer
                </button>
            </div>
        </div>
    );
};

type ItemTierListProps = {
    selected: Selected;
    setSelected: (selected: Selected) => void;
    craftList: CraftsList;
    category: string;
    itemIcon: (item: Item) => string;
    showUnavailable: boolean;
};

const ItemTierList: FunctionComponent<ItemTierListProps> = ({
    selected,
    setSelected,
    craftList,
    category,
    itemIcon,
    showUnavailable,
}) => {
    const items = useItems();

    return (
        <>
            <h3 className="font-medium uppercase text-lg">{category}</h3>
            <div className="flex flex-wrap gap-4 my-4">
                {Object.entries(craftList.categories[category].recipes)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([itemId, recipe]) => {
                        const item = items.find(i => i.name === itemId);
                        const check = recipe;
                        const isSelected = selected.id === itemId && selected.category === category;
                        const classes = classNames('w-36 h-36 box-border rounded-lg bg-black/60 cursor-pointer', {
                            'border-2 border-green-500': isSelected,
                            grayscale: !check.canCraft,
                        });

                        if (!showUnavailable && !check.canCraft) {
                            return null;
                        }

                        if (!item) {
                            return null;
                        }

                        return (
                            <div
                                key={itemId}
                                className={classes}
                                onClick={() =>
                                    setSelected({
                                        id: itemId,
                                        category: category,
                                    })
                                }
                            >
                                <img
                                    alt={item.name}
                                    className="h-full w-full object-contain"
                                    src={itemIcon(item)}
                                    onError={e => (e.currentTarget.src = 'https://placekitten.com/200/200')}
                                />
                            </div>
                        );
                    })}
            </div>
        </>
    );
};

type SelectedItemProps = {
    selected: Selected;
    craftList: CraftsList;
    doCraft: () => void;
    isCrafting: boolean;
    title: string;
};

const SelectedItem: FunctionComponent<SelectedItemProps> = ({ selected, craftList, doCraft, isCrafting, title }) => {
    const items = useItems();
    const selectedItem = items.find(i => i.name === selected.id);
    const canCraft = craftList.categories[selected.category].recipes[selected.id].canCraft;

    const cancelDrugTransform = async () => {
        if (isCrafting) {
            fetchNui(NuiEvent.CraftCancel);
        }
    };

    if (!selectedItem) {
        return null;
    }

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex flex-1 min-h-0 flex-col mb-4">
                <div className="flex items-center mb-4">
                    <h2 className="uppercase font-bold text-xl ml-4">{title}</h2>
                </div>
                <div className="rounded-lg border-2 border-gray-500 p-2 max-h-[50%] flex flex-col">
                    <h3 className="mb-2 text-lg">
                        {craftList.categories[selected.category].recipes[selected.id].amount}x {selectedItem.label}
                    </h3>
                    <div className="flex justify-center items-center aspect-square min-h-0">
                        <img
                            alt={selectedItem.name}
                            style={{
                                maxHeight: '100%',
                            }}
                            className="aspect-square object-contain"
                            src={itemIcon(selectedItem)}
                            onError={e => (e.currentTarget.src = 'https://placekitten.com/300/200')}
                        />
                    </div>
                </div>
                {!isCrafting && (
                    <button
                        onClick={doCraft}
                        disabled={!canCraft}
                        className={classNames(
                            'my-2 inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white',
                            {
                                'opacity-50': !canCraft,
                                grayscale: !canCraft,
                                'hover:bg-green-700': canCraft,
                            }
                        )}
                    >
                        Transformer
                    </button>
                )}
                {isCrafting && (
                    <button
                        onClick={cancelDrugTransform}
                        className={classNames(
                            'my-2 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700'
                        )}
                    >
                        Annuler
                    </button>
                )}
                <div className="flex-shrink-1 rounded-lg border-2 border-gray-500 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                    <h3 className="mb-2 ml-4 text-lg font-bold">Matériaux requis :</h3>
                    {Object.entries(craftList.categories[selected.category].recipes[selected.id].inputs).map(
                        ([name, input]) => {
                            const requiredItem = items.find(i => i.name === name);

                            return (
                                <div key={name} className="flex justify-between items-center px-4 mb-2">
                                    <div className="flex items-center">
                                        <img
                                            alt={requiredItem.label}
                                            className="h-8 w-8"
                                            src={itemIcon(requiredItem)}
                                            onError={e => (e.currentTarget.src = 'https://placekitten.com/300/200')}
                                        />
                                        <span className="ml-4">
                                            {input.count}x {requiredItem.label}
                                        </span>
                                    </div>
                                    {input.check && (
                                        <div className="rounded-lg border border-green-500 h-7 w-7 text-green-500 text-xl text-center">
                                            ✓
                                        </div>
                                    )}
                                    {!input.check && <div className="rounded-lg border border-gray-500 h-7 w-7"></div>}
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    );
};
