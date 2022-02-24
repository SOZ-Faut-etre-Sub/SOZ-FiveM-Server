function tPrint(tbl, indent)
    indent = indent or 0
    for k, v in pairs(tbl) do
        local tblType = type(v)
        local formatting = string.rep("  ", indent) .. k .. ": "

        if tblType == "table" then
            print(formatting)
            tPrint(v, indent + 1)
        elseif tblType == "boolean" then
            print(formatting .. tostring(v))
        elseif tblType == "function" then
            print(formatting .. tostring(v))
        else
            print(formatting .. v)
        end
    end
end

local function types(args)
    local argType = type(args[1])
    for i = 2, #args do
        local arg = args[i]
        if argType == arg then
            return true, argType
        end
    end
    return false, argType
end

function type_check(...)
    local vars = {...}
    for i = 1, #vars do
        local var = vars[i]
        local matchesType, varType = types(var)
        if not matchesType then
            table.remove(var, 1)
            error(("Invalid type sent to argument #%s, expected %s, got %s"):format(i, table.concat(var, "|"), varType))
        end
    end
end
