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
local load = assert(load)
local xpcall = assert(xpcall)
local lower = assert(string.lower)
local upper = assert(string.upper)
local rawget = assert(rawget)
local rawset = assert(rawset)
local traceback = assert(debug.traceback)
local setmetatable = assert(setmetatable)

--- FiveM globals
local GetInvokingResource = assert(GetInvokingResource)
local LoadResourceFile = assert(LoadResourceFile)
local RegisterKeyMapping = assert(RegisterKeyMapping)
local RegisterCommand = assert(RegisterCommand)
local SendNUIMessage = assert(SendNUIMessage)
local RegisterNUICallback = assert(RegisterNUICallback)
local IsScreenFadedOut = assert(IsScreenFadedOut)
local IsPauseMenuActive = assert(IsPauseMenuActive)
local PlaySoundFrontend = assert(PlaySoundFrontend)
local CreateThread = assert(Citizen.CreateThread)
local Wait = assert(Citizen.Wait)
local exports = assert(exports)

--- MenuV globals
---@type Utilities
local Utilities = assert(Utilities)

--- Load a file from `menuv`
---@param path string Path in `menuv`
---@return any|nil Results of nil
local function load_file(path)
    if (path == nil or type(path) ~= 'string') then return nil end

    local raw_file = LoadResourceFile('menuv', path)

    if (raw_file) then
        local raw_func, _ = load(raw_file, ('menuv/%s'):format(path), 't', _ENV)

        if (raw_func) then
            local ok, result = xpcall(raw_func, traceback)

            if (ok) then
                return result
            end
        end
    end

    return nil
end

load_file('menuv/components/translations.lua')

local MenuV = setmetatable({
    ---@type string
    __class = 'MenuV',
    ---@type string
    __type = 'MenuV',
    ---@type boolean
    Loaded = false,
    ---@type number
    ThreadWait = Utilities:Ensure((Config or {}).HideInterval, 250),
    ---@type table<string, string>
    Translations = translations or {},
    ---@type table<string, table>
    Sounds = Utilities:Ensure((Config or {}).Sounds, {}),
    ---@type boolean
    Hidden = false
}, {})

MenuV.Keys = setmetatable({ data = {}, __class = 'MenuVKeys', __type = 'keys' }, {
    __index = function(t, k)
        return rawget(t.data, k)
    end,
    __newindex = function(t, k, v)
        k = Utilities:Ensure(k, 'unknown')

        if (k == 'unknown') then return end

        local rawKey = rawget(t.data, k)
        local keyExists = rawKey ~= nil
        local prevState = Utilities:Ensure((rawKey or {}).status, false)
        local newState = Utilities:Ensure(v, false)

        if (keyExists and not MenuV.Hidden) then
            rawset(t.data[k], 'status', newState)

            if (prevState ~= newState) then
                local action = newState and not prevState and 'KEY_PRESSED' or 'KEY_RELEASED'
                local key = Utilities:Ensure(rawKey.action, 'UNKNOWN')

                SendNUIMessage({ action = action, key = key })
            end
        end
    end,
    __call = function(t, k, a, inputType)
        k = Utilities:Ensure(k, 'unknown')
        a = Utilities:Ensure(a, 'UNKNOWN')
        inputType = Utilities:Ensure(inputType, 0)

        if (k == 'unknown') then return end

        local rawKey = rawget(t.data, k)
        local keyExists = rawKey ~= nil

        if (keyExists) then
            if not rawKey.inputTypes[inputType] then
                rawKey.inputTypes[inputType] = true
            end

            return
        end

        rawset(t.data, k, { status = false, action = a, inputTypes = { [inputType] = true } })
    end
})

--- Register a `action` with custom keybind
---@param action string Action like: UP, DOWN, LEFT...
---@param description string Description of keybind
---@param defaultType string Type like: keyboard, mouse etc.
---@param defaultKey string Default key for this keybind
function MenuV:RegisterKey(action, description, defaultType, defaultKey)
    action = Utilities:Ensure(action, 'UNKNOWN')
    description = Utilities:Ensure(description, 'unknown')
    defaultType = Utilities:Ensure(defaultType, 'KEYBOARD')
    defaultType = upper(defaultType)
    defaultKey = Utilities:Ensure(defaultKey, 'F12')

    action = Utilities:Replace(action, ' ', '_')
    action = upper(action)

    local typeGroup = Utilities:GetInputTypeGroup(defaultType)

    if (self.Keys[action] and self.Keys[action].inputTypes[typeGroup]) then return end

    self.Keys(action, action, typeGroup)

    local k = lower(action)

    if typeGroup > 0 then
        local inputGroupName = Utilities:GetInputGroupName(typeGroup)
        k = ('%s_%s'):format(lower(inputGroupName), k)
    end

    k = ('menuv_%s'):format(k)

    RegisterKeyMapping(('+%s'):format(k), description, defaultType, defaultKey)
    RegisterCommand(('+%s'):format(k), function() MenuV.Keys[action] = true end)
    RegisterCommand(('-%s'):format(k), function() MenuV.Keys[action] = false end)
end

--- Load translation
---@param k string Translation key
---@return string Translation or 'MISSING TRANSLATION'
local function T(k)
    k = Utilities:Ensure(k, 'unknown')

    return Utilities:Ensure(MenuV.Translations[k], 'MISSING TRANSLATION')
end

RegisterNUICallback('loaded', function(_, cb)
    MenuV.Loaded = true
    cb('ok')
end)

RegisterNUICallback('sound', function(info, cb)
    local key = upper(Utilities:Ensure(info.key, 'UNKNOWN'))

    if (MenuV.Sounds == nil and MenuV.Sounds[key] == nil) then cb('ok') return end

    local sound = Utilities:Ensure(MenuV.Sounds[key], {})
    local soundType = lower(Utilities:Ensure(sound.type, 'unknown'))

    if (soundType == 'native') then
        local name = Utilities:Ensure(sound.name, 'UNKNOWN')
        local library = Utilities:Ensure(sound.library, 'UNKNOWN')

        PlaySoundFrontend(-1, name, library, true)
    end

    cb('ok')
end)

--- Trigger the NUICallback for the right resource
---@param name string Name of callback
---@param info table Info returns from callback
---@param cb function Trigger this when callback is done
local function TriggerResourceCallback(name, info, cb)
    local r = Utilities:Ensure(info.r, 'menuv')

    if (r == 'menuv') then cb('ok') return end

    local resource = exports[r] or nil

    if (resource == nil) then cb('ok') return end

    local nuiCallback = resource['NUICallback'] or nil

    if (nuiCallback == nil) then cb('ok') return end

    exports[r]:NUICallback(name, info, cb)
end

RegisterNUICallback('submit', function(info, cb) TriggerResourceCallback('submit', info, cb) end)
RegisterNUICallback('close', function(info, cb) TriggerResourceCallback('close', info, cb) end)
RegisterNUICallback('switch', function(info, cb) TriggerResourceCallback('switch', info, cb) end)
RegisterNUICallback('update', function(info, cb) TriggerResourceCallback('update', info, cb) end)
RegisterNUICallback('open', function(info, cb) TriggerResourceCallback('open', info, cb) end)
RegisterNUICallback('opened', function(info, cb) TriggerResourceCallback('opened', info, cb) end)
RegisterNUICallback('close_all', function(info, cb) TriggerResourceCallback('close_all', info, cb) end)

--- MenuV exports
exports('IsLoaded', function(cb)
    cb = Utilities:Ensure(cb, function() end)

    if (MenuV.Loaded) then
        cb()
        return
    end

    CreateThread(function()
        local callback = cb

        repeat Wait(0) until MenuV.Loaded

        callback()
    end)
end)

exports('SendNUIMessage', function(input)
    local r = Utilities:Ensure(GetInvokingResource(), 'menuv')

    if (Utilities:Typeof(input) == 'table') then
        if (input.menu) then
            rawset(input.menu, 'resource', r)
            rawset(input.menu, 'defaultSounds', MenuV.Sounds)
            rawset(input.menu, 'hidden', MenuV.Hidden)
        end

        SendNUIMessage(input)
    end
end)

--- Register `MenuV` keybinds
MenuV:RegisterKey('UP', T('keybind_key_up'), 'KEYBOARD', 'UP')
MenuV:RegisterKey('DOWN', T('keybind_key_down'), 'KEYBOARD', 'DOWN')
MenuV:RegisterKey('LEFT', T('keybind_key_left'), 'KEYBOARD', 'LEFT')
MenuV:RegisterKey('RIGHT', T('keybind_key_right'), 'KEYBOARD', 'RIGHT')
MenuV:RegisterKey('ENTER', T('keybind_key_enter'), 'KEYBOARD', 'RETURN')
MenuV:RegisterKey('CLOSE', T('keybind_key_close'), 'KEYBOARD', 'BACK')
MenuV:RegisterKey('CLOSE_ALL', T('keybind_key_close_all'), 'KEYBOARD', 'PLUS')

MenuV:RegisterKey('UP', ('%s - %s'):format(T('controller'), T('keybind_key_up')), 'PAD_ANALOGBUTTON', 'LUP_INDEX')
MenuV:RegisterKey('DOWN', ('%s - %s'):format(T('controller'), T('keybind_key_down')), 'PAD_ANALOGBUTTON', 'LDOWN_INDEX')
MenuV:RegisterKey('LEFT', ('%s - %s'):format(T('controller'), T('keybind_key_left')), 'PAD_ANALOGBUTTON', 'LLEFT_INDEX')
MenuV:RegisterKey('RIGHT', ('%s - %s'):format(T('controller'), T('keybind_key_right')), 'PAD_ANALOGBUTTON', 'LRIGHT_INDEX')
MenuV:RegisterKey('ENTER', ('%s - %s'):format(T('controller'), T('keybind_key_enter')), 'PAD_ANALOGBUTTON', 'RDOWN_INDEX')
MenuV:RegisterKey('CLOSE', ('%s - %s'):format(T('controller'), T('keybind_key_close')), 'PAD_ANALOGBUTTON', 'RRIGHT_INDEX')
MenuV:RegisterKey('CLOSE_ALL', ('%s - %s'):format(T('controller'), T('keybind_key_close_all')), 'PAD_ANALOGBUTTON', 'R3_INDEX')

--- Hide menu when screen is faded out or pause menu ia active
CreateThread(function()
    MenuV.Hidden = false

    while true do
        repeat Wait(0) until MenuV.Loaded

        local new_state = IsScreenFadedOut() or IsPauseMenuActive()

        if (MenuV.Hidden ~= new_state) then
            SendNUIMessage({ action = 'UPDATE_STATUS', status = not new_state })
        end

        MenuV.Hidden = new_state

        Wait(MenuV.ThreadWait)
    end
end)

--- When resource is stopped
AddEventHandler('onResourceStop', function(resourceName)
    SendNUIMessage({ action = 'RESOURCE_STOPPED', resource = resourceName })
end)