local MotoList = MenuV:CreateMenu(nil, "Veuillez choisir une moto", "menu_shop_vehicle_car", "soz", "shop:vehicle:moto")
local MotoModel = MenuV:InheritMenu(MotoList, {Title = nil})
local MotoChoose = MenuV:InheritMenu(MotoModel, {Title = nil})

MotoCategorie = {}
GlobalMoto = {}
InsideConcessMoto = false

ZonesConcessMoto = {
    ["Concessmoto"] = BoxZone:Create(vector3(1224.99, 2725.22, 38.0), 8, 10, {
        name = "Concessmoto_z",
        heading = 0,
        minZ = 37.0,
        maxZ = 41.0,
    }),
}

local motocycles = {}
for k, cycle in pairs(QBCore.Shared.Vehicles) do
    local category = cycle["category"]
    for cat, _ in pairs(Config.Shops["moto"]["Categories"]) do
        if cat == category then
            if motocycles[category] == nil then
                motocycles[category] = {}
            end
            motocycles[category][k] = cycle
        end
    end
end

local function clean()
    local vcoords = vector3(1224.66, 2706.15, 38.01)
    local stillthere = true
    while stillthere do
        local motocycles = QBCore.Functions.GetClosestVehicle(vcoords)
        if #(vcoords - GetEntityCoords(motocycles)) <= 2.0 then
            SetEntityAsMissionEntity(motocycles, true, true)
            DeleteVehicle(motocycles)
        else
            stillthere = false
        end
    end
end

local function MotoModels(moto)
    local motocycle = moto
    local model = GetHashKey(motocycle["model"])
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end
    TriggerEvent("soz-concessmoto:client:createcam", "")
    local mot = CreateVehicle(model, 1224.66, 2706.15, 38.01, 120.0, false, false)
    SetModelAsNoLongerNeeded(model)
    SetVehicleOnGroundProperly(mot)
    SetEntityInvincible(mot, true)
    SetVehicleDoorsLocked(mot, 6)
    FreezeEntityPosition(mot, true)
    SetVehicleNumberPlateText(mot, "SOZ")
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

MotoChoose:On("open", function(menu)
    menu:ClearItems()
    local moto = GlobalMoto
    menu:AddTitle({label = moto.name})
    menu:AddButton({
        icon = "◀",
        label = VehicleCategorie[1],
        value = MotoModel,
        description = "Choisir un autre modèle",
        select = function()
            menu:Close()
        end,
    })
    local vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(moto["hash"]))
    menu:AddButton({
        label = "Acheter " .. vehicleName,
        rightLabel = "💸 " .. moto["price"] .. "$",
        description = "Confirmer l'achat",
        select = function()
            menu:Close()
            MotoModel:Close()
            MotoList:Close()
            TriggerServerEvent("soz-concess:server:buyShowroomVehicle", "moto", moto["model"], moto["model"]:lower())
        end,
    })
end)

MotoChoose:On("close", function()
    MotoChoose:ClearItems()
end)

MotoModel:On("open", function(menu)
    local RpcCategorie = MotoCategorie[1]
    local RPCMotostorage = QBCore.Functions.TriggerRpc("soz-concess:server:getstock", RpcCategorie)
    menu:ClearItems()
    local motocycles = {}
    for _, motocat in pairs(MotoCategorie[2]) do
        table.insert(motocycles, motocat)
    end
    table.sort(motocycles, function(bicycleLhs, bicycleRhs)
        return bicycleLhs["price"] < bicycleRhs["price"]
    end)
    menu:AddTitle({label = RpcCategorie})
    menu:AddButton({
        icon = "◀",
        label = "Catégories",
        value = MotoList,
        description = "Choisir une autre catégorie",
        select = function()
            menu:Close()
        end,
    })
    for k, cycle in pairs(motocycles) do
        local vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(cycle["hash"]))
        for _, y in pairs(RPCMotostorage) do
            if cycle.model == y.model then
                if y.stock == 0 then
                    menu:AddButton({
                        label = "^9" .. vehicleName,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        description = "❌ HORS STOCK de " .. vehicleName,
                        enter = function()
                            clean()
                            MotoModels(cycle)
                        end,
                    })
                elseif y.stock == 1 then
                    menu:AddButton({
                        label = "~o~" .. vehicleName,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = MotoChoose,
                        description = "⚠ Stock limité de  " .. vehicleName,
                        select = function()
                            GlobalMoto = cycle
                        end,
                        enter = function()
                            clean()
                            MotoModels(cycle)
                        end,
                    })
                else
                    menu:AddButton({
                        label = vehicleName,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = MotoChoose,
                        description = "Acheter  " .. vehicleName,
                        select = function()
                            GlobalMoto = cycle
                        end,
                        enter = function()
                            clean()
                            MotoModels(cycle)
                        end,
                    })
                end
            end
        end
    end
end)

MotoModel:On("close", function()
    MotoModel:ClearItems()
end)

MotoList:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Catégories"})
    for k, moto in pairs(motocycles) do
        menu:AddButton({
            label = k,
            value = MotoModel,
            description = "Nom de catégorie",
            select = function()
                MotoCategorie = {k, moto}
            end,
        })
    end
end)

MotoList:On("close", function()
    MotoList:ClearItems()
end)

RegisterNetEvent("soz-concessmoto:client:createcam", function()
    local cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", 1224.5, 2701.63, 39.01, 216.5, 0.00, 0.00, 60.00, false, 0)
    PointCamAtCoord(cam, 1224.66, 2706.15, 38.01)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 1, true, true)
    SetFocusPosAndVel(1224.5, 2701.63, 38.01, 0.0, 0.0, 0.0)
end)

for indexConcessMoto, ConcessMoto in pairs(ZonesConcessMoto) do
    ConcessMoto:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            InsideConcessMoto = true
        else
            InsideConcessMoto = false
        end
    end)
end

exports["qb-target"]:SpawnPed({
    model = "s_m_m_autoshop_01",
    coords = vector4(1224.79, 2727.25, 37.0, 180.0),
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
                event = "soz-concessmoto:client:Menu",
                icon = "c:concess/lister.png",
                label = "Liste Motos",
                action = function()
                    TriggerEvent("soz-concessmoto:client:Menu", "")
                end,
                canInteract = function()
                    return InsideConcessMoto
                end,
            },
        },
        distance = 2.5,
    },
})

RegisterNetEvent("soz-concessmoto:client:Menu", function()
    MotoList:Open()
end)

CreateThread(function()
    QBCore.Functions.CreateBlip("concess_moto", {
        name = Config.Shops["moto"]["ShopLabel"],
        coords = Config.Shops["moto"]["Location"],
        sprite = 522,
        color = 46,
    })
end)
