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
