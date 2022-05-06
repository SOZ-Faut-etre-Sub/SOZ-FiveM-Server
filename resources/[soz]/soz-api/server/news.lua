RegisterNetEvent("soz-api:server:AddFlashNews", function(news)
    local url = GetConvar("soz_api_endpoint", "https://soz.zerator.com") .. "/news/add-flash"
    local authorization = GetAuthorizationHeader(GetConvar("soz_api_username", "admin"), GetConvar("soz_api_password", "admin"))

    PerformHttpRequest(url, function(status, text)
        if status ~= 201 then
            exports["soz-monitor"]:Log("ERROR", "error when adding flash news, status: " .. status .. ", body: " .. tostring(text), {})
        end
    end, "POST", json.encode(news), {["Authorization"] = authorization, ["Content-Type"] = "application/json"})
end)
