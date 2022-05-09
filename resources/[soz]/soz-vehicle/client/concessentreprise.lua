InsideConcessEntreprise = false
ModelVariable = {}

ZonesConcessEntreprise = {
    ["ConcessEntreprise"] = BoxZone:Create(vector3(858.83, -3207.03, 5.9), 10, 10, {
        name = "ConcessEntreprise_z",
        heading = 0,
        minZ = 4.9,
        maxZ = 8.9,
    }),
}

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

local VehiculeModel = MenuV:CreateMenu(nil, "Veuillez choisir un véhicule", "menu_shop_vehicle_car_society", "soz", "concessentre:vehicle:car")
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

VehiculeChoose:On("open", function(m)
    m:ClearItems()
    local vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(ModelVariable.vehicle))
    m:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeModel,
        description = "Choisir un autre modèle",
        select = function()
            VehiculeChoose:Close()
        end,
    })
    m:AddButton({
        label = "Acheter " .. vehicleName,
        rightLabel = "💸 " .. ModelVariable.price .. "$",
        description = "Confirmer l'achat",
        select = function()
            VehiculeChoose:Close()
            VehiculeModel:Close()
            TakeOutGarage(ModelVariable)
        end,
    })
end)

VehiculeModel:On("open", function(m)
    local listconcessmodels = QBCore.Functions.TriggerRpc("soz-concessentreprise:server:getconcessmodels")
    m:ClearItems()
    for _, model in pairs(listconcessmodels) do
        if model.job == PlayerJob.id then
            local vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(model.vehicle))
            m:AddButton({
                label = vehicleName,
                rightLabel = "💸 " .. model.price .. "$",
                value = VehiculeChoose,
                description = "Acheter  " .. vehicleName,
                select = function()
                    ModelVariable = model
                end,
            })
        end
    end
end)

for indexConcessEntreprise, ConcessEntreprise in pairs(ZonesConcessEntreprise) do
    ConcessEntreprise:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            InsideConcessEntreprise = true
        else
            InsideConcessEntreprise = false
        end
    end)
end

RegisterNetEvent("soz-concessentreprise:checkGrade", function()
    QBCore.Functions.TriggerCallback("soz-concessentreprise:server:getGrade", function(listejobgrades)
        for _, job in ipairs(listejobgrades) do
            if job.id == PlayerJob.grade then
                if job.owner == 1 then
                    VehiculeModel:Open()
                else
                    exports["soz-hud"]:DrawNotification("Vous n'êtes pas patron de votre entreprise", "error")
                end
            end
        end
    end)
end)

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
                event = "soz-concessentreprise:checkGrade",
                icon = "c:concess/lister.png",
                label = "Liste Véhicules",
                action = function()
                    TriggerEvent("soz-concessentreprise:checkGrade")
                end,
                canInteract = function()
                    if OnDuty == false then
                        return false
                    end
                    return InsideConcessEntreprise
                end,
            },
        },
        distance = 2.5,
    },
})

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
    QBCore.Functions.CreateBlip("concess_entreprise", {
        name = "Concess Entreprise",
        coords = vector3(858.72, -3204.44, 5.99),
        sprite = 821,
    })
end)
