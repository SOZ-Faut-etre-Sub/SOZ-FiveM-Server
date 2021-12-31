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
local next = assert(next)
local pairs = assert(pairs)
local ipairs = assert(ipairs)
local lower = assert(string.lower)
local upper = assert(string.upper)
local sub = assert(string.sub)
local insert = assert(table.insert)
local remove = assert(table.remove)
local pack = assert(table.pack)
local unpack = assert(table.unpack)
local encode = assert(json.encode)
local rawset = assert(rawset)
local rawget = assert(rawget)
local setmetatable = assert(setmetatable)

--- FiveM globals
local GET_CURRENT_RESOURCE_NAME = assert(GetCurrentResourceName)
local GET_INVOKING_RESOURCE = assert(GetInvokingResource)
local HAS_STREAMED_TEXTURE_DICT_LOADED = assert(HasStreamedTextureDictLoaded)
local REQUEST_STREAMED_TEXTURE_DICT = assert(RequestStreamedTextureDict)

--- MenuV local variable
local current_resource = GET_CURRENT_RESOURCE_NAME()

--- Returns default empty table for items
---@returns items
function CreateEmptyItemsTable(data)
    data = U:Ensure(data, {})
    data.ToTable = function(t)
        local tempTable = {}
        local index = 0

        for _, option in pairs(t) do
            index = index + 1

            tempTable[index] = {
                index = index,
                type = option.__type,
                uuid = U:Ensure(option.UUID, 'unknown'),
                icon = U:Ensure(option.Icon, 'none'),
                label = U:Ensure(option.Label, 'Unknown'),
                description = U:Ensure(option.Description, ''),
                value = 'none',
                values = {},
                min = U:Ensure(option.Min, 0),
                max = U:Ensure(option.Max, 0),
                disabled = U:Ensure(option.Disabled, false)
            }

            if (option.__type == 'button' or option.__type == 'menu') then
                tempTable[index].value = 'none'
            elseif (option.__type == 'checkbox' or option.__type == 'confirm') then
                tempTable[index].value = U:Ensure(option.Value, false)
            elseif (option.__type == 'range') then
                tempTable[index].value = U:Ensure(option.Value, 0)

                if (tempTable[index].value <= tempTable[index].min) then
                    tempTable[index].value = tempTable[index].min
                elseif (tempTable[index].value >= tempTable[index].max) then
                    tempTable[index].value = tempTable[index].max
                end
            elseif (option.__type == 'slider') then
                tempTable[index].value = 0
            end

            local _values = U:Ensure(option.Values, {})
            local vIndex = 0

            for valueIndex, value in pairs(_values) do
                vIndex = vIndex + 1

                tempTable[index].values[vIndex] = {
                    label = U:Ensure(value.Label, 'Option'),
                    description = U:Ensure(value.Description, ''),
                    value = vIndex
                }

                if (option.__type == 'slider') then
                    if (U:Ensure(option.Value, 0) == valueIndex) then
                        tempTable[index].value = (valueIndex - 1)
                    end
                end
            end
        end

        return tempTable
    end
    data.ItemToTable = function(t, i)
        local tempTable = {}
        local index = 0
        local uuid = U:Typeof(i) == 'Item' and i.UUID or U:Ensure(i, '00000000-0000-0000-0000-000000000000')

        for _, option in pairs(t) do
            index = index + 1

            if (option.UUID == uuid) then
                tempTable = {
                    index = index,
                    type = option.__type,
                    uuid = U:Ensure(option.UUID, 'unknown'),
                    icon = U:Ensure(option.Icon, 'none'),
                    label = U:Ensure(option.Label, 'Unknown'),
                    description = U:Ensure(option.Description, ''),
                    value = 'none',
                    values = {},
                    min = U:Ensure(option.Min, 0),
                    max = U:Ensure(option.Max, 0),
                    disabled = U:Ensure(option.Disabled, false)
                }

                if (option.__type == 'button' or option.__type == 'menu') then
                    tempTable.value = 'none'
                elseif (option.__type == 'checkbox' or option.__type == 'confirm') then
                    tempTable.value = U:Ensure(option.Value, false)
                elseif (option.__type == 'range') then
                    tempTable.value = U:Ensure(option.Value, 0)

                    if (tempTable.value <= tempTable.min) then
                        tempTable.value = tempTable.min
                    elseif (tempTable.value >= tempTable.max) then
                        tempTable.value = tempTable.max
                    end
                elseif (option.__type == 'slider') then
                    tempTable.value = 0
                end

                local _values = U:Ensure(option.Values, {})
                local vIndex = 0

                for valueIndex, value in pairs(_values) do
                    vIndex = vIndex + 1

                    tempTable.values[vIndex] = {
                        label = U:Ensure(value.Label, 'Option'),
                        description = U:Ensure(value.Description, ''),
                        value = vIndex
                    }

                    if (option.__type == 'slider') then
                        if (U:Ensure(option.Value, 0) == valueIndex) then
                            tempTable.value = (valueIndex - 1)
                        end
                    end
                end

                return tempTable
            end
        end

        return tempTable
    end
    data.AddItem = function(t, item)
        if (U:Typeof(item) == 'Item') then
            local newIndex = #(U:Ensure(rawget(t, 'data'), {})) + 1

            rawset(t.data, newIndex, item)

            if (t.Trigger ~= nil and type(t.Trigger) == 'function') then
                t:Trigger('update', 'AddItem', item)
            end
        end

        return U:Ensure(rawget(t, 'data'), {})
    end

    local item_pairs = function(t, k)
        local _k, _v = next((rawget(t, 'data') or {}), k)

        if (_v ~= nil and type(_v) ~= 'table') then
            return item_pairs(t, _k)
        end

        return _k, _v
    end

    local item_ipairs = function(t, k)
        local _k, _v = next((rawget(t, 'data') or {}), k)

        if (_v ~= nil and (type(_v) ~= 'table' or type(_k) ~= 'number')) then
            return item_ipairs(t, _k)
        end

        return _k, _v
    end

    _G.item_pairs = item_pairs
    _ENV.item_pairs = item_pairs

    ---@class items
    return setmetatable({ data = data, Trigger = nil }, {
        __index = function(t, k)
            return rawget(t.data, k)
        end,
        __newindex = function(t, k, v)
            local oldValue = rawget(t.data, k)

            rawset(t.data, k, v)

            if (t.Trigger ~= nil and type(t.Trigger) == 'function') then
                if (oldValue == nil) then
                    t:Trigger('update', 'AddItem', v)
                elseif (oldValue ~= nil and v == nil) then
                    t:Trigger('update', 'RemoveItem', oldValue)
                elseif (oldValue ~= v) then
                    t:Trigger('update', 'UpdateItem', v, oldValue)
                end
            end
        end,
        __call = function(t, func)
            rawset(t, 'Trigger', U:Ensure(func, function() end))
        end,
        __pairs = function(t)
            local k = nil

            return function()
                local v

                k, v = item_pairs(t, k)

                return k, v
            end, t, nil
        end,
        __ipairs = function(t)
            local k = nil

            return function()
                local v

                k, v = item_ipairs(t, k)

                return k, v
            end, t, 0
        end,
        __len = function(t)
            local items = U:Ensure(rawget(t, 'data'), {})
            local itemCount = 0

            for _, v in pairs(items) do
                if (U:Typeof(v) == 'Item') then
                    itemCount = itemCount + 1
                end
            end

            return itemCount
        end
    })
end

--- Load a texture dictionary if not already loaded
---@param textureDictionary string Name of texture dictionary
local function LoadTextureDictionary(textureDictionary)
    textureDictionary = U:Ensure(textureDictionary, 'menuv')

    if (HAS_STREAMED_TEXTURE_DICT_LOADED(textureDictionary)) then return end

    REQUEST_STREAMED_TEXTURE_DICT(textureDictionary, true)
end

--- Create a new menu item
---@param info table Menu information
---@return Menu New item
function CreateMenu(info)
    info = U:Ensure(info, {})

    local namespace = U:Ensure(info.Namespace or info.namespace, 'unknown')
    local namespace_available = MenuV:IsNamespaceAvailable(namespace)

    if (not namespace_available) then
        error(("[MenuV] Namespace '%s' is already taken, make sure it is unique."):format(namespace))
    end

    local theme = lower(U:Ensure(info.Theme or info.theme, 'default'))

    if (theme ~= 'default' and theme ~= 'native') then
        theme = 'default'
    end

    if (theme == 'native') then
        info.R, info.G, info.B = 255, 255, 255
        info.r, info.g, info.b = 255, 255, 255
    end

    local item = {
        ---@type string
        Namespace = namespace,
        ---@type boolean
        IsOpen = false,
        ---@type string
        UUID = U:UUID(),
        ---@type string
        Title = not (info.Title or info.title) and '‏‏‎ ‎' or U:Ensure(info.Title or info.title, 'MenuV'),
        ---@type string
        Subtitle = U:Ensure(info.Subtitle or info.subtitle, ''),
        ---@type string | "'topleft'" | "'topcenter'" | "'topright'" | "'centerleft'" | "'center'" | "'centerright'" | "'bottomleft'" | "'bottomcenter'" | "'bottomright'"
        Position = U:Ensure(info.Position or info.position, 'topleft'),
        ---@type table
        Color = {
            R = U:Ensure(info.R or info.r, 0),
            G = U:Ensure(info.G or info.g, 0),
            B = U:Ensure(info.B or info.b, 255)
        },
        ---@type string | "'size-100'" | "'size-110'" | "'size-125'" | "'size-150'" | "'size-175'" | "'size-200'"
        Size = U:Ensure(info.Size or info.size, 'size-110'),
        ---@type string
        Dictionary = U:Ensure(info.Dictionary or info.dictionary, 'menuv'),
        ---@type string
        Texture = U:Ensure(info.Texture or info.texture, 'default'),
        ---@type table
        Events = U:Ensure(info.Events or info.events, {}),
        ---@type string
        Theme = theme,
        ---@type Item[]
        Items = CreateEmptyItemsTable({}),
        ---@param t Menu
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

            if (event == 'OnOpen') then rawset(t, 'IsOpen', true)
            elseif (event == 'OnClose') then rawset(t, 'IsOpen', false) end

            local args = pack(...)

            for _, v in pairs(t.Events[event]) do
                if (type(v) == 'table' and U:Typeof(v.func) == 'function') then
                    CreateThread(function()
                        if (event == 'OnClose') then
                            v.func(t, unpack(args))
                        else
                            local threadId = coroutine.running()

                            if (threadId ~= nil) then
                                insert(t.data.Threads, threadId)

                                v.func(t, unpack(args))

                                for i = 0, #(t.data.Threads or {}), 1 do
                                    if (t.data.Threads[i] == threadId) then
                                        remove(t.data.Threads, i)
                                        return
                                    end
                                end
                            end
                        end
                    end)
                end
            end
        end,
        ---@type thread[]
        Threads = {},
        ---@param t Menu
        DestroyThreads = function(t)
            for _, threadId in pairs(t.data.Threads or {}) do
                local threadStatus = coroutine.status(threadId)

                if (threadStatus ~= nil and threadStatus ~= 'dead') then
                    coroutine.close(threadId)
                end
            end

            t.data.Threads = {}
        end,
        ---@param t Menu
        ---@param event string Name of event
        ---@param func function|Menu Function or Menu to trigger
        ---@return string UUID of event
        On = function(t, event, func)
            local ir = GET_INVOKING_RESOURCE()
            local resource = U:Ensure(ir, current_resource)

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

            func = U:Ensure(func, function() end)

            local uuid = U:UUID()

            insert(t.Events[event], {
                __uuid = uuid,
                __resource = resource,
                func = func
            })

            return uuid
        end,
        ---@param t Menu
        ---@param event string Name of event
        ---@param uuid string UUID of event
        RemoveOnEvent = function(t, event, uuid)
            local ir = GET_INVOKING_RESOURCE()
            local resource = U:Ensure(ir, current_resource)

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

            uuid = U:Ensure(uuid, '00000000-0000-0000-0000-000000000000')

            for i = 1, #t.Events[event], 1 do
                if (t.Events[event][i] ~= nil and
                    t.Events[event][i].__uuid == uuid and
                    t.Events[event][i].__resource == resource) then
                    remove(t.Events[event], i)
                end
            end
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
        Parser = function(t, k, v)
            if (k == 'Position' or k == 'position') then
                local position = lower(U:Ensure(v, 'topleft'))

                if (U:Any(position, {'topleft', 'topcenter', 'topright', 'centerleft', 'center', 'centerright', 'bottomleft', 'bottomcenter', 'bottomright'}, 'value')) then
                    return position
                else
                    return 'topleft'
                end
            end

            return v
        end,
        ---@param t Item
        ---@param k string
        ---@param v string
        NewIndex = U:Ensure(info.NewIndex or info.newIndex, function(t, k, v)
        end),
        ---@type function
        ---@param t Menu MenuV menu
        ---@param info table Information about button
        ---@return Item New item
        AddButton = function(t, info)
            info = U:Ensure(info, {})

            info.Type = 'button'
            info.Events = { OnSelect = {} }
            info.PrimaryEvent = 'OnSelect'
            info.TriggerUpdate = not U:Ensure(info.IgnoreUpdate or info.ignoreUpdate, false)
            info.__menu = t

            if (U:Typeof(info.Value or info.value) == 'Menu') then
                info.Type = 'menu'
            end

            local item = CreateMenuItem(info)

            if (info.Type == 'menu') then
                item:On('select', function() item.Value() end)
            end

            if (info.TriggerUpdate) then
                t.Items:AddItem(item)
            else
                local items = rawget(t.data, 'Items')

                if (items) then
                    local newIndex = #items + 1

                    rawset(items.data, newIndex, item)

                    return items.data[newIndex] or item
                end
            end

            return t.Items[#t.Items] or item
        end,
        ---@type function
        ---@param t Menu MenuV menu
        ---@param info table Information about checkbox
        ---@return Item New item
        AddCheckbox = function(t, info)
            info = U:Ensure(info, {})

            info.Type = 'checkbox'
            info.Value = U:Ensure(info.Value or info.value, false)
            info.Events = { OnChange = {}, OnCheck = {}, OnUncheck = {} }
            info.PrimaryEvent = 'OnCheck'
            info.TriggerUpdate = not U:Ensure(info.IgnoreUpdate or info.ignoreUpdate, false)
            info.__menu = t
            info.NewIndex = function(t, k, v)
                if (k == 'Value') then
                    local value = U:Ensure(v, false)

                    if (value) then
                        t:Trigger('check', t)
                    else
                        t:Trigger('uncheck', t)
                    end
                end
            end

            local item = CreateMenuItem(info)

            if (info.TriggerUpdate) then
                t.Items:AddItem(item)
            else
                local items = rawget(t.data, 'Items')

                if (items) then
                    local newIndex = #items + 1

                    rawset(items.data, newIndex, item)

                    return items.data[newIndex] or item
                end
            end

            return t.Items[#t.Items] or item
        end,
        ---@type function
        ---@param t Menu MenuV menu
        ---@param info table Information about slider
        ---@return SliderItem New slider item
        AddSlider = function(t, info)
            info = U:Ensure(info, {})

            info.Type = 'slider'
            info.Events = { OnChange = {}, OnSelect = {} }
            info.PrimaryEvent = 'OnSelect'
            info.TriggerUpdate = not U:Ensure(info.IgnoreUpdate or info.ignoreUpdate, false)
            info.__menu = t

            ---@class SliderItem : Item
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
            ---@field private Events table<string, function[]> List of registered `on` events
            ---@field public Trigger fun(t: Item, event: string)
            ---@field public On fun(t: Item, event: string, func: function)
            ---@field public Validate fun(t: Item, k: string, v:any)
            ---@field public NewIndex fun(t: Item, k: string, v: any)
            ---@field public GetValue fun(t: Item):any
            ---@field public AddValue fun(t: Item, info: table)
            ---@field public AddValues fun(t: Item)
            local item = CreateMenuItem(info)

            --- Add a value to slider
            ---@param info table Information about slider
            function item:AddValue(info)
                info = U:Ensure(info, {})

                local value = {
                    Label = U:Ensure(info.Label or info.label, 'Value'),
                    Description = U:Ensure(info.Description or info.description, ''),
                    Value = info.Value or info.value
                }

                insert(self.Values, value)
            end

            --- Add values to slider
            ---@vararg table[] List of values
            function item:AddValues(...)
                local arguments = pack(...)

                for _, argument in pairs(arguments) do
                    if (U:Typeof(argument) == 'table') then
                        local hasIndex = argument[1] or nil

                        if (hasIndex and U:Typeof(hasIndex) == 'table') then
                            self:AddValues(unpack(argument))
                        else
                            self:AddValue(argument)
                        end
                    end
                end
            end

            local values = U:Ensure(info.Values or info.values, {})

            if (#values > 0) then
                item:AddValues(values)
            end

            if (info.TriggerUpdate) then
                t.Items:AddItem(item)
            else
                local items = rawget(t.data, 'Items')

                if (items) then
                    local newIndex = #items + 1

                    rawset(items.data, newIndex, item)

                    return items.data[newIndex] or item
                end
            end

            return t.Items[#t.Items] or item
        end,
        ---@type function
        ---@param t Menu MenuV menu
        ---@param info table Information about range
        ---@return RangeItem New Range item
        AddRange = function(t, info)
            info = U:Ensure(info, {})

            info.Type = 'range'
            info.Events = { OnChange = {}, OnSelect = {}, OnMin = {}, OnMax = {} }
            info.PrimaryEvent = 'OnSelect'
            info.TriggerUpdate = not U:Ensure(info.IgnoreUpdate or info.ignoreUpdate, false)
            info.__menu = t
            info.Value = U:Ensure(info.Value or info.value, 0)
            info.Min = U:Ensure(info.Min or info.min, 0)
            info.Max = U:Ensure(info.Max or info.max, 0)
            info.Validate = function(t, k, v)
                if (k == 'Value' or k == 'value') then
                    v = U:Ensure(v, 0)

                    if (t.Min > v) then return false end
                    if (t.Max < v) then return false end
                end

                return true
            end

            if (info.Min > info.Max) then
                local min = info.Min
                local max = info.Max

                info.Min = min
                info.Max = max
            end

            if (info.Value < info.Min) then info.Value = info.Min end
            if (info.Value > info.Max) then info.Value = info.Max end

            ---@class RangeItem : Item
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
            ---@field private Events table<string, function[]> List of registered `on` events
            ---@field public Trigger fun(t: Item, event: string)
            ---@field public On fun(t: Item, event: string, func: function)
            ---@field public Validate fun(t: Item, k: string, v:any)
            ---@field public NewIndex fun(t: Item, k: string, v: any)
            ---@field public GetValue fun(t: Item):any
            ---@field public SetMinValue fun(t: any)
            ---@field public SetMaxValue fun(t: any)
            local item = CreateMenuItem(info)

            --- Update min value of range
            ---@param input number Minimum value of Range
            function item:SetMinValue(input)
                input = U:Ensure(input, 0)

                self.Min = input

                if (self.Value < self.Min) then
                    self.Value = self.Min
                end

                if (self.Min > self.Max) then
                    self.Max = self.Min
                end
            end

            --- Update max value of range
            ---@param input number Minimum value of Range
            function item:SetMaxValue(input)
                input = U:Ensure(input, 0)

                self.Min = input

                if (self.Value > self.Max) then
                    self.Value = self.Max
                end

                if (self.Min < self.Max) then
                    self.Min = self.Max
                end
            end

            if (info.TriggerUpdate) then
                t.Items:AddItem(item)
            else
                local items = rawget(t.data, 'Items')

                if (items) then
                    local newIndex = #items + 1

                    rawset(items.data, newIndex, item)

                    return items.data[newIndex] or item
                end
            end

            return t.Items[#t.Items] or item
        end,
        ---@type function
        ---@param t Menu MenuV menu
        ---@param info table Information about confirm
        ---@return ConfirmItem New Confirm item
        AddConfirm = function(t, info)
            info = U:Ensure(info, {})

            info.Type = 'confirm'
            info.Value = U:Ensure(info.Value or info.value, false)
            info.Events = { OnConfirm = {}, OnDeny = {}, OnChange = {} }
            info.PrimaryEvent = 'OnConfirm'
            info.TriggerUpdate = not U:Ensure(info.IgnoreUpdate or info.ignoreUpdate, false)
            info.__menu = t
            info.NewIndex = function(t, k, v)
                if (k == 'Value') then
                    local value = U:Ensure(v, false)

                    if (value) then
                        t:Trigger('confirm', t)
                    else
                        t:Trigger('deny', t)
                    end
                end
            end

            ---@class ConfirmItem : Item
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
            ---@field private Events table<string, function[]> List of registered `on` events
            ---@field public Trigger fun(t: Item, event: string)
            ---@field public On fun(t: Item, event: string, func: function)
            ---@field public Validate fun(t: Item, k: string, v:any)
            ---@field public NewIndex fun(t: Item, k: string, v: any)
            ---@field public GetValue fun(t: Item):any
            ---@field public Confirm fun(t: Item)
            ---@field public Deny fun(t: Item)
            local item = CreateMenuItem(info)

            --- Confirm this item
            function item:Confirm() item.Value = true end
            --- Deny this item
            function item:Deny() item.Value = false end

            if (info.TriggerUpdate) then
                t.Items:AddItem(item)
            else
                local items = rawget(t.data, 'Items')

                if (items) then
                    local newIndex = #items + 1

                    rawset(items.data, newIndex, item)

                    return items.data[newIndex] or item
                end
            end

            return t.Items[#t.Items] or item
        end,
        --- Create child menu from properties of this object
        ---@param t Menu|string MenuV menu
        ---@param overrides table<string, string|number> Properties to override in menu object (ignore parent)
        ---@param namespace string Namespace of menu
        InheritMenu = function(t, overrides, namespace)
            return MenuV:InheritMenu(t, overrides, namespace)
        end,
        --- Add control key for specific menu
        ---@param t Menu|string MenuV menu
        ---@param action string Name of action
        ---@param func function This will be executed
        ---@param description string Key description
        ---@param defaultType string Default key type
        ---@param defaultKey string Default key
        AddControlKey = function(t, action, func, description, defaultType, defaultKey)
            if (U:Typeof(t.Namespace) ~= 'string' or t.Namespace == 'unknown') then
                error('[MenuV] Namespace is required for assigning keys.')
                return
            end

            MenuV:AddControlKey(t, action, func, description, defaultType, defaultKey)
        end,
        --- Assign key for opening this menu
        ---@param t Menu|string MenuV menu
        ---@param defaultType string Default key type
        ---@param defaultKey string Default key
        OpenWith = function(t, defaultType, defaultKey)
            t:AddControlKey('open', function(m)
                MenuV:CloseAll(function()
                    MenuV:OpenMenu(m)
                end)
            end, MenuV:T('open_menu'):format(t.Namespace), defaultType, defaultKey)
        end,
        --- Change title of menu
        ---@param t Menu
        ---@param title string Title of menu
        SetTitle = function(t, title)
            t.Title = U:Ensure(title, 'MenuV')
        end,
        --- Change subtitle of menu
        ---@param t Menu
        ---@param subtitle string Subtitle of menu
        SetSubtitle = function(t, subtitle)
            t.Subtitle = U:Ensure(subtitle, '')
        end,
        --- Change subtitle of menu
        ---@param t Menu
        ---@param position string | "'topleft'" | "'topcenter'" | "'topright'" | "'centerleft'" | "'center'" | "'centerright'" | "'bottomleft'" | "'bottomcenter'" | "'bottomright'"
        SetPosition = function(t, position)
            t.Position = U:Ensure(position, 'topleft')
        end,
        --- Clear all Menu items
        ---@param t Menu
        ClearItems = function(t, update)
            update = U:Ensure(update, true)

            local items = CreateEmptyItemsTable({})

            items(function(_, trigger, key, index, value, oldValue)
                t:Trigger(trigger, key, index, value, oldValue)
            end)

            rawset(t.data, 'Items', items)

            if (update and t.Trigger ~= nil and type(t.Trigger) == 'function') then
                t:Trigger('update', 'Items', items)
            end
        end,
        Open = function(t)
            MenuV:OpenMenu(t)
        end,
        Close = function(t)
            MenuV:CloseMenu(t)
        end,
        --- @see Menu to @see table
        ---@param t Menu
        ---@return table
        ToTable = function(t)
            local tempTable = {
                theme = U:Ensure(t.Theme, 'default'),
                uuid = U:Ensure(t.UUID, '00000000-0000-0000-0000-000000000000'),
                title = U:Ensure(t.Title, 'MenuV'),
                subtitle = U:Ensure(t.Subtitle, ''),
                position = U:Ensure(t.Position, 'topleft'),
                size = U:Ensure(t.Size, 'size-110'),
                dictionary = U:Ensure(t.Dictionary, 'menuv'),
                texture = U:Ensure(t.Texture, 'default'),
                color = {
                    r = U:Ensure(t.Color.R, 0),
                    g = U:Ensure(t.Color.G, 0),
                    b = U:Ensure(t.Color.B, 255)
                },
                items = {}
            }

            local items = rawget(t.data, 'Items')

            if (items ~= nil and items.ToTable ~= nil) then
                tempTable.items = items:ToTable()
            end

            if (tempTable.color.r <= 0) then tempTable.color.r = 0 end
            if (tempTable.color.r >= 255) then tempTable.color.r = 255 end
            if (tempTable.color.g <= 0) then tempTable.color.g = 0 end
            if (tempTable.color.g >= 255) then tempTable.color.g = 255 end
            if (tempTable.color.b <= 0) then tempTable.color.b = 0 end
            if (tempTable.color.b >= 255) then tempTable.color.b = 255 end

            return tempTable
        end
    }

    if (lower(item.Texture) == 'default' and lower(item.Dictionary) == 'menuv' and theme == 'native') then
        item.Texture = 'default_native'
    end

    item.Events.OnOpen = {}
    item.Events.OnClose = {}
    item.Events.OnSelect = {}
    item.Events.OnUpdate = {}
    item.Events.OnSwitch = {}
    item.Events.OnChange = {}
    item.Events.OnIChange = {}

    if (not U:Any(item.Size, { 'size-100', 'size-110', 'size-125', 'size-150', 'size-175', 'size-200' }, 'value')) then
        item.Size = 'size-110'
    end

    local mt = {
        __index = function(t, k)
            return rawget(t.data, k)
        end,
        ---@param t Menu
        __tostring = function(t)
            return encode(t:ToTable())
        end,
        __call = function(t)
            MenuV:OpenMenu(t)
        end,
        __newindex = function(t, k, v)
            local whitelisted = { 'Title', 'Subtitle', 'Position', 'Color', 'R', 'G', 'B', 'Size', 'Dictionary', 'Texture', 'Theme' }
            local key = U:Ensure(k, 'unknown')
            local oldValue = rawget(t.data, k)

            if (not U:Any(key, whitelisted, 'value') and oldValue ~= nil) then
                return
            end

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

            if (key == 'Theme' or key == 'theme') then
                local theme_value = string.lower(U:Ensure(v, 'default'))

                if (theme_value == 'native') then
                    rawset(t.data, 'color', { R = 255, G = 255, B = 255 })

                    local texture = U:Ensure(rawget(t.data, 'Texture'), 'default')

                    if (texture == 'default') then
                        rawset(t.data, 'Texture', 'default_native')
                    end
                elseif (theme_value == 'default') then
                    local texture = U:Ensure(rawget(t.data, 'Texture'), 'default')

                    if (texture == 'default_native') then
                        rawset(t.data, 'Texture', 'default')
                    end
                end
            end

            if (updateIndexTrigger) then
                t:NewIndex(key, v)
            end

            if (t.Trigger ~= nil and type(t.Trigger) == 'function') then
                t:Trigger('update', key, v, oldValue)
            end
        end,
        __len = function(t)
            return #t.Items
        end,
        __pairs = function(t)
            return pairs(rawget(t.data, 'Items') or {})
        end,
        __ipairs = function(t)
            return ipairs(rawget(t.data, 'Items') or {})
        end,
        __metatable = 'MenuV',
    }

    ---@class Menu
    ---@field public IsOpen boolean `true` if menu is open, otherwise `false`
    ---@field public UUID string UUID of Menu
    ---@field public Title string Title of Menu
    ---@field public Subtitle string Subtitle of Menu
    ---@field public Position string | "'topleft'" | "'topcenter'" | "'topright'" | "'centerleft'" | "'center'" | "'centerright'" | "'bottomleft'" | "'bottomcenter'" | "'bottomright'"
    ---@field public Texture string Name of texture example: "default"
    ---@field public Dictionary string Name of dictionary example: "menuv"
    ---@field public Color table<string, number> Color of Menu
    ---@field private Events table<string, fun[]> List of registered `on` events
    ---@field public Items Item[] List of items
    ---@field public Trigger fun(t: Item, event: string)
    ---@field public On fun(t: Menu, event: string, func: function|Menu): string
    ---@field public RemoveOnEvent fun(t: Menu, event: string, uuid: string)
    ---@field public Validate fun(t: Menu, k: string, v:any)
    ---@field public NewIndex fun(t: Menu, k: string, v: any)
    ---@field public Parser fun(t: Menu, k: string, v: any)
    ---@field public AddButton fun(t: Menu, info: table):Item
    ---@field public AddCheckbox fun(t: Menu, info: table):Item
    ---@field public AddSlider fun(t: Menu, info: table):SliderItem
    ---@field public AddRange fun(t: Menu, info: table):RangeItem
    ---@field public AddConfirm fun(t: Menu, info: table):ConfirmItem
    ---@field public AddControlKey fun(t: Menu, action: string, func: function, description: string, defaultType: string, defaultKey: string)
    ---@field public OpenWith fun(t: Menu, defaultType: string, defaultKey: string)
    ---@field public SetTitle fun(t: Menu, title: string)
    ---@field public SetSubtitle fun(t: Menu, subtitle: string)
    ---@field public SetPosition fun(t: Menu, position: string)
    ---@field public ClearItems fun(t: Menu)
    ---@field public Open fun(t: Menu)
    ---@field public Close fun(t: Menu)
    ---@field public ToTable fun(t: Menu):table
    local menu = setmetatable({ data = item, __class = 'Menu', __type = 'Menu' }, mt)

    menu.Items(function(items, trigger, key, index, value, oldValue)
        menu:Trigger(trigger, key, index, value, oldValue)
    end)

    for k, v in pairs(info or {}) do
        local key = U:Ensure(k, 'unknown')

        if (key == 'unknown') then return end

        menu:On(key, v)
    end

    LoadTextureDictionary(menu.Dictionary)

    return menu
end

_ENV.CreateMenu = CreateMenu
_G.CreateMenu = CreateMenu
