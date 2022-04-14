QBCore = exports["qb-core"]:GetCoreObject()

Housing = {}

local isOwned = false
local isOwner = false
local coords = {}
local LastLocation = nil

Citizen.CreateThread(function()
    for item, zone in pairs(Config.PolyZone) do
        exports["qb-target"]:AddBoxZone(zone.name, vector3(zone.x, zone.y, zone.z), zone.sx, zone.sy, {
            name = zone.name,
            heading = zone.heading,
            minZ = zone.minZ,
            maxZ = zone.maxZ,
            debugPoly = true,
        }, {
            options = {
                {
                    label = "Acheter",
                    icon = "c:housing/acheter.png",
                    canInteract = function()
                        TriggerServerEvent("soz-housing:server:isOwned", zone.name)
                        Wait(100)
                        return not isOwned
                    end,
                    action = function()
                        TriggerServerEvent("soz-housing:server:ShowAcheter", zone.name)
                    end,
                },                
                {
                    label = "Visiter",
                    icon = "c:housing/visiter.png",
                    event = "soz-housing:client:visiter",
                    canInteract = function()
                        return not isOwner
                    end,
                },                
                {
                    label = "Rentrer",
                    icon = "c:housing/entrer.png",
                    event = "soz-housing:client:rentrer",
                    canInteract = function()
                        return isOwner
                    end,
                },                
                {
                    label = "Garage",
                    icon = "c:housing/garage.png",
                    event = "soz-housing:client:garage",
                    canInteract = function()
                        return isOwner and not isTrailer(zone.name)
                    end,
                },
                {
                    label = "Vendre",
                    icon = "c:housing/vendre.png",
                    event = "soz-housing:client:garage",
                    canInteract = function()
                        return isOwner
                    end,
                    action = function()
                        TriggerServerEvent("soz-housing:server:ShowVendre", zone.name)
                    end,
                },
            },
            distance = 2.5,
        })
    end
end)

Citizen.CreateThread(function()
    for item, zone in pairs(Config.PolyZone) do
        QBCore.Functions.CreateBlip(zone.name, {
            name = zone.name,
            coords = vector3(zone.x, zone.y, zone.z),
            sprite = 350,
            color = 5,
            scale = 0.5,
        })
    end
end)

function isTrailer(name)
    if string.find(name, 'trailer') == nil then
        return false
    else
        return true
    end
end

function dump(o)
    if type(o) == 'table' then
       local s = '{ '
       for k,v in pairs(o) do
          if type(k) ~= 'number' then k = '"'..k..'"' end
          s = s .. '['..k..'] = ' .. dump(v) .. ','
       end
       return s .. '} '
    else
       return tostring(o)
    end
 end
 

RegisterNetEvent("soz-housing:client:setData")
AddEventHandler("soz-housing:client:setData", function(owner, owned, coord)
    isOwner = owner
    isOwned = owned
    coords = coord
end)

RegisterNetEvent("soz-housing:client:Acheter")
AddEventHandler("soz-housing:client:Acheter", function(Data)
    Housing.Functions.Menu.BuyHousing(Data)
end)

RegisterNetEvent("soz-housing:client:Vendre")
AddEventHandler("soz-housing:client:Vendre", function(Data)
    Housing.Functions.Menu.SellHousing(Data)
end)

RegisterNetEvent("soz-housing:client:visiter")
AddEventHandler("soz-housing:client:visiter", function()
end)

RegisterNetEvent("soz-housing:client:rentrer")
AddEventHandler("soz-housing:client:rentrer", function()
    player = PlayerPedId()
    LastLocation = GetEntityCoords(player)
    print(dump(coords))
    print(LastLocation.x)
    SetPedCoordsKeepVehicle(player, coords[1].coordx, coords[1].coordy, coords[1].coordz, coords[1].coordw)
end)

RegisterNetEvent("soz-housing:client:garage")
AddEventHandler("soz-housing:client:garage", function()
    print("test")
end)