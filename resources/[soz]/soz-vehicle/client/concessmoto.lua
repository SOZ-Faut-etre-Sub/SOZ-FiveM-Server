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

MotoChoose:On("open", function(m)
    m:ClearItems()
    local moto = GlobalMoto
    m:AddButton({
        icon = "◀",
        label = moto["name"],
        value = MotoModel,
        description = "Choisir un autre modèle",
        select = function()
            m:Close()
        end,
    })
    m:AddButton({
        label = "Acheter " .. moto["name"],
        rightLabel = "💸 " .. moto["price"] .. "$",
        description = "Confirmer l'achat",
        select = function()
            m:Close()
            MotoModel:Close()
            MotoList:Close()
            TriggerServerEvent("soz-concess:server:buyShowroomVehicle", "moto", moto["model"])
        end,
    })
end)

MotoModel:On("open", function(m)
    local RpcCategorie = MotoCategorie[1]
    local RPCMotostorage = QBCore.Functions.TriggerRpc("soz-concess:server:getstock", RpcCategorie)
    m:ClearItems()
    local firstbutton = 0
    local motocycles = {}
    for _, motocat in pairs(MotoCategorie[2]) do
        table.insert(motocycles, motocat)
    end
    table.sort(motocycles, function(bicycleLhs, bicycleRhs)
        return bicycleLhs["price"] < bicycleRhs["price"]
    end)
    for k, cycle in pairs(motocycles) do
        firstbutton = firstbutton + 1
        if firstbutton == 1 then
            m:AddButton({
                icon = "◀",
                label = cycle["category"],
                value = MotoList,
                description = "Choisir une autre catégorie",
                select = function()
                    m:Close()
                end,
            })
        end
        local newlabel = cycle["name"]
        for _, y in pairs(RPCMotostorage) do
            if cycle.model == y.model then
                if y.stock == 0 then
                    newlabel = "^9" .. cycle["name"]
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        description = "❌ HORS STOCK de " .. cycle["name"],
                    })
                elseif y.stock == 1 then
                    newlabel = "~o~" .. cycle["name"]
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = MotoChoose,
                        description = "⚠ Stock limité de  " .. cycle["name"],
                        select = function()
                            GlobalMoto = cycle
                        end,
                    })
                else
                    m:AddButton({
                        label = newlabel,
                        rightLabel = "💸 " .. cycle["price"] .. "$",
                        value = MotoChoose,
                        description = "Acheter  " .. cycle["name"],
                        select = function()
                            GlobalMoto = cycle
                        end,
                    })
                end
            end
        end
    end
end)

MotoList:On("open", function(m)
    m:ClearItems()
    for k, moto in pairs(motocycles) do
        m:AddButton({
            label = k,
            value = MotoModel,
            description = "Nom de catégorie",
            select = function()
                MotoCategorie = {k, moto}
            end,
        })
    end
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

RegisterNetEvent("soz-concessmoto:client:buyShowroomVehicle", function(bicycle, plate)
    local newlocation = vec4(Config.Shops["moto"]["VehicleSpawn"].x, Config.Shops["moto"]["VehicleSpawn"].y, Config.Shops["moto"]["VehicleSpawn"].z,
                             Config.Shops["moto"]["VehicleSpawn"].w)
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
    local CycleDealer = AddBlipForCoord(Config.Shops["moto"]["Location"])
    SetBlipSprite(CycleDealer, 522)
    SetBlipDisplay(CycleDealer, 4)
    SetBlipScale(CycleDealer, 1.0)
    SetBlipColour(CycleDealer, 46)
    SetBlipAsShortRange(CycleDealer, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName(Config.Shops["moto"]["ShopLabel"])
    EndTextCommandSetBlipName(CycleDealer)
end)
