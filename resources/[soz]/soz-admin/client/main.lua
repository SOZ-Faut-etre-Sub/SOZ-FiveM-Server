local QBCore        = exports['qb-core']:GetCoreObject()

local AdminMenu     = MenuV:CreateMenu("Admin", "Le menu de métal", 255, 0, 0, 'default', 'soz', 'admin-panel')

local PlayerList    = MenuV:InheritMenu(AdminMenu, { Title = 'Joueur' })
local VehiculeList  = MenuV:InheritMenu(AdminMenu, { Title = 'Véhicule model' })
local VehiculeModel = MenuV:InheritMenu(AdminMenu, { Title = 'Spawn Véhicule' })
local Players       = MenuV:InheritMenu(AdminMenu, { Title = 'Player Option' })

local noclip_check  = false
local coords_check  = false

local vehicles      = {}
for k, v in pairs(QBCore.Shared.Vehicles) do
    local category = v["category"]
    if vehicles[category] == nil then
        vehicles[category] = { }
    end
    vehicles[category][k] = v
end

local function round(input, decimalPlaces)
    return tonumber(string.format("%." .. (decimalPlaces or 0) .. "f", input))
end

local function Draw2DText(content, font, colour, scale, x, y)
    SetTextFont(font)
    SetTextScale(scale, scale)
    SetTextColour(colour[1], colour[2], colour[3], 255)
    SetTextEntry("STRING")
    SetTextDropShadow(0, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextEdge(4, 0, 0, 0, 255)
    SetTextOutline()
    AddTextComponentString(content)
    DrawText(x, y)
end

local function ToggleShowCoordinates()
    local x    = 0.4
    local y    = 0.05
    showCoords = not showCoords
    Citizen.CreateThread(function()
        while showCoords do
            local coords  = GetEntityCoords(PlayerPedId())
            local heading = GetEntityHeading(PlayerPedId())
            local c       = {}
            c.x           = round(coords.x, 2)
            c.y           = round(coords.y, 2)
            c.z           = round(coords.z, 2)
            heading       = round(heading, 2)
            Citizen.Wait(0)
            Draw2DText(string.format('~w~Ped Coordinates:~b~ vector4(~w~%s~b~, ~w~%s~b~, ~w~%s~b~, ~w~%s~b~)', c.x, c.y, c.z, heading), 4, { 66, 182, 245 }, 0.4, x + 0.0, y + 0.0)
        end
    end)
end

local function OpenPlayerMenus(player)
    Players:ClearItems()
    MenuV:OpenMenu(Players)
    local elements = {
        [1] = {
            label       = "Aller sur",
            value       = "goto",
            description = "Va sur la position de " .. player.cid .. ""
        },
        [2] = {
            label       = "Amène sur",
            value       = "bring",
            description = " Amène " .. player.cid .. " sur ta position"
        }
    }
    for k, v in ipairs(elements) do
        local menu_button10 = Players:AddButton({
            label       = ' ' .. v.label,
            value       = v.value,
            description = v.description,
            select      = function(btn)
                local values = btn.Value
                TriggerServerEvent('admin:server:' .. values, player)
            end
        })
    end
end

local function OpenCarModelsMenu(category)
    VehiculeModel:ClearItems()
    MenuV:OpenMenu(VehiculeModel)
    for k, v in pairs(category) do
        local menu_button10 = VehiculeModel:AddButton({
            label       = v["name"],
            value       = k,
            description = 'Frayer ' .. v["name"],
            select      = function(btn)
                TriggerServerEvent('QBCore:CallCommand', "car", { k })
            end
        })
    end
end

local function SetFoodandDrink()
    TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] + 100)
    TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] + 100)
end

local function AdminPanel(menu)
    local noclip     = menu:AddCheckbox({ label = "Noclip", value = noclip_check, description = "Active/Désactive le noclip" })
    local coords     = menu:AddCheckbox({ label = "Voir les coords", value = coords_check, description = "Affiche les coords" })
    local tpm        = menu:AddButton({ label = "Tpm", description = "Téléport sur le marqueur" })
    local playerlist = menu:AddButton({ label = "Gestion des joueurs", value = PlayerList, description = "Voir la liste des joueurs" })
    local vehspawn   = menu:AddButton({ label = "Spawn Véhicules", value = VehiculeList, description = "Voir la liste des Véhicules" })
    local heal       = menu:AddButton({ label = "max faim/soif", description = "reset la faim et la soif" })

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

    heal:On('select', function()
        SetFoodandDrink()
    end)

    playerlist:On('select', function(item)
        PlayerList:ClearItems()
        QBCore.Functions.TriggerCallback('admin:server:getplayers', function(players)
            for k, v in pairs(players) do
                local menu_button10 = PlayerList:AddButton({
                    label       = 'ID:' .. v["id"] .. ' | ' .. v["name"],
                    value       = v,
                    description = 'Nom du joueur',
                    select      = function(btn)
                        local select = btn.Value
                        OpenPlayerMenus(select)
                    end
                })
            end
        end)
    end)

    vehspawn:On('Select', function(item)
        VehiculeList:ClearItems()
        for k, v in pairs(vehicles) do
            local menu_button10 = VehiculeList:AddButton({
                label       = k,
                value       = v,
                description = 'Nom de catégorie',
                select      = function(btn)
                    local select = btn.Value
                    OpenCarModelsMenu(select)
                end
            })
        end
    end)

end

local function GenerateMenu()
    if AdminMenu.IsOpen then
        AdminMenu:Close()
    else
        QBCore.Functions.TriggerCallback('admin:server:isAllowed', function(isAllowed)
            if isAllowed then
                AdminMenu:ClearItems()
                AdminPanel(AdminMenu)

                AdminMenu:Open()
            end
        end)
    end
end

RegisterKeyMapping("admin", "", "keyboard", "F7")
RegisterCommand("admin", GenerateMenu, false)
