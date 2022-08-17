local vehicleMenu, vehicleCategories, vehicleModels
local vehicleCatalog = {}

--- Functions
CreateThread(function()
    local vehicles = QBCore.Functions.TriggerRpc("soz-vehicle:server:GetAllVehicles")
    for _, vehicle in pairs(vehicles) do
        local category = vehicle.category
        if vehicleCatalog[category] == nil then
            vehicleCatalog[category] = {}
        end
        table.insert(vehicleCatalog[category], vehicle)
    end
end)

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
    })

    vehicleMenu:AddButton({label = "Choisir un véhicule à faire apparaitre", value = vehicleCategories})

    vehicleMenu:AddButton({
        label = "Réparer le véhicule",
        value = nil,
        select = function()
            local vehicle = GetVehiclePedIsIn(PlayerPedId())
            SetVehicleBodyHealth(vehicle, 1000.0)
            SetVehicleEngineHealth(vehicle, 1000.0)
            SetVehicleFixed(vehicle)
            SetVehicleDeformationFixed(vehicle)
            local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(vehicle))
            Entity(vehicle).state:set("condition", json.encode(newcondition), true)
        end,
    })

    vehicleMenu:AddButton({
        label = "Nettoyer le véhicule",
        value = nil,
        select = function()
            local vehicle = GetVehiclePedIsIn(PlayerPedId())
            SetVehicleDirtLevel(vehicle, 0.1)
            WashDecalsFromVehicle(vehicle, 1.0)
            local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(vehicle))
            Entity(vehicle).state:set("condition", json.encode(newcondition), true)
        end,
    })

    vehicleMenu:AddButton({
        label = "Ravitailler le véhicule",
        value = nil,
        select = function()
            local vehicle = GetVehiclePedIsIn(PlayerPedId())
            exports["soz-vehicle"]:SetFuel(vehicle, 100.0)
            local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(vehicle))
            Entity(vehicle).state:set("condition", json.encode(newcondition), true)
        end,
    })

    vehicleMenu:AddButton({
        icon = "⚠️",
        label = "Sauvegarder le véhicule",
        value = nil,
        select = function()
            local vehicle = GetVehiclePedIsIn(PlayerPedId())
            local mods = QBCore.Functions.GetVehicleProperties(vehicle)
            local modelName = GetDisplayNameFromVehicleModel(GetEntityModel(vehicle)):lower()

            if IsModelValid(GetHashKey(modelName)) then
                TriggerServerEvent("admin:vehicle:AddVehicle", modelName, VehToNet(vehicle), mods)
                exports["soz-hud"]:DrawNotification("Véhicule sauvegardé !")
            else
                exports["soz-hud"]:DrawNotification("Ce modèle n'est pas disponible à la sauvegarde !", "error")
            end
        end,
        disabled = permission ~= "admin",
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

        for category, models in pairs(vehicleCatalog) do
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
    menu:AddButton({
        icon = "🚗",
        label = "Gestion du véhicule",
        value = vehicleMenu,
        disabled = permission ~= "admin" and permission ~= "staff",
    })
end
