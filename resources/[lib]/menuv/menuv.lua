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

----------------------- [ MenuV ] -----------------------
-- GitHub: https://github.com/ThymonA/menuv/
-- License: GNU General Public License v3.0
--          https://choosealicense.com/licenses/gpl-3.0/
-- Author: Thymon Arens <contact@arens.io>
-- Name: MenuV
-- Version: 1.0.0
-- Description: FiveM menu library for creating menu's
----------------------- [ MenuV ] -----------------------
MVconfig = {
    Language = 'fr',
    HideInterval = 250,
    Sounds = {
        UP = {
            type = 'native',
            name = 'NAV_UP_DOWN',
            library = 'HUD_FREEMODE_SOUNDSET'
        },
        DOWN = {
            type = 'native',
            name = 'NAV_UP_DOWN',
            library = 'HUD_FREEMODE_SOUNDSET'
        },
        LEFT = {
            type = 'native',
            name = 'NAV_LEFT_RIGHT',
            library = 'HUD_FRONTEND_DEFAULT_SOUNDSET'
        },
        RIGHT = {
            type = 'native',
            name = 'NAV_LEFT_RIGHT',
            library = 'HUD_FRONTEND_DEFAULT_SOUNDSET'
        },
        ENTER = {
            type = 'native',
            name = 'SELECT',
            library = 'HUD_FRONTEND_DEFAULT_SOUNDSET'
        },
        CLOSE = {
            type = 'native',
            name = 'BACK',
            library = 'HUD_FRONTEND_DEFAULT_SOUNDSET'
        }
    }
}

_G.MVconfig = MVconfig
_ENV.MVconfig = MVconfig
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
local type = assert(type)
local tonumber = assert(tonumber)
local tostring = assert(tostring)
local lower = assert(string.lower)
local upper = assert(string.upper)
local sub = assert(string.sub)
local encode = assert(json.encode)
local decode = assert(json.decode)
local floor = assert(math.floor)
local random = assert(math.random)
local randomseed = assert(math.randomseed)
local rawget = assert(rawget)
local setmetatable = assert(setmetatable)

--- FiveM globals
local GET_GAME_TIMER = assert(GetGameTimer)
local GET_CURRENT_RESOURCE_NAME = assert(GetCurrentResourceName)

-- Init randomseed
randomseed(GET_GAME_TIMER())

--- Utilities for MenuV
---@class Utilities
local Utilities = setmetatable({ __class = 'Utilities' }, {})

--- Returns `true` if `input` starts with `start`, otherwise `false`
---@param input string Checks if this string starts with `start`
---@param start string Checks if `input` starts with this
---@return boolean `true` if `input` starts with `start`, otherwise `false`
function Utilities:StartsWith(input, start)
    if (self:Typeof(input) ~= 'string') then return false end
    if (self:Typeof(start) == 'number') then start = tostring(start) end
    if (self:Typeof(start) ~= 'string') then return false end

    return sub(input, 1, #start) == start
end

--- Returns `true` if `input` ends with `ends`, otherwise `false`
---@param input string Checks if this string ends with `ends`
---@param ends string Checks if `input` ends with this
---@return boolean `true` if `input` ends with `ends`, otherwise `false`
function Utilities:EndsWith(input, ends)
    if (self:Typeof(input) ~= 'string') then return false end
    if (self:Typeof(ends) == 'number') then ends = tostring(ends) end
    if (self:Typeof(ends) ~= 'string') then return false end

    return sub(input, -#ends) == ends
end

--- Returns the type of given `input`
---@param input any Any input
---@return string Type of given input
function Utilities:Typeof(input)
    if (input == nil) then return 'nil' end

    local rawType = type(input) or 'nil'

    if (rawType ~= 'table') then return rawType end

    local isFXFunction = rawget(input, '__cfx_functionReference') ~= nil or
        rawget(input, '__cfx_async_retval') ~= nil

    if (isFXFunction) then return 'function' end
    if (rawget(input, '__cfx_functionSource') ~= nil) then return 'number' end

    local rawClass = rawget(input, '__class')

    if (rawClass ~= nil) then return type(rawClass) == 'string' and rawClass or 'class' end

    local rawTableType = rawget(input, '__type')

    if (rawTableType ~= nil) then return type(rawTableType) == 'string' and rawTableType or 'table' end

    return rawType
end

local INPUT_GROUPS = {
    [0] = "KEYBOARD",
    [2] = "CONTROLLER"
}

local INPUT_TYPE_GROUPS = {
    ["KEYBOARD"] = 0,
    ["MOUSE_ABSOLUTEAXIS"] = 0,
    ["MOUSE_CENTEREDAXIS"] = 0,
    ["MOUSE_RELATIVEAXIS"] = 0,
    ["MOUSE_SCALEDAXIS"] = 0,
    ["MOUSE_NORMALIZED"] = 0,
    ["MOUSE_WHEEL"] = 0,
    ["MOUSE_BUTTON"] = 0,
    ["MOUSE_BUTTONANY"] = 0,
    ["MKB_AXIS"] = 0,
    ["PAD_AXIS"] = 2,
    ["PAD_DIGITALBUTTON"] = 2,
    ["PAD_DIGITALBUTTONANY"] = 2,
    ["PAD_ANALOGBUTTON"] = 2,
    ["JOYSTICK_POV"] = 2,
    ["JOYSTICK_POV_AXIS"] = 2,
    ["JOYSTICK_BUTTON"] = 2,
    ["JOYSTICK_AXIS"] = 2,
    ["JOYSTICK_IAXIS"] = 2,
    ["JOYSTICK_AXIS_NEGATIVE"] = 2,
    ["JOYSTICK_AXIS_POSITIVE"] = 2,
    ["PAD_DEBUGBUTTON"] = 2,
    ["GAME_CONTROLLED"] = 2,
    ["DIGITALBUTTON_AXIS"] = 2,
}

function Utilities:GetInputTypeGroup(inputType)
    return INPUT_TYPE_GROUPS[inputType] or 0
end

function Utilities:GetInputGroupName(inputTypeGroup)
    return INPUT_GROUPS[inputTypeGroup] or "KEYBOARD"
end

--- Transform any `input` to the same type as `defaultValue`
---@type function
---@param input any Transform this `input` to `defaultValue`'s type
---@param defaultValue any Returns this if `input` can't transformed to this type
---@param ignoreDefault boolean Don't return default value if this is true
---@return any Returns `input` matches the `defaultValue` type or `defaultValue`
function Utilities:Ensure(input, defaultValue, ignoreDefault)
    ignoreDefault = type(ignoreDefault) == 'boolean' and ignoreDefault or false

    if (defaultValue == nil) then return nil end

    local requiredType = self:Typeof(defaultValue)

    if (requiredType == 'nil') then return nil end

    local inputType = self:Typeof(input)

    if (inputType == requiredType) then return input end
    if (inputType == 'nil') then return defaultValue end

    if (requiredType == 'number') then
        if (inputType == 'boolean') then return input and 1 or 0 end

        return tonumber(input) or (not ignoreDefault and defaultValue or nil)
    end

    if (requiredType == 'string') then
        if (inputType == 'boolean') then return input and 'yes' or 'no' end
        if (inputType == 'vector3') then return encode({ x = input.x, y = input.y, z = input.z }) or (not ignoreDefault and defaultValue or nil) end
        if (inputType == 'vector2') then return encode({ x = input.x, y = input.y }) or (not ignoreDefault and defaultValue or nil) end
        if (inputType == 'table') then return encode(input) or (not ignoreDefault and defaultValue or nil) end

        local result = tostring(input)

        if (result == 'nil') then
            return not ignoreDefault and defaultValue or 'nil'
        end

        return result
    end

    if (requiredType == 'boolean') then
        if (inputType == 'string') then
            input = lower(input)

            if (input == 'true' or input == '1' or input == 'yes' or input == 'y') then return true end
            if (input == 'false' or input == '0' or input == 'no' or input == 'n') then return false end

            return (not ignoreDefault and defaultValue or nil)
        end

        if (inputType == 'number') then
            if (input == 1) then return true end
            if (input == 0) then return false end

            return (not ignoreDefault and defaultValue or nil)
        end

        return (not ignoreDefault and defaultValue or nil)
    end

    if (requiredType == 'table') then
        if (inputType == 'string') then
            if (self:StartsWith(input, '{') and self:EndsWith(input, '}')) then
                return decode(input) or (not ignoreDefault and defaultValue or nil)
            end

            if (self:StartsWith(input, '[') and self:EndsWith(input, ']')) then
                return decode(input) or (not ignoreDefault and defaultValue or nil)
            end

            return (not ignoreDefault and defaultValue or nil)
        end

        if (inputType == 'vector3') then return { x = input.x or 0, y = input.y or 0, z = input.z or 0 } end
        if (inputType == 'vector2') then return { x = input.x or 0, y = input.y or 0 } end

        return (not ignoreDefault and defaultValue or nil)
    end

    if (requiredType == 'vector3') then
        if (inputType == 'table') then
            local _x = self:Ensure(input.x, defaultValue.x)
            local _y = self:Ensure(input.y, defaultValue.y)
            local _z = self:Ensure(input.z, defaultValue.z)

            return vector3(_x, _y, _z)
        end

        if (inputType == 'vector2') then
            local _x = self:Ensure(input.x, defaultValue.x)
            local _y = self:Ensure(input.y, defaultValue.y)

            return vector3(_x, _y, 0)
        end

        if (inputType == 'number') then
            return vector3(input, input, input)
        end

        return (not ignoreDefault and defaultValue or nil)
    end

    if (requiredType == 'vector2') then
        if (inputType == 'table') then
            local _x = self:Ensure(input.x, defaultValue.x)
            local _y = self:Ensure(input.y, defaultValue.y)

            return vector2(_x, _y)
        end

        if (inputType == 'vector3') then
            local _x = self:Ensure(input.x, defaultValue.x)
            local _y = self:Ensure(input.y, defaultValue.y)

            return vector2(_x, _y)
        end

        if (inputType == 'number') then
            return vector2(input, input)
        end

        return (not ignoreDefault and defaultValue or nil)
    end

    return (not ignoreDefault and defaultValue or nil)
end

--- Checks if input exists in inputs
--- '0' and 0 are both the same '0' == 0 equals `true`
--- 'yes' and true are both the same 'yes' == true equals `true`
---@param input any Any input
---@param inputs any[] Any table
---@param checkType string | "'value'" | "'key'" | "'both'"
---@return boolean Returns `true` if input has been found as `key` and/or `value`
function Utilities:Any(input, inputs, checkType)
    if (input == nil) then return false end
    if (inputs == nil) then return false end

    inputs = self:Ensure(inputs, {})
    checkType = lower(self:Ensure(checkType, 'value'))

    local checkMethod = 1

    if (checkType == 'value' or checkType == 'v') then
        checkMethod = 1
    elseif (checkType == 'key' or checkType == 'k') then
        checkMethod = -1
    elseif (checkType == 'both' or checkType == 'b') then
        checkMethod = 0
    end

    for k, v in pairs(inputs) do
        if (checkMethod == 0 or checkMethod == -1) then
            local checkK = self:Ensure(input, k, true)

            if (checkK ~= nil and checkK == k) then return true end
        end

        if (checkMethod == 0 or checkMethod == 1) then
            local checkV = self:Ensure(input, v, true)

            if (checkV ~= nil and checkV == v) then return true end
        end
    end

    return false
end

--- Round any `value`
---@param value number Round this value
---@param decimal number Number of decimals
---@return number Rounded number
function Utilities:Round(value, decimal)
    value = self:Ensure(value, 0)
    decimal = self:Ensure(decimal, 0)

    if (decimal > 0) then
        return floor((value * 10 ^ decimal) + 0.5) / (10 ^ decimal)
    end

    return floor(value + 0.5)
end

--- Checks if `item1` equals `item2`
---@param item1 any Item1
---@param item2 any Item2
---@return boolean `true` if both are equal, otherwise `false`
function Utilities:Equal(item1, item2)
    if (item1 == nil and item2 == nil) then return true end
    if (item1 == nil or item2 == nil) then return false end

    if (type(item1) == 'table') then
        local item1EQ = rawget(item1, '__eq')

        if (item1EQ ~= nil and self:Typeof(item1EQ) == 'function') then
            return item1EQ(item1, item2)
        end

        return item1 == item2
    end

    if (type(item2) == 'table') then
        local item2EQ = rawget(item2, '__eq')

        if (item2EQ ~= nil and self:Typeof(item2EQ) == 'function') then
            return item2EQ(item2, item1)
        end

        return item2 == item1
    end

    return item1 == item2
end

local function tohex(x)
    x = Utilities:Ensure(x, 32)

    local s, base, d = '', 16

    while x > 0 do
        d = x % base + 1
        x = floor(x / base)
        s = sub('0123456789abcdef', d, d) .. s
    end

    while #s < 2 do s = ('0%s'):format(s) end

    return s
end

local function bitwise(x, y, matrix)
    x = Utilities:Ensure(x, 32)
    y = Utilities:Ensure(y, 16)
    matrix = Utilities:Ensure(matrix, {{0,0}, {0, 1}})

    local z, pow = 0, 1

    while x > 0 or y > 0 do
        z = z + (matrix[x %2 + 1][y %2 + 1] * pow)
        pow = pow * 2
        x = floor(x / 2)
        y = floor(y / 2)
    end

    return z
end

--- Generates a random UUID like: 00000000-0000-0000-0000-000000000000
---@return string Random generated UUID
function Utilities:UUID()
    ---@type number[]
    local bytes = {
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255),
        random(0, 255)
    }

    bytes[7] = bitwise(bytes[7], 0x0f, {{0,0},{0,1}})
    bytes[7] = bitwise(bytes[7], 0x40, {{0,1},{1,1}})
    bytes[9] = bitwise(bytes[7], 0x3f, {{0,0},{0,1}})
    bytes[9] = bitwise(bytes[7], 0x80, {{0,1},{1,1}})

    return upper(('%s%s%s%s-%s%s-%s%s-%s%s-%s%s%s%s%s%s'):format(
        tohex(bytes[1]), tohex(bytes[2]), tohex(bytes[3]), tohex(bytes[4]),
        tohex(bytes[5]), tohex(bytes[6]),
        tohex(bytes[7]), tohex(bytes[8]),
        tohex(bytes[9]), tohex(bytes[10]),
        tohex(bytes[11]), tohex(bytes[12]), tohex(bytes[13]), tohex(bytes[14]), tohex(bytes[15]), tohex(bytes[16])
    ))
end

--- Replace a string that contains `this` to `that`
---@param str string String where to replace in
---@param this string Word that's need to be replaced
---@param that string Replace `this` whit given string
---@return string String where `this` has been replaced with `that`
function Utilities:Replace(str, this, that)
    local b, e = str:find(this, 1, true)

    if b == nil then
        return str
    else
        return str:sub(1, b - 1) .. that .. self:Replace(str:sub(e + 1), this, that)
    end
end

_G.Utilities = Utilities
_ENV.Utilities = Utilities

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
        ---@type any
        RightLabel = info.RightLabel or info.rightLabel,
        ---@type table[]
        Values = {},
        ---@type string
        MinLabel = U:Ensure(info.MinLabel or info.minLabel, ''),
        ---@type string
        MaxLabel = U:Ensure(info.MaxLabel or info.maxLabel, ''),
        ---@type number
        Min = U:Ensure(info.Min or info.min, 0),
        ---@type number
        Max = U:Ensure(info.Max or info.max, 0),
        ---@type number
        Interval = U:Ensure(info.Interval or info.interval, 1),
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

            if itemType == 'slider' or itemType == 'color_slider' then
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
        end,
        ---@param t Item
        ---@param value any
        SetValue = function(t, value)
            t.Value = value
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
                rightLabel = U:Ensure(option.RightLabel, ''),
                description = U:Ensure(option.Description, ''),
                value = 'none',
                values = {},
                minLabel = U:Ensure(option.MinLabel, ''),
                maxLabel = U:Ensure(option.MaxLabel, ''),
                min = U:Ensure(option.Min, 0),
                max = U:Ensure(option.Max, 0),
                interval = U:Ensure(option.Interval, 1),
                disabled = U:Ensure(option.Disabled, false),
                portraitMale = U:Ensure(option.PortraitMale, 'male_0'),
                portraitFemale = U:Ensure(option.PortraitFemale, 'female_0'),
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
            elseif (option.__type == 'slider' or option.__type == 'color_slider') then
                tempTable[index].value = 0
            end

            local _values = U:Ensure(option.Values, {})
            local vIndex = 0

            for valueIndex, value in pairs(_values) do
                vIndex = vIndex + 1

                tempTable[index].values[vIndex] = {
                    label = U:Ensure(value.Label, 'Option'),
                    description = U:Ensure(value.Description, ''),
                    value = vIndex,
                    r = U:Ensure(value.R, 0),
                    g = U:Ensure(value.G, 0),
                    b = U:Ensure(value.B, 0),
                }

                if (option.__type == 'slider' or option.__type == 'color_slider') then
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
                    minLabel = U:Ensure(option.MinLabel, ''),
                    maxLabel = U:Ensure(option.MaxLabel, ''),
                    min = U:Ensure(option.Min, 0),
                    max = U:Ensure(option.Max, 0),
                    interval = U:Ensure(option.Interval, 1),
                    disabled = U:Ensure(option.Disabled, false),
                    portraitMale = U:Ensure(option.PortraitMale, 'male_0'),
                    portraitFemale = U:Ensure(option.PortraitFemale, 'female_0'),
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
                elseif (option.__type == 'slider' or option.__type == 'color_slider') then
                    tempTable.value = 0
                end

                local _values = U:Ensure(option.Values, {})
                local vIndex = 0

                for valueIndex, value in pairs(_values) do
                    vIndex = vIndex + 1

                    tempTable.values[vIndex] = {
                        label = U:Ensure(value.Label, 'Option'),
                        description = U:Ensure(value.Description, ''),
                        value = vIndex,
                        r = U:Ensure(value.R, 0),
                        g = U:Ensure(value.G, 0),
                        b = U:Ensure(value.B, 0),
                    }

                    if (option.__type == 'slider' or option.__type == 'color_slider') then
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
        Color = { R = 255, G = 255, B = 255 },
        ---@type string | "'size-100'" | "'size-110'" | "'size-125'" | "'size-150'" | "'size-175'" | "'size-200'"
        Size = U:Ensure(info.Size or info.size, 'size-110'),
        ---@type string
        Dictionary = U:Ensure(info.Dictionary or info.dictionary, 'soz'),
        ---@type string
        Texture = U:Ensure(info.Texture or info.texture, 'default'),
        ---@type table
        Events = U:Ensure(info.Events or info.events, {}),
        ---@type string
        Theme = 'native',
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
        AddTitle = function(t, info)
            info = U:Ensure(info, {})

            info.Type = 'title'
            info.disabled = true
            info.Events = { OnSelect = {} }
            info.PrimaryEvent = 'OnSelect'
            info.TriggerUpdate = not U:Ensure(info.IgnoreUpdate or info.ignoreUpdate, false)
            info.__menu = t

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
        ---@param info table Information about heritage
        ---@return Item New item
        AddHeritage = function(t, info)
            info = U:Ensure(info, {})

            info.Type = 'heritage'
            info.disabled = true
            info.Events = { OnSelect = {} }
            info.PortraitMale = U:Ensure(info.PortraitMale or info.portraitMale, "male_0")
            info.PortraitFemale = U:Ensure(info.PortraitFemale or info.portraitFemale, "female_0")
            info.PrimaryEvent = 'OnSelect'
            info.TriggerUpdate = not U:Ensure(info.IgnoreUpdate or info.ignoreUpdate, false)
            info.__menu = t

            LoadTextureDictionary('pause_menu_pages_char_mom_dad')
            LoadTextureDictionary('char_creator_portraits')

            local item = CreateMenuItem(info)

            --- Set portrait male
            ---@param portraitMale string Male portrait texture name
            function item:SetPortraitMale(portraitMale)
                portraitMale = U:Ensure(portraitMale, "male_0")
                self.PortraitMale = portraitMale
            end

            --- Set portrait female
            ---@param portraitFemale string Female portrait texture name
            function item:SetPortraitFemale(portraitFemale)
                portraitFemale = U:Ensure(portraitFemale, "female_0")
                self.PortraitFemale = portraitFemale
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
            ---@field public SetValue fun(t: Item, value: any)
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

            --- Add Clear values of slider
            function item:ClearValues()
                self.Values = {}
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
        ---@param info table Information about slider
        ---@return SliderItem New slider item
        AddColorSlider = function(t, info)
            info = U:Ensure(info, {})

            info.Type = 'color_slider'
            info.Events = { OnChange = {}, OnSelect = {} }
            info.PrimaryEvent = 'OnSelect'
            info.TriggerUpdate = not U:Ensure(info.IgnoreUpdate or info.ignoreUpdate, false)
            info.__menu = t

            ---@class ColorSliderItem : Item
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
                    Value = info.Value or info.value,
                    R = U:Ensure(info.R or info.r, 0),
                    G = U:Ensure(info.G or info.g, 0),
                    B = U:Ensure(info.B or info.b, 0),
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
            info.MinLabel = U:Ensure(info.MinLabel or info.minLabel, '')
            info.MaxLabel = U:Ensure(info.MaxLabel or info.maxLabel, '')
            info.Min = U:Ensure(info.Min or info.min, 0)
            info.Max = U:Ensure(info.Max or info.max, 0)
            info.Interval = U:Ensure(info.Interval or info.interval, 1)
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
            ---@field public SetValue fun(t: Item, value: any)
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
            ---@field public SetValue fun(t: Item, value: any)
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
                color = { r = 255, g = 255, b = 255 },
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
    ---@field public AddHeritage fun(t: Menu, info: table):Item
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
local decode = assert(json.decode)

--- FiveM globals
local LoadResourceFile = assert(LoadResourceFile)

--- MenuV globals
---@type Utilities
local Utilities = assert(Utilities)

--- Empty translations table
local translations = {}

--- Load all translations
local lang = Utilities:Ensure((MVconfig or {}).Language, 'en')
local translations_path = ('languages/%s.json'):format(lang)
local translations_raw = LoadResourceFile('menuv', translations_path)

if (translations_raw) then
    local transFile = decode(translations_raw)

    if (transFile) then translations = Utilities:Ensure(transFile.translations, {}) end
end

_ENV.translations = translations
_G.translations = translations

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
