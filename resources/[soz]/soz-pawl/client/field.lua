local function TreeInteraction(identifier, position)
    local zoneName = ("storage:%s:%s"):format(identifier, position.x .. position.y)
    exports["qb-target"]:RemoveZone(zoneName)
    exports["qb-target"]:AddBoxZone(zoneName, position, 8.0, 8.0,
                                    {
        name = zoneName,
        heading = position.w or 0.0,
        minZ = position.z,
        maxZ = position.z + 5.0,
        debugPoly = false,
    }, {
        options = {
            {
                label = "Récolter",
                icon = "c:inventory/ouvrir_le_stockage.png",
                event = "pawl:client:harvestTree",
                item = Config.Harvest.RequiredWeapon,
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                --- metadata
                identifier = identifier,
                position = position,
            },
        },
        distance = 2.5,
    })
end

RegisterNetEvent("pawl:client:harvestTree", function(data)
    exports["soz-hud"]:DrawNotification("Vous êtes en train de ~g~couper l’arbre~s~.")
    local success, _ = exports["soz-utils"]:Progressbar("harvest-tree", "Vous récoltez...", Config.Harvest.Duration, false, true,
                                                        {disableMovement = true, disableCombat = true},
                                                        {
        animDict = "melee@hatchet@streamed_core",
        anim = "plyr_front_takedown",
        flags = 17,
    }, {}, {})

    if success then
        local cutTree = QBCore.Functions.TriggerRpc("pawl:server:harvestTree", data.identifier, data.position)
        if cutTree then
            exports["soz-hud"]:DrawNotification("Vous avez ~g~découpé~s~ l’arbre.")
        else
            exports["soz-hud"]:DrawNotification("Vous avez ~r~raté~s~ la découpe de l’arbre.")
        end
    end
end)

RegisterNetEvent("pawl:client:syncField", function(identifier, data)
    local field = Fields[identifier]
    if field == nil then
        Fields[identifier] = {}
        field = Fields[identifier]
    end
    local model = Config.Fields[identifier].model

    --- Delete existing trees
    for k, v in pairs(field or {}) do
        DeleteObject(v)
        field[k] = nil
    end

    for _, v in pairs(data) do
        local tree = CreateObjectNoOffset(model, v.position.x, v.position.y, v.position.z, false, false, false)
        SetEntityHeading(tree, v.w or 0.0)
        FreezeEntityPosition(tree, true)

        field[#field + 1] = tree
        TreeInteraction(identifier, v.position)
    end
end)
