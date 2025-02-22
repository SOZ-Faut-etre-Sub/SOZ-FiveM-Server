import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { BorderBox } from '@public/nui/components/Styleguide/BorderBox';
import { GlassMorphismContainer } from '@public/nui/components/Styleguide/GlassMorphismContainer';
import { fetchNui } from '@public/nui/fetch';
import { useNuiEvent } from '@public/nui/hook/nui';
import { slugify } from '@public/nui/utils/slugify';
import { RGBColor } from '@public/shared/color';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import {
    createDescendantContext,
    Descendant,
    DescendantProvider,
    useDescendant,
    useDescendants,
    useDescendantsInit,
} from '@reach/descendants';
import cn from 'classnames';
import clsx from 'clsx';
import {
    createContext,
    DetailedHTMLProps,
    forwardRef,
    FunctionComponent,
    InputHTMLAttributes,
    PropsWithChildren,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
    useArrowDown,
    useArrowLeft,
    useArrowRight,
    useArrowUp,
    useBackspace,
    useEnter,
    useReset,
} from '../../hook/control';

type MenuDescendant = Descendant & {
    selectable: boolean;
};

type MenuSelectDescendant = Descendant & {
    value?: any;
    helper?: ReactNode;
};

const MenuDescendantContext = createDescendantContext<MenuDescendant>('MenuDescendantContext');
const MenuItemSelectDescendantContext = createDescendantContext<MenuSelectDescendant>(
    'MenuItemSelectDescendantContext'
);
const MenuContext = createContext<{
    activeIndex: number;
    setActiveIndex: (number: number) => void;
    visibility: boolean;
    setDescription: (desc: string | ReactNode) => void;
    textFocus: boolean;
    setTextFocus: (focus: boolean) => void;
}>({
    activeIndex: 0,
    visibility: true,
    setActiveIndex: () => {},
    setDescription: () => {},
    textFocus: false,
    setTextFocus: () => {},
});
const MenuSelectedContext = createContext<boolean>(false);
const MenuItemSelectContext = createContext<{
    activeOptionIndex: number;
    setActiveOptionIndex: (number) => void;
    setActiveValue: (any) => void;
    setDescription: (description: string | null) => void;
    activeValue: any;
    distance: number;
    showAllOptions: boolean;
    equalityFn: (a: any, b: any) => boolean;
}>({
    activeOptionIndex: 0,
    setActiveOptionIndex: () => {},
    setActiveValue: () => {},
    setDescription: () => {},
    activeValue: null,
    distance: 0,
    showAllOptions: false,
    equalityFn: (a, b) => a === b,
});
export const MenuTypeContext = createContext<MenuType | null>(null);

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
    const slugId = slugify(id);

    return (
        <Routes>
            <Route path={`/${slugId}`} element={<MenuContainer>{children}</MenuContainer>} />
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
    let leftOffset = 'left-8';
    if (
        (window.innerWidth > 5000 && window.innerHeight < 1500) ||
        (window.innerWidth > 3079 && window.innerHeight < 1200)
    ) {
        leftOffset = 'left-[94vh]';
    }
    return (
        <div className={clsx('absolute top-10 w-[36vh] min-w-[36vh] font-prompt select-none', leftOffset)}>
            {children}
        </div>
    );
};

export type MenuTitleProps = {
    type?: 'menu' | 'boutique';
    title: string;
};

export const MenuTitle: FunctionComponent<MenuTitleProps> = ({ type = 'menu', title }) => {
    return (
        <header className="relative w-full py-3">
            <div className="flex flex-col uppercase text-white drop-shadow-bg">
                <h1 className="font-light text-base leading-3">{type}</h1>
                <h2 className="font-semibold text-2xl">{title}</h2>
            </div>
        </header>
    );
};

export const MenuSubTitle: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return (
        <header className="flex justify-center uppercase text-white relative w-full py-1">
            <h2 className="font-semibold text-sm">{children}</h2>
        </header>
    );
};

type MenuContentProps = PropsWithChildren & {
    subtitle?: string;
    helpPanel?: ReactNode;
};

export const MenuContent: FunctionComponent<MenuContentProps> = ({ children, subtitle, helpPanel }) => {
    const [descendants, setDescendants] = useDescendantsInit();
    const [activeIndex, setActiveIndex] = useState(0);
    const [description, setDescription] = useState<string | null | ReactNode>(null);
    const [visibility, setVisibility] = useState(true);
    const [textFocus, setTextFocus] = useState(false);
    const [pauseMenuActive, setPauseMenuActive] = useState(true);
    const [previousLength, setPreviousLength] = useState(0);

    useNuiEvent('global', 'PauseMenuActive', setPauseMenuActive);

    useNuiEvent('menu', 'SetMenuVisibility', setVisibility);

    useEffect(() => {
        if (previousLength === descendants.length) {
            return;
        }

        setPreviousLength(descendants.length);

        if (previousLength > 0 && descendants.length > 0) {
            // reset descendants to ensure ordering is correct
            setDescendants([]);
        }
    }, [descendants.length, previousLength]);

    return (
        <DescendantProvider context={MenuDescendantContext} items={descendants} set={setDescendants}>
            <MenuContext.Provider
                value={{
                    activeIndex,
                    setActiveIndex,
                    setDescription,
                    visibility: visibility && !pauseMenuActive,
                    textFocus,
                    setTextFocus,
                }}
            >
                <MenuControls>
                    <div>
                        <GlassMorphismContainer duration="duration-0" borderClassName="rounded-lg" disableBorder>
                            {subtitle && (
                                <div className="flex items-center gap-2 text-sm font-semibold pt-3 px-4 text-white">
                                    <ChevronLeftIcon className="size-4" />
                                    <span>{subtitle}</span>
                                </div>
                            )}

                            <ul className="p-2 max-h-[40vh] overflow-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                                {children}
                            </ul>
                        </GlassMorphismContainer>
                        {description && (
                            <div className="mt-3 w-full overflow-hidden text-white">
                                <GlassMorphismContainer
                                    duration="duration-0"
                                    borderClassName="rounded-lg"
                                    disableBorder
                                >
                                    <div className="px-2 py-1">{description}</div>
                                </GlassMorphismContainer>
                            </div>
                        )}
                        {helpPanel && (
                            <div
                                className="mt-3 max-h-[40vh] overflow-hidden"
                                style={{
                                    pointerEvents: 'none',
                                }}
                            >
                                <GlassMorphismContainer
                                    duration="duration-0"
                                    borderClassName="rounded-lg"
                                    disableBorder
                                >
                                    <ul>{helpPanel}</ul>
                                </GlassMorphismContainer>
                            </div>
                        )}
                    </div>
                </MenuControls>
            </MenuContext.Provider>
        </DescendantProvider>
    );
};

const MenuControls: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { activeIndex, setActiveIndex, visibility, textFocus } = useContext(MenuContext);
    const menuItems = useDescendants(MenuDescendantContext);
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { activeIndex: number } | undefined;

    useEffect(() => {
        const index = state?.activeIndex ?? 0;
        setActiveIndex(index);
    }, [location]);

    useArrowDown(() => {
        let newIndex = activeIndex;

        if (!visibility || textFocus) {
            return;
        }

        do {
            newIndex = newIndex + 1;

            if (newIndex >= menuItems.length) {
                newIndex = 0;
            }

            if (newIndex === activeIndex) {
                break;
            }
        } while (menuItems[newIndex] && !menuItems[newIndex].selectable);

        navigate(location.pathname, {
            state: {
                ...(state || {}),
                activeIndex: newIndex,
            },
            replace: true,
        });
    });

    useArrowUp(() => {
        let newIndex = activeIndex;

        if (!visibility || textFocus) {
            return;
        }

        do {
            newIndex = newIndex - 1;

            if (newIndex < 0) {
                newIndex = menuItems.length - 1;
            }

            if (newIndex === activeIndex) {
                break;
            }
        } while (menuItems[newIndex] && !menuItems[newIndex].selectable);

        navigate(location.pathname, {
            state: {
                ...(state || {}),
                activeIndex: newIndex,
            },
            replace: true,
        });
    });

    useBackspace(() => {
        if (!visibility || textFocus) {
            return;
        }

        navigate(-1);
    });

    return <>{children}</>;
};

type MenuItemProps = PropsWithChildren<{
    onConfirm?: () => void;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onSelected?: () => void;
    disabled?: boolean;
    selectable?: boolean;
    description?: ReactNode;
    className?: string;
}>;

const MenuItemContainer: FunctionComponent<MenuItemProps> = ({
    children,
    onConfirm,
    onClick,
    onSelected,
    disabled = false,
    selectable = null,
    description = null,
    className = null,
}) => {
    const { activeIndex, setDescription, setActiveIndex, visibility } = useContext(MenuContext);
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
    }, [element, selectable]);

    const index = useDescendant(descendant, MenuDescendantContext);
    const isSelected = index === activeIndex;

    useEffect(() => {
        if (isSelected) {
            onSelected && onSelected();
            setDescription(description);

            if (ref) {
                ref.current.scrollIntoViewIfNeeded();
            }
        }
    }, [isSelected, ref, description]);

    useEnter(() => {
        if (!isSelected || !visibility) {
            return;
        }

        if (disabled) {
            return;
        }

        onConfirm && onConfirm();
    });

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (disabled || !visibility) {
            return;
        }

        if (onClick) {
            onClick(event);
            return;
        }

        onConfirm && onConfirm();
    };

    const onOver = () => {
        if (disabled || !visibility) {
            return;
        }

        setActiveIndex(index);
    };

    return (
        <li
            ref={handleRefSet}
            className={cn(className, 'my-1', {
                'text-white/50': disabled,
                'text-white': !disabled,
                'cursor-not-allowed': disabled,
                'cursor-pointer': !disabled,
            })}
            onClick={handleClick}
            onMouseEnter={onOver}
        >
            <MenuSelectedContext.Provider value={isSelected}>
                <BorderBox
                    duration="duration-0"
                    borderClassName="rounded-lg"
                    showBorder={isSelected}
                    disableBackground={!isSelected}
                    blur={false}
                >
                    <div className="px-4 py-1 pl-2">{children}</div>
                </BorderBox>
            </MenuSelectedContext.Provider>
        </li>
    );
};

type MenuItemButtonProps = PropsWithChildren<{
    onConfirm?: () => void;
    onSelected?: () => void;
    disabled?: boolean;
    selectable?: boolean;
    className?: string;
    description?: ReactNode;
}>;

export const MenuItemButton: FunctionComponent<MenuItemButtonProps> = ({
    children,
    onConfirm,
    onSelected,
    disabled = false,
    selectable = null,
    className = null,
    description = null,
}) => {
    return (
        <MenuItemContainer
            onSelected={onSelected}
            onConfirm={onConfirm}
            disabled={disabled}
            selectable={selectable === null ? !disabled : selectable}
            className={className}
            description={description}
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

type baseItemInputProps = PropsWithChildren<{
    onConfirm?: () => void;
    onSelected?: () => void;
    setChildTextFocus?: (v: boolean) => void;
    value?: any;
    name: string;
    handleOnChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: () => void;
}>;

type InputType = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const InputText = forwardRef<HTMLInputElement, InputType>(({ ...props }, ref) => {
    return <input type="text" {...props} id="targeted-input" ref={ref} />;
});

type MenuItemNumberInputProps = PropsWithChildren<{
    setChildTextFocus?: (v: boolean) => void;
    onSelected?: () => void;
    value?: string;
    name: string;
    onChange: (k: string, v: string) => void;
    onBlur: () => void;
    rounding?: number;
}>;

export const BaseItemInput: FunctionComponent<baseItemInputProps> = ({
    children,
    onSelected,
    setChildTextFocus,
    value,
    name,
    handleOnChange,
    onBlur,
}) => {
    const ref = useRef<HTMLInputElement>(null);
    const { setTextFocus } = useContext(MenuContext);

    const handleOnFocus = () => {
        setChildTextFocus && setChildTextFocus(true);
        setTextFocus(true);
    };

    const handleBlur = async () => {
        setChildTextFocus && setChildTextFocus(false);
        setTextFocus(false);
        if (typeof onBlur === 'function') {
            onBlur();
        }
    };

    const handleSelect = () => {
        onSelected && onSelected();
    };

    const handleConfirm = async () => {
        if (document.activeElement.id !== ref.current.id) {
            ref.current.focus();
            fetchNui(NuiEvent.ToggleDispatchTargetFocus, { target: true });
        } else {
            ref.current.blur();
            fetchNui(NuiEvent.ToggleDispatchTargetFocus, { target: false });
        }
    };

    const onClick = (event: React.MouseEvent) => {
        const target = event.target as InputType;
        if (document.activeElement.id === ref.current.id && target.id !== ref.current.id) {
            ref.current.blur();
        }
    };

    return (
        <MenuItemContainer
            onConfirm={handleConfirm}
            onClick={onClick}
            onSelected={handleSelect}
            description={'Appuyer sur Entrée pour modifier la valeur et pour confirmer.'}
        >
            <div className="flex justify-between items-center">
                <h3>{children}</h3>
                <div className="border border-white w-50 rounded">
                    <InputText
                        className="w-full h-full"
                        style={{ backgroundColor: 'transparent', textAlign: 'center' }}
                        tabIndex={-1}
                        onChange={handleOnChange}
                        onFocus={handleOnFocus}
                        onBlur={handleBlur}
                        value={value}
                        name={name}
                        ref={ref}
                    />
                </div>
            </div>
        </MenuItemContainer>
    );
};

export const MenuItemNumberInput: FunctionComponent<MenuItemNumberInputProps> = ({
    children,
    setChildTextFocus,
    value,
    name,
    onChange,
    onBlur,
}) => {
    const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        onChange(e.currentTarget.name, e.currentTarget.value);
    };

    return (
        <BaseItemInput
            children={children}
            setChildTextFocus={setChildTextFocus}
            value={value}
            name={name}
            handleOnChange={handleOnChange}
            onBlur={onBlur}
        />
    );
};

type MenuItemStringInputProps = PropsWithChildren<{
    setChildTextFocus?: (v: boolean) => void;
    onSelected?: () => void;
    value?: string;
    onChange: (v: string) => void;
}>;

export const MenuItemStringInput: FunctionComponent<MenuItemStringInputProps> = ({
    children,
    onSelected,
    setChildTextFocus,
    value,
    onChange,
}) => {
    const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const text =
            e.currentTarget.value && e.currentTarget.value.length ? e.currentTarget.value.toLocaleLowerCase() : null;
        onChange(text);
    };

    return (
        <BaseItemInput
            children={children}
            setChildTextFocus={setChildTextFocus}
            onSelected={onSelected}
            value={value}
            name={null}
            handleOnChange={handleOnChange}
        />
    );
};

type MenuItemCheckboxProps = PropsWithChildren<{
    onSelected?: () => void;
    onChange?: (value: boolean) => void;
    checked?: boolean;
    disabled?: boolean;
    description?: string;
}>;

export const MenuItemCheckbox: FunctionComponent<MenuItemCheckboxProps> = ({
    children,
    onChange,
    checked = false,
    onSelected,
    disabled = false,
    description = null,
}) => {
    const [isChecked, setIsChecked] = useState(checked);

    const onConfirm = () => {
        setIsChecked(!isChecked);
        onChange && onChange(!isChecked);
    };

    return (
        <MenuItemContainer description={description} onSelected={onSelected} onConfirm={onConfirm} disabled={disabled}>
            <div className="flex justify-between items-center">
                <h3>{children}</h3>

                <div className="relative">
                    <div className="border border-white size-4 rounded-full bg-black/20">
                        {isChecked && <div className="absolute top-0.5 left-0.5 size-3 rounded-full bg-white" />}
                    </div>
                </div>
            </div>
        </MenuItemContainer>
    );
};

type MenuItemSubMenuLinkProps = PropsWithChildren<{
    id: string;
    onSelected?: () => void;
    disabled?: boolean;
    selectable?: boolean;
    description?: string;
    noChevron?: boolean;
}>;

export const useMenuNavigate = (id: string): (() => void) => {
    const location = useLocation();
    const navigate = useNavigate();
    const type = useContext(MenuTypeContext);
    const slugId = slugify(id);
    const state = location.state as { activeIndex: number } | undefined;

    return () =>
        navigate(`/${type}/${slugId}`, {
            state: {
                ...(state || {}),
                activeIndex: 0,
            },
        });
};

export const useCurrentMenu = (): [MenuType, string | null] => {
    const type = useContext(MenuTypeContext);
    const location = useLocation();

    if (type === null) {
        return [null, null];
    }

    const subPath = location.pathname.replace(`/${type}/`, '');

    if (subPath === '') {
        return [type, null];
    }

    return [type, subPath];
};

export const useIsInSubMenu = (id: string): boolean => {
    const [, subPath] = useCurrentMenu();

    return subPath === id;
};

export const MenuItemSubMenuLink: FunctionComponent<MenuItemSubMenuLinkProps> = ({
    children,
    id,
    onSelected,
    description = null,
    disabled = false,
    selectable = null,
    noChevron = false,
}) => {
    const navigateTo = useMenuNavigate(id);

    if (noChevron) {
        return (
            <MenuItemContainer
                onSelected={onSelected}
                onConfirm={navigateTo}
                disabled={disabled}
                selectable={selectable}
                description={description}
            >
                {children}
            </MenuItemContainer>
        );
    } else {
        return (
            <MenuItemContainer
                onSelected={onSelected}
                onConfirm={navigateTo}
                disabled={disabled}
                selectable={selectable}
                description={description}
            >
                <div className="flex items-center justify-between">
                    <div>{children}</div>
                    <ChevronRightIcon className="size-5 p-0.5" />
                </div>
            </MenuItemContainer>
        );
    }
};

export const MenuItemGoBack: FunctionComponent = () => {
    const navigate = useNavigate();

    return (
        <MenuItemContainer className="border-t-2 mt-2 border-white/50" onConfirm={() => navigate(-1)}>
            🔙 Revenir au menu précédent
        </MenuItemContainer>
    );
};

type MenuSelectControlsProps = PropsWithChildren<{
    onChange?: (index: number, value?: any) => void;
    initialValue?: any;
}>;

const MenuSelectControls: FunctionComponent<MenuSelectControlsProps> = ({ onChange, children, initialValue }) => {
    const { activeOptionIndex, setActiveOptionIndex, setActiveValue, activeValue, showAllOptions, equalityFn } =
        useContext(MenuItemSelectContext);
    const initialValueRef = useRef(initialValue);
    const isItemSelected = useContext(MenuSelectedContext);
    const menuItems = useDescendants(MenuItemSelectDescendantContext);
    const { visibility } = useContext(MenuContext);

    useReset(() => {
        if (isItemSelected) {
            for (const index in menuItems) {
                const menuItem = menuItems[index];

                if (equalityFn(menuItem.value, initialValueRef.current)) {
                    setActiveOptionIndex(parseInt(index, 10));
                }
            }
        }
    });

    useEffect(() => {
        for (const index in menuItems) {
            const menuItem = menuItems[index];

            if (equalityFn(menuItem.value, activeValue)) {
                const activeIndex = parseInt(index, 10);

                if (activeIndex !== activeOptionIndex) {
                    setActiveOptionIndex(activeIndex);
                }
            }
        }
    }, [activeValue]);

    useEffect(() => {
        const menuItem = menuItems[activeOptionIndex];

        onChange && onChange(activeOptionIndex, menuItem?.value);
        setActiveValue(menuItem?.value);
    }, [activeOptionIndex, menuItems]);

    useLayoutEffect(() => {
        let defaultIndex = null;

        for (let i = 0; i < menuItems.length; i++) {
            if (equalityFn(menuItems[i].value, activeValue)) {
                defaultIndex = i;
                break;
            }
        }

        if (defaultIndex !== null) {
            if (defaultIndex !== activeOptionIndex) {
                setActiveOptionIndex(defaultIndex);
            }
        } else {
            if (activeOptionIndex != 0) {
                setActiveOptionIndex(0);
            }
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
        if (!visibility) {
            return;
        }

        if (isItemSelected) {
            goLeft();
        }
    });

    useArrowRight(() => {
        if (!visibility) {
            return;
        }

        if (isItemSelected) {
            goRight();
        }
    });

    return (
        <div className="flex items-center w-full justify-between">
            {!showAllOptions && (
                <ChevronLeftIcon
                    onClick={event => {
                        goLeft();

                        event.stopPropagation();
                    }}
                    className="size-5 p-0.5"
                />
            )}
            <div className="overflow-hidden">{children}</div>
            {!showAllOptions && (
                <ChevronRightIcon
                    onClick={event => {
                        goRight();

                        event.stopPropagation();
                    }}
                    className="size-5 p-0.5"
                />
            )}
        </div>
    );
};

type MenuItemSelectProps = PropsWithChildren<{
    title: string | ReactNode;
    onConfirm?: (index: number, value: any | undefined) => void;
    onSelected?: () => void;
    onSelectedValue?: (index: number, value: any | undefined) => void;
    onChange?: (index: number, value: any) => void;
    disabled?: boolean;
    value?: any;
    distance?: number;
    keyDescendant?: string | null;
    showAllOptions?: boolean;
    initialValue?: any;
    titleWidth?: number;
    description?: string | ReactNode;
    useGrid?: boolean;
    alignRight?: boolean;
    descriptionValue?: (value: any) => string | ReactNode;
    equalityFn?: (a: any, b: any) => boolean;
    syncValue?: boolean;
}>;

export const MenuItemSelect: FunctionComponent<MenuItemSelectProps> = ({
    children,
    onConfirm,
    onSelected,
    onSelectedValue,
    onChange,
    title,
    disabled = false,
    distance = 0,
    value = null,
    keyDescendant = null,
    showAllOptions = false,
    initialValue,
    titleWidth = 40,
    description = null,
    useGrid = false,
    alignRight = false,
    syncValue = false,
    descriptionValue,
    equalityFn = (a, b) => a === b,
}) => {
    const [descendants, setDescendants] = useDescendantsInit();
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);
    const [itemDescription, setItemDescription] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState(value);
    const [previousLength, setPreviousLength] = useState(0);

    useEffect(() => {
        if (previousLength === descendants.length) {
            return;
        }

        setPreviousLength(descendants.length);

        if (previousLength > 0 && descendants.length > 0) {
            // reset descendants to ensure ordering is correct
            setDescendants([]);
        }
    }, [descendants.length, previousLength]);

    useEffect(() => {
        if (syncValue) {
            setActiveValue(value);
        }
    }, [syncValue, value]);

    const onItemConfirm = useCallback(() => {
        onConfirm && onConfirm(activeOptionIndex, activeValue);
    }, [activeOptionIndex, onConfirm, activeValue]);

    const classNameContainer = cn('flex items-center', {
        'justify-between': !showAllOptions || useGrid,
    });

    const classNameTitle = cn('pr-2 truncate');

    const classNameList = cn({
        'ml-4': showAllOptions && !alignRight,
        'ml-auto': alignRight,
    });

    return (
        <MenuItemContainer
            onSelected={
                onSelected
                    ? onSelected
                    : onSelectedValue
                      ? () => onSelectedValue(activeOptionIndex, activeValue)
                      : undefined
            }
            onConfirm={onItemConfirm}
            disabled={disabled}
            description={
                descriptionValue ? descriptionValue(activeValue) : itemDescription ? itemDescription : description
            }
        >
            <DescendantProvider
                key={keyDescendant}
                context={MenuItemSelectDescendantContext}
                items={descendants}
                set={setDescendants}
            >
                <MenuItemSelectContext.Provider
                    value={{
                        activeOptionIndex,
                        setDescription: setItemDescription,
                        setActiveOptionIndex,
                        setActiveValue,
                        activeValue,
                        distance,
                        showAllOptions,
                        equalityFn,
                    }}
                >
                    <div className="w-full">
                        <div className={classNameContainer}>
                            <h3
                                className={classNameTitle}
                                style={{
                                    width: showAllOptions ? 'auto' : `${titleWidth}%`,
                                }}
                            >
                                {title}
                            </h3>
                            <div
                                className={classNameList}
                                style={{
                                    width: showAllOptions ? 'auto' : `${100 - titleWidth}%`,
                                }}
                            >
                                <MenuSelectControls onChange={onChange} initialValue={initialValue}>
                                    {useGrid ? (
                                        <ul className="grid grid-cols-5 gap-2">{children}</ul>
                                    ) : (
                                        <ul className="flex">{children}</ul>
                                    )}
                                </MenuSelectControls>
                            </div>
                        </div>
                        <MenuItemSelectHelper />
                    </div>
                </MenuItemSelectContext.Provider>
            </DescendantProvider>
        </MenuItemContainer>
    );
};

export default function useOnScreen(ref) {
    const [isIntersecting, setIntersecting] = useState(false);

    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

    useEffect(() => {
        observer.observe(ref.current);
        // Remove the observer as soon as the component is unmounted
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting;
}

type MenuItemSelectHelperItemProps = PropsWithChildren<{
    index: number;
}>;

export const MenuItemSelectHelperItem: FunctionComponent<MenuItemSelectHelperItemProps> = ({ children, index }) => {
    const { activeOptionIndex, setActiveOptionIndex } = useContext(MenuItemSelectContext);
    const ref = useRef(null);
    const onScreen = useOnScreen(ref);

    useEffect(() => {
        if (index === activeOptionIndex && ref && !onScreen) {
            ref.current.scrollIntoView();
        }
    }, [activeOptionIndex, index, ref]);

    return (
        <li
            ref={ref}
            onMouseEnter={() => setActiveOptionIndex(index)}
            onClick={() => setActiveOptionIndex(index)}
            className="capitalize"
            key={index}
        >
            <BorderBox
                duration="duration-0"
                borderClassName="rounded-lg"
                showBorder={index === activeOptionIndex}
                disableBackground={index !== activeOptionIndex}
                blur={false}
            >
                <div className="px-4 py-0.5 pl-2">{children}</div>
            </BorderBox>
        </li>
    );
};

export const MenuItemSelectHelper: FunctionComponent = () => {
    const isItemSelected = useContext(MenuSelectedContext);
    const menuItems = useDescendants(MenuItemSelectDescendantContext);
    const helperCount = menuItems.filter(item => item.helper !== null).length;
    const helpers = menuItems.map(item => item.helper);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        return () => {
            setClicked(false);
        };
    }, [isItemSelected]);

    if (!isItemSelected || helperCount <= 0 || clicked) {
        return null;
    }

    let leftOffset = 'left-12';
    let width = 'w-1/5';

    if (window.innerWidth > 3079 && window.innerHeight < 1200) {
        leftOffset = 'left-[96vh]';
        width = 'w-[10vh]';
    }

    if (window.innerWidth > 5000 && window.innerHeight < 1500) {
        leftOffset = 'left-[104vh]';
        width = 'w-[10vh]';
    }

    return (
        <div
            className={clsx('fixed translate-x-full top-28 min-w-[24rem] max-h-[40vh]', {
                [leftOffset]: true,
                [width]: true,
            })}
        >
            <GlassMorphismContainer duration="duration-0" className="p-1" borderClassName="rounded-lg" disableBorder>
                <ul
                    onClick={() => setClicked(true)}
                    className="rounded-lg max-h-[40vh] overflow-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                >
                    {helpers.map((helper, index) => {
                        return (
                            <MenuItemSelectHelperItem key={index} index={index}>
                                {helper}
                            </MenuItemSelectHelperItem>
                        );
                    })}
                </ul>
            </GlassMorphismContainer>
        </div>
    );
};

const useSelectOption = (
    value?: any,
    onSelected?: () => void,
    description?: string,
    helper?: ReactNode,
    helperRef?: any
): [(value) => void, boolean, boolean, (value) => void, boolean] => {
    const isItemSelected = useContext(MenuSelectedContext);
    const { activeOptionIndex, distance, setDescription, setActiveOptionIndex, showAllOptions, activeValue } =
        useContext(MenuItemSelectContext);
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
            helper,
        };
    }, [element, helperRef]);
    const isInitialValue = useMemo(() => {
        return activeValue === value;
    }, []);

    const index = useDescendant(descendant, MenuItemSelectDescendantContext);
    const distanceOfIndex = Math.abs(index - activeOptionIndex);
    const show = showAllOptions || distanceOfIndex <= distance;
    const isSelected = distanceOfIndex === 0;
    const onClick = useCallback(() => {
        setActiveOptionIndex(index);
    }, [setActiveOptionIndex, index]);

    useEffect(() => {
        if (isItemSelected && isSelected) {
            onSelected && onSelected();
            setDescription(description);
        }
    }, [isSelected, isItemSelected]);

    return [handleRefSet, show, isSelected, onClick, isInitialValue];
};

type MenuItemSelectOptionProps = PropsWithChildren<{
    onSelected?: () => void;
    value?: any;
    description?: string;
    helper?: ReactNode;
    useGrid?: boolean;
    highlight?: boolean;
    disabled?: boolean;
}>;

export const MenuItemSelectOption: FunctionComponent<MenuItemSelectOptionProps> = ({
    children,
    onSelected,
    value = null,
    description = null,
    helper = null,
    disabled = false,
}) => {
    const [handleRefSet, show, , onClick] = useSelectOption(value, onSelected, description, helper, helper);

    return (
        <li
            ref={handleRefSet}
            className={cn('truncate', {
                hidden: !show,
                'text-white/50': disabled,
                'text-white': !disabled,
            })}
            onClick={onClick}
        >
            {children}
        </li>
    );
};

export const MenuItemSelectOptionBox: FunctionComponent<MenuItemSelectOptionProps> = ({
    children,
    onSelected,
    value = null,
    description = null,
    helper = null,
    useGrid = false,
    highlight = false,
}) => {
    const [handleRefSet, show, selected, onClick, isInitialValue] = useSelectOption(
        value,
        onSelected,
        description,
        helper
    );

    return (
        <li
            ref={handleRefSet}
            className={cn('border-2 rounded-sm p-2 truncate', {
                'mr-2': !useGrid,
                hidden: !show,
                'border-white': selected,
                'border-white/20': !highlight && !selected,
                'border-green-400': !selected && highlight,
                'text-white': isInitialValue,
                'text-white/50': !isInitialValue,
                'text-green-400': !isInitialValue && highlight,
                'grid place-content-center': useGrid,
            })}
            onClick={onClick}
        >
            {children}
        </li>
    );
};

type MenuItemSelectOptionColorHelperProps = {
    label: string;
    color: RGBColor;
};

export const MenuItemSelectOptionColorHelper: FunctionComponent<MenuItemSelectOptionColorHelperProps> = ({
    label,
    color,
}) => {
    return (
        <div className="flex justify-between items-center">
            <span>{label}</span>
            <div
                className="flex-grow h-4 ml-2"
                style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]} )` }}
            />
        </div>
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
    label = null,
}) => {
    const helper = <MenuItemSelectOptionColorHelper label={label} color={color} />;
    const [handleRefSet, show, isSelected, onClick] = useSelectOption(value, onSelected, description, helper);
    const colorClassname = cn('h-5 w-5 rounded-full hover:border-white', {
        'border-2 border-white': isSelected,
        'border-2 border-black/50': !isSelected,
    });

    return (
        <li
            ref={handleRefSet}
            className={cn('mr-1', {
                hidden: !show,
            })}
            onClick={onClick}
        >
            <div
                className={colorClassname}
                style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]} )` }}
            />
        </li>
    );
};
