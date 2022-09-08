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

local function GetAuthorizationHeader(user, password)
    return "Basic " .. base64encode(user .. ":" .. password)
end

local http_endpoint = GetConvar("soz_voip_mumble_http_endpoint", "http://127.0.0.1:8080")
local http_username = GetConvar("soz_voip_mumble_http_username", "admin")
local http_password = GetConvar("soz_voip_mumble_http_password", "changeme")

local function HttpRequestAwait(url, method, data, headers)
    local p = promise.new()
    local httpUrl = http_endpoint .. url
    local authorization = GetAuthorizationHeader(http_username, http_password)

    method = method or "GET"
    data = data or ""
    headers = headers or {}

    headers["Authorization"] = authorization

    PerformHttpRequest(httpUrl, function(status, text)
        p:resolve({status = status, body = text})
    end, method, data, headers)

    return Citizen.Await(p)
end

function ZumbleSetPlayerMuted(source, mute)
    local username = string.format("[%d] %s", source, GetPlayerName(source))
    local data = json.encode({mute = mute, user = username})
    local headers = {["Content-Type"] = "application/json"}

    local response = HttpRequestAwait("/mute", "POST", data, headers)

    if response.status ~= 200 then
        print(string.format("ZumbleSetPlayerMuted: %s", response.body))
    end
end

function ZumbleIsPlayerMuted(source)
    local username = string.format("[%d]%%20%s", source, GetPlayerName(source))

    local headers = {["Accept"] = "application/json"}
    local response = HttpRequestAwait("/mute/" .. username, "GET", "", headers)

    if response.status ~= 200 then
        print(string.format("ZumbleIsPlayerMuted: %s", response.body))
        return false
    end

    local data = json.decode(response.body)

    return data.mute
end
