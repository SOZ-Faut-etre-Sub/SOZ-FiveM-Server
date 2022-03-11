QBCore = exports["qb-core"]:GetCoreObject()

VehicleStatus = {}
local effectTimer = 0

-- #[Local Functions]#--

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
    print("rrer")
    print(categoryID)
    print(modID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    if categoryID == 18 then
        ToggleVehicleMod(plyVeh, categoryID, modID)
    else
        SetVehicleMod(plyVeh, categoryID, modID)
    end
end)

local function GetVehicleStatusList(plate)
    local retval = nil
    if VehicleStatus[plate] ~= nil then
        retval = VehicleStatus[plate]
    end
    return retval
end

local function GetVehicleStatus(plate, part)
    local retval = nil
    if VehicleStatus[plate] ~= nil then
        retval = VehicleStatus[plate][part]
    end
    return retval
end

local function SetVehicleStatus(plate, part, level)
    TriggerServerEvent("vehiclemod:server:updatePart", plate, part, level)
end

exports("GetVehicleStatusList", GetVehicleStatusList)
exports("GetVehicleStatus", GetVehicleStatus)
exports("SetVehicleStatus", SetVehicleStatus)

-- Functions

local function ApplyEffects(vehicle)
    local plate = QBCore.Functions.GetPlate(vehicle)
    if GetVehicleClass(vehicle) ~= 13 and GetVehicleClass(vehicle) ~= 21 and GetVehicleClass(vehicle) ~= 16 and GetVehicleClass(vehicle) ~= 15 and
        GetVehicleClass(vehicle) ~= 14 then
        if VehicleStatus[plate] ~= nil then
            local chance = math.random(1, 100)
            if VehicleStatus[plate]["radiator"] <= 80 and (chance >= 1 and chance <= 20) then
                local engineHealth = GetVehicleEngineHealth(vehicle)
                if VehicleStatus[plate]["radiator"] <= 80 and VehicleStatus[plate]["radiator"] >= 60 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(10, 15))
                elseif VehicleStatus[plate]["radiator"] <= 59 and VehicleStatus[plate]["radiator"] >= 40 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(15, 20))
                elseif VehicleStatus[plate]["radiator"] <= 39 and VehicleStatus[plate]["radiator"] >= 20 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(20, 30))
                elseif VehicleStatus[plate]["radiator"] <= 19 and VehicleStatus[plate]["radiator"] >= 6 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(30, 40))
                else
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(40, 50))
                end
            end

            if VehicleStatus[plate]["axle"] <= 80 and (chance >= 21 and chance <= 40) then
                if VehicleStatus[plate]["axle"] <= 80 and VehicleStatus[plate]["axle"] >= 60 then
                    for i = 0, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                elseif VehicleStatus[plate]["axle"] <= 59 and VehicleStatus[plate]["axle"] >= 40 then
                    for i = 0, 360 do
                        Wait(10)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                elseif VehicleStatus[plate]["axle"] <= 39 and VehicleStatus[plate]["axle"] >= 20 then
                    for i = 0, 360 do
                        Wait(15)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                elseif VehicleStatus[plate]["axle"] <= 19 and VehicleStatus[plate]["axle"] >= 6 then
                    for i = 0, 360 do
                        Wait(20)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                else
                    for i = 0, 360 do
                        Wait(25)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                end
            end

            if VehicleStatus[plate]["brakes"] <= 80 and (chance >= 41 and chance <= 60) then
                if VehicleStatus[plate]["brakes"] <= 80 and VehicleStatus[plate]["brakes"] >= 60 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(1000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 59 and VehicleStatus[plate]["brakes"] >= 40 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(3000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 39 and VehicleStatus[plate]["brakes"] >= 20 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(5000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 19 and VehicleStatus[plate]["brakes"] >= 6 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(7000)
                    SetVehicleHandbrake(vehicle, false)
                else
                    SetVehicleHandbrake(vehicle, true)
                    Wait(9000)
                    SetVehicleHandbrake(vehicle, false)
                end
            end

            if VehicleStatus[plate]["clutch"] <= 80 and (chance >= 61 and chance <= 80) then
                if VehicleStatus[plate]["clutch"] <= 80 and VehicleStatus[plate]["clutch"] >= 60 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(50)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(500)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 59 and VehicleStatus[plate]["clutch"] >= 40 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(100)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(750)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 39 and VehicleStatus[plate]["clutch"] >= 20 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(150)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 19 and VehicleStatus[plate]["clutch"] >= 6 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(200)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1250)
                    SetVehicleHandbrake(vehicle, false)
                else
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(250)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1500)
                    SetVehicleHandbrake(vehicle, false)
                end
            end

            if VehicleStatus[plate]["fuel"] <= 80 and (chance >= 81 and chance <= 100) then
                local fuel = exports["soz-vehicle"]:GetFuel(vehicle)
                if VehicleStatus[plate]["fuel"] <= 80 and VehicleStatus[plate]["fuel"] >= 60 then
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 2.0)
                elseif VehicleStatus[plate]["fuel"] <= 59 and VehicleStatus[plate]["fuel"] >= 40 then
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 4.0)
                elseif VehicleStatus[plate]["fuel"] <= 39 and VehicleStatus[plate]["fuel"] >= 20 then
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 6.0)
                elseif VehicleStatus[plate]["fuel"] <= 19 and VehicleStatus[plate]["fuel"] >= 6 then
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 8.0)
                else
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 10.0)
                end
            end
        end
    end
end

local VehiculeOptions = MenuV:CreateMenu(nil, "LS Customs", "menu_shop_vehicle_car", "soz", "custom:vehicle:options")
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
    -- #[Mods Menu]#--
    local validMods, amountValidMods = CheckValidMods(v.category, v.id)
    local currentMod, currentModName = GetCurrentMod(v.id)

    if amountValidMods > 0 or v.id == 18 then
        if v.id == 11 or v.id == 12 or v.id == 13 or v.id == 15 or v.id == 16 then -- Performance Upgrades
            local tempNum = 0
            for m, n in pairs(validMods) do
                tempNum = tempNum + 1

                if Config.maxVehiclePerformanceUpgrades == 0 then
                    if currentMod == n.id then
                        menu:AddButton({label = "Installed"})
                    else
                        menu:AddButton({
                            label = n.name,
                            description = "Acheter 💸 $" .. Config.vehicleCustomisationPricesCustom.performance.prices[tempNum],
                            select = function()
                                menu:Close()
                                TriggerServerEvent("soz-custom:server:buyupgrade", v.id, n, Config.vehicleCustomisationPricesCustom.performance.prices[tempNum])
                            end,
                        })
                    end
                else
                    if tempNum <= (Config.maxVehiclePerformanceUpgrades + 1) then
                        if currentMod == n.id then
                            menu:AddButton({label = "Installed"})
                        else
                            menu:AddButton({
                                label = n.name,
                                description = "Acheter 💸 $" .. Config.vehicleCustomisationPricesCustom.performance.prices[tempNum],
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
                menu:AddButton({label = "Disable - Installed"})
                menu:AddButton({
                    label = "Enable",
                    description = "Acheter 💸 $" .. Config.vehicleCustomisationPricesCustom.turbo.price,
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
    if VehicleStatus[plate] ~= nil then
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

RegisterNetEvent("vehiclemod:client:setVehicleStatus", function(plate, status)
    VehicleStatus[plate] = status
end)

RegisterNetEvent("vehiclemod:client:getVehicleStatus", function(plate, status)
    if not (IsPedInAnyVehicle(PlayerPedId(), false)) then
        local veh = GetVehiclePedIsIn(PlayerPedId(), true)
        if veh ~= nil and veh ~= 0 then
            local vehpos = GetEntityCoords(veh)
            local pos = GetEntityCoords(PlayerPedId())
            if #(pos - vehpos) < 5.0 then
                if not IsThisModelABicycle(GetEntityModel(veh)) then
                    local plate = QBCore.Functions.GetPlate(veh)
                    if VehicleStatus[plate] ~= nil then
                        SendStatusMessage(VehicleStatus[plate])
                    else
                        exports["soz-hud"]:DrawNotification("~r~Etat inconnu")
                    end
                else
                    exports["soz-hud"]:DrawNotification("~r~Véhicule invalide")
                end
            else
                exports["soz-hud"]:DrawNotification("~r~Vous n'êtes pas assez proche du véhicule")
            end
        else
            exports["soz-hud"]:DrawNotification("~r~Vous devez d'abord être dans un véhicule")
        end
    else
        exports["soz-hud"]:DrawNotification("~r~Vous devez être à l'extérieur du véhicule")
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

-- Threads

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

CreateThread(function()
    while true do
        Wait(1000)
        if (IsPedInAnyVehicle(PlayerPedId(), false)) then
            local veh = GetVehiclePedIsIn(PlayerPedId(), false)
            if not IsThisModelABicycle(GetEntityModel(veh)) and GetPedInVehicleSeat(veh, -1) == PlayerPedId() then
                local engineHealth = GetVehicleEngineHealth(veh)
                local bodyHealth = GetVehicleBodyHealth(veh)
                local plate = QBCore.Functions.GetPlate(veh)
                if VehicleStatus[plate] == nil then
                    TriggerServerEvent("vehiclemod:server:setupVehicleStatus", plate, engineHealth, bodyHealth)
                else
                    TriggerServerEvent("vehiclemod:server:updatePart", plate, "engine", engineHealth)
                    TriggerServerEvent("vehiclemod:server:updatePart", plate, "body", bodyHealth)
                    effectTimer = effectTimer + 1
                    if effectTimer >= math.random(10, 15) then
                        ApplyEffects(veh)
                        effectTimer = 0
                    end
                end
            else
                effectTimer = 0
                Wait(1000)
            end
        else
            effectTimer = 0
            Wait(2000)
        end
    end
end)
