QBCore = exports["qb-core"]:GetCoreObject()
Gready = false
Gfinishready = false
Gveh = nil
Gped = nil
Gcoords = nil
Gdict = nil
Gmodel = nil
Goffset = nil
Gheadin = nil
Gvehicle = nil
Gvehpos = nil
Gvehjack = nil

function GetCurrentMod(id)
    local mod = GetVehicleMod(Config.AttachedCustomVehicle, id)
    local modName = GetLabelText(GetModTextLabel(Config.AttachedCustomVehicle, id, mod))

    return mod, modName
end

function GetCurrentTurboState()
    local isEnabled = IsToggleModOn(Config.AttachedCustomVehicle, 18)

    if isEnabled then
        return 1
    else
        return 0
    end
end

function CheckValidMods(category, id)
    local tempMod = GetVehicleMod(Config.AttachedCustomVehicle, id)
    local validMods = {}
    local amountValidMods = 0
    local hornNames = {}
    local modAmount = GetNumVehicleMods(Config.AttachedCustomVehicle, id)

    for i = 1, modAmount do
        local label = GetModTextLabel(Config.AttachedCustomVehicle, id, (i - 1))
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
    if categoryID == 18 then
        ToggleVehicleMod(Config.AttachedCustomVehicle, categoryID, modID)
    else
        SetVehicleMod(Config.AttachedCustomVehicle, categoryID, modID)
    end
    if (Config.AttachedCustomVehicle ~= nil) then
        local vehExtraData = QBCore.Functions.GetVehicleProperties(Config.AttachedCustomVehicle)
        QBCore.Functions.TriggerRpc("soz-garage:server:UpdateVehicleMods", NetworkGetNetworkIdFromEntity(Config.AttachedCustomVehicle), vehExtraData)
    end
end)

local function finishAnimation()
    Gdict = "move_crawl"
    local coords2 = GetEntityCoords(Gped)
    RequestAnimDict(Gdict)
    while not HasAnimDictLoaded(Gdict) do
        Citizen.Wait(1)
    end
    TaskPlayAnimAdvanced(Gped, Gdict, "onback_fwd", coords2, 0.0, 0.0, Gheadin - 180, 1.0, 0.5, 2000, 1, 0.0, 1, 1)
    Citizen.Wait(3000)
    Gdict = "mp_car_bomb"
    RequestAnimDict(Gdict)
    while not HasAnimDictLoaded(Gdict) do
        Citizen.Wait(1)
    end

    FreezeEntityPosition(Gveh, true)
    SetVehicleUndriveable(Gvehicle, false)
    SetVehicleEngineOn(Gvehicle, true, true)
    ClearPedTasksImmediately(PlayerPedId())

    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1250, 1, 0.0, 1, 1)
    Citizen.Wait(1250)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.4, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.3, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.2, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.15, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.1, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.05, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.025, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Gdict = "move_crawl"
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.01, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z, true, true, true)
    FreezeEntityPosition(Gveh, false)
    Citizen.Wait(100)
    DetachEntity(Gvehjack, true, false)
    DeleteEntity(Gvehjack)

    Gfinishready = false
    exports["soz-hud"]:DrawNotification("Véhicule libéré")
end

local VehicleOptions = MenuV:CreateMenu(nil, "LS Customs", "menu_shop_lscustoms", "soz", "custom:vehicle:options")
local Upgrade = MenuV:InheritMenu(VehicleOptions, "Upgrade")
local UpgradeMenu = MenuV:InheritMenu(VehicleOptions, "Upgrade Menu")

function GenerateUpgradeMenu(k, v)
    local menu = UpgradeMenu

    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = Upgrade,
        select = function()
            menu:Close()
        end,
    })

    local validMods, amountValidMods = CheckValidMods(v.category, v.id)
    local currentMod, _ = GetCurrentMod(v.id)

    local vehicleHash = GetEntityModel(Config.AttachedCustomVehicle)
    local vehiclePrice = QBCore.Functions.TriggerRpc("soz-vehicle:server:GetPriceOfVehicleByHash", vehicleHash)

    if amountValidMods <= 0 and v.id ~= 18 then
        return
    end

    if v.id == 11 or v.id == 12 or v.id == 13 or v.id == 15 or v.id == 16 then -- Performance
        local tempNum = 0
        for m, n in pairs(validMods) do
            tempNum = tempNum + 1

            local price = 0
            for _, customprice in ipairs(Config.vehicleCustomisationPricesCustom) do
                if v.id == customprice.id then
                    price = math.ceil(customprice.prices[tempNum] * vehiclePrice)
                end
            end

            if Config.maxVehiclePerformanceUpgrades == 0 then
                if currentMod == n.id then
                    menu:AddButton({label = n.name, rightLabel = "~g~Installé"})
                else
                    menu:AddButton({
                        label = n.name,
                        rightLabel = "💸 " .. price .. "$",
                        description = "Acheter 💸",
                        select = function()
                            menu:Close()
                            TriggerServerEvent("soz-custom:server:buyupgrade", v.id, n, price, QBCore.Functions.GetPlate(Config.AttachedCustomVehicle))
                        end,
                    })
                end
            else
                if tempNum <= (Config.maxVehiclePerformanceUpgrades + 1) then
                    if currentMod == n.id then
                        menu:AddButton({label = n.name, rightLabel = "~g~Installé"})
                    else
                        menu:AddButton({
                            label = n.name,
                            rightLabel = "💸 " .. price .. "$",
                            description = "Acheter 💸",
                            select = function()
                                menu:Close()
                                TriggerServerEvent("soz-custom:server:buyupgrade", v.id, n, price, QBCore.Functions.GetPlate(Config.AttachedCustomVehicle))
                            end,
                        })
                    end
                end
            end
        end
    elseif v.id == 18 then
        local currentTurboState = GetCurrentTurboState()
        if currentTurboState == 0 then
            for _, customprice in ipairs(Config.vehicleCustomisationPricesCustom) do
                if customprice.id == v.id then
                    local price = math.ceil(customprice.prices[1] * vehiclePrice)
                    menu:AddButton({label = "Désactiver", rightLabel = "~g~Installé"})
                    menu:AddButton({
                        label = "Activer",
                        rightLabel = "💸 " .. price .. "$",
                        description = "Acheter 💸",
                        select = function()
                            menu:Close()
                            TriggerServerEvent("soz-custom:server:buyupgrade", v.id, 1, price, QBCore.Functions.GetPlate(Config.AttachedCustomVehicle))
                        end,
                    })
                end
            end
        else
            menu:AddButton({
                label = "Désactiver",
                description = "Gratuit 💸",
                select = function()
                    menu:Close()
                    TriggerEvent("soz-custom:client:applymod", v.id, 0)
                    exports["soz-hud"]:DrawNotification("Le turbo a été enlevé!")
                end,
            })
            menu:AddButton({label = "Activer", rightLabel = "~g~Installé"})
        end
    end

    menu:Open()
end

Upgrade:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleCustomisationCustom) do
        local _, amountValidMods = CheckValidMods(v.category, v.id)
        if amountValidMods > 0 or (v.id == 18 and GetVehicleClass(Config.AttachedCustomVehicle) ~= 13) then
            menu:AddButton({
                label = v.category,
                select = function()
                    GenerateUpgradeMenu(k, v)
                end,
            })
        end
    end
end)

VehicleOptions:On("open", function(menu)
    menu:ClearItems()
    local veh = Config.AttachedCustomVehicle
    FreezeEntityPosition(veh, true)
    menu:AddButton({
        icon = "◀",
        label = "Libérer le véhicule",
        description = "Détacher le véhicule de la plateforme",
        select = function()
            if Gready == true then
                TriggerEvent("soz-custom:client:UnattachVehicle")
                Gfinishready = true
                Gready = false
                menu:Close()
                finishAnimation()
                SetVehicleDoorsLocked(veh, 1)
                Gfinishready = false
            else
                exports["soz-hud"]:DrawNotification("Veuillez attendre de monter le cric avant de le redescendre", "error")
            end
        end,
    })
    menu:AddButton({
        label = "Amélioration du véhicule",
        value = Upgrade,
        description = "Améliorer les pièces du véhicule",
        select = function()
            SetVehicleModKit(veh, 0)
        end,
    })
end)

VehicleOptions:On("close", function(menu)
    menu:ClearItems()
    if Gready == false and Gfinishready == false then
        exports["soz-hud"]:DrawNotification("Veuillez libérer le véhicule avant de partir", "error")
        VehicleOptions:Open()
    elseif Gready == true then
        VehicleOptions:Open()
    else
        VehicleOptions:Close()
    end
end)

local function UnattachVehicle()
    FreezeEntityPosition(Config.AttachedCustomVehicle, false)
    Config.AttachedCustomVehicle = nil
end

-- Events
RegisterNetEvent("soz-custom:client:UnattachVehicle", function()
    UnattachVehicle()
end)

RegisterNetEvent("soz-custom:client:SetAttachedVehicle", function(veh)
    if veh ~= false then
        Config.AttachedCustomVehicle = veh
    else
        Config.AttachedCustomVehicle = nil
    end
end)

local function startAnimation()
    local veh = Config.AttachedCustomVehicle
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local dict
    local model = "prop_carjack"
    local offset = GetOffsetFromEntityInWorldCoords(ped, 0.0, -2.0, 0.0)
    local headin = GetEntityHeading(ped)

    local vehicle = veh
    FreezeEntityPosition(veh, true)
    local vehpos = GetEntityCoords(veh)
    dict = "mp_car_bomb"
    RequestAnimDict(dict)
    RequestModel(model)
    while not HasAnimDictLoaded(dict) or not HasModelLoaded(model) do
        Citizen.Wait(1)
    end
    local vehjack = CreateObject(GetHashKey(model), vehpos.x, vehpos.y, vehpos.z - 0.5, true, true, true)
    AttachEntityToEntity(vehjack, veh, 0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, false, false, false, false, 0, true)

    VehicleOptions:Open()
    TaskTurnPedToFaceEntity(ped, veh, 500)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1250, 1, 0.0, 1, 1)
    Citizen.Wait(1250)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.01, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.025, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.05, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.1, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.15, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.2, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.3, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    dict = "move_crawl"
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.4, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.5, true, true, true)
    TaskPedSlideToCoord(ped, offset, headin, 1000)
    Citizen.Wait(1000)

    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Citizen.Wait(100)
    end
    TaskPlayAnimAdvanced(ped, dict, "onback_bwd", coords, 0.0, 0.0, headin - 180, 1.0, 0.5, 3000, 1, 0.0, 1, 1)
    dict = "amb@world_human_vehicle_mechanic@male@base"
    Citizen.Wait(1000)
    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Citizen.Wait(1)
    end

    Gveh = veh
    FreezeEntityPosition(Gveh, true)
    while Gfinishready == false do
        TaskPlayAnim(ped, dict, "base", 8.0, -8.0, 710, 1, 0, false, false, false)
        Citizen.Wait(700)
        Gveh = veh
        Gped = ped
        Gcoords = coords
        Gdict = dict
        Gheadin = headin
        Gvehicle = vehicle
        Gvehpos = vehpos
        Gvehjack = vehjack
        Gready = true
    end
end

AddEventHandler("QBCore:Client:OnPlayerLoaded", function()
    CreateThread(function()
        for k, v in pairs(Config.lscustom) do
            if v.blip then
                QBCore.Functions.CreateBlip("custom_" .. k, {
                    name = "LS Custom",
                    coords = vector3(v.coords.x, v.coords.y, v.coords.z),
                    sprite = 72,
                    color = 46,
                })
            end
        end
    end)
end)

Insidecustom = false
for int = 1, 5 do
    lszones[int]:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            Insidecustom = true
        else
            Insidecustom = false
            VehicleOptions:Close()
            Config.AttachedCustomVehicle = nil
        end
    end)
end

CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                type = "client",
                icon = "c:mechanic/Ameliorer.png",
                label = "Améliorer",
                action = function(entity)
                    if Config.AttachedCustomVehicle == nil then
                        QBCore.Functions.TriggerCallback("soz-garage:server:UpdateVehicleProperties", function(success)
                            Config.AttachedCustomVehicle = entity
                            Gfinishready = false
                            Gready = false
                            SetVehicleDoorsLocked(entity, 2)
                            startAnimation()
                        end, NetworkGetNetworkIdFromEntity(entity))
                    else
                        QBCore.Functions.TriggerCallback("soz-garage:server:UpdateVehicleProperties", function(success)
                            SetVehicleDoorsLocked(entity, 2)
                            VehicleOptions:Open()
                        end, NetworkGetNetworkIdFromEntity(entity))
                    end
                end,
                canInteract = function()
                    return Insidecustom
                end,
                blackoutGlobal = true,
            },
        },
        distance = 3.0,
    })
end)
