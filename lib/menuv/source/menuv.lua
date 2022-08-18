----------------------- [ MenuV ] -----------------------
-- GitHub: https://github.com/ThymonA/menuv/
-- License: GNU General Public License v3.0
--          https://choosealicense.com/licenses/gpl-3.0/
-- Author: Thymon Arens <contact@arens.io>
-- Name: MenuV
-- Version: 1.0.0
-- Description: FiveM menu library for creating menu's
----------------------- [ MenuV ] -----------------------
local assert = assert
local pairs = assert(pairs)
local rawget = assert(rawget)
local rawset = assert(rawset)
local insert = assert(table.insert)
local remove = assert(table.remove)
local format = assert(string.format)
local upper = assert(string.upper)
local lower = assert(string.lower)
local setmetatable = assert(setmetatable)

--- FiveM globals
local GET_CURRENT_RESOURCE_NAME = assert(GetCurrentResourceName)
local HAS_STREAMED_TEXTURE_DICT_LOADED = assert(HasStreamedTextureDictLoaded)
local REQUEST_STREAMED_TEXTURE_DICT = assert(RequestStreamedTextureDict)
local REGISTER_KEY_MAPPING = assert(RegisterKeyMapping)
local REGISTER_COMMAND = assert(RegisterCommand)
local GET_HASH_KEY = assert(GetHashKey)
local CreateThread = assert(Citizen.CreateThread)
local Wait = assert(Citizen.Wait)

---@load 'config.lua'
---@load 'app/lua_components/utilities.lua'
---@load 'app/lua_components/item.lua'
---@load 'app/lua_components/menu.lua'
---@load 'app/lua_components/translations.lua'

--- MenuV table
local menuv_table = {
    ---@type string
    __class = 'MenuV',
    ---@type string
    __type = 'MenuV',
    ---@type Menu|nil
    CurrentMenu = nil,
    ---@type string|nil
    CurrentUpdateUUID = nil,
    ---@type string
    CurrentResourceName = GET_CURRENT_RESOURCE_NAME(),
    ---@type boolean
    Loaded = false,
    ---@type Menu[]
    Menus = {},
    ---@type Menu[]
    ParentMenus = {},
    ---@type table<string, function>
    NUICallbacks = {},
    ---@type table<string, string>
    Translations = translations,
    ---@class keys
    Keys = setmetatable({ data = {}, __class = 'MenuVKeys', __type = 'keys' }, {
        __index = function(t, k)
            return rawget(t.data, k)
        end,
        __newindex = function(t, actionHax, v)
            actionHax = Utilities:Ensure(actionHax, 'unknown')

            if (actionHax == 'unknown') then return end

            local rawKey = rawget(t.data, actionHax)
            local keyExists = rawKey ~= nil
            local prevState = Utilities:Ensure((rawKey or {}).status, false)
            local newState = Utilities:Ensure(v, false)

            if (keyExists) then
                rawset(t.data[actionHax], 'status', newState)

                if (prevState ~= newState and newState) then
                    rawKey.func(rawKey.menu)
                end
            end
        end,
        __call = function(t, actionHax, m, actionFunc, inputType)
            actionHax = Utilities:Ensure(actionHax, 'unknown')
            m = Utilities:Typeof(m) == 'Menu' and m or nil
            actionFunc = Utilities:Ensure(actionFunc, function() end)
            inputType = Utilities:Ensure(inputType, 'KEYBOARD')
            inputType = upper(inputType)

            if (actionHax == 'unknown') then return end

            local rawKey = rawget(t.data, actionHax)
            local keyExists = rawKey ~= nil

            if (keyExists) then
                if not rawKey.inputTypes[inputType] then
                    rawKey.inputTypes[inputType] = true
                end

                return
            end

            rawset(t.data, actionHax, { status = false, menu = m, func = actionFunc, inputTypes = { [inputType] = true } })
        end
    })
}

---@class MenuV
MenuV = setmetatable(menuv_table, {})

--- Send a NUI message to MenuV resource
---@param input any
local SEND_NUI_MESSAGE = function(input)
    exports['menuv']:SendNUIMessage(input)
end

--- Register a NUI callback event
---@param name string Name of callback
---@param cb function Callback to execute
local REGISTER_NUI_CALLBACK = function(name, cb)
    name = Utilities:Ensure(name, 'unknown')
    cb = Utilities:Ensure(cb, function(_, cb) cb('ok') end)

    MenuV.NUICallbacks[name] = cb
end

--- Load translation
---@param k string Translation key
---@return string Translation or 'MISSING TRANSLATION'
function MenuV:T(k)
    k = Utilities:Ensure(k, 'unknown')

    return Utilities:Ensure(MenuV.Translations[k], 'MISSING TRANSLATION')
end

--- Create a `MenuV` menu
---@param title string Title of Menu
---@param subtitle string Subtitle of Menu
---@param texture string Name of texture example: "default"
---@param dictionary string Name of dictionary example: "menuv"
---@param namespace string Namespace of Menu
---@param theme string Theme of Menu
---@return Menu
function MenuV:CreateMenu(title, subtitle, texture, dictionary, namespace, theme)
    local menu = CreateMenu({
        Theme = theme,
        Title = title,
        Subtitle = subtitle,
        Texture = texture,
        Dictionary = dictionary,
        Namespace = namespace
    })

    local index = #(self.Menus or {}) + 1

    insert(self.Menus, index, menu)

    return self.Menus[index] or menu
end

--- Create a menu that inherits properties from another menu
---@param parent Menu|string Menu or UUID of menu
---@param overrides table<string, string|number> Properties to override in menu object (ignore parent)
---@param namespace string Namespace of menu
function MenuV:InheritMenu(parent, overrides, namespace)
    overrides = Utilities:Ensure(overrides, {})

    local uuid = Utilities:Typeof(parent) == 'Menu' and parent.UUID or Utilities:Typeof(parent) == 'string' and parent

    if (uuid == nil) then return end

    local parentMenu = self:GetMenu(uuid)

    if (parentMenu == nil) then return end

    local menu = CreateMenu({
        Theme = Utilities:Ensure(overrides.theme or overrides.Theme, parentMenu.Theme),
        Title = Utilities:Ensure(overrides.title or overrides.Title, parentMenu.Title),
        Subtitle = Utilities:Ensure(overrides.subtitle or overrides.Subtitle, parentMenu.Subtitle),
        Position = Utilities:Ensure(overrides.position or overrides.Position, parentMenu.Position),
        Size = Utilities:Ensure(overrides.size or overrides.Size, parentMenu.Size),
        Texture = Utilities:Ensure(overrides.texture or overrides.Texture, parentMenu.Texture),
        Dictionary = Utilities:Ensure(overrides.dictionary or overrides.Dictionary, parentMenu.Dictionary),
        Namespace = Utilities:Ensure(namespace, 'unknown')
    })

    local index = #(self.Menus or {}) + 1

    insert(self.Menus, index, menu)

    return self.Menus[index] or menu
end

--- Load a menu based on `uuid`
---@param uuid string UUID of menu
---@return Menu|nil Founded menu or `nil`
function MenuV:GetMenu(uuid)
    uuid = Utilities:Ensure(uuid, '00000000-0000-0000-0000-000000000000')

    for _, v in pairs(self.Menus) do
        if (v.UUID == uuid) then
            return v
        end
    end

    return nil
end

--- Open a menu
---@param menu Menu|string Menu or UUID of Menu
---@param cb function Execute this callback when menu has opened
function MenuV:OpenMenu(menu, cb, reopen)
    local uuid = Utilities:Typeof(menu) == 'Menu' and menu.UUID or Utilities:Typeof(menu) == 'string' and menu

    if (uuid == nil) then return end

    cb = Utilities:Ensure(cb, function() end)

    menu = self:GetMenu(uuid)

    if (menu == nil) then return end

    local dictionaryLoaded = HAS_STREAMED_TEXTURE_DICT_LOADED(menu.Dictionary)

    if (not self.Loaded or not dictionaryLoaded) then
        if (not dictionaryLoaded) then REQUEST_STREAMED_TEXTURE_DICT(menu.Dictionary) end

        CreateThread(function()
            repeat Wait(0) until MenuV.Loaded

            if (not dictionaryLoaded) then
                repeat Wait(10) until HAS_STREAMED_TEXTURE_DICT_LOADED(menu.Dictionary)
            end

            MenuV:OpenMenu(uuid, cb)
        end)
        return
    end

    if (self.CurrentMenu ~= nil) then
        insert(self.ParentMenus, self.CurrentMenu)

        self.CurrentMenu:RemoveOnEvent('update', self.CurrentUpdateUUID)
        self.CurrentMenu:DestroyThreads()
    end

    TriggerEvent('soz-core:client:menu:close')

    self.CurrentMenu = menu
    self.CurrentUpdateUUID = menu:On('update', function(m, k, v)
        k = Utilities:Ensure(k, 'unknown')

        if (k == 'Title' or k == 'title') then
            SEND_NUI_MESSAGE({ action = 'UPDATE_TITLE', title = Utilities:Ensure(v, 'MenuV'), __uuid = m.UUID })
        elseif (k == 'Subtitle' or k == 'subtitle') then
            SEND_NUI_MESSAGE({ action = 'UPDATE_SUBTITLE', subtitle = Utilities:Ensure(v, ''), __uuid = m.UUID })
        elseif (k == 'Items' or k == 'items') then
            SEND_NUI_MESSAGE({ action = 'UPDATE_ITEMS', items = (m.Items:ToTable() or {}), __uuid = m.UUID })
        elseif (k == 'Item' or k == 'item' and Utilities:Typeof(v) == 'Item') then
            SEND_NUI_MESSAGE({ action = 'UPDATE_ITEM', item = m.Items:ItemToTable(v) or {}, __uuid = m.UUID })
        elseif (k == 'AddItem' or k == 'additem' and Utilities:Typeof(v) == 'Item') then
            SEND_NUI_MESSAGE({ action = 'ADD_ITEM', item = m.Items:ItemToTable(v), __uuid = m.UUID })
        elseif (k == 'RemoveItem' or k == 'removeitem' and Utilities:Typeof(v) == 'Item') then
            SEND_NUI_MESSAGE({ action = 'REMOVE_ITEM', uuid = v.UUID, __uuid = m.UUID })
        elseif (k == 'UpdateItem' or k == 'updateitem' and Utilities:Typeof(v) == 'Item') then
            SEND_NUI_MESSAGE({ action = 'UPDATE_ITEM', item = m.Items:ItemToTable(v) or {}, __uuid = m.UUID })
        end
    end)

    SEND_NUI_MESSAGE({
        action = 'OPEN_MENU',
        menu = menu:ToTable(),
        reopen = Utilities:Ensure(reopen, false)
    })

    cb()
end

function MenuV:Refresh()
    if (self.CurrentMenu == nil) then
        return
    end

    SEND_NUI_MESSAGE({
        action = 'REFRESH_MENU',
        menu = self.CurrentMenu:ToTable()
    })
end

--- Close a menu
---@param menu Menu|string Menu or UUID of Menu
---@param cb function Execute this callback when menu has is closed or parent menu has opened
function MenuV:CloseMenu(menu, cb)
    local uuid = Utilities:Typeof(menu) == 'Menu' and menu.UUID or Utilities:Typeof(menu) == 'string' and menu

    if (uuid == nil) then cb() return end

    cb = Utilities:Ensure(cb, function() end)
    menu = self:GetMenu(uuid)

    if (menu == nil or self.CurrentMenu == nil or self.CurrentMenu.UUID ~= uuid) then cb() return end

    self.CurrentMenu:RemoveOnEvent('update', self.CurrentUpdateUUID)
    self.CurrentMenu:Trigger('close')
    self.CurrentMenu:DestroyThreads()
    self.CurrentMenu = nil

    SEND_NUI_MESSAGE({ action = 'CLOSE_MENU', uuid = uuid })

    if (#self.ParentMenus <= 0) then cb() return end

    local prev_index = #self.ParentMenus
    local prev_menu = self.ParentMenus[prev_index] or nil

    if (prev_menu == nil) then cb() return end

    remove(self.ParentMenus, prev_index)

    self:OpenMenu(prev_menu, function()
        cb()
    end, true)
end

--- Close all menus
---@param cb function Execute this callback when all menus are closed
function MenuV:CloseAll(cb)
    cb = Utilities:Ensure(cb, function() end)

    if (not self.Loaded) then
        CreateThread(function()
            repeat Wait(0) until MenuV.Loaded

            MenuV:CloseAll(cb)
        end)
        return
    end

    if (self.CurrentMenu == nil) then cb() return end

    local uuid = Utilities:Ensure(self.CurrentMenu.UUID, '00000000-0000-0000-0000-000000000000')

    self.CurrentMenu:RemoveOnEvent('update', self.CurrentUpdateUUID)
    self.CurrentMenu:Trigger('close')
    self.CurrentMenu:DestroyThreads()

    SEND_NUI_MESSAGE({ action = 'CLOSE_MENU', uuid = uuid })

    self.CurrentMenu = nil
    self.ParentMenus = {}

    cb()
end

--- Register keybind for specific menu
---@param menu Menu|string MenuV menu
---@param action string Name of action
---@param func function This will be executed
---@param description string Key description
---@param defaultType string Default key type
---@param defaultKey string Default key
function MenuV:AddControlKey(menu, action, func, description, defaultType, defaultKey)
    local uuid = Utilities:Typeof(menu) == 'Menu' and menu.UUID or Utilities:Typeof(menu) == 'string' and menu

    action = Utilities:Ensure(action, 'UNKNOWN')
    func = Utilities:Ensure(func, function() end)
    description = Utilities:Ensure(description, 'unknown')
    defaultType = Utilities:Ensure(defaultType, 'KEYBOARD')
    defaultType = upper(defaultType)
    defaultKey = Utilities:Ensure(defaultKey, 'F12')

    local m = self:GetMenu(uuid)

    if (m == nil) then return end

    if (Utilities:Typeof(m.Namespace) ~= 'string' or m.Namespace == 'unknown') then
        error('[MenuV] Namespace is required for assigning keys.')
        return
    end

    action = Utilities:Replace(action, ' ', '_')
    action = upper(action)

    local resourceName = Utilities:Ensure(self.CurrentResourceName, 'unknown')
    local namespace = Utilities:Ensure(m.Namespace, 'unknown')
    local actionHash = GET_HASH_KEY(('%s_%s_%s'):format(resourceName, namespace, action))
    local actionHax = format('%x', actionHash)

    local typeGroup = Utilities:GetInputTypeGroup(defaultType)

    if (self.Keys[actionHax] and self.Keys[actionHax].inputTypes[typeGroup]) then return end

    self.Keys(actionHax, m, func, typeGroup)

    local k = actionHax

    if typeGroup > 0 then
        local inputGroupName = Utilities:GetInputGroupName(typeGroup)
        k = ('%s_%s'):format(lower(inputGroupName), k)
    end

    REGISTER_KEY_MAPPING(('+%s'):format(k), description, defaultType, defaultKey)
    REGISTER_COMMAND(('+%s'):format(k), function() MenuV.Keys[actionHax] = true end)
    REGISTER_COMMAND(('-%s'):format(k), function() MenuV.Keys[actionHax] = false end)
end

--- Checks if namespace is available
---@param namespace string Namespace
---@return boolean Returns `true` if given namespace is available
function MenuV:IsNamespaceAvailable(namespace)
    namespace = lower(Utilities:Ensure(namespace, 'unknown'))

    if (namespace == 'unknown') then return true end

    ---@param v Menu
    for k, v in pairs(self.Menus or {}) do
        local v_namespace = Utilities:Ensure(v.Namespace, 'unknown')

        if (namespace == lower(v_namespace)) then
            return false
        end
    end

    return true
end


--- Checks if namespace is available
---@param namespace string Namespace
---@return boolean Returns `true` if given namespace is available
function MenuV:DeleteNamespace(namespace)
    namespace = lower(Utilities:Ensure(namespace, 'unknown'))

    ---@param v Menu
    for k, v in pairs(self.Menus or {}) do
        if namespace == v.Namespace then
            self.Menus[k] = nil
        end
    end
end

--- Mark MenuV as loaded when `main` resource is loaded
exports['menuv']:IsLoaded(function()
    MenuV.Loaded = true
end)

--- Register callback handler for MenuV
exports('NUICallback', function(name, info, cb)
    name = Utilities:Ensure(name, 'unknown')

    if (MenuV.NUICallbacks == nil or MenuV.NUICallbacks[name] == nil) then
        return
    end

    MenuV.NUICallbacks[name](info, cb)
end)

REGISTER_NUI_CALLBACK('open', function(info, cb)
    local uuid = Utilities:Ensure(info.uuid, '00000000-0000-0000-0000-000000000000')
    local new_uuid = Utilities:Ensure(info.new_uuid, '00000000-0000-0000-0000-000000000000')

    cb('ok')

    if (MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID == uuid or MenuV.CurrentMenu.UUID == new_uuid) then return end

    for _, v in pairs(MenuV.ParentMenus) do
        if (v.UUID == uuid) then
            return
        end
    end

    MenuV.CurrentMenu:RemoveOnEvent('update', MenuV.CurrentUpdateUUID)
    MenuV.CurrentMenu:Trigger('close')
    MenuV.CurrentMenu:DestroyThreads()
    MenuV.CurrentMenu = nil
    MenuV.ParentMenus = {}
end)

REGISTER_NUI_CALLBACK('opened', function(info, cb)
    local uuid = Utilities:Ensure(info.uuid, '00000000-0000-0000-0000-000000000000')

    cb('ok')

    if (MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= uuid) then return end

    MenuV.CurrentMenu:Trigger('open')
end)

REGISTER_NUI_CALLBACK('submit', function(info, cb)
    local uuid = Utilities:Ensure(info.uuid, '00000000-0000-0000-0000-000000000000')

    cb('ok')

    if (MenuV.CurrentMenu == nil) then return end

    for k, v in pairs(MenuV.CurrentMenu.Items) do
        if (v.UUID == uuid) then
            if (v.__type == 'confirm' or v.__type == 'checkbox') then
                v.Value = Utilities:Ensure(info.value, false)
            elseif (v.__type == 'range') then
                v.Value = Utilities:Ensure(info.value, v.Min)
            elseif (v.__type == 'slider' or v.__type == 'color_slider') then
                v.Value = Utilities:Ensure(info.value, 0) + 1
            end

            MenuV.CurrentMenu:Trigger('select', v)

            if (v.__type == 'button' or v.__type == 'menu') then
                MenuV.CurrentMenu.Items[k]:Trigger('select')
            elseif (v.__type == 'range') then
                MenuV.CurrentMenu.Items[k]:Trigger('select', v.Value)
            elseif (v.__type == 'slider' or v.__type == 'color_slider') then
                local option = MenuV.CurrentMenu.Items[k].Values[v.Value] or nil

                if (option == nil) then return end

                MenuV.CurrentMenu.Items[k]:Trigger('select', option.Value)
            end

            return
        end
    end
end)

REGISTER_NUI_CALLBACK('close', function(info, cb)
    local uuid = Utilities:Ensure(info.uuid, '00000000-0000-0000-0000-000000000000')

    if (MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= uuid) then cb('ok') return end

    MenuV.CurrentMenu:RemoveOnEvent('update', MenuV.CurrentUpdateUUID)
    MenuV.CurrentMenu:Trigger('close')
    MenuV.CurrentMenu:DestroyThreads()
    MenuV.CurrentMenu = nil

    if (#MenuV.ParentMenus <= 0) then cb('ok') return end

    local prev_index = #MenuV.ParentMenus
    local prev_menu = MenuV.ParentMenus[prev_index] or nil

    if (prev_menu == nil) then cb('ok') return end

    remove(MenuV.ParentMenus, prev_index)

    MenuV:OpenMenu(prev_menu, function()
        cb('ok')
    end, true)
end)

REGISTER_NUI_CALLBACK('close_all', function(info, cb)
    if (MenuV.CurrentMenu == nil) then
        for _, parentMenu in ipairs(MenuV.ParentMenus) do
            parentMenu:Trigger('close')
        end
        MenuV.ParentMenus = {}
        cb('ok')
        return
    end

    MenuV.CurrentMenu:RemoveOnEvent('update', MenuV.CurrentUpdateUUID)
    MenuV.CurrentMenu:Trigger('close')
    MenuV.CurrentMenu:DestroyThreads()
    MenuV.CurrentMenu = nil
    for _, parentMenu in ipairs(MenuV.ParentMenus) do
        parentMenu:Trigger('close')
    end
    MenuV.ParentMenus = {}

    cb('ok')
end)

REGISTER_NUI_CALLBACK('switch', function(info, cb)
    local prev_uuid = Utilities:Ensure(info.prev, '00000000-0000-0000-0000-000000000000')
    local next_uuid = Utilities:Ensure(info.next, '00000000-0000-0000-0000-000000000000')
    local prev_item, next_item = nil, nil

    cb('ok')

    if (MenuV.CurrentMenu == nil) then return end

    for k, v in pairs(MenuV.CurrentMenu.Items) do
        if (v.UUID == prev_uuid) then
            prev_item = v

            MenuV.CurrentMenu.Items[k]:Trigger('leave')
        end

        if (v.UUID == next_uuid) then
            next_item = v

            MenuV.CurrentMenu.Items[k]:Trigger('enter')
        end
    end

    if (prev_item ~= nil and next_item ~= nil) then
        MenuV.CurrentMenu:Trigger('switch', next_item, prev_item)
    end
end)

REGISTER_NUI_CALLBACK('update', function(info, cb)
    local uuid = Utilities:Ensure(info.uuid, '00000000-0000-0000-0000-000000000000')

    cb('ok')

    if (MenuV.CurrentMenu == nil) then return end

    for k, v in pairs(MenuV.CurrentMenu.Items) do
        if (v.UUID == uuid) then
            local newValue, oldValue = nil, nil

            if (v.__type == 'confirm' or v.__type == 'checkbox') then
                newValue = Utilities:Ensure(info.now, false)
                oldValue = Utilities:Ensure(info.prev, false)
            elseif (v.__type == 'range') then
                newValue = Utilities:Ensure(info.now, v.Min)
                oldValue = Utilities:Ensure(info.prev, v.Min)
            elseif (v.__type == 'slider' or v.__type == 'color_slider') then
                newValue = Utilities:Ensure(info.now, 0) + 1
                oldValue = Utilities:Ensure(info.prev, 0) + 1
            end

            if (Utilities:Any(v.__type, { 'button', 'menu', 'label' }, 'value')) then return end

            MenuV.CurrentMenu:Trigger('update', v, newValue, oldValue)
            MenuV.CurrentMenu.Items[k]:Trigger('change', newValue, oldValue)

            if (v.SaveOnUpdate) then
                MenuV.CurrentMenu.Items[k].Value = newValue

                if (v.__type == 'range') then
                    MenuV.CurrentMenu.Items[k]:Trigger('select', v.Value)
                elseif (v.__type == 'slider' or v.__type == 'color_slider') then
                    local option = MenuV.CurrentMenu.Items[k].Values[v.Value] or nil

                    if (option == nil) then return end

                    MenuV.CurrentMenu.Items[k]:Trigger('select', option.Value)
                end
            end
            return
        end
    end
end)

CreateThread(function()
    while true do
        local hidden = IsScreenFadedOut() or IsPauseMenuActive()

        if MenuV.CurrentMenu ~= nil and not hidden then
            DisableAllControlActions(0)

            EnableControlAction(0, 1, true) -- INPUT_LOOK_LR
            EnableControlAction(0, 2, true) -- INPUT_LOOK_UD
            EnableControlAction(0, 19, true) -- INPUT_CHARACTER_WHEEL
            EnableControlAction(0, 21, true) -- INPUT_SPRINT
            EnableControlAction(0, 30, true) -- INPUT_MOVE_LR
            EnableControlAction(0, 31, true) -- INPUT_MOVE_UD
            EnableControlAction(0, 59, true) -- INPUT_VEH_MOVE_LR
            EnableControlAction(0, 71, true) -- INPUT_VEH_ACCELERATE
            EnableControlAction(0, 72, true) -- INPUT_VEH_BRAKE
            EnableControlAction(0, 74, true) -- INPUT_VEH_HEADLIGHT
            EnableControlAction(0, 75, true) -- INPUT_VEH_EXIT
            EnableControlAction(0, 76, true) -- INPUT_VEH_HANDBRAKE
            EnableControlAction(0, 86, true) -- INPUT_VEH_HORN
            EnableControlAction(0, 137, true) -- INPUT_VEH_PUSHBIKE_SPRINT
            EnableControlAction(0, 172, true) -- INPUT_CELLPHONE_UP
            EnableControlAction(0, 173, true) -- INPUT_CELLPHONE_DOWN
            EnableControlAction(0, 174, true) -- INPUT_CELLPHONE_LEFT
            EnableControlAction(0, 175, true) -- INPUT_CELLPHONE_RIGHT
            EnableControlAction(0, 189, true) -- INPUT_FRONTEND_LEFT
            EnableControlAction(0, 190, true) -- INPUT_FRONTEND_RIGHT
            EnableControlAction(0, 191, true) -- INPUT_FRONTEND_RDOWN
            EnableControlAction(0, 194, true) -- INPUT_FRONTEND_RRIGHT
            EnableControlAction(0, 239, true) -- INPUT_CURSOR_X
            EnableControlAction(0, 240, true) -- INPUT_CURSOR_Y
        end

        Wait(0)
    end
end)
