condition = {}

condition.ternary = function(condition, trueExpr, falseExpr)
    if condition then
        return trueExpr
    else
        return falseExpr
    end
end
