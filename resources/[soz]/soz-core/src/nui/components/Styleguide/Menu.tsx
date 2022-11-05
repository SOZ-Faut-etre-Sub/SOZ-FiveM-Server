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
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { RGBColor } from '../../../shared/color';
import { MenuType } from '../../../shared/nui/menu';
import { useArrowDown, useArrowLeft, useArrowRight, useArrowUp, useBackspace, useEnter } from '../../hook/control';

type MenuDescendant = Descendant & {
    selectable: boolean;
};

type MenuSelectDescendant = Descendant & {
    value?: any;
};

const MenuDescendantContext = createDescendantContext<MenuDescendant>('MenuDescendantContext');
const MenuItemSelectDescendantContext = createDescendantContext<MenuSelectDescendant>(
    'MenuItemSelectDescendantContext'
);
const MenuContext = createContext<{ activeIndex: number; setActiveIndex: (number) => void }>({
    activeIndex: 0,
    setActiveIndex: () => {},
});
const MenuSelectedContext = createContext<boolean>(false);
const MenuItemSelectContext = createContext<{
    activeOptionIndex: number;
    setActiveOptionIndex: (number) => void;
    setActiveValue: (any) => void;
    setDescription: (description: string | null) => void;
    activeValue: any;
    distance: number;
}>({
    activeOptionIndex: 0,
    setActiveOptionIndex: () => {},
    setActiveValue: () => {},
    setDescription: () => {},
    activeValue: null,
    distance: 0,
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
    return <div className="absolute left-8 top-8 w-1/5 min-w-[24rem]">{children}</div>;
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
                    <ul className="p-2 bg-black/50 rounded-b-lg max-h-[40vh] overflow-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                        {children}
                    </ul>
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
        } while (menuItems[newIndex] && !menuItems[newIndex].selectable);

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
        } while (menuItems[newIndex] && !menuItems[newIndex].selectable);

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
    selectable?: boolean;
}>;

const MenuItemContainer: FunctionComponent<MenuItemProps> = ({
    children,
    onConfirm,
    onSelected,
    disabled = false,
    selectable = null,
}) => {
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
            selectable: selectable === null ? !disabled : selectable,
        };
    }, [element]);

    const index = useDescendant(descendant, MenuDescendantContext);

    const isSelected = index === activeIndex;

    useEffect(() => {
        if (isSelected) {
            onSelected && onSelected();

            if (ref) {
                ref.current.scrollIntoView();
            }
        }
    }, [isSelected, ref]);

    useEnter(() => {
        if (!isSelected) {
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
    selectable?: boolean;
}>;

export const MenuItemButton: FunctionComponent<MenuItemButtonProps> = ({
    children,
    onConfirm,
    onSelected,
    disabled = false,
    selectable = null,
}) => {
    return (
        <MenuItemContainer
            onSelected={onSelected}
            onConfirm={onConfirm}
            disabled={disabled}
            selectable={selectable === null ? !disabled : selectable}
        >
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
            <div className="flex justify-between items-center">
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

type MenuSelectControlsProps = PropsWithChildren<{
    onChange?: (index: number, value?: any) => void;
}>;

const MenuSelectControls: FunctionComponent<MenuSelectControlsProps> = ({ onChange, children }) => {
    const { activeOptionIndex, setActiveOptionIndex, setActiveValue, activeValue } = useContext(MenuItemSelectContext);
    const isItemSelected = useContext(MenuSelectedContext);
    const menuItems = useDescendants(MenuItemSelectDescendantContext);

    useEffect(() => {
        const menuItem = menuItems[activeOptionIndex];

        onChange && onChange(activeOptionIndex, menuItem?.value);
        setActiveValue(menuItem?.value);
    }, [activeOptionIndex, menuItems]);

    useLayoutEffect(() => {
        let defaultIndex = null;

        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].value === activeValue) {
                defaultIndex = i;
                break;
            }
        }

        if (defaultIndex !== null) {
            setActiveOptionIndex(defaultIndex);
        } else {
            setActiveOptionIndex(0);
        }
    }, [menuItems]);

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
    onConfirm?: (index: number, value: any | undefined) => void;
    onSelected?: () => void;
    onChange?: (index: number, value: any) => void;
    disabled?: boolean;
    value?: any;
    distance?: number;
    keyDescendant?: string | null;
}>;

export const MenuItemSelect: FunctionComponent<MenuItemSelectProps> = ({
    children,
    onConfirm,
    onSelected,
    onChange,
    title,
    disabled = false,
    distance = 0,
    value = null,
    keyDescendant = null,
}) => {
    const [descendants, setDescendants] = useDescendantsInit();
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);
    const [activeValue, setActiveValue] = useState(value);
    const [description, setDescription] = useState(null);

    const onItemConfirm = useCallback(() => {
        onConfirm && onConfirm(activeOptionIndex, activeValue);
    }, [activeOptionIndex, onConfirm, activeValue]);

    return (
        <MenuItemContainer onSelected={onSelected} onConfirm={onItemConfirm} disabled={disabled}>
            <DescendantProvider
                key={keyDescendant}
                context={MenuItemSelectDescendantContext}
                items={descendants}
                set={setDescendants}
            >
                <MenuItemSelectContext.Provider
                    value={{
                        activeOptionIndex,
                        setDescription,
                        setActiveOptionIndex,
                        setActiveValue,
                        activeValue,
                        distance,
                    }}
                >
                    <div className="flex justify-between items-center">
                        <h3>{title}</h3>
                        <div>
                            <MenuSelectControls onChange={onChange}>
                                <ul className="flex">{children}</ul>
                            </MenuSelectControls>
                            {description && <p className="mt-1 text-sm text-center text-gray-100">{description}</p>}
                        </div>
                    </div>
                </MenuItemSelectContext.Provider>
            </DescendantProvider>
        </MenuItemContainer>
    );
};

const useSelectOption = (
    value?: any,
    onSelected?: () => void,
    description?: string
): [(value) => void, boolean, boolean] => {
    const { activeOptionIndex, distance, setDescription } = useContext(MenuItemSelectContext);
    const ref = useRef(null);
    const [element, setElement] = useState(null);
    const handleRefSet = useCallback(refValue => {
        ref.current = refValue;
        setElement(refValue);
    }, []);
    const descendant = useMemo(() => {
        return {
            element,
            value,
        };
    }, [element]);

    const index = useDescendant(descendant, MenuItemSelectDescendantContext);
    const distanceOfIndex = Math.abs(index - activeOptionIndex);
    const show = distanceOfIndex <= distance;
    const isSelected = distanceOfIndex === 0;

    useEffect(() => {
        if (isSelected) {
            onSelected && onSelected();
            setDescription(description);
        }
    }, [isSelected]);

    return [handleRefSet, show, isSelected];
};

type MenuItemSelectOptionProps = PropsWithChildren<{
    onSelected?: () => void;
    value?: any;
    description?: string;
}>;

export const MenuItemSelectOption: FunctionComponent<MenuItemSelectOptionProps> = ({
    children,
    onSelected,
    value = null,
    description = null,
}) => {
    const [handleRefSet, show] = useSelectOption(value, onSelected, description);

    return (
        <li
            ref={handleRefSet}
            className={cn({
                hidden: !show,
            })}
        >
            {children}
        </li>
    );
};

type MenuItemSelectOptionColorProps = {
    onSelected?: () => void;
    value?: any;
    label?: string;
    color: RGBColor;
    description?: string;
};

export const MenuItemSelectOptionColor: FunctionComponent<MenuItemSelectOptionColorProps> = ({
    onSelected,
    color,
    value = null,
    description = null,
}) => {
    const [handleRefSet, show, isSelected] = useSelectOption(value, onSelected, description);
    const colorClassname = cn('h-5 w-5 rounded-full', {
        'border-2 border-white': isSelected,
        'border-2 border-black/50': !isSelected,
    });

    return (
        <li
            ref={handleRefSet}
            className={cn('mr-1', {
                hidden: !show,
            })}
        >
            <div
                className={colorClassname}
                style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]} )` }}
            />
        </li>
    );
};
