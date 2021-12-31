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
    randomseed(GET_GAME_TIMER() + random(30720, 92160))

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