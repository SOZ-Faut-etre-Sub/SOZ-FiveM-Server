table.insert(migrations, {
    name = "update-livery-societies-veh",
    queries = {
        [[
            UPDATE concess_entreprise SET liverytype = 4 WHERE job='lspd' AND vehicle='polmav';
        ]],
        [[
            UPDATE concess_entreprise SET vehicle='maverick2', liverytype = 1 WHERE job='bcso' AND vehicle='polmav';
        ]],
        [[
            UPDATE concess_entreprise SET liverytype = 1 WHERE job='lsmc' AND vehicle='polmav';
        ]],
        [[
            UPDATE concess_entreprise SET vehicle='baller8', liverytype = 1 WHERE job='cash-transfer' AND vehicle='baller4';
        ]],
        [[
            UPDATE concess_entreprise SET liverytype = 1 WHERE job='news' AND vehicle='newsvan';
        ]],
        [[
            UPDATE concess_entreprise SET liverytype = 1 WHERE job='food' AND vehicle='mule6';
        ]],
        [[
            UPDATE concess_entreprise SET vehicle='packer2', liverytype = 1 WHERE job='oil' AND vehicle='packer';
        ]],
        [[
            UPDATE concess_entreprise SET vehicle='utillitruck4', liverytype = 1 WHERE job='oil' AND vehicle='utillitruck2';
        ]],
        [[
            UPDATE concess_entreprise SET vehicle='dynasty2', liverytype = 1 WHERE job='taxi' AND vehicle='dynasty';
        ]],
        [[
            UPDATE concess_entreprise SET vehicle='burrito6', liverytype = 1 WHERE job='bennys' AND vehicle='burrito2';
        ]],
        [[
            UPDATE concess_entreprise SET price=27000 WHERE job='oil' AND vehicle='packer2';
        ]],
        [[
            UPDATE concess_entreprise SET price=10000 WHERE job='oil' AND vehicle='tanker';
        ]],
        [[
            UPDATE concess_entreprise SET price=20000 WHERE job='oil' AND vehicle='utillitruck4';
        ]],
    },
});
