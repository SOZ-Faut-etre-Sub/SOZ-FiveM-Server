local function readBody(req)
    local p = promise.new()

    req.setDataHandler(function(body)
        local data = body

        if data == nil then
            p:reject("Request body contains invalid JSON")
        else
            p:resolve(data)
        end
    end)

    return Citizen.Await(p)
end

local function readJson(req)
    local data = readBody(req)

    return json.decode(data)
end

SetHttpHandler(function(req, res)
    local authorizationHeader = GetAuthorizationHeader(GetConvar("soz_api_username", "admin"), GetConvar("soz_api_password", "admin"))

    if req.headers["Authorization"] ~= authorizationHeader then
        res.send("Route /" .. GetCurrentResourceName() .. req.path .. " not found.")

        return;
    end

    -- Get list of connected players
    if req.path == "/active-players" and req.method == "GET" then
        local data = {}
        local playerCount = GetNumPlayerIndices()

        for index = 0, playerCount - 1 do
            local source = GetPlayerFromIndex(index)

            data[QBCore.Functions.GetSozIdentifier(source)] = source
        end

        res.send(json.encode(data))

        return;
    end
    -- Get list of items
    if req.path == "/items" and req.method == "GET" then
        res.send(json.encode(QBCore.Shared.Items))

        return;
    end

    -- Kick a player
    if req.path == "/kick-player" and req.method == "POST" then
        local data = readJson(req);
        DropPlayer(tonumber(data.player), data.reason)

        res.send("Player kicked.")

        return;
    end

    if req.path == "/phone/message-create" and req.method == "POST" then
        local jsonV = readJson(req)

        res.send(json.encode(jsonV))

        return;
    end

    res.send("Route /" .. GetCurrentResourceName() .. req.path .. " not found.")
end)
