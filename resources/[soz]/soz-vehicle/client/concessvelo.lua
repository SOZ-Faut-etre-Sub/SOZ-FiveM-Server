local VeloList = MenuV:CreateMenu(nil, "Veuillez choisir un vélo", "menu_shop_vehicle_car", "soz", "shop:vehicle:velo")
local VeloModel = MenuV:InheritMenu(VeloList, {Title = nil})
local VeloChoose = MenuV:InheritMenu(VeloModel, {Title = nil})

VeloCategorie = {}
Globalbicyclestorage = {}
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

local function ChooseCarModelsMenu(bicycle)
    VeloChoose:ClearItems()
    MenuV:OpenMenu(VeloChoose)
    local cycle = bicycle
    VeloChoose:AddButton({
        icon = "◀",
        label = cycle["name"],
        value = VeloModel,
        description = "Choisir un autre modèle",
        select = function()
            VeloChoose:Close()
        end,
    })
    VeloChoose:AddButton({
        label = "Acheter " .. cycle["name"],
        rightLabel = "💸 " .. cycle["price"] .. "$",
        value = cycle,
        description = "Confirmer l'achat",
        select = function()
            VeloChoose:Close()
            VeloModel:Close()
            VeloList:Close()
            TriggerServerEvent("soz-concess:server:buyShowroomVehicle", "velo", cycle["model"])
        end,
    })
end

VeloModel:On('open', function(m)
    m:ClearItems()
    local firstbutton = 0
    local bicycles = {}
    for _, cyclecat in pairs(VeloCategorie) do
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
        for _, y in pairs(Globalbicyclestorage) do
            if cycle.model == y.model then
                if y.stock == 0 then
                    newlabel = "^9" .. cycle["name"]
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = cycle,
                        description = "❌ HORS STOCK de " .. cycle["name"],
                    })
                elseif y.stock == 1 then
                    newlabel = "~o~" .. cycle["name"]
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = cycle,
                        description = "⚠ Stock limité de  " .. cycle["name"],
                        select = function(btn)
                            local select = btn.Value
                            ChooseCarModelsMenu(cycle)
                        end,
                    })
                else
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = cycle,
                        description = "Acheter  " .. cycle["name"],
                        select = function(btn)
                            local select = btn.Value
                            ChooseCarModelsMenu(cycle)
                        end,
                    })
                end
            end
        end
    end
end)

VeloList:On('open', function(m)
    m:ClearItems()
    for k, cycle in pairs(bicycles) do
        m:AddButton({
            label = k,
            value = VeloModel,
            description = "Nom de catégorie",
            select = function()
                VeloCategorie = cycle
                Globalbicyclestorage = QBCore.Functions.TriggerRpc("soz-concess:server:getstock")
            end,
        })
    end
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
                label = "Demander la liste des vélos",
                action = function(entity)
                    TriggerEvent("soz-concessvelo:client:Menu", "")
                end,
                canInteract = function(entity)
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
    local newlocation = vec4(Config.Shops["velo"]["VehicleSpawn"].x, Config.Shops["velo"]["VehicleSpawn"].y, Config.Shops["velo"]["VehicleSpawn"].z, 70)
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
    local CycleDealer = AddBlipForCoord(Config.Shops["velo"]["Location"])
    SetBlipSprite(CycleDealer, 559)
    SetBlipDisplay(CycleDealer, 4)
    SetBlipScale(CycleDealer, 1.0)
    SetBlipColour(CycleDealer, 46)
    SetBlipAsShortRange(CycleDealer, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName(Config.Shops["velo"]["ShopLabel"])
    EndTextCommandSetBlipName(CycleDealer)
end)
