QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Functions.CreateCallback("soz-api:server:GetJwtToken", function(source, cb)
    local steam = QBCore.Functions.GetSozIdentifier(source)
    local url = GetConvar("soz_api_endpoint", "https://soz.zerator.com") .. "/accounts/create-token/" .. steam
    local authorization = GetAuthorizationHeader(GetConvar("soz_api_username", "admin"), GetConvar("soz_api_password", "admin"))

    PerformHttpRequest(url, function(status, text)
        if status ~= 200 then
            cb(null)
        else
            cb(text)
        end
    end, "GET", "", {["Authorization"] = authorization})
end)
