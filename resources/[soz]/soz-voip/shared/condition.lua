condition = {}

condition.ternary = function(condition, trueExpr, falseExpr)
    if condition then
        return trueExpr
    else
        return falseExpr
    end
end

function table.exist(table, val)
    for key, value in pairs(table) do
        local exist

        if type(val) == "function" then
            exists = val(value, key, table)
        else
            exist = val == value
        end

        if exist then
            return true, key
        end
    end

    return false
end

function IsDifferent(current, old)
    if #current ~= #old then
        return true
    else
        for i = 1, #current, 1 do
            if current[i] ~= old[i] then
                return true
            end
        end
    end
end
