local function GetKey(type_)
    return string.format("soz_mtp_metrics_%s", type_)
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

function GetMtpMetrics()
    local lines = {}

    local MtpMetrics = exports["soz-jobs"]:GetMtpMetrics()

    for type_, metrics in pairs(MtpMetrics) do
        table.insert(lines, GetHeader(type_))

        for _, data in ipairs(metrics) do
            local fields = {string.format("type=\"%s\"", type_)}

            for key, value in pairs(data) do
                if key ~= "value" then
                    table.insert(fields, string.format("%s=\"%s\"", key, value))
                end
            end

            table.insert(lines, string.format("%s{%s} %f", GetKey(type_), table.concat(fields, ","), data.value))
        end
    end

    return table.concat(lines, "\n")
end
