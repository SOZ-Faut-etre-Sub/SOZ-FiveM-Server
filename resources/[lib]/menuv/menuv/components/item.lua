----------------------- [ MenuV ] -----------------------
-- GitHub: https://github.com/ThymonA/menuv/
-- License: GNU General Public License v3.0
--          https://choosealicense.com/licenses/gpl-3.0/
-- Author: Thymon Arens <contact@arens.io>
-- Name: MenuV
-- Version: 1.4.1
-- Description: FiveM menu library for creating menu's
----------------------- [ MenuV ] -----------------------
local assert = assert
---@type Utilities
local U = assert(Utilities)
local type = assert(type)
local pairs = assert(pairs)
local lower = assert(string.lower)
local upper = assert(string.upper)
local sub = assert(string.sub)
local pack = assert(table.pack)
local unpack = assert(table.unpack)
local insert = assert(table.insert)
local rawset = assert(rawset)
local rawget = assert(rawget)
local setmetatable = assert(setmetatable)

--- FiveM globals
local CreateThread = assert(Citizen.CreateThread)

--- Create a new menu item
---@param info table Menu information
---@return Item New item
function CreateMenuItem(info)
    info = U:Ensure(info, {})

    local item = {
        ---@type Menu|nil
        __menu = U:Ensure(info.__Menu or info.__menu, { __class = 'Menu', __type = 'Menu' }, true) or nil,
        ---@type string
        __event = U:Ensure(info.PrimaryEvent or info.primaryEvent, 'unknown'),
        ---@type string
        UUID = U:UUID(),
        ---@type string
        Icon = U:Ensure(info.Icon or info.icon, 'none'),
        ---@type string
        Label = U:Ensure(info.Label or info.label, ''),
        ---@type string
        Description = U:Ensure(info.Description or info.description, ''),
        ---@type any
        Value = info.Value or info.value,
        ---@type table[]
        Values = {},
        ---@type number
        Min = U:Ensure(info.Min or info.min, 0),
        ---@type number
        Max = U:Ensure(info.Max or info.max, 0),
        ---@type boolean
        Disabled = U:Ensure(info.Disabled or info.disabled, false),
        ---@type table
        Events = U:Ensure(info.Events or info.events, {}),
        ---@type boolean
        SaveOnUpdate = U:Ensure(info.SaveOnUpdate or info.saveOnUpdate, false),
        ---@param t Item
        ---@param event string Name of Event
        Trigger = function(t, event, ...)
            event = lower(U:Ensure(event, 'unknown'))

            if (event == 'unknown') then return end
            if (U:StartsWith(event, 'on')) then
                event = 'On' .. sub(event, 3):gsub('^%l', upper)
            else
                event = 'On' .. event:gsub('^%l', upper)
            end

            if (not U:Any(event, (t.Events or {}), 'key')) then
                return
            end

            local args = pack(...)

            for _, v in pairs(t.Events[event]) do
                CreateThread(function()
                    v(t, unpack(args))
                end)
            end
        end,
        ---@param t Item
        ---@param event string Name of event
        ---@param func function|Menu Function or Menu to trigger
        On = function(t, event, func)
            event = lower(U:Ensure(event, 'unknown'))

            if (event == 'unknown') then return end
            if (U:StartsWith(event, 'on')) then
                event = 'On' .. sub(event, 3):gsub('^%l', upper)
            else
                event = 'On' .. event:gsub('^%l', upper)
            end

            if (not U:Any(event, (t.Events or {}), 'key')) then
                return
            end

            local _type = U:Typeof(func)

            if (_type == 'Menu') then
                local menu_t = {
                    __class = 'function',
                    __type = 'function',
                    func = function(t) MenuV:OpenMenu(t.uuid) end,
                    uuid = func.UUID or func.uuid or U:UUID()
                }
                local menu_mt = { __index = menu_t, __call = function(t) t:func() end }
                local menu_item = setmetatable(menu_t, menu_mt)

                insert(t.Events[event], menu_item)

                return
            end

            func = U:Ensure(func, function() end)

            insert(t.Events[event], func)
        end,
        ---@param t Item
        ---@param k string
        ---@param v string
        Validate = U:Ensure(info.Validate or info.validate, function(t, k, v)
            return true
        end),
        ---@param t Item
        ---@param k string
        ---@param v string
        Parser = U:Ensure(info.Parser or info.parser, function(t, k, v)
            return v
        end),
        ---@param t Item
        ---@param k string
        ---@param v string
        NewIndex = U:Ensure(info.NewIndex or info.newIndex, function(t, k, v)
        end),
        ---@param t Item
        ---@return any
        GetValue = function(t)
            local itemType = U:Ensure(t.__type, 'unknown')

            if (itemType == 'button' or itemType == 'menu' or itemType == 'unknown') then
                return t.Value
            end

            if (itemType == 'checkbox' or itemType == 'confirm') then
                return U:Ensure(t.Value, false)
            end

            if (itemType == 'slider') then
                for _, item in pairs(t.Values) do
                    if (item.Value == t.Value) then
                        return item.Value
                    end
                end

                return nil
            end

            if (itemType == 'range') then
                local rawValue = U:Ensure(t.Value, 0)

                if (t.Min > rawValue) then
                    return t.Min
                end

                if (t.Max < rawValue) then
                    return t.Max
                end

                return rawValue
            end
        end,
        ---@return Menu|nil
        GetParentMenu = function(t)
            return t.__menu or nil
        end
    }

    item.Events.OnEnter = {}
    item.Events.OnLeave = {}
    item.Events.OnUpdate = {}
    item.Events.OnDestroy = {}

    local mt = {
        __index = function(t, k)
            return rawget(t.data, k)
        end,
        __tostring = function(t)
            return t.UUID
        end,
        __call = function(t, ...)
            if (t.Trigger ~= nil and type(t.Trigger) == 'function') then
                t:Trigger(t.__event, ...)
            end
        end,
        __newindex = function(t, k, v)
            local key = U:Ensure(k, 'unknown')
            local oldValue = rawget(t.data, k)
            local checkInput = t.Validate ~= nil and type(t.Validate) == 'function'
            local inputParser = t.Parser ~= nil and type(t.Parser) == 'function'
            local updateIndexTrigger = t.NewIndex ~= nil and type(t.NewIndex) == 'function'

            if (checkInput) then
                local result = t:Validate(key, v)
                result = U:Ensure(result, true)

                if (not result) then
                   return
                end
            end

            if (inputParser) then
                local parsedValue = t:Parser(key, v)

                v = parsedValue or v
            end

            rawset(t.data, k, v)

            if (updateIndexTrigger) then
                t:NewIndex(key, v)
            end

            if (t.__menu ~= nil and U:Typeof(t.__menu) == 'Menu' and t.__menu.Trigger ~= nil and U:Typeof( t.__menu.Trigger) == 'function') then
                t.__menu:Trigger('update', 'UpdateItem', t)
            end

            if (key == 'Value' and t.Trigger ~= nil and type(t.Trigger) == 'function') then
                t:Trigger('update', key, v, oldValue)
            end
        end,
        __metatable = 'MenuV'
    }

    ---@class Item
    ---@filed private __event string Name of primary event
    ---@field public UUID string UUID of Item
    ---@field public Icon string Icon/Emoji for Item
    ---@field public Label string Label of Item
    ---@field public Description string Description of Item
    ---@field public Value any Value of Item
    ---@field public Values table[] List of values
    ---@field public Min number Min range value
    ---@field public Max number Max range value
    ---@field public Disabled boolean Disabled state of Item
    ---@field public SaveOnUpdate boolean Save on `update`
    ---@field private Events table<string, function[]> List of registered `on` events
    ---@field public Trigger fun(t: Item, event: string)
    ---@field public On fun(t: Item, event: string, func: function|Menu)
    ---@field public Validate fun(t: Item, k: string, v:any)
    ---@field public NewIndex fun(t: Item, k: string, v: any)
    ---@field public Parser fun(t: Item, k: string, v: any)
    ---@field public GetValue fun(t: Item):any
    ---@field public GetParentMenu func(t: Item):Menu|nil
    local i = setmetatable({ data = item, __class = 'Item', __type = U:Ensure(info.Type or info.type, 'unknown') }, mt)

    for k, v in pairs(info or {}) do
        local key = U:Ensure(k, 'unknown')

        if (key == 'unknown') then return end

        i:On(key, v)
    end

    return i
end

_ENV.CreateMenuItem = CreateMenuItem
_G.CreateMenuItem = CreateMenuItem