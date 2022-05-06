local vehicleMenu, vehicleCategories, vehicleModels
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

function AdminMenuVehicles(menu, permission)
    if vehicleMenu == nil then
        vehicleMenu = MenuV:InheritMenu(menu, {subtitle = "ça roule vite ?"})
    end
    if vehicleCategories == nil then
        vehicleCategories = MenuV:InheritMenu(vehicleMenu)
    end
    if vehicleModels == nil then
        vehicleModels = MenuV:InheritMenu(vehicleMenu)
    end

    vehicleMenu:ClearItems()
    vehicleCategories:ClearItems()
    vehicleModels:ClearItems()

    vehicleMenu:AddButton({
        label = "Faire apparaitre un véhicule",
        value = nil,
        select = function()
            local model = exports["soz-hud"]:Input("Modèle du véhicule :", 32)

            if model and model ~= "" then
                TriggerServerEvent("QBCore:CallCommand", "car", {model})
            end
        end,
        disabled = permission ~= "admin",
    })

    vehicleMenu:AddButton({
        label = "Choisir un véhicule à faire apparaitre",
        value = vehicleCategories,
        disabled = permission ~= "admin",
    })

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
        label = "Ravitailler le véhicule",
        value = nil,
        select = function()
            local vehicle = GetVehiclePedIsIn(PlayerPedId())
            exports["soz-vehicle"]:SetFuel(vehicle, 100.0)
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
        disabled = permission ~= "admin",
    })

    vehicleMenu:AddButton({
        label = "Supprimer le véhicule",
        value = nil,
        select = function()
            TriggerServerEvent("QBCore:CallCommand", "dv")
        end,
    })

    vehicleCategories:On("open", function(m)
        m:ClearItems()

        for category, models in pairs(vehicles) do
            m:AddButton({
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

    vehicleCategories:On("close", function(m)
        m:ClearItems()
    end)

    --- Add to main menu
    menu:AddButton({icon = "🚗", label = "Gestion du véhicule", value = vehicleMenu})
end
