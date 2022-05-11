local VehiculeList = MenuV:CreateMenu(nil, "Veuillez choisir un véhicule", "menu_shop_vehicle_car", "soz", "shop:vehicle:car")
local VehiculeModel = MenuV:InheritMenu(VehiculeList, {Title = nil})
local VehiculeChoose = MenuV:InheritMenu(VehiculeModel, {Title = nil})

VehicleCategorie = {}
GlobalVehicle = {}
InsideConcess = false

ZonesConcessVehicule = {
    ["Concess"] = BoxZone:Create(vector3(-55.49, -1096.44, 26.92), 10, 10, {
        name = "Concess_z",
        heading = 340,
        minZ = 25.92,
        maxZ = 29.92,
    }),
}

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

local function clean()
    local vcoords = vector3(-46.64, -1097.53, 25.44)
    local stillthere = true
    while stillthere do
        local vehicles = QBCore.Functions.GetClosestVehicle(vcoords)
        if #(vcoords - GetEntityCoords(vehicles)) <= 2.0 then
            SetEntityAsMissionEntity(vehicles, true, true)
            DeleteVehicle(vehicles)
        else
            stillthere = false
        end
    end
end

local function CarModels(vehicule)
    local voiture = vehicule
    local model = GetHashKey(voiture["model"])
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end
    TriggerEvent("soz-concess:client:createcam", "")
    local veh = CreateVehicle(model, -46.64, -1097.53, 25.44, false, false)
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
                clean()
                break
            end
        end
    end)
end

VehiculeChoose:On("open", function(menu)
    clean()
    menu:ClearItems()
    local voiture = GlobalVehicle
    menu:AddTitle({label = voiture.name})
    menu:AddButton({
        icon = "◀",
        label = VehicleCategorie[1],
        value = VehiculeModel,
        description = "Choisir un autre modèle",
        select = function()
            menu:Close()
        end,
    })
    menu:AddButton({
        label = "Acheter " .. voiture["name"],
        rightLabel = "💸 " .. voiture["price"] .. "$",
        value = voiture,
        description = "Confirmer l'achat",
        select = function()
            menu:Close()
            VehiculeModel:Close()
            VehiculeList:Close()
            TriggerServerEvent("soz-concess:server:buyShowroomVehicle", "pdm", voiture["model"])
        end,
    })
end)

VehiculeModel:On("open", function(menu)
    local RpcCategorie = VehicleCategorie[1]
    local RPCVehiclestorage = QBCore.Functions.TriggerRpc("soz-concess:server:getstock", RpcCategorie)
    menu:ClearItems()
    local vehicules = {}
    for _, voiture in pairs(VehicleCategorie[2]) do
        table.insert(vehicules, voiture)
    end
    table.sort(vehicules, function(vehiculeLhs, vehiculeRhs)
        return vehiculeLhs["price"] < vehiculeRhs["price"]
    end)
    menu:AddTitle({label = RpcCategorie})
    menu:AddButton({
        icon = "◀",
        label = "Catégories",
        value = VehiculeList,
        description = "Choisir une autre catégorie",
        select = function()
            menu:Close()
        end,
    })
    for k, voiture in pairs(vehicules) do
        local newlabel = voiture["name"]
        for _, y in pairs(RPCVehiclestorage) do
            if voiture.model == y.model then
                if y.stock == 0 then
                    newlabel = "^9" .. voiture["name"]
                    menu:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. voiture["price"] .. "$",
                        description = "❌ HORS STOCK de " .. voiture["name"],
                        enter = function()
                            clean()
                            CarModels(voiture)
                        end,
                    })
                elseif y.stock == 1 then
                    newlabel = "~o~" .. voiture["name"]
                    menu:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. voiture["price"] .. "$",
                        value = VehiculeChoose,
                        description = "⚠ Stock limité de  " .. voiture["name"],
                        select = function()
                            GlobalVehicle = voiture
                        end,
                        enter = function()
                            clean()
                            CarModels(voiture)
                        end,
                    })
                else
                    menu:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. voiture["price"] .. "$",
                        value = VehiculeChoose,
                        description = "Acheter  " .. voiture["name"],
                        select = function()
                            GlobalVehicle = voiture
                        end,
                        enter = function()
                            clean()
                            CarModels(voiture)
                        end,
                    })
                end
            end
        end
    end
end)

VehiculeList:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Catégories"})
    for k, voiture in pairs(vehicles) do
        menu:AddButton({
            label = k,
            value = VehiculeModel,
            description = "Nom de catégorie",
            select = function()
                VehicleCategorie = {k, voiture}
            end,
        })
    end
end)

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

for indexConcess, Concess in pairs(ZonesConcessVehicule) do
    Concess:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            InsideConcess = true
        else
            InsideConcess = false
        end
    end)
end

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
                icon = "c:concess/lister.png",
                label = "Liste Véhicules",
                action = function()
                    TriggerEvent("soz-concess:client:Menu", "")
                end,
                canInteract = function()
                    return InsideConcess
                end,
            },
        },
        distance = 2.5,
    },
})

RegisterNetEvent("soz-concess:client:Menu", function()
    VehiculeList:Open()
end)

CreateThread(function()
    QBCore.Functions.CreateBlip("concess_pdm", {
        name = Config.Shops["pdm"]["ShopLabel"],
        coords = Config.Shops["pdm"]["Location"],
        sprite = 523,
        color = 46,
    })
end)
