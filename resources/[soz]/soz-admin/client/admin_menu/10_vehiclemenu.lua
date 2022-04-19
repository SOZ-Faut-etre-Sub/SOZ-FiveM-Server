local vehicleMenu = MenuV:InheritMenu(AdminMenu, {subtitle = "ça roule vite ?"})
local vehicleCategories = MenuV:InheritMenu(vehicleMenu)
local vehicleModels = MenuV:InheritMenu(vehicleMenu)

local vehicles = {}

--- Functions
for k, v in pairs(QBCore.Shared.Vehicles) do
    local category = v.category
    if vehicles[category] == nil then
        vehicles[category] = {}
    end
    vehicles[category][k] = v
end

function CheckMods(id)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    local validMods = {}
    local amountValidMods = 0
    local modAmount = GetNumVehicleMods(plyVeh, id)

    for i = 1, modAmount do
        validMods[i] = {id = (i - 1)}
        amountValidMods = amountValidMods + 1
    end

    if modAmount > 0 then
        table.insert(validMods, 1, {id = -1})
    end

    return validMods, amountValidMods
end

--- Menu entries
vehicleMenu:AddButton({
    label = "Faire apparaitre un véhicule",
    value = nil,
    select = function()
        local model = exports["soz-hud"]:Input("Modèle du véhicule :", 32)

        if model and model ~= "" then
            TriggerServerEvent("QBCore:CallCommand", "car", {model})
        end
    end,
})

vehicleMenu:AddButton({label = "Choisir un véhicule à faire apparaitre", value = vehicleCategories})

vehicleMenu:AddButton({
    label = "Réparer le véhicule",
    value = nil,
    select = function()
        local vehicle = GetVehiclePedIsIn(PlayerPedId())

        SetVehicleFixed(vehicle)
        SetVehicleDeformationFixed(vehicle)
        SetVehicleUndriveable(vehicle, false)
    end,
})

vehicleMenu:AddButton({
    label = "Configuration FBI",
    value = nil,
    select = function()
        local plyPed = PlayerPedId()
        local plyVeh = GetVehiclePedIsIn(plyPed, false)
        SetVehicleModKit(plyVeh, 0)
        local amelioration = {11, 12, 13, 15, 16, 18}

        for _, v in pairs(amelioration) do
            local validMods, amountValidMods = CheckMods(v)
            if amountValidMods > 0 or v == 18 then
                if v == 18 then
                    ToggleVehicleMod(plyVeh, 18, 1)
                else
                    local mod
                    for _, n in pairs(validMods) do
                        mod = n
                    end
                    SetVehicleMod(plyVeh, v, mod.id)
                end
            end
        end

        SetVehicleColours(plyVeh, 12, 12)
        SetVehicleExtraColours(plyVeh, 12, 12)
        SetVehicleWindowTint(plyVeh, 1)
    end,
})

vehicleMenu:AddButton({
    label = "Supprimer le véhicule",
    value = nil,
    select = function()
        TriggerServerEvent("QBCore:CallCommand", "dv")
    end,
})

vehicleCategories:On("open", function(menu)
    menu:ClearItems()

    for category, models in pairs(vehicles) do
        menu:AddButton({
            label = category,
            value = vehicleModels,
            select = function()
                vehicleModels:ClearItems()

                for _, model in pairs(models) do
                    vehicleModels:AddButton({
                        label = model.name,
                        value = model.model,
                        select = function(item)
                            TriggerServerEvent("QBCore:CallCommand", "car", {item.Value})
                        end,
                    })
                end
            end,
        })
    end
end)

--- Add to main menu
AdminMenu:AddButton({icon = "🚗", label = "Gestion du véhicule", value = vehicleMenu})
