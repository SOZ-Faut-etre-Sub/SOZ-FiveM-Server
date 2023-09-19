local SapHarvestedTrees = {}
local harvesting = false

local function ConcatPosition(position)
    local x = math.floor(position.x)
    local y = math.floor(position.y)
    local z = math.floor(position.z)

    return table.concat({x, y, z}, "-")
end

local function TreeInteraction(identifier, position)
    local zoneName = ("pawl:%s:%s"):format(identifier, position.x .. position.y)
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
                color = "pawl",
                label = "Récolter",
                icon = "c:pawl/harvest.png",
                event = "pawl:client:harvestTree",
                item = Config.Harvest.RequiredWeapon,
                canInteract = function()
                    return not harvesting and PlayerData.job.onduty
                end,
                job = "pawl",
                blackoutGlobal = true,
                blackoutJob = "pawl",
                --- metadata
                identifier = identifier,
                position = position,
            },
            {
                color = "pawl",
                label = "Tronçonner",
                icon = "c:pawl/harvest-chainsaw.png",
                event = "pawl:client:checkChainsawFuel",
                item = Config.FastHarvest.RequiredWeapon,
                canInteract = function()
                    return not harvesting and PlayerData.job.onduty
                end,
                job = "pawl",
                blackoutGlobal = true,
                blackoutJob = "pawl",
                --- metadata
                identifier = identifier,
                position = position,
            },
            {
                color = "pawl",
                label = "Récolter la sève",
                icon = "c:pawl/harvest-sap.png",
                event = "pawl:client:harvestTreeSap",
                item = Config.Harvest.RequiredWeapon,
                canInteract = function()
                    local treeKey = ConcatPosition(position)
                    if SapHarvestedTrees[treeKey] ~= nil then
                        return false
                    end

                    return not harvesting and PlayerData.job.onduty
                end,
                job = "pawl",
                blackoutGlobal = true,
                blackoutJob = "pawl",
                --- metadata
                identifier = identifier,
                position = position,
            },
            {
                color = "crimi",
                label = "Récolter des champignons",
                icon = "c:pawl/harvest-mushroom.png",
                event = "soz-core:client:drugs:harvest-champi",
                position = position,
                canInteract = function()
                    for _, value in ipairs(PlayerData.metadata.drugs_skills) do
                        -- 1 is Botanite
                        if value == 1 then
                            return true
                        end
                    end
                    return false
                end,
            },
        },
        distance = 2.5,
    })
end

RegisterNetEvent("pawl:client:harvestTree", function(data)
    harvesting = true
    local ped = PlayerPedId()
    TriggerEvent("soz-core:client:weapon:use-weapon-name", Config.Harvest.RequiredWeapon)

    Wait(3000)

    exports["soz-core"]:DrawNotification("Vous êtes en train de ~g~couper l’arbre~s~.")
    local success, _ = exports["soz-utils"]:Progressbar("harvest-tree", "Vous récoltez...", Config.Harvest.Duration, false, true,
                                                        {disableMovement = true, disableCombat = true},
                                                        {
        animDict = "melee@large_wpn@streamed_core",
        anim = "plyr_rear_takedown_bat_r_facehit",
        flags = 17,
    }, {}, {})

    if success then
        local cutTree = QBCore.Functions.TriggerRpc("pawl:server:harvestTree", data.identifier, data.position)
        if cutTree then
            table.insert(Config.Field.List[data.identifier], GetGameTimer())

            local treeKey = ConcatPosition(data.position)
            SapHarvestedTrees[treeKey] = nil

            exports["soz-core"]:DrawNotification("Vous avez ~g~découpé~s~ l’arbre.")
        else
            exports["soz-core"]:DrawNotification("Vous avez ~r~raté~s~ la découpe de l’arbre.")
        end
    end

    TriggerEvent("soz-core:client:weapon:use-weapon-name", Config.Harvest.RequiredWeapon)
    harvesting = false
end)

local createChainsawThread = function()
    CreateThread(function()
        while harvesting do
            TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 2, "pawl/chainsaw", 6000);
            Wait(7000)
        end
    end)
end

RegisterNetEvent("pawl:client:checkChainsawFuel", function()
    TriggerEvent("soz-core:client:job:pawl:fast-harvest-tree");
end)

RegisterNetEvent("pawl:client:fastHarvestTree", function(data)
    harvesting = true
    local ped = PlayerPedId()
    Wait(500)

    exports["soz-core"]:DrawNotification("Vous êtes en train de ~g~tronçonner l'arbre~s~.")

    createChainsawThread()

    local success, _ = exports["soz-utils"]:Progressbar("harvest-tree", "Vous tronçonnez...", Config.FastHarvest.Duration, false, true,
                                                        {disableMovement = true, disableCombat = true}, {
        animDict = "anim@amb@business@cfm@cfm_cut_sheets@",
        anim = "load_and_tune_guilotine_v1_billcutter",
        flags = 17,
    }, {
        bone = 28422,
        model = "prop_tool_consaw",
        coords = {x = 0.12, y = 0.02, z = 0.0001},
        rotation = {x = 90.0, y = 180.0, z = -40.0},
    }, {})

    if success then
        local cutTree = QBCore.Functions.TriggerRpc("pawl:server:harvestTree", data.identifier, data.position)
        if cutTree then
            table.insert(Config.Field.List[data.identifier], GetGameTimer())

            local treeKey = ConcatPosition(data.position)
            SapHarvestedTrees[treeKey] = nil

            exports["soz-core"]:DrawNotification("Vous avez ~g~tronçonné~s~ l’arbre.")
        else
            exports["soz-core"]:DrawNotification("Vous avez ~r~raté~s~ la découpe de l’arbre.")
        end
    end
    harvesting = false
end)

RegisterNetEvent("pawl:client:harvestTreeSap", function(data)
    harvesting = true
    local ped = PlayerPedId()
    TriggerEvent("soz-core:client:weapon:use-weapon-name", Config.Harvest.RequiredWeapon)

    Wait(3000)

    exports["soz-core"]:DrawNotification("Vous êtes en train de ~g~récolter de la sève~s~.")
    local success, _ = exports["soz-utils"]:Progressbar("harvest-tree", "Vous récoltez...", Config.Harvest.SapDuration, false, true,
                                                        {disableMovement = true, disableCombat = true},
                                                        {
        animDict = "melee@large_wpn@streamed_core",
        anim = "plyr_rear_takedown_bat_r_facehit",
        flags = 17,
    }, {}, {})

    if success then
        local sapTree = QBCore.Functions.TriggerRpc("pawl:server:harvestTreeSap", data.identifier, data.position)
        if sapTree then
            local treeKey = ConcatPosition(data.position)
            SapHarvestedTrees[treeKey] = true

            exports["soz-core"]:DrawNotification("Vous avez ~g~récolté~s~ de la sève.")
        else
            exports["soz-core"]:DrawNotification("Vous avez ~r~raté~s~ la récolte de la sève.")
        end
    end

    TriggerEvent("soz-core:client:weapon:use-weapon-name", Config.Harvest.RequiredWeapon)
    harvesting = false
end)

RegisterNetEvent("pawl:client:syncField", function(identifier, data)
    local field = FieldTrees[identifier]
    if field == nil then
        FieldTrees[identifier] = {}
        field = FieldTrees[identifier]
    end

    --- Delete existing trees
    for k, v in pairs(field or {}) do
        DeleteObject(v)
        field[k] = nil
    end

    local currentTime = exports["soz-utils"]:GetTimestamp() / 1000

    if data then
        for _, v in pairs(data) do
            if (currentTime - v.harvestTime) * 1000 >= Config.Field.RefillDelay then
                local tree = CreateObjectNoOffset(v.model, v.position.x, v.position.y, v.position.z, false, false, false)
                SetEntityHeading(tree, v.position.w or 0.0)
                FreezeEntityPosition(tree, true)

                field[#field + 1] = tree
                TreeInteraction(identifier, v.position)
            else
                local zoneName = ("pawl:%s:%s"):format(identifier, v.position.x .. v.position.y)
                exports["qb-target"]:RemoveZone(zoneName)
            end
        end
    end
end)
