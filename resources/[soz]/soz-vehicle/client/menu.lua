local vehicleMenu = MenuV:CreateMenu(nil, "", "menu_vehicle", "soz", "vehicle")
local doorName = {"Conducteur avant", "Passager avant", "Conducteur arrière", "Passager arrière", "Capot", "Coffre"}

local function EngineMenu()
    local engine = vehicleMenu:AddSlider({
        label = "Contact du moteur",
        value = nil,
        values = {{label = "Allumé", value = true}, {label = "Éteint", value = false}},
    })
    engine:On("select", function(item, value)
        TriggerEvent("vehiclekeys:client:ToggleEngine", value)
    end)
end

local function CibiMenu(vehicle)
    if not Entity(vehicle).state.hasRadio then
        return
    end

    local cibi = vehicleMenu:AddButton({label = "Radio longue portée", value = nil})
    cibi:On("select", function()
        TriggerEvent("talk:cibi:use")
    end)
end

local function SpeedLimiterMenu(vehicle)
    local speed = vehicleMenu:AddSlider({
        label = "Limitateur de vitesse",
        value = nil,
        values = {
            {label = "Aucune limite de vitesse", value = 0},
            {label = "Limiter la vitesse à 50km/h", value = 50},
            {label = "Limiter la vitesse à 90km/h", value = 90},
            {label = "Limiter la vitesse à 120km/h", value = 120},
        },
    })
    speed:On("select", function(item, value)
        local currentspeed = GetEntitySpeed(GetVehiclePedIsIn(PlayerPedId(), false)) * 3.6 + 0.25
        if currentspeed > value and value ~= 0 then
            exports["soz-hud"]:DrawNotification("Vous allez trop vite pour faire ça", "error")
            return
        else
            TriggerEvent("soz-bennys:client:UpdateLimiter", value)
        end
    end)
end

local function DoorManagementMenu(vehicle)
    local doorMenu = MenuV:InheritMenu(vehicleMenu, {Subtitle = "Portes"})
    vehicleMenu:AddButton({label = "Gestion des portes", value = doorMenu})

    for i = 0, 5 do
        if not IsVehicleDoorDamaged(vehicle, i) and GetIsDoorValid(vehicle, i) then
            local door = doorMenu:AddCheckbox({
                label = doorName[i + 1],
                value = GetVehicleDoorAngleRatio(vehicle, i) >= 0.5,
            })

            door:On("change", function(menu, value)
                if value then
                    SetVehicleDoorOpen(vehicle, i, false, false)
                else
                    SetVehicleDoorShut(vehicle, i, false)
                end
            end)
        end
    end
end

local function GenerateMenu()
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)

    if IsPedInAnyVehicle(player, false) then
        vehicleMenu:ClearItems()

        if GetPedInVehicleSeat(vehicle, -1) == player then
            EngineMenu()
            CibiMenu(vehicle)
            SpeedLimiterMenu(vehicle)
            DoorManagementMenu(vehicle)
        end
        if GetPedInVehicleSeat(vehicle, 0) == player then
            CibiMenu(vehicle)
        end

        if MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= vehicleMenu.UUID then
            MenuV:CloseAll(function()
                vehicleMenu:Open()
            end)
        else
            MenuV:CloseAll(function()
                vehicleMenu:Close()
            end)
        end
    end
end

RegisterKeyMapping("vehmenu", "Ouvrir le menu du véhicule", "keyboard", "HOME")
RegisterCommand("vehmenu", GenerateMenu, false)

Citizen.CreateThread(function()
    while true do
        if vehicleMenu.IsOpen and not IsPedInAnyVehicle(PlayerPedId(), false) then
            vehicleMenu:Close()
        end

        Wait(1000)
    end
end)
