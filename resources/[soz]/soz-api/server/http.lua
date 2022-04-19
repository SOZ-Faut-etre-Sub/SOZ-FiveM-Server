local function readJson(req)
    local p = promise.new()

    req.setDataHandler(function(body)
        local data = json.decode(body)

        if data == nil then
            p:reject("Request body contains invalid JSON")
        else
            p:resolve(data)
        end
    end)

    return Citizen.Await(p)
end

SetHttpHandler(function(req, res)
    local authorizationHeader = GetAuthorizationHeader(GetConvar("soz_api_username", "admin"), GetConvar("soz_api_password", "admin"))

    if req.headers["Authorization"] ~= authorizationHeader then
        res.send("Route /" .. GetCurrentResourceName() .. req.path .. " not found.")

        return;
    end

    if req.path == "/phone/message-create" and req.method == "POST" then
        local jsonV = readJson(req)

        res.send(json.encode(jsonV))

        return;
    end

    res.send("Route /" .. GetCurrentResourceName() .. req.path .. " not found.")
end)
