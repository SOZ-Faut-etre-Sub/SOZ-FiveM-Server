function decode_json(data)
    if not data then
        return nil
    end
    if type(data) == "table" then
        return data
    end
    return json.decode(data)
end

table.length = function(tbl)
    local count = 0
    for _ in pairs(tbl) do
        count = count + 1
    end
    return count
end
