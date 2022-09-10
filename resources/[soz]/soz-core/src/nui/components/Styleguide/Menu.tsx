import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { CheckIcon } from '@heroicons/react/solid';
import {
    createDescendantContext,
    Descendant,
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
import { Route, Routes, useNavigate } from 'react-router-dom';

import { MenuType } from '../../../shared/nui/menu';
import { useArrowDown, useArrowLeft, useArrowRight, useArrowUp, useBackspace, useEnter } from '../../hook/control';

type MenuDescendant = Descendant & {
    disabled: boolean;
};

const MenuDescendantContext = createDescendantContext<MenuDescendant>('MenuDescendantContext');
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
const MenuTypeContext = createContext<MenuType | null>(null);

export type MenuProps = {
    type: MenuType;
};

export const Menu: FunctionComponent<PropsWithChildren<MenuProps>> = ({ children, type }) => {
    return <MenuTypeContext.Provider value={type}>{children}</MenuTypeContext.Provider>;
};

export type SubMenuProps = {
    id: string;
};

export const SubMenu: FunctionComponent<PropsWithChildren<SubMenuProps>> = ({ children, id }) => {
    return (
        <Routes>
            <Route path={`/${id}`} element={<MenuContainer>{children}</MenuContainer>} />
        </Routes>
    );
};

export const MainMenu: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return (
        <Routes>
            <Route index element={<MenuContainer>{children}</MenuContainer>} />
        </Routes>
    );
};

export const MenuContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="absolute left-8 top-8 w-1/5 min-w-[24rem] max-h-[50vh]">{children}</div>;
};

export type MenuTitleProps = {
    banner?: string;
};

const MenuHeader: FunctionComponent<MenuTitleProps> = ({ banner }) => {
    return <img src={banner} className="opacity-80 w-full h-auto object-cover mb-[-2px]" alt="banner" />;
};

export const MenuTitle: FunctionComponent<PropsWithChildren<MenuTitleProps>> = ({ children, banner }) => {
    return (
        <>
            {banner && <MenuHeader banner={banner} />}
            <div
                className={cn('px-3 py-1 font-semibold text-sm bg-black/80 text-white uppercase', {
                    'rounded-t-lg text-center': !banner,
                })}
            >
                {children}
            </div>
        </>
    );
};

export const MenuContent: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [descendants, setDescendants] = useDescendantsInit();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <DescendantProvider context={MenuDescendantContext} items={descendants} set={setDescendants}>
            <MenuContext.Provider value={{ activeIndex, setActiveIndex }}>
                <MenuControls>
                    <ul className="p-2 bg-black/50 rounded-b-lg">{children}</ul>
                </MenuControls>
            </MenuContext.Provider>
        </DescendantProvider>
    );
};

const MenuControls: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { activeIndex, setActiveIndex } = useContext(MenuContext);
    const menuItems = useDescendants(MenuDescendantContext);
    const navigate = useNavigate();

    useArrowDown(() => {
        let newIndex = activeIndex;

        do {
            newIndex = newIndex + 1;

            if (newIndex >= menuItems.length) {
                newIndex = 0;
            }

            if (newIndex === activeIndex) {
                break;
            }
        } while (menuItems[newIndex].disabled);

        setActiveIndex(newIndex);
    });

    useArrowUp(() => {
        let newIndex = activeIndex;

        do {
            newIndex = newIndex - 1;

            if (newIndex < 0) {
                newIndex = menuItems.length - 1;
            }

            if (newIndex === activeIndex) {
                break;
            }
        } while (menuItems[newIndex].disabled);

        setActiveIndex(newIndex);
    });

    useBackspace(() => {
        navigate(-1);
    });

    return <>{children}</>;
};

type MenuItemProps = PropsWithChildren<{
    onConfirm?: () => void;
    onSelected?: () => void;
    disabled?: boolean;
}>;

const MenuItemContainer: FunctionComponent<MenuItemProps> = ({ children, onConfirm, onSelected, disabled = false }) => {
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
            disabled,
        };
    }, [element]);

    const index = useDescendant(descendant, MenuDescendantContext);

    const isSelected = disabled ? false : index === activeIndex;

    useEffect(() => {
        if (disabled) {
            return;
        }

        if (isSelected) {
            onSelected && onSelected();
        }
    }, [isSelected]);

    useEnter(() => {
        if (!isSelected || disabled) {
            return;
        }

        if (disabled) {
            return;
        }

        onConfirm && onConfirm();
    });

    const onClick = () => {
        if (disabled) {
            return;
        }

        onConfirm && onConfirm();
    };

    return (
        <li
            ref={handleRefSet}
            className={cn('p-1 pl-2 my-0.5 hover:bg-white/10 rounded', {
                'bg-white/10': isSelected,
                'text-white/50': disabled,
                'text-white': !disabled,
                'cursor-not-allowed': disabled,
                'cursor-pointer': !disabled,
            })}
            onClick={onClick}
        >
            <MenuSelectedContext.Provider value={isSelected}>{children}</MenuSelectedContext.Provider>
        </li>
    );
};

type MenuItemButtonProps = PropsWithChildren<{
    onConfirm?: () => void;
    onSelected?: () => void;
    disabled?: boolean;
}>;

export const MenuItemButton: FunctionComponent<MenuItemButtonProps> = ({
    children,
    onConfirm,
    onSelected,
    disabled = false,
}) => {
    return (
        <MenuItemContainer onSelected={onSelected} onConfirm={onConfirm} disabled={disabled}>
            {children}
        </MenuItemContainer>
    );
};

type MenuItemTextProps = PropsWithChildren<{
    onSelected?: () => void;
}>;

export const MenuItemText: FunctionComponent<MenuItemTextProps> = ({ children, onSelected }) => {
    return (
        <MenuItemContainer onSelected={onSelected} disabled={true}>
            <h3 className="text-white cursor-default">{children}</h3>
        </MenuItemContainer>
    );
};

type MenuItemCheckboxProps = PropsWithChildren<{
    onSelected?: () => void;
    onChange?: (value: boolean) => void;
    checked?: boolean;
    disabled?: boolean;
}>;

export const MenuItemCheckbox: FunctionComponent<MenuItemCheckboxProps> = ({
    children,
    onChange,
    checked = false,
    onSelected,
    disabled = false,
}) => {
    const [isChecked, setIsChecked] = useState(checked);

    const onConfirm = () => {
        setIsChecked(!isChecked);
        onChange && onChange(!isChecked);
    };

    return (
        <MenuItemContainer onSelected={onSelected} onConfirm={onConfirm} disabled={disabled}>
            <div className="flex  justify-between items-center">
                <h3>{children}</h3>
                <div className="border border-white w-5 h-5 rounded bg-black/20">
                    {isChecked && (
                        <CheckIcon className="w-full h-full text-white" aria-hidden="true" focusable="false" />
                    )}
                </div>
            </div>
        </MenuItemContainer>
    );
};

type MenuItemSubMenuLinkProps = PropsWithChildren<{
    id: string;
    onSelected?: () => void;
    disabled?: boolean;
}>;

export const MenuItemSubMenuLink: FunctionComponent<MenuItemSubMenuLinkProps> = ({
    children,
    id,
    onSelected,
    disabled = false,
}) => {
    const type = useContext(MenuTypeContext);
    const navigate = useNavigate();

    return (
        <MenuItemContainer onSelected={onSelected} onConfirm={() => navigate(`/${type}/${id}`)} disabled={disabled}>
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
        <div className="flex items-center">
            <ChevronLeftIcon
                onClick={event => {
                    goLeft();

                    event.stopPropagation();
                }}
                className="h-5 w-5 p-0.5 mr-2 bg-black/20 rounded-full"
            />
            <div>{children}</div>
            <ChevronRightIcon
                onClick={event => {
                    goRight();

                    event.stopPropagation();
                }}
                className="h-5 w-5 p-0.5 ml-2 bg-black/20 rounded-full"
            />
        </div>
    );
};

type MenuItemSelectProps = PropsWithChildren<{
    title: string;
    onConfirm?: (index: number) => void;
    onSelected?: () => void;
    disabled?: boolean;
}>;

export const MenuItemSelect: FunctionComponent<MenuItemSelectProps> = ({
    children,
    onConfirm,
    onSelected,
    title,
    disabled = false,
}) => {
    const [descendants, setDescendants] = useDescendantsInit();
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);

    const onItemConfirm = useCallback(() => {
        onConfirm && onConfirm(activeOptionIndex);
    }, [activeOptionIndex, onConfirm]);

    return (
        <MenuItemContainer onSelected={onSelected} onConfirm={onItemConfirm} disabled={disabled}>
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
