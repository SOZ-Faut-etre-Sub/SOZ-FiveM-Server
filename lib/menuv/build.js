/**
----------------------- [ MenuV ] -----------------------
-- GitHub: https://github.com/ThymonA/menuv/
-- License: GNU General Public License v3.0
--          https://choosealicense.com/licenses/gpl-3.0/
-- Author: Thymon Arens <contact@arens.io>
-- Name: MenuV
-- Description: FiveM menu library for creating menu's
----------------------- [ MenuV ] -----------------------
*/

const process = require("process");
const colors = require('colors/safe');
const { exec } = require('child_process');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const recursive = require('recursive-readdir');
const args = process.argv.slice(2);

const DEBUG = {
    PRINT: function(msg) {
        console.log(colors.bgBlack(`[${colors.bold(colors.blue('MenuV'))}][${colors.bold(colors.green('BUILD'))}] ${colors.bold(colors.white(msg))}`));
    },
    ERROR: function(msg) {
        console.log(colors.bgBlack(`[${colors.bold(colors.blue('MenuV'))}][${colors.bold(colors.green('BUILD'))}][${colors.bold(colors.red('ERROR'))}] ${colors.bold(colors.white(msg))}`));
    }
}

const PATHS = {
    SOURCE: path.resolve(`${__dirname}/source`),
    BUILD: path.resolve(`${__dirname}/../../resources/[lib]/menuv`),
    APP: path.resolve(`${__dirname}/source/app`),
    MENUV: path.resolve(`${__dirname}/source/menuv.lua`)
}

const COPY_FILES = [
    { from: `${PATHS.APP}/menuv.lua`, to: `${PATHS.BUILD}/menuv/menuv.lua`, type: 'file' },
    { from: `${PATHS.APP}/fxmanifest.lua`, to: `${PATHS.BUILD}/fxmanifest.lua`, type: 'file' },
    { from: `${__dirname}/source/config.lua`, to: `${PATHS.BUILD}/config.lua`, type: 'file' },
    { from: `${__dirname}/source/languages`, to: `${PATHS.BUILD}/languages`, type: 'dir' },
    { from: `${__dirname}/dist`, to: `${PATHS.BUILD}/dist`, type: 'dir', deleteAfter: true },
    { from: `${PATHS.APP}/lua_components`, to: `${PATHS.BUILD}/menuv/components`, type: 'dir' }
];

DEBUG.PRINT(`Building ${colors.yellow('MenuV')} ...`)

for (var i = 0; i < args.length; i++) {
    if (args[i].startsWith("--mode=")) {
        const configuration = args[i].substr(7).toLowerCase();

        switch (configuration) {
            case "production":
            case "release":
                args[i] = '--mode=production';
                break;
            case "development":
            case "debug":
                args[i] = '--mode=development';
                break;
            default:
                args[i] = '--mode=none';
                break;
        }
    }
}

let argumentString = args.join(" ");

if (argumentString.length > 0) {
    argumentString = ` ${argumentString}`;
} else {
    argumentString = ` --mode=production`;
}

exec(`npx webpack${argumentString}`, (err, stdout, stderr) => {
    if (err) {
        DEBUG.ERROR(err.stack);
        return;
    }

    for (var i = 0; i < COPY_FILES.length; i++) {
        const copy_file = COPY_FILES[i];
        const from_file_path = path.resolve(copy_file.from);
        const to_file_path = path.resolve(copy_file.to);

        if (copy_file.type == 'file') {
            const to_file_path_directory = path.dirname(to_file_path);

            if (!fs.existsSync(to_file_path_directory))
                fs.mkdirSync(to_file_path_directory, { recursive: true });

            fs.copyFileSync(from_file_path, to_file_path)
        } else {
            if (!fs.existsSync(to_file_path))
                fs.mkdirSync(to_file_path, { recursive: true });

            fse.copySync(from_file_path, to_file_path, { recursive: true });
        }

        if (copy_file.deleteAfter)
            fse.rmdirSync(from_file_path, { recursive: true });
    }

    let menuv_file = fs.readFileSync(PATHS.MENUV, { encoding: 'utf8' });
    const regex = /---@load '(.*?)'/gm;

    let m;

    while ((m = regex.exec(menuv_file)) != null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
            if (groupIndex == 1) {
                const content_path = path.resolve(`${PATHS.SOURCE}/${match}`);

                if (fs.existsSync(content_path)) {
                    const content = fs.readFileSync(content_path, { encoding: 'utf8' });
                    const content_regex = new RegExp(`---@load '${match}'`, 'g');

                    menuv_file = menuv_file.replace(content_regex, content);
                }
            }
        });
    }

    const final_menuv_path = path.resolve(`${PATHS.BUILD}/menuv.lua`);

    fs.writeFileSync(final_menuv_path, menuv_file);

    recursive(__dirname, ['*.woff', '*.ytd', '*.png', '*.psd'], function (err, files) {
        for(var i = 0; i < files.length; i++) {
            const file = path.resolve(files[i]);
            const file_content = fs.readFileSync(file, { encoding: 'utf8' });

            fs.writeFileSync(file, file_content);
        }

        DEBUG.PRINT(`${colors.yellow('MenuV')} successfully build`);
    });
});