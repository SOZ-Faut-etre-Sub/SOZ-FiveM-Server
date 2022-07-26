local VehicleCategoriesMenu = MenuV:CreateMenu(nil, "Veuillez choisir un hélicoptère", "menu_shop_vehicle_car", "soz", "shop:vehicle:helicopter")
local VehiclesMenu = MenuV:InheritMenu(VehicleCategoriesMenu, {Title = nil})
local ChooseVehicleMenu = MenuV:InheritMenu(VehiclesMenu, {Title = nil})

local selectedCategory = {}
local selectedVehicle = {}
local isInsideConcess = false
local dealerId = "air"
local licenseTypeRequired = "heli"
local dealer = Config.Shops[dealerId]

local dealerZones = {
    ["sandy_concess_air"] = BoxZone:Create(vector3(1732.15, 3308.31, 41.22), 23.8, 27.8, {
        name = "sandy_concess_air",
        heading = 15,
        minZ = 40.22,
        maxZ = 44.22,
    }),
}

local filteredCategories = {}
for k, vehicle in pairs(QBCore.Shared.Vehicles) do
    local category = vehicle["category"]
    for cat, _ in pairs(dealer.Categories) do
        if cat == category then
            if filteredCategories[category] == nil then
                filteredCategories[category] = {}
            end
            filteredCategories[category][k] = vehicle
        end
    end
end

local function clean()
    local coords = dealer.VehicleSpawn.xyz
    local stillThere = true
    while stillThere do
        local closestVehicle = QBCore.Functions.GetClosestVehicle(coords)
        if #(coords - GetEntityCoords(closestVehicle)) <= 3.0 then
            SetEntityAsMissionEntity(closestVehicle, true, true)
            DeleteVehicle(closestVehicle)
        else
            stillThere = false
        end
    end
end

local function previsualizeVehicle(vehicle)
    local model = GetHashKey(vehicle["model"])
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end
    TriggerEvent("soz-dealer:air:client:createcam", "")
    local dealerSpawnPos = dealer.VehicleSpawn
    local createdVehicle = CreateVehicle(model, dealerSpawnPos.x, dealerSpawnPos.y, dealerSpawnPos.z, dealerSpawnPos.w, false, false)
    SetModelAsNoLongerNeeded(model)
    SetVehicleOnGroundProperly(createdVehicle)
    SetEntityInvincible(createdVehicle, true)
    SetVehicleDoorsLocked(createdVehicle, 6)
    FreezeEntityPosition(createdVehicle, true)
    SetVehicleNumberPlateText(createdVehicle, "SOZ")
    Citizen.CreateThread(function()
        while true do
            Citizen.Wait(0)
            if IsControlPressed(0, 176) or IsControlPressed(0, 177) then
                TriggerEvent("soz-concess:client:deletecam", "")
                clean()
                break
            end
        end
    end)
end

ChooseVehicleMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = selectedVehicle.name})
    menu:AddButton({
        icon = "◀",
        label = selectedCategory[1],
        value = VehiclesMenu,
        description = "Choisir un autre modèle",
        select = function()
            menu:Close()
        end,
    })
    local displayName = GetDisplayNameFromVehicleModel(selectedVehicle["hash"])
    local vehicleLabelText = selectedVehicle["name"]
    menu:AddButton({
        label = "Acheter " .. vehicleLabelText,
        rightLabel = "💸 " .. selectedVehicle["price"] .. "$",
        description = "Confirmer l'achat",
        select = function()
            menu:Close()
            VehiclesMenu:Close()
            VehicleCategoriesMenu:Close()
            TriggerServerEvent("soz-concess:server:buyShowroomVehicle", dealerId, selectedVehicle["model"], displayName:lower())
        end,
    })
end)

ChooseVehicleMenu:On("close", function()
    ChooseVehicleMenu:ClearItems()
end)

VehiclesMenu:On("open", function(menu)
    local currentCategory = selectedCategory[1]
    local vehiclesStock = QBCore.Functions.TriggerRpc("soz-concess:server:getstock", currentCategory)
    menu:ClearItems()
    local vehicles = {}
    for _, vehCategory in pairs(selectedCategory[2]) do
        table.insert(vehicles, vehCategory)
    end
    table.sort(vehicles, function(vehA, vehB)
        return vehA["price"] < vehB["price"]
    end)
    menu:AddTitle({label = currentCategory})
    menu:AddButton({
        icon = "◀",
        label = "Catégories",
        value = VehicleCategoriesMenu,
        description = "Choisir une autre catégorie",
        select = function()
            menu:Close()
        end,
    })
    for k, vehicle in pairs(vehicles) do
        local vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(vehicle["hash"]))
        for _, vehicleInStock in pairs(vehiclesStock) do
            if vehicle.model == vehicleInStock.model then
                if vehicleInStock.stock == 0 then
                    menu:AddButton({
                        label = "^9" .. vehicleName,
                        rightLabel = "💸 " .. vehicle["price"] .. "$",
                        description = "❌ HORS STOCK de " .. vehicleName,
                        enter = function()
                            clean()
                            previsualizeVehicle(vehicle)
                        end,
                    })
                elseif vehicleInStock.stock == 1 then
                    menu:AddButton({
                        label = "~o~" .. vehicleName,
                        rightLabel = "💸 " .. vehicle["price"] .. "$",
                        value = ChooseVehicleMenu,
                        description = "⚠ Stock limité de  " .. vehicleName,
                        select = function()
                            selectedVehicle = vehicle
                        end,
                        enter = function()
                            clean()
                            previsualizeVehicle(vehicle)
                        end,
                    })
                else
                    menu:AddButton({
                        label = vehicleName,
                        rightLabel = "💸 " .. vehicle["price"] .. "$",
                        value = ChooseVehicleMenu,
                        description = "Acheter  " .. vehicleName,
                        select = function()
                            selectedVehicle = vehicle
                        end,
                        enter = function()
                            clean()
                            previsualizeVehicle(vehicle)
                        end,
                    })
                end
            end
        end
    end
end)

VehiclesMenu:On("close", function()
    VehiclesMenu:ClearItems()
end)

VehicleCategoriesMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Catégories"})
    for categoryKey, vehicleList in pairs(filteredCategories) do
        menu:AddButton({
            label = Config.Shops[dealerId].Categories[categoryKey],
            value = VehiclesMenu,
            description = "Nom de catégorie",
            select = function()
                selectedCategory = {categoryKey, vehicleList}
            end,
        })
    end
end)

VehicleCategoriesMenu:On("close", function()
    VehicleCategoriesMenu:ClearItems()
    clean()
    TriggerEvent("soz-concess:client:deletecam")
end)

RegisterNetEvent("soz-dealer:air:client:createcam", function()
    local dealerSpawnPos = dealer.VehicleSpawn
    local camPos = dealer.CameraPosition
    local cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", camPos.x, camPos.y, camPos.z, camPos.w, 0.00, 0.00, 60.00, false, 0)
    PointCamAtCoord(cam, dealerSpawnPos.x, dealerSpawnPos.y, dealerSpawnPos.z)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 1, true, true)
end)

for dealerIndex, dealerZone in pairs(dealerZones) do
    dealerZone:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            isInsideConcess = true
        else
            isInsideConcess = false
        end
    end)
end

exports["qb-target"]:SpawnPed({
    model = "s_m_m_autoshop_02",
    coords = dealer.PedPosition,
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
                event = "soz-dealer:air:client:Menu",
                icon = "c:concess/lister.png",
                label = "Liste Véhicules",
                canInteract = function()
                    local licenses = PlayerData.metadata["licences"]
                    return isInsideConcess and licenses ~= nil and licenses[licenseTypeRequired] > 0
                end,
                blackoutGlobal = true,
            },
        },
        distance = 2.5,
    },
})

RegisterNetEvent("soz-dealer:air:client:Menu", function()
    VehicleCategoriesMenu:Open()
end)

CreateThread(function()
    QBCore.Functions.CreateBlip("air_dealer", {
        name = Config.Shops[dealerId]["ShopLabel"],
        coords = Config.Shops[dealerId]["Location"],
        sprite = 64,
        color = 46,
    })
end)
