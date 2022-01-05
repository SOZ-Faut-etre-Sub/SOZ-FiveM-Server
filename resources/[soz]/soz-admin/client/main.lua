local QBCore = exports['qb-core']:GetCoreObject()
local AdminMenu = MenuV:CreateMenu("admin", "", 255, 0, 0, 'default_native', 'menuv', 'admin-panel')
local PlayerData = QBCore.Functions.GetPlayerData()

local noclip_check = false
local coords_check = false

local function round(input, decimalPlaces)
    return tonumber(string.format("%." .. (decimalPlaces or 0) .. "f", input))
end

local function Draw2DText(content, font, colour, scale, x, y)
    SetTextFont(font)
    SetTextScale(scale, scale)
    SetTextColour(colour[1],colour[2],colour[3], 255)
    SetTextEntry("STRING")
    SetTextDropShadow(0, 0, 0, 0,255)
    SetTextDropShadow()
    SetTextEdge(4, 0, 0, 0, 255)
    SetTextOutline()
    AddTextComponentString(content)
    DrawText(x, y)
end

local function ToggleShowCoordinates()
    local x = 0.4
    local y = 0.025
    showCoords = not showCoords
    Citizen.CreateThread(function()
        while showCoords do
            local coords = GetEntityCoords(PlayerPedId())
            local heading = GetEntityHeading(PlayerPedId())
            local c = {}
            c.x = round(coords.x, 2)
            c.y = round(coords.y, 2)
            c.z = round(coords.z, 2)
            heading = round(heading, 2)
            Citizen.Wait(0)
            Draw2DText(string.format('~w~Ped Coordinates:~b~ vector4(~w~%s~b~, ~w~%s~b~, ~w~%s~b~, ~w~%s~b~)', c.x, c.y, c.z, heading), 4, {66, 182, 245}, 0.4, x + 0.0, y + 0.0)
        end
    end)
end

local function AdminPanel(menu)
    local noclip = menu:AddCheckbox({ label = "Noclip", value = noclip_check, description = "Active/Désactive le noclip" })
    local coords = menu:AddCheckbox({ label = "Coords", value = coords_check, description = "Affiche les coords" })
    local tpm = menu:AddButton({label = "Tpm", description = "Téléport sur le marqueur"})
    
    noclip:On('change', function()
        noclip_check = not noclip_check
        ToggleNoClipMode()
    end)

    coords:On('change', function()
        coords_check = not coords_check
        ToggleShowCoordinates()
    end)

    tpm:On('select', function()
        TeleportToWaypoint()
    end)
end

local function GenerateMenu()
    AdminMenu:ClearItems()
    AdminMenu:SetSubtitle(string.format('%s %s', PlayerData.charinfo.firstname, PlayerData.charinfo.lastname))
    AdminPanel(AdminMenu)
    
    MenuV:CloseAll(function()
        AdminMenu:Open()
    end)
end

RegisterCommand("admin", function()
    GenerateMenu()
end)
