QBCore = exports["qb-core"]:GetCoreObject()

function GetCurrentMod(id)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    local mod = GetVehicleMod(plyVeh, id)
    local modName = GetLabelText(GetModTextLabel(plyVeh, id, mod))

    return mod, modName
end

function GetCurrentTurboState()
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    local isEnabled = IsToggleModOn(plyVeh, 18)

    if isEnabled then
        return 1
    else
        return 0
    end
end

function CheckValidMods(category, id)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    local tempMod = GetVehicleMod(plyVeh, id)
    local validMods = {}
    local amountValidMods = 0
    local hornNames = {}
    local modAmount = GetNumVehicleMods(plyVeh, id)

    for i = 1, modAmount do
        local label = GetModTextLabel(plyVeh, id, (i - 1))
        local modName = GetLabelText(label)

        if modName == "NULL" then
            if id == 14 then
                if i <= #hornNames then
                    modName = hornNames[i].name
                else
                    modName = "Horn " .. i
                end
            else
                modName = category .. " " .. i
            end
        end

        validMods[i] = {id = (i - 1), name = modName}

        amountValidMods = amountValidMods + 1
    end

    if modAmount > 0 then
        table.insert(validMods, 1, {id = -1, name = "Stock " .. category})
    end

    return validMods, amountValidMods
end

RegisterNetEvent("soz-custom:client:applymod", function(categoryID, modID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    if categoryID == 18 then
        ToggleVehicleMod(plyVeh, categoryID, modID)
    else
        SetVehicleMod(plyVeh, categoryID, modID)
    end
end)

local VehiculeOptions = MenuV:CreateMenu(nil, "LS Customs", "menu_shop_lscustoms", "soz", "custom:vehicle:options")
local Upgrade = MenuV:InheritMenu(VehiculeOptions, "Upgrade")
local UpgradeMenu = MenuV:InheritMenu(Upgrade, "Upgrade Menu")

local function OpenUpgrade(menu, v, k)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })

    local validMods, amountValidMods = CheckValidMods(v.category, v.id)
    local currentMod, currentModName = GetCurrentMod(v.id)

    if amountValidMods > 0 or v.id == 18 then
        if v.id == 11 or v.id == 12 or v.id == 13 or v.id == 15 or v.id == 16 then -- Performance
            local tempNum = 0
            for m, n in pairs(validMods) do
                tempNum = tempNum + 1

                if Config.maxVehiclePerformanceUpgrades == 0 then
                    if currentMod == n.id then
                        menu:AddButton({label = n.name .. " - ~g~Installed"})
                    else
                        menu:AddButton({
                            label = n.name .. " - $" .. Config.vehicleCustomisationPricesCustom.performance.prices[tempNum],
                            description = "Acheter 💸",
                            select = function()
                                menu:Close()
                                TriggerServerEvent("soz-custom:server:buyupgrade", v.id, n, Config.vehicleCustomisationPricesCustom.performance.prices[tempNum])
                            end,
                        })
                    end
                else
                    if tempNum <= (Config.maxVehiclePerformanceUpgrades + 1) then
                        if currentMod == n.id then
                            menu:AddButton({label = n.name .. " - ~g~Installed"})
                        else
                            menu:AddButton({
                                label = n.name .. " - $" .. Config.vehicleCustomisationPricesCustom.performance.prices[tempNum],
                                description = "Acheter 💸",
                                select = function()
                                    menu:Close()
                                    TriggerServerEvent("soz-custom:server:buyupgrade", v.id, n,
                                                       Config.vehicleCustomisationPricesCustom.performance.prices[tempNum])
                                end,
                            })
                        end
                    end
                end
            end
        elseif v.id == 18 then
            local currentTurboState = GetCurrentTurboState()
            if currentTurboState == 0 then
                menu:AddButton({label = "Disable - ~g~Installed"})
                menu:AddButton({
                    label = "Enable" .. " - $" .. Config.vehicleCustomisationPricesCustom.turbo.price,
                    description = "Acheter 💸",
                    select = function()
                        menu:Close()
                        TriggerServerEvent("soz-custom:server:buyupgrade", v.id, 1, Config.vehicleCustomisationPricesCustom.turbo.price)
                    end,
                })
            else
                menu:AddButton({
                    label = "Disable",
                    description = "Gratuit 💸",
                    select = function()
                        menu:Close()
                        TriggerEvent("soz-custom:client:applymod", v.id, 0)
                        exports["soz-hud"]:DrawNotification("Le turbo a été enlevé!")
                    end,
                })
                menu:AddButton({label = "Enable - Installed"})
            end
        end
    end
end

local function OpenUpgradesMenu(menu)
    local plate = QBCore.Functions.GetPlate(Config.AttachedVehicle)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleCustomisationCustom) do
        local validMods, amountValidMods = CheckValidMods(v.category, v.id)
        if amountValidMods > 0 or v.id == 18 then
            menu:AddButton({
                label = v.category,
                select = function()
                    OpenUpgrade(UpgradeMenu, v, k)
                end,
            })
        end
    end
end

local function OpenMenu(menu)
    local veh = GetVehiclePedIsIn(PlayerPedId(), false)
    FreezeEntityPosition(veh, true)
    menu:AddButton({
        icon = "◀",
        label = "Libérer le véhicule",
        description = "Détacher le véhicule de la plateforme",
        select = function()
            TriggerEvent("soz-mechanicjob:client:UnattachVehicle")
            exports["soz-hud"]:DrawNotification("Véhicule libéré")
            menu:Close()
            SetVehicleDoorsLocked(veh, 1)
        end,
    })
    menu:AddButton({
        label = "Amélioration du véhicule",
        description = "Améliorer les pièces du véhicule",
        select = function()
            SetVehicleModKit(veh, 0)
            OpenUpgradesMenu(Upgrade)
        end,
    })
end

local function GenerateOpenMenu()
    if VehiculeOptions.IsOpen then
        VehiculeOptions:Close()
    else
        VehiculeOptions:ClearItems()
        OpenMenu(VehiculeOptions)
        VehiculeOptions:Open()
    end
end

local function UnattachVehicle()
    FreezeEntityPosition(Config.AttachedVehicle, false)
    Config.AttachedVehicle = nil
    TriggerServerEvent("qb-vehicletuning:server:SetAttachedVehicle", false)
end

-- Events
RegisterNetEvent("soz-mechanicjob:client:UnattachVehicle", function()
    UnattachVehicle()
end)

RegisterNetEvent("qb-vehicletuning:client:SetAttachedVehicle", function(veh)
    if veh ~= false then
        Config.AttachedVehicle = veh
    else
        Config.AttachedVehicle = nil
    end
end)

RegisterNetEvent("vehiclemod:client:setPartLevel", function(part, level)
    if (IsPedInAnyVehicle(PlayerPedId(), false)) then
        local veh = GetVehiclePedIsIn(PlayerPedId(), false)
        if not IsThisModelABicycle(GetEntityModel(veh)) and GetPedInVehicleSeat(veh, -1) == PlayerPedId() then
            local plate = QBCore.Functions.GetPlate(veh)
            if part == "engine" then
                SetVehicleEngineHealth(veh, level)
                TriggerServerEvent("vehiclemod:server:updatePart", plate, "engine", GetVehicleEngineHealth(veh))
            elseif part == "body" then
                SetVehicleBodyHealth(veh, level)
                TriggerServerEvent("vehiclemod:server:updatePart", plate, "body", GetVehicleBodyHealth(veh))
            else
                TriggerServerEvent("vehiclemod:server:updatePart", plate, part, level)
            end
        else
            exports["soz-hud"]:DrawNotification("~r~You Are Not The Driver Or On A Bicycle")
        end
    else
        exports["soz-hud"]:DrawNotification("~r~You Are Not The Driver Or On A Bicycle")
    end
end)

CreateThread(function()
    for k, v in pairs(Config.lscustom) do
        if v.blip then
            local blip = AddBlipForCoord(v.coords.x, v.coords.y, v.coords.z)
            SetBlipSprite(blip, 72)
            SetBlipScale(blip, 0.7)
            SetBlipAsShortRange(blip, true)
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentString("LS Custom")
            EndTextCommandSetBlipName(blip)
        end
    end
end)

local lszones = {
    BoxZone:Create(vector3(-339.42, -138.23, 39.01), 7, 6, {
        name = "Vehiclecustom1_z",
        heading = 70,
        minZ = 38.01,
        maxZ = 42.01,
    }),
    BoxZone:Create(vector3(-1155.99, -2005.25, 13.18), 7, 6, {
        name = "Vehiclecustom2_z",
        heading = 315,
        minZ = 12.18,
        maxZ = 16.18,
    }),
    BoxZone:Create(vector3(731.54, -1088.73, 22.19), 7, 6, {
        name = "Vehiclecustom3_z",
        heading = 90,
        minZ = 21.19,
        maxZ = 25.19,
    }),
    BoxZone:Create(vector3(110.36, 6626.7, 31.87), 7, 6, {
        name = "Vehiclecustom4_z",
        heading = 45,
        minZ = 30.87,
        maxZ = 34.87,
    }),
    BoxZone:Create(vector3(1174.9, 2640.06, 37.77), 7, 6, {
        name = "Vehiclecustom5_z",
        heading = 0,
        minZ = 36.77,
        maxZ = 40.77,
    }),
}

local insidecustom = false
for int = 1, 5 do
    lszones[int]:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            if Config.AttachedVehicle == nil then
                if IsPedInAnyVehicle(PlayerPedId()) then
                    local veh = GetVehiclePedIsIn(PlayerPedId())
                    if not IsThisModelABicycle(GetEntityModel(veh)) then
                        insidecustom = true
                    else
                        exports["soz-hud"]:DrawNotification("~r~Vous ne pouvez pas mette de vélos")
                    end
                end
            end
        else
            insidecustom = false
            VehiculeOptions:Close()
            Config.AttachedVehicle = nil
        end
    end)
end

CreateThread(function()
    while true do
        if insidecustom == true then
            QBCore.Functions.ShowHelpNotification("~INPUT_CONTEXT~ Menu LS Custom")
            if IsControlJustPressed(1, 51) then
                local veh = GetVehiclePedIsIn(PlayerPedId())
                Config.AttachedVehicle = veh
                TriggerServerEvent("qb-vehicletuning:server:SetAttachedVehicle", veh)
                SetVehicleDoorsLocked(veh, 4)
                GenerateOpenMenu()
            end
        end
        Wait(2)
    end
end)
