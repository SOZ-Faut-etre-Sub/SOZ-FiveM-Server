QBCore = exports["qb-core"]:GetCoreObject()

function flattenTable(prefix, data)
    if not data then
        return {}
    end

    if type(data) ~= "table" then
        return {prefix = data}
    end

    local values = {}

    for k, v in pairs(data) do
        local prefixName = k

        if prefix ~= "" then
            prefixName = prefix .. "_" .. tostring(k)
        end

        if type(v) == "table" then
            for name, value in pairs(flattenTable(prefixName, v)) do
                values[name] = value
            end
        else
            values[prefixName] = v
        end
    end

    return values
end
