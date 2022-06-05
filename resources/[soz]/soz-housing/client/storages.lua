RegisterNetEvent("soz-housing:client:SetStorage", function(GlobalZone)
    Citizen.CreateThread(function()
        for _, zone in pairs(GlobalZone) do
            if zone.identifier and zone.fridge_position then
                local fridge = json.decode(zone.fridge_position)

                exports["qb-target"]:AddBoxZone(zone.identifier .. "_fridge", vector3(fridge["x"], fridge["y"], fridge["z"]), fridge["sx"], fridge["sy"], {
                    name = zone.identifier .. "_fridge",
                    heading = fridge["heading"],
                    minZ = fridge["minZ"],
                    maxZ = fridge["maxZ"],
                }, {
                    options = {
                        {
                            label = "Frigo",
                            icon = "c:inventory/ouvrir_le_stockage.png",
                            action = function()
                                TriggerServerEvent("inventory:server:openInventory", "house_fridge", zone.identifier)
                            end,
                        },
                    },
                    distance = 2.5,
                })
            end

            if zone.identifier and zone.stash_position then
                local stash = json.decode(zone.stash_position)

                exports["qb-target"]:AddBoxZone(zone.identifier .. "_stash", vector3(stash["x"], stash["y"], stash["z"]), stash["sx"], stash["sy"],
                                                {
                    name = zone.identifier .. "_stash",
                    heading = stash["heading"],
                    minZ = stash["minZ"],
                    maxZ = stash["maxZ"],
                }, {
                    options = {
                        {
                            label = "Coffre",
                            icon = "c:inventory/ouvrir_le_stockage.png",
                            action = function()
                                TriggerServerEvent("inventory:server:openInventory", "house_stash", zone.identifier)
                            end,
                        },
                    },
                    distance = 2.5,
                })
            end

            if zone.identifier and zone.money_position then
                local money = json.decode(zone.money_position)

                --[[
                exports["qb-target"]:AddBoxZone(zone.identifier .. "_money", vector3(money["x"], money["y"], money["z"]), money["sx"], money["sy"], {
                    name = zone.identifier .. "_money",
                    heading = money["heading"],
                    minZ = money["minZ"],
                    maxZ = money["maxZ"],
                    debugPoly = false,
                }, {
                    options = {
                        {
                            label = "Coffre d'argent",
                            icon = "c:housing/entrer.png",
                            action = function()
                                print("money")
                            end,
                        },
                    },
                    distance = 2.5,
                })
                ]] --
            end
        end
    end)
end)
