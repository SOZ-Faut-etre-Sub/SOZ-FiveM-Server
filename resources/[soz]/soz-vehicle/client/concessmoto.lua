local MotoList = MenuV:CreateMenu(nil, "Veuillez choisir une moto", "menu_shop_vehicle_car", "soz", "shop:vehicle:moto")
local MotoModel = MenuV:InheritMenu(MotoList, {Title = nil})
local MotoChoose = MenuV:InheritMenu(MotoModel, {Title = nil})

InsideConcessMoto = false

ZonesConcessMoto = {
    ["Concessmoto"] = BoxZone:Create(vector3(1224.99, 2725.22, 38.0), 8, 10, {
        name = "Concessmoto_z",
        heading = 0,
        minZ = 37.0,
        maxZ = 41.0,
    }),
}

local bicycles = {}
for k, cycle in pairs(QBCore.Shared.Vehicles) do
    local category = cycle["category"]
    for cat, _ in pairs(Config.Shops["moto"]["Categories"]) do
        if cat == category then
            if bicycles[category] == nil then
                bicycles[category] = {}
            end
            bicycles[category][k] = cycle
        end
    end
end

local function ChooseCarModelsMenu(bicycle)
    MotoChoose:ClearItems()
    MenuV:OpenMenu(MotoChoose)
    local cycle = bicycle
    MotoChoose:AddButton({
        icon = "◀",
        label = cycle["name"],
        value = MotoModel,
        description = "Choisir un autre modèle",
        select = function()
            MotoChoose:Close()
        end,
    })
    MotoChoose:AddButton({
        label = "Acheter " .. cycle["name"] .. " 💸 " .. cycle["price"] .. "$",
        value = cycle,
        description = "Confirmer l'achat",
        select = function()
            MotoChoose:Close()
            MotoModel:Close()
            MotoList:Close()
            TriggerServerEvent("soz-concess:server:buyShowroomVehicle", "moto", cycle["model"])
        end,
    })
end

local function OpenCarModelsMenu(category)
    MotoModel:ClearItems()
    MenuV:OpenMenu(MotoModel)
    local firstbutton = 0
    local bicycles = {}
    for _, cyclecat in pairs(category) do
        table.insert(bicycles, cyclecat)
    end
    table.sort(bicycles, function(bicycleLhs, bicycleRhs)
        return bicycleLhs["price"] < bicycleRhs["price"]
    end)
    QBCore.Functions.TriggerCallback("soz-concess:server:getstock", function(bicyclestorage)
        for k, cycle in pairs(bicycles) do
            firstbutton = firstbutton + 1
            if firstbutton == 1 then
                MotoModel:AddButton({
                    icon = "◀",
                    label = cycle["category"],
                    rightLabel = "",
                    value = MotoList,
                    description = "Choisir une autre catégorie",
                    select = function()
                        MotoModel:Close()
                    end,
                })
            end
            local newlabel = cycle["name"]
            for _, y in pairs(bicyclestorage) do
                if cycle.model == y.model then
                    if y.stock == 0 then
                        newlabel = "^9" .. cycle["name"]
                        MotoModel:AddButton({
                            label = newlabel,
                            rightLabel = "💸 " .. cycle["price"] .. "$",
                            value = cycle,
                            description = "❌ HORS STOCK de " .. cycle["name"],
                        })
                    elseif y.stock == 1 then
                        newlabel = "~o~" .. cycle["name"]
                        MotoModel:AddButton({
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
                        MotoModel:AddButton({
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
    MotoModel:On("close", function()
        MotoModel:RemoveOnEvent("switch", eventmodelswitch)
    end)
end

local function MotoPanel(menu)
    for k, cycle in pairs(bicycles) do
        menu:AddButton({
            label = k,
            value = cycle,
            description = "Nom de catégorie",
            select = function(btn)
                local select = btn.Value
                OpenCarModelsMenu(select)
            end,
        })
    end
end

local function GenerateMotoMenu()
    if MotoList.IsOpen then
        MotoList:Close()
    else
        MotoList:ClearItems()
        MotoPanel(MotoList)
        MotoList:Open()
    end
end

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
                label = "Demander la liste des motos",
                action = function(entity)
                    TriggerEvent("soz-concessmoto:client:Menu", "")
                end,
                canInteract = function(entity)
                    return InsideConcessMoto
                end,
            },
        },
        distance = 2.5,
    },
})

RegisterNetEvent("soz-concessmoto:client:Menu", function()
    GenerateMotoMenu()
end)

RegisterNetEvent("soz-concessmoto:client:buyShowroomVehicle", function(bicycle, plate)
    local newlocation = vec4(Config.Shops["moto"]["VehicleSpawn"].x, Config.Shops["moto"]["VehicleSpawn"].y, Config.Shops["moto"]["VehicleSpawn"].z, 70)
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
