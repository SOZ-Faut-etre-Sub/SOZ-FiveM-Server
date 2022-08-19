local function GetKey(type_)
    return string.format("soz_pawl_metrics_%s", type_)
end

local function GetHeader(type_)
    local key = GetKey(type_)

    local label = string.format("Degradation level in %s", type_)
    local help = string.format("%s %s", key, label)

    return string.format([[
# HELP %s
# TYPE %s gauge
]], help, key)
end

function GetPawlMetrics()
    local lines = {}

    local UpwMetrics = exports["soz-pawl"]:GetPawlMetrics()

    for type_, metrics in pairs(UpwMetrics) do
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
