local function GetKey(type_)
    return string.format("soz_upw_metrics_%s", type_)
end

local function GetHeader(type_)
    local key = GetKey(type_)

    local label = string.format("Energy available in %s", type_)
    local labels = {["pollution_level"] = "Pollution level", ["blackout_level"] = "Blackout level"}
    if labels[type_] ~= nil then
        label = labels[type_]
    end

    local help = string.format("%s %s", key, label)

    return string.format([[
# HELP %s
# TYPE %s gauge
]], help, key)
end

function GetUpwMetrics()
    local lines = {}

    local UpwMetrics = exports["soz-upw"]:GetUpwMetrics()

    for type_, metrics in pairs(UpwMetrics) do
        table.insert(lines, GetHeader(type_))

        for _, data in ipairs(metrics) do
            table.insert(lines, string.format("%s{type=\"%s\",identifier=\"%s\"} %d", GetKey(type_), type_, data.identifier, data.value))
        end
    end

    return table.concat(lines, "\n")
end
