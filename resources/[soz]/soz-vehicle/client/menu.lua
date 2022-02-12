local vehicleMenu = MenuV:CreateMenu(nil, "", "menu_vehicle", "soz", "vehicle")
local doorName = {
    "Conducteur avant",
    "Passager avant",
    "Conducteur arrière",
    "Passager arrière",
    "Capot",
    "Coffre",
}

local function EngineMenu(vehicle)
    local engine = vehicleMenu:AddSlider({
        label = "Contact du moteur",
        value = nil,
        values = {{label = "Allumé", value = true}, {label = "Éteint", value = false}},
    })
    engine:On("select", function(item, value)
        -- SetVehicleEngineOn(vehicle, value, false, true)
        TriggerEvent("vehiclekeys:client:ToggleEngine", value)
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
        SetVehicleMaxSpeed(vehicle, value / 3.6 - 0.5)
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

    if IsPedInAnyVehicle(player, false) and GetPedInVehicleSeat(vehicle, -1) == player then
        vehicleMenu:ClearItems()

        EngineMenu(vehicle)
        SpeedLimiterMenu(vehicle)
        DoorManagementMenu(vehicle)

        if vehicleMenu.IsOpen then
            vehicleMenu:Close()
        else
            vehicleMenu:Open()
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
