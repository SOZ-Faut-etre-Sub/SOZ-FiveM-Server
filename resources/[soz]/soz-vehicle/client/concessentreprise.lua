local SozJobCore = exports["soz-jobs"]:GetCoreObject()

local vehicleListMenu = MenuV:CreateMenu(nil, "Veuillez choisir un véhicule", "menu_shop_vehicle_car_society", "soz", "concessentre:vehicle:car")
local vehicleChooseMenu = MenuV:InheritMenu(vehicleListMenu)

local InsideConcessEntreprise = false
local selectedModel = {}

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
        data = {indexGarage = "ConcessEntreprise", vehicleType = "car"},
    }),
    ["entreprise2"] = BoxZone:Create(vector3(834.94, -3210.88, 5.9), 8, 6, {
        name = "entreprise2",
        heading = 180,
        minZ = 4.9,
        maxZ = 8.9,
        data = {indexGarage = "ConcessEntreprise", vehicleType = "car"},
    }),
    ["entreprise3"] = BoxZone:Create(vector3(807.41, -3208.19, 5.9), 12.8, 10.4, {
        name = "entreprise_air",
        heading = 46,
        minZ = 4.9,
        maxZ = 9.9,
        data = {indexGarage = "ConcessEntreprise", vehicleType = "air"},
    }),
}

local function TakeOutGarage(vehicle)
    local location, heading, availableSlots = nil, nil, 0
    for _, jobDealerSlot in pairs(PlacesConcessEntreprise) do
        if vehicle.data.category == jobDealerSlot.data.vehicleType then
            local vehiclesPool = GetGamePool("CVehicle")
            local inside = false
            for _, vehicle2 in ipairs(vehiclesPool) do
                if jobDealerSlot:isPointInside(GetEntityCoords(vehicle2)) then
                    inside = true
                end
            end
            if inside == false then
                availableSlots = availableSlots + 1
                location = jobDealerSlot:getBoundingBoxCenter()
                heading = jobDealerSlot:getHeading()
            end
        end
    end
    local newlocation = vec4(location.x, location.y, location.z, heading)
    if availableSlots == 0 then
        exports["soz-hud"]:DrawNotification("Déjà une voiture sur une des sorties", "primary", 4500)
    else
        TriggerServerEvent("soz-concessentreprise:server:buyShowroomVehicle", vehicle.model, newlocation)
    end
end

vehicleListMenu:On("open", function(m)
    local listVehicles = QBCore.Functions.TriggerRpc("soz-concessentreprise:server:getAvailableVehicles")

    m:ClearItems()
    for vehicleModel, model in pairs(listVehicles) do
        local vehicleName = model
        if model.job_name then
            vehicleName = decode_json(model.job_name)[PlayerData.job.id]
        end

        m:AddButton({
            label = vehicleName,
            rightLabel = "💸 " .. model.price .. "$",
            value = vehicleChooseMenu,
            description = "Acheter  " .. vehicleName,
            select = function()
                selectedModel = {model = vehicleModel, data = model}
            end,
        })
    end
end)

vehicleListMenu:On("close", function()
    vehicleListMenu:ClearItems()
end)

local function HasRequiredLicence(required_licence)

end

vehicleChooseMenu:On("open", function(m)
    m:ClearItems()
    local vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(selectedModel.model))
    m:AddButton({
        icon = "◀",
        label = "Retour",
        value = vehicleListMenu,
        description = "Choisir un autre modèle",
        select = function()
            vehicleChooseMenu:Close()
        end,
    })
    m:AddButton({
        label = "Acheter " .. vehicleName,
        description = "Confirmer l'achat",
        select = function()
            local licences = PlayerData.metadata["licences"]
            local hasLicence = licences ~= nil and licences[required_licence] > 0
            if hasLicence then
                vehicleChooseMenu:Close()
                vehicleListMenu:Close()
                TakeOutGarage(selectedModel)
            else
                exports["soz-hud"]:DrawNotification("Vous n'avez pas le permis pour ce véhicule.", "error")
            end
        end,
    })
end)

vehicleChooseMenu:On("close", function()
    vehicleChooseMenu:ClearItems()
end)

for _, ConcessEntreprise in pairs(ZonesConcessEntreprise) do
    ConcessEntreprise:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            InsideConcessEntreprise = true
        else
            InsideConcessEntreprise = false
            vehicleChooseMenu:Close()
            vehicleListMenu:Close()
        end
    end)
end

RegisterNetEvent("soz-concessentreprise:checkGrade", function()
    if SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.SocietyDealershipVehicle) then
        vehicleListMenu:Open()
    else
        exports["soz-hud"]:DrawNotification("Vous n'avez pas les droits d'accéder au concessionnaire", "error")
    end
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
                icon = "c:dealership/list.png",
                label = "Liste Véhicules",
                canInteract = function()
                    if OnDuty == false then
                        return false
                    end
                    return InsideConcessEntreprise
                end,
                blackoutGlobal = true,
            },
        },
        distance = 2.5,
    },
})

RegisterNetEvent("soz-concessentreprise:client:buyShowroomVehicle", function(vehicle, plate, newlocation)
    local liverytype = QBCore.Functions.TriggerRpc("soz-concessentreprise:server:getLiveryType", vehicle)
    QBCore.Functions.SpawnVehicle(vehicle, function(veh)
        TaskWarpPedIntoVehicle(PlayerPedId(), veh, -1)
        SetFuel(veh, 100)
        SetVehicleLivery(veh, liverytype.liverytype)
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
