// Executed with `yarn build-showroom`
const csvtojson = require('csvtojson');
const fs = require('fs');

async function run() {
    const showRoomListJSON = await csvtojson().fromFile('./data/FightForStyleShowRoom/showRoomList.csv');

    const ShowRoomFreeElement = {
        mp_m_freemode_01: {
            Components: {},
            Props: {},
        },
        mp_f_freemode_01: {
            Components: {},
            Props: {},
        },
    };

    const showRoomClothesList = {
        mp_m_freemode_01: {
            Components: {},
            Props: {},
        },
        mp_f_freemode_01: {
            Components: {},
            Props: {},
        },
    };

    for (const cloth of showRoomListJSON) {
        const clothDrawable = parseInt(cloth.Drawable);
        showRoomClothesList[cloth.Model][cloth.Type][cloth.Index] ||= {};
        ShowRoomFreeElement[cloth.Model][cloth.Type][cloth.Index] ||= [];
        if (cloth['UseDrawable'] == 'TRUE') {
            const clothConfig = [];
            for (let i = 0; i <= 25; i++) {
                if (cloth['Texture' + i] == 'TRUE') clothConfig.push(i);
            }
            showRoomClothesList[cloth.Model][cloth.Type][cloth.Index][clothDrawable] = clothConfig;
        }
        if (cloth['Free'] == 'TRUE') ShowRoomFreeElement[cloth.Model][cloth.Type][cloth.Index].push(clothDrawable);
    }

    let string = `export const ShowRoomFreeElement = ${JSON.stringify(
        ShowRoomFreeElement,
        (k, v) => (Array.isArray(v) ? JSON.stringify(v) : v),
        4
    ).replace(/"\[[^"\]]*]"/g, r => JSON.stringify(JSON.parse(r)).substr(1).slice(0, -1))};\n\n`;
    string += `export const ffsClothConfig = ${JSON.stringify(
        showRoomClothesList,
        (k, v) => (Array.isArray(v) ? JSON.stringify(v) : v),
        4
    ).replace(/"\[[^"\]]*]"/g, r => JSON.stringify(JSON.parse(r)).substr(1).slice(0, -1))};\n\n`;

    fs.writeFileSync('./src/shared/FightForStyleShowRoom/ffsClothConfig.ts', string);
}

run();