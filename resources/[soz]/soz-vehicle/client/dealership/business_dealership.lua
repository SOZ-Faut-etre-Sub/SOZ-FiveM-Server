local SozJobCore = exports["soz-jobs"]:GetCoreObject()

local vehicleListMenu = MenuV:CreateMenu(nil, "Veuillez choisir un véhicule", "menu_shop_vehicle_car_society", "soz", "concessentre:vehicle:car")
local vehicleChooseMenu = MenuV:InheritMenu(vehicleListMenu)

local insideBusinessDealership = false
local selectedModel = {}

local businessDealershipZone = {
    BoxZone:Create(vector3(858.83, -3207.03, 5.9), 10, 10, {
        name = "business_dealership",
        heading = 0,
        minZ = 4.9,
        maxZ = 8.9,
    }),
}

local businessDealershipParkingSpots = {
    BoxZone:Create(vector3(827.31, -3210.51, 5.9), 8, 6, {
        name = "entreprise1",
        heading = 180,
        minZ = 4.9,
        maxZ = 8.9,
        data = {
            indexGarage = "business_dealership",
            vehicleTypes = {car = true, bike = true, motorcycle = true, truck = true},
        },
    }),
    BoxZone:Create(vector3(834.94, -3210.88, 5.9), 8, 6, {
        name = "entreprise2",
        heading = 180,
        minZ = 4.9,
        maxZ = 8.9,
        data = {
            indexGarage = "business_dealership",
            vehicleTypes = {car = true, bike = true, motorcycle = true, truck = true},
        },
    }),
    BoxZone:Create(vector3(807.41, -3208.19, 5.9), 12.8, 10.4, {
        name = "entreprise_air",
        heading = 46,
        minZ = 4.9,
        maxZ = 9.9,
        data = {indexGarage = "business_dealership", vehicleTypes = {heli = true}},
    }),
}

local function TakeOutGarage(vehicle)
    local location, heading, availableSlots = nil, nil, 0
    for _, jobDealerSlot in pairs(businessDealershipParkingSpots) do
        if jobDealerSlot.data.vehicleTypes[vehicle.data.required_licence] then
            local vehiclesPool = GetGamePool("CVehicle")
            local inside = false
            for _, vehicleFromPool in ipairs(vehiclesPool) do
                if jobDealerSlot:isPointInside(GetEntityCoords(vehicleFromPool)) then
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
    if availableSlots == 0 then
        exports["soz-hud"]:DrawNotification("Aucune place disponible pour ce véhicule.", "primary", 4500)
    else
        local newLocation = vec4(location.x, location.y, location.z, heading)
        TriggerServerEvent("soz-concessentreprise:server:buyShowroomVehicle", vehicle.model, newLocation)
    end
end

vehicleListMenu:On("open", function(m)
    local listVehicles = QBCore.Functions.TriggerRpc("soz-concessentreprise:server:getAvailableVehicles")

    m:ClearItems()
    for vehicleModel, vehicle in pairs(listVehicles) do
        local vehicleName = vehicle.name
        if vehicle.job_name and vehicle.job_name[PlayerData.job.id] then
            vehicleName = decode_json(vehicle.job_name)[PlayerData.job.id]
        end

        m:AddButton({
            label = vehicleName,
            rightLabel = "💸 $" .. QBCore.Shared.GroupDigits(vehicle.price),
            value = vehicleChooseMenu,
            description = "Acheter  " .. vehicleName,
            select = function()
                selectedModel = {model = vehicleModel, data = vehicle}
            end,
        })
    end
end)

vehicleListMenu:On("close", function()
    vehicleListMenu:ClearItems()
end)

vehicleChooseMenu:On("open", function(m)
    m:ClearItems()
    local vehicleName = selectedModel.data.name
    if selectedModel.data.job_name and selectedModel.data.job_name[PlayerData.job.id] then
        vehicleName = decode_json(selectedModel.data.job_name)[PlayerData.job.id]
    end
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
            local hasLicence = licences ~= nil and licences[selectedModel.data.required_licence] > 0
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

for _, businessDealership in pairs(businessDealershipZone) do
    businessDealership:onPlayerInOut(function(isPointInside)
        if isPointInside then
            insideBusinessDealership = true
        else
            insideBusinessDealership = false
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
                    return PlayerData.job.onduty and insideBusinessDealership
                end,
                blackoutGlobal = true,
            },
        },
        distance = 2.5,
    },
})

RegisterNetEvent("soz-concessentreprise:client:buyShowroomVehicle", function(vehicle, plate, newLocation)
    local liverytype = QBCore.Functions.TriggerRpc("soz-concessentreprise:server:getLiveryType", vehicle)
    QBCore.Functions.SpawnVehicle(vehicle, function(veh)
        TaskWarpPedIntoVehicle(PlayerPedId(), veh, -1)
        SetFuel(veh, 100)
        SetVehicleLivery(veh, liverytype)
        SetVehicleNumberPlateText(veh, plate)
        SetEntityAsMissionEntity(veh, true, true)
        TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
        TriggerServerEvent("qb-vehicletuning:server:SaveVehicleProps", QBCore.Functions.GetVehicleProperties(veh))
    end, newLocation, true)
end)

CreateThread(function()
    QBCore.Functions.CreateBlip("business_dealership", {
        name = "Concessionnaire Entreprise",
        coords = vector3(858.72, -3204.44, 5.99),
        sprite = 821,
    })
end)
