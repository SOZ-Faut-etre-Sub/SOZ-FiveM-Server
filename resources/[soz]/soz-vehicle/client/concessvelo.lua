local VeloList = MenuV:CreateMenu(nil, "Veuillez choisir un vélo", "menu_shop_vehicle_car", "soz", "shop:vehicle:velo")
local VeloModel = MenuV:InheritMenu(VeloList, {Title = nil})
local VeloChoose = MenuV:InheritMenu(VeloModel, {Title = nil})

VeloCategorie = {}
GlobalCycle = {}
InsideConcessVelo = false

ZonesConcessVelo = {
    ["Concessvelo"] = BoxZone:Create(vector3(-1223.7, -1495.49, 4.37), 8, 10, {
        name = "Concessvelo_z",
        heading = 305,
        minZ = 3.37,
        maxZ = 7.37,
    }),
}

local bicycles = {}
for k, cycle in pairs(QBCore.Shared.Vehicles) do
    local category = cycle["category"]
    for cat, _ in pairs(Config.Shops["velo"]["Categories"]) do
        if cat == category then
            if bicycles[category] == nil then
                bicycles[category] = {}
            end
            bicycles[category][k] = cycle
        end
    end
end

local function clean()
    local vcoords = vector3(-1240.39, -1498.58, 4.35)
    local stillthere = true
    while stillthere do
        local bicycles = QBCore.Functions.GetClosestVehicle(vcoords)
        if #(vcoords - GetEntityCoords(bicycles)) <= 2.0 then
            SetEntityAsMissionEntity(bicycles, true, true)
            DeleteVehicle(bicycles)
        else
            stillthere = false
        end
    end
end

local function VeloModels(velo)
    local bicycle = velo
    local model = GetHashKey(bicycle["model"])
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end
    TriggerEvent("soz-concessvelo:client:createcam", "")
    local vel = CreateVehicle(model, -1240.39, -1498.58, 4.35, 350.0, false, false)
    SetModelAsNoLongerNeeded(model)
    SetVehicleOnGroundProperly(vel)
    SetEntityInvincible(vel, true)
    SetVehicleDoorsLocked(vel, 6)
    FreezeEntityPosition(vel, true)
    SetVehicleNumberPlateText(vel, "SOZ")
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

VeloChoose:On("open", function(m)
    m:ClearItems()
    local cycle = GlobalCycle
    m:AddButton({
        icon = "◀",
        label = cycle["name"],
        value = VeloModel,
        description = "Choisir un autre modèle",
        select = function()
            m:Close()
        end,
    })
    m:AddButton({
        label = "Acheter " .. cycle["name"],
        rightLabel = "💸 " .. cycle["price"] .. "$",
        description = "Confirmer l'achat",
        select = function()
            m:Close()
            VeloModel:Close()
            VeloList:Close()
            TriggerServerEvent("soz-concess:server:buyShowroomVehicle", "velo", cycle["model"])
        end,
    })
end)

VeloModel:On("open", function(m)
    local RpcCategorie = VeloCategorie[1]
    local RPCBicyclestorage = QBCore.Functions.TriggerRpc("soz-concess:server:getstock", RpcCategorie)
    m:ClearItems()
    local firstbutton = 0
    local bicycles = {}
    for _, cyclecat in pairs(VeloCategorie[2]) do
        table.insert(bicycles, cyclecat)
    end
    table.sort(bicycles, function(bicycleLhs, bicycleRhs)
        return bicycleLhs["price"] < bicycleRhs["price"]
    end)
    for k, cycle in pairs(bicycles) do
        firstbutton = firstbutton + 1
        if firstbutton == 1 then
            m:AddButton({
                icon = "◀",
                label = cycle["category"],
                value = VeloList,
                description = "Choisir une autre catégorie",
                select = function()
                    m:Close()
                end,
            })
        end
        local newlabel = cycle["name"]
        for _, y in pairs(RPCBicyclestorage) do
            if cycle.model == y.model then
                if y.stock == 0 then
                    newlabel = "^9" .. cycle["name"]
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        description = "❌ HORS STOCK de " .. cycle["name"],
                        enter = function()
                            clean()
                            VeloModels(cycle)
                        end,
                    })
                elseif y.stock == 1 then
                    newlabel = "~o~" .. cycle["name"]
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = VeloChoose,
                        description = "⚠ Stock limité de  " .. cycle["name"],
                        select = function()
                            GlobalCycle = cycle
                        end,
                        enter = function()
                            clean()
                            VeloModels(cycle)
                        end,
                    })
                else
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = VeloChoose,
                        description = "Acheter  " .. cycle["name"],
                        select = function()
                            GlobalCycle = cycle
                        end,
                        enter = function()
                            clean()
                            VeloModels(cycle)
                        end,
                    })
                end
            end
        end
    end
end)

VeloList:On("open", function(m)
    m:ClearItems()
    for k, cycle in pairs(bicycles) do
        m:AddButton({
            label = k,
            value = VeloModel,
            description = "Nom de catégorie",
            select = function()
                VeloCategorie = {k, cycle}
            end,
        })
    end
end)

RegisterNetEvent("soz-concessvelo:client:createcam", function()
    local cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -1236.72, -1495.94, 5.33, 216.5, 0.00, 0.00, 60.00, false, 0)
    PointCamAtCoord(cam, -1240.39, -1498.58, 4.35)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 1, true, true)
    SetFocusPosAndVel(-1236.72, -1495.94, 4.33, 0.0, 0.0, 0.0)
    DisplayHud(false)
    DisplayRadar(false)
end)

for indexConcessVelo, ConcessVelo in pairs(ZonesConcessVelo) do
    ConcessVelo:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            InsideConcessVelo = true
        else
            InsideConcessVelo = false
        end
    end)
end

exports["qb-target"]:SpawnPed({
    model = "s_m_m_autoshop_01",
    coords = vector4(-1222.26, -1494.83, 3.34, 120.0),
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
                event = "soz-concessvelo:client:Menu",
                icon = "c:concess/lister.png",
                label = "Liste Vélos",
                action = function()
                    TriggerEvent("soz-concessvelo:client:Menu", "")
                end,
                canInteract = function()
                    return InsideConcessVelo
                end,
            },
        },
        distance = 2.5,
    },
})

RegisterNetEvent("soz-concessvelo:client:Menu", function()
    VeloList:Open()
end)

RegisterNetEvent("soz-concessvelo:client:buyShowroomVehicle", function(bicycle, plate)
    local newlocation = vec4(Config.Shops["velo"]["VehicleSpawn"].x, Config.Shops["velo"]["VehicleSpawn"].y, Config.Shops["velo"]["VehicleSpawn"].z,
                             Config.Shops["velo"]["VehicleSpawn"].w)
    QBCore.Functions.SpawnVehicle(bicycle, function(cyc)
        TaskWarpPedIntoVehicle(PlayerPedId(), cyc, -1)
        SetFuel(cyc, 100)
        SetVehicleNumberPlateText(cyc, plate)
        SetEntityAsMissionEntity(cyc, true, true)
        TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(cyc))
        TriggerServerEvent("qb-vehicletuning:server:SaveVehicleProps", QBCore.Functions.GetVehicleProperties(cyc))
    end, newlocation, true)
end)

CreateThread(function()
    QBCore.Functions.CreateBlip("concess_velo", {
        name = Config.Shops["velo"]["ShopLabel"],
        coords = Config.Shops["velo"]["Location"],
        sprite = 559,
        color = 46,
    })
end)
