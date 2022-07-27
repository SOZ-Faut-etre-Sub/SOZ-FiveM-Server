local b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

local function base64encode(data)
    return ((data:gsub(".", function(x)
        local r, b = "", x:byte()
        for i = 8, 1, -1 do
            r = r .. (b % 2 ^ i - b % 2 ^ (i - 1) > 0 and "1" or "0")
        end
        return r;
    end) .. "0000"):gsub("%d%d%d?%d?%d?%d?", function(x)
        if (#x < 6) then
            return ""
        end
        local c = 0
        for i = 1, 6 do
            c = c + (x:sub(i, i) == "1" and 2 ^ (6 - i) or 0)
        end
        return b:sub(c + 1, c + 1)
    end) .. ({"", "==", "="})[#data % 3 + 1])
end

local authLogin = GetConvar("prometheus_login", "admin")
local authPassword = GetConvar("prometheus_password", "admin")
local authorizationHeader = "Basic " .. base64encode(authLogin .. ":" .. authPassword)

local metrics = ""

Citizen.CreateThread(function()
    Citizen.Wait(1000)

    while true do
        local newMetrics = {
            GetBankMetrics(),
            GetPlayerMetrics(),
            GetInventoryMetrics(),
            GetUpwMetrics(),
            GetMtpMetrics(),
        }
        metrics = table.concat(newMetrics, "\n")

        Citizen.Wait(3000)
    end
end)

SetHttpHandler(function(req, res)
    if req.path == "/metrics" and req.headers["Authorization"] == authorizationHeader then
        res.send(metrics)

        return;
    end

    res.send("Route /" .. GetCurrentResourceName() .. req.path .. " not found.")
end)
