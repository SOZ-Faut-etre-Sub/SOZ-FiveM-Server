local QBCore = exports["qb-core"]:GetCoreObject()

PlacesConcessEntreprise = {
    ["entreprise1"] = BoxZone:Create(vector3(827.31, -3210.51, 5.9), 8, 6, {
        name = "entreprise1",
        heading = 180,
        minZ = 4.9,
        maxZ = 8.9,
    }),
    ["entreprise2"] = BoxZone:Create(vector3(834.94, -3210.88, 5.9), 8, 6, {
        name = "entreprise2",
        heading = 180,
        minZ = 4.9,
        maxZ = 8.9,
    }),
}

local VehiculeModel = MenuV:CreateMenu(nil, "Veuillez choisir un véhicule", "menu_shop_vehicle_car", "soz", "concessentre:vehicle:car")
local VehiculeChoose = MenuV:InheritMenu(VehiculeModel, {Title = nil})

local function TakeOutGarage(vehicule)
    local location
    local heading
    local placedispo = 0
    for _, entreprisepar in pairs(PlacesConcessEntreprise) do
        local vehicles2 = GetGamePool("CVehicle")
        local inside = false
        for _, vehicle2 in ipairs(vehicles2) do
            if entreprisepar:isPointInside(GetEntityCoords(vehicle2)) then
                inside = true
            end
        end
        if inside == false then
            placedispo = placedispo + 1
            location = entreprisepar:getBoundingBoxCenter()
            heading = entreprisepar:getHeading()
        end
    end
    local newlocation = vec4(location.x, location.y, location.z, heading)
    if placedispo == 0 then
        exports["soz-hud"]:DrawNotification("Déjà une voiture sur une des sorties", "primary", 4500)
    else
        TriggerServerEvent("soz-concessentreprise:server:buyShowroomVehicle", vehicule, newlocation)
        exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_out"), "primary", 4500)
    end
end

local function ChooseCarModelsEntreMenu(model)
    VehiculeChoose:ClearItems()
    MenuV:OpenMenu(VehiculeChoose)
    VehiculeChoose:AddButton({
        icon = "◀",
        label = Config.GarageVehicles[model.vehicle],
        value = VehiculeModel,
        description = "Choisir un autre modèle",
        select = function()
            VehiculeChoose:Close()
        end,
    })
    VehiculeChoose:AddButton({
        label = "Acheter " .. Config.GarageVehicles[model.vehicle] .. " 💸 " .. model.price .. "$",
        value = model,
        description = "Confirmer l'achat",
        select = function()
            VehiculeChoose:Close()
            VehiculeModel:Close()
            TakeOutGarage(model)
        end,
    })
end

local function OpenCarModelsEntreMenu(VehiculeModel)
    VehiculeModel:ClearItems()
    QBCore.Functions.TriggerCallback("soz-concessentreprise:server:getconcessmodels", function(listconcessmodels)
        for _, model in pairs(listconcessmodels) do
            if model.job == PlayerJob.id then
                VehiculeModel:AddButton({
                    label = Config.GarageVehicles[model.vehicle],
                    value = model,
                    rightLabel = "💸 " .. model.price .. "$",
                    description = "Acheter  " .. Config.GarageVehicles[model.vehicle],
                    select = function()
                        ChooseCarModelsEntreMenu(model)
                    end,
                })
            end
        end
    end)
end

local function GenerateMenuEntreprise()
    if VehiculeModel.IsOpen then
        VehiculeModel:Close()
    else
        VehiculeModel:ClearItems()
        OpenCarModelsEntreMenu(VehiculeModel)
        VehiculeModel:Open()
    end
end

exports["qb-target"]:SpawnPed({
    model = "s_f_m_shop_high",
    coords = vector4(858.72, -3204.44, 4.99, 180.00),
    minusOne = false,
    freeze = true,
    invincible = true,
    blockevents = true,
    flag = 1,
    target = {
        options = {
            {
                type = "client",
                event = "soz-concessentreprise:client:Menu",
                icon = "fas fa-car",
                label = "Demander la liste des véhicules",
                targeticon = "fas fa-clipboard-list",
                action = function(entity)
                    if IsPedAPlayer(entity) then
                        return false
                    end
                    TriggerEvent("soz-concessentreprise:client:Menu", "")
                end,
                canInteract = function(entity)
                    if IsPedAPlayer(entity) then
                        return false
                    end
                    if ((PlayerJob.grade ~= 14) and (PlayerJob.grade ~= 16) and (PlayerJob.grade ~= 18) and (PlayerJob.grade ~= 20) and (PlayerJob.grade ~= 22) and
                        (PlayerJob.grade ~= 24) and (PlayerJob.grade ~= 26) and (PlayerJob.grade ~= 28) and (PlayerJob.grade ~= 30) and (PlayerJob.grade ~= 31) and
                        (PlayerJob.grade ~= 32) and (PlayerJob.grade ~= 38) and (PlayerJob.grade ~= 39) and (PlayerJob.grade ~= 40) and (PlayerJob.grade ~= 44) and
                        (PlayerJob.grade ~= 45) and (PlayerJob.grade ~= 48)) or OnDuty == false then
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

RegisterNetEvent("soz-concessentreprise:client:Menu", function()
    GenerateMenuEntreprise()
end)

RegisterNetEvent("soz-concessentreprise:client:buyShowroomVehicle", function(vehicle, plate, newlocation)
    QBCore.Functions.SpawnVehicle(vehicle, function(veh)
        TaskWarpPedIntoVehicle(PlayerPedId(), veh, -1)
        SetFuel(veh, 100)
        SetVehicleNumberPlateText(veh, plate)
        SetEntityAsMissionEntity(veh, true, true)
        TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
        TriggerServerEvent("qb-vehicletuning:server:SaveVehicleProps", QBCore.Functions.GetVehicleProperties(veh))
    end, newlocation, true)
end)

CreateThread(function()
    local DealerEnter = AddBlipForCoord(vector3(858.72, -3204.44, 5.99))
    SetBlipSprite(DealerEnter, 326)
    SetBlipDisplay(DealerEnter, 4)
    SetBlipScale(DealerEnter, 0.8)
    SetBlipAsShortRange(DealerEnter, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("Concess Entreprise")
    EndTextCommandSetBlipName(DealerEnter)
end)
