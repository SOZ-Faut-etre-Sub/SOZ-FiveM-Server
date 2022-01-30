local QBCore = exports["qb-core"]:GetCoreObject()

local VehiculeList = MenuV:CreateMenu(nil, "Veuillez choisir un véhicule", "menu_shop_vehicle_car", "soz", "shop:vehicle:car")
local VehiculeModel = MenuV:InheritMenu(VehiculeList, {Title = nil})
local VehiculeChoose = MenuV:InheritMenu(VehiculeModel, {Title = nil})

local vehicles = {}
for k, voiture in pairs(QBCore.Shared.Vehicles) do
    local category = voiture["category"]
    for cat, _ in pairs(Config.Shops["pdm"]["Categories"]) do
        if cat == category then
            if vehicles[category] == nil then
                vehicles[category] = {}
            end
            vehicles[category][k] = voiture
        end
    end
end

local veh
local function CarModels(vehicule)

    local voiture = vehicule
    local model = GetHashKey(voiture["model"])
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end
    TriggerEvent("soz-concess:client:createcam", "")
    veh = CreateVehicle(model, -46.64, -1097.53, 25.44, false, false)
    SetModelAsNoLongerNeeded(model)
    SetVehicleOnGroundProperly(veh)
    SetEntityInvincible(veh, true)
    SetEntityHeading(veh, 26.42)
    SetVehicleDoorsLocked(veh, 6)
    FreezeEntityPosition(veh, true)
    SetVehicleNumberPlateText(veh, "SOZ")
    Citizen.CreateThread(function()
        while true do
            Citizen.Wait(0)
            if IsControlPressed(0, 176) or IsControlPressed(0, 177) then
                TriggerEvent("soz-concess:client:deletecam", "")
                DeleteVehicle(veh)
                break
            end
        end
    end)
end

local function ChooseCarModelsMenu(vehicule)
    VehiculeChoose:ClearItems()
    MenuV:OpenMenu(VehiculeChoose)
    local voiture = vehicule
    VehiculeChoose:AddButton({
        icon = "◀",
        label = voiture["name"],
        value = VehiculeModel,
        description = "Choisir un autre modèle",
        select = function()
            VehiculeChoose:Close()
        end,
    })
    VehiculeChoose:AddButton({
        label = "Acheter " .. voiture["name"] .. " 💸 " .. voiture["price"] .. "$",
        value = voiture,
        description = "Confirmer l'achat",
        select = function()
            VehiculeChoose:Close()
            VehiculeModel:Close()
            VehiculeList:Close()
            TriggerServerEvent("soz-concess:server:buyShowroomVehicle", voiture["model"])
        end,
    })
end

local function OpenCarModelsMenu(category)
    VehiculeModel:ClearItems()
    MenuV:OpenMenu(VehiculeModel)
    local firstbutton = 0
    local vehicules = {}
    for _, voiture in pairs(category) do
        table.insert(vehicules, voiture)
    end
    table.sort(vehicules, function(vehiculeLhs, vehiculeRhs)
        return vehiculeLhs["price"] < vehiculeRhs["price"]
    end)
    VehiculeModel:On("switch", function(currentItem)
        DeleteVehicle(veh)
        CarModels(currentItem.Value)
    end)
    QBCore.Functions.TriggerCallback("soz-concess:server:getstock", function(vehiclestorage)
        for k, voiture in pairs(vehicules) do
            firstbutton = firstbutton + 1
            if firstbutton == 1 then
                VehiculeModel:AddButton({
                    icon = "◀",
                    label = voiture["category"],
                    value = VehiculeList,
                    description = "Choisir une autre catégorie",
                    select = function()
                        VehiculeModel:Close()
                    end,
                })
            end
            local newlabel = voiture["name"]
            for _, y in pairs(vehiclestorage) do
                if voiture.model == y.model then
                    if y.stock == 0 then
                        newlabel = "^9" .. voiture["name"]
                        VehiculeModel:AddButton({
                            label = newlabel,
                            value = voiture,
                            description = "❌ HORS STOCK de " .. voiture["name"] .. " 💸 " .. voiture["price"] .. "$",
                        })
                    elseif y.stock == 1 then
                        newlabel = "^o" .. voiture["name"]
                        VehiculeModel:AddButton({
                            label = newlabel,
                            value = voiture,
                            description = "⚠ Stock limité de  " .. voiture["name"] .. " 💸 " .. voiture["price"] .. "$",
                            select = function(btn)
                                local select = btn.Value
                                ChooseCarModelsMenu(select)
                            end,
                        })
                    else
                        VehiculeModel:AddButton({
                            label = newlabel,
                            value = voiture,
                            description = "Acheter  " .. voiture["name"] .. " 💸 " .. voiture["price"] .. "$",
                            select = function(btn)
                                local select = btn.Value
                                ChooseCarModelsMenu(select)
                            end,
                        })

                    end
                end
            end

        end
    end)
end

local function VehiculePanel(menu)
    VehiculeList:ClearItems()
    for k, voiture in pairs(vehicles) do
        VehiculeList:AddButton({
            label = k,
            value = voiture,
            description = "Nom de catégorie",
            select = function(btn)
                local select = btn.Value
                OpenCarModelsMenu(select)
            end,
        })
    end
end

local function GenerateMenu()
    if VehiculeList.IsOpen then
        VehiculeList:Close()
    else
        VehiculeList:ClearItems()
        VehiculePanel(VehiculeList)
        VehiculeList:Open()
    end
end

RegisterNetEvent("soz-concess:client:createcam", function()
    local cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -53.69, -1094.83, 27.00, 216.5, 0.00, 0.00, 60.00, false, 0)
    PointCamAtCoord(cam, -46.64, -1097.53, 25.44)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 1, true, true)
    SetFocusPosAndVel(-53.69, -1094.83, 25.44, 0.0, 0.0, 0.0)
    DisplayHud(false)
    DisplayRadar(false)
end)

RegisterNetEvent("soz-concess:client:deletecam", function()
    RenderScriptCams(false)
    DestroyAllCams(true)
    SetFocusEntity(GetPlayerPed(PlayerId()))
    DisplayHud(true)
    DisplayRadar(true)
end)

exports["qb-target"]:SpawnPed({
    model = "s_m_m_autoshop_01",
    coords = vector4(-56.61, -1096.58, 25.42, 30.0),
    minusOne = false,
    freeze = true,
    invincible = true,
    blockevents = true,
    animDict = "abigail_mcs_1_concat-0",
    anim = "csb_abigail_dual-0",
    flag = 1,
    scenario = "WORLD_HUMAN_CLIPBOARD",
    target = {
        options = {
            {
                type = "client",
                event = "soz-concess:client:Menu",
                icon = "fas fa-car",
                label = "Demander la liste des véhicules",
                action = function(entity)
                    if IsPedAPlayer(entity) then
                        return false
                    end
                    TriggerEvent("soz-concess:client:Menu", "")
                end,
                canInteract = function(entity)
                    if IsPedAPlayer(entity) then
                        return false
                    end
                    return true
                end,
            },
        },
        distance = 2.5,
    },
    currentpednumber = 0,
})

RegisterNetEvent("soz-concess:client:Menu", function()
    GenerateMenu()
end)

RegisterNetEvent("soz-concess:client:buyShowroomVehicle", function(vehicle, plate)
    QBCore.Functions.SpawnVehicle(vehicle, function(veh)
        TaskWarpPedIntoVehicle(PlayerPedId(), veh, -1)
        -- SetFuel(veh, 100)
        SetVehicleNumberPlateText(veh, plate)
        SetEntityHeading(veh, 0)
        SetEntityAsMissionEntity(veh, true, true)
        -- TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
        TriggerServerEvent("qb-vehicletuning:server:SaveVehicleProps", QBCore.Functions.GetVehicleProperties(veh))
    end, Config.Shops["pdm"]["VehicleSpawn"], true)
end)

CreateThread(function()
    for k, magasin in pairs(Config.Shops) do
        if magasin.showBlip then
            local Dealer = AddBlipForCoord(Config.Shops[k]["Location"])
            SetBlipSprite(Dealer, 326)
            SetBlipDisplay(Dealer, 4)
            SetBlipScale(Dealer, 0.75)
            SetBlipAsShortRange(Dealer, true)
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentSubstringPlayerName(Config.Shops[k]["ShopLabel"])
            EndTextCommandSetBlipName(Dealer)
        end
    end
end)
