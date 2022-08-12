import {
    createDescendantContext,
    DescendantProvider,
    useDescendant,
    useDescendants,
    useDescendantsInit,
} from '@reach/descendants';
import cn from 'classnames';
import {
    createContext,
    FunctionComponent,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { useArrowDown, useArrowLeft, useArrowRight, useArrowUp, useEnter } from '../../hook/control';

const MenuDescendantContext = createDescendantContext('MenuDescendantContext');
const MenuItemSelectDescendantContext = createDescendantContext('MenuItemSelectDescendantContext');
const MenuContext = createContext<{ activeIndex: number; setActiveIndex: (number) => void }>({
    activeIndex: 0,
    setActiveIndex: () => {},
});
const MenuSelectedContext = createContext<boolean>(false);
const MenuItemSelectContext = createContext<{ activeOptionIndex: number; setActiveOptionIndex: (number) => void }>({
    activeOptionIndex: 0,
    setActiveOptionIndex: () => {},
});

export const MenuContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="absolute left-8 top-8 w-1/4 min-w-[24rem] max-h-[50vh]">{children}</div>;
};

export const MenuTitle: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="p-3 font-bold bg-black/30 text-white">{children}</div>;
};

export const MenuContent: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [descendants, setDescendants] = useDescendantsInit();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <DescendantProvider context={MenuDescendantContext} items={descendants} set={setDescendants}>
            <MenuContext.Provider value={{ activeIndex, setActiveIndex }}>
                <MenuControls>
                    <ul>{children}</ul>
                </MenuControls>
            </MenuContext.Provider>
        </DescendantProvider>
    );
};

const MenuControls: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { activeIndex, setActiveIndex } = useContext(MenuContext);
    const menuItems = useDescendants(MenuDescendantContext);

    useArrowDown(() => {
        if (activeIndex < menuItems.length - 1) {
            setActiveIndex(activeIndex + 1);
        } else {
            setActiveIndex(0);
        }
    });

    useArrowUp(() => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        } else {
            setActiveIndex(menuItems.length - 1);
        }
    });

    return <>{children}</>;
};

type MenuItemProps = PropsWithChildren<{
    onConfirm?: () => void;
    onSelected?: () => void;
}>;

const MenuItemContainer: FunctionComponent<MenuItemProps> = ({ children, onConfirm, onSelected }) => {
    const { activeIndex } = useContext(MenuContext);
    const ref = useRef(null);
    const [element, setElement] = useState(null);
    const handleRefSet = useCallback(refValue => {
        ref.current = refValue;
        setElement(refValue);
    }, []);
    const descendant = useMemo(() => {
        return {
            element,
        };
    }, [element]);

    const index = useDescendant(descendant, MenuDescendantContext);

    const isSelected = index === activeIndex;

    useEffect(() => {
        if (isSelected) {
            onSelected && onSelected();
        }
    }, [isSelected]);

    useEnter(() => {
        if (!isSelected) {
            return;
        }

        onConfirm && onConfirm();
    });

    return (
        <li
            ref={handleRefSet}
            className={cn('cursor-pointer p-3 hover:bg-black/25 text-white', {
                'bg-black/10': !isSelected,
                'bg-black/25': isSelected,
            })}
            onClick={onConfirm}
        >
            <MenuSelectedContext.Provider value={isSelected}>{children}</MenuSelectedContext.Provider>
        </li>
    );
};

type MenuItemButtonProps = PropsWithChildren<{
    onConfirm?: () => void;
    onSelected?: () => void;
}>;

export const MenuItemButton: FunctionComponent<MenuItemButtonProps> = ({ children, onConfirm, onSelected }) => {
    return (
        <MenuItemContainer onSelected={onSelected} onConfirm={onConfirm}>
            {children}
        </MenuItemContainer>
    );
};

const MenuSelectControls: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { activeOptionIndex, setActiveOptionIndex } = useContext(MenuItemSelectContext);
    const isItemSelected = useContext(MenuSelectedContext);
    const menuItems = useDescendants(MenuItemSelectDescendantContext);

    const goLeft = () => {
        if (activeOptionIndex > 0) {
            setActiveOptionIndex(activeOptionIndex - 1);
        } else {
            setActiveOptionIndex(menuItems.length - 1);
        }
    };

    const goRight = () => {
        if (activeOptionIndex < menuItems.length - 1) {
            setActiveOptionIndex(activeOptionIndex + 1);
        } else {
            setActiveOptionIndex(0);
        }
    };

    useArrowLeft(() => {
        if (isItemSelected) {
            goLeft();
        }
    });

    useArrowRight(() => {
        if (isItemSelected) {
            goRight();
        }
    });

    return (
        <div className="flex">
            <a
                href="#"
                onClick={event => {
                    goLeft();

                    event.stopPropagation();
                }}
                className="mr-2"
            >
                &lt;
            </a>
            <div>{children}</div>
            <a
                href="#"
                onClick={event => {
                    goRight();

                    event.stopPropagation();
                }}
                className="ml-2"
            >
                &gt;
            </a>
        </div>
    );
};

type MenuItemSelectProps = PropsWithChildren<{
    title: string;
    onConfirm?: (index: number) => void;
    onSelected?: () => void;
}>;

export const MenuItemSelect: FunctionComponent<MenuItemSelectProps> = ({ children, onConfirm, onSelected, title }) => {
    const [descendants, setDescendants] = useDescendantsInit();
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);

    const onItemConfirm = useCallback(() => {
        onConfirm && onConfirm(activeOptionIndex);
    }, [activeOptionIndex, onConfirm]);

    return (
        <MenuItemContainer onSelected={onSelected} onConfirm={onItemConfirm}>
            <DescendantProvider context={MenuItemSelectDescendantContext} items={descendants} set={setDescendants}>
                <MenuItemSelectContext.Provider value={{ activeOptionIndex, setActiveOptionIndex }}>
                    <div className="flex justify-between">
                        <h3>{title}</h3>
                        <div>
                            <MenuSelectControls>
                                <ul>{children}</ul>
                            </MenuSelectControls>
                        </div>
                    </div>
                </MenuItemSelectContext.Provider>
            </DescendantProvider>
        </MenuItemContainer>
    );
};

type MenuItemSelectOptionProps = PropsWithChildren<{
    onSelected?: () => void;
}>;

export const MenuItemSelectOption: FunctionComponent<MenuItemSelectOptionProps> = ({ children, onSelected }) => {
    const { activeOptionIndex } = useContext(MenuItemSelectContext);
    const ref = useRef(null);
    const [element, setElement] = useState(null);
    const handleRefSet = useCallback(refValue => {
        ref.current = refValue;
        setElement(refValue);
    }, []);
    const descendant = useMemo(() => {
        return {
            element,
        };
    }, [element]);

    const index = useDescendant(descendant, MenuItemSelectDescendantContext);

    const isSelected = index === activeOptionIndex;

    useEffect(() => {
        if (isSelected) {
            onSelected && onSelected();
        }
    }, [isSelected]);

    return (
        <li
            ref={handleRefSet}
            className={cn({
                hidden: !isSelected,
            })}
        >
            {children}
        </li>
    );
};
