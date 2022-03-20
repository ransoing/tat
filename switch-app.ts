/* eslint-disable no-console */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as fsx from 'fs-extra';
import * as process from 'process';

// run this script to work on the TAT ELD app instead of the TAT app, or vice versa.
// the script renames relevant files (environment.ts, environment.prod.ts, package.json, and config.xml)

enum Mode {
    TAT = 'tat',
    ELD = 'eld'
}

// check the current package.json to see which app is "active"
const pack = JSON.parse( fs.readFileSync( './package.json', { encoding: 'utf-8' } ).toString() );

let currentMode: Mode;
let newMode: Mode;

if ( pack.name === 'truckers-against-trafficking-app' ) {
    currentMode = Mode.TAT;
    newMode = Mode.ELD;
} else if ( pack.name === 'truckers-against-trafficking-eld-app' ) {
    currentMode = Mode.ELD;
    newMode = Mode.TAT;
} else {
    console.error( `Unrecognized app name: ${pack.name}. Expected either "truckers-against-trafficking-app" or "truckers-against-trafficking-eld-app"` );
    process.exit( 1 );
}

const paths = {
    active: buildPaths(),
    currentMode: buildPaths( currentMode ),
    newMode: buildPaths( newMode )
}

function buildPaths( mode?: Mode ) {
    // add a dot before the mode if it isn't empty
    const modePath = mode ? `.${mode}` : '';
    return {
        envApp:     `./src/environments/apps/app${modePath}.ts`,
        package:    `./package${modePath}.json`,
        config:     `./config${modePath}.xml`
    };
}

// we will rename 'active' paths to 'currentMode' paths, then rename 'newMode' paths to 'active' paths

// verify that we will not overwrite files by renaming
const toOverwrite = Object.values( paths.currentMode ).find( path => fs.existsSync(path) );
if ( toOverwrite ) {
    console.error( `Stopped because the script would overwrite ${toOverwrite}.` );
    process.exit( 1 );
}

// verify that all the 'active' files exist.
let doesntExist = Object.values( paths.active ).find( path => !fs.existsSync(path) );
if ( doesntExist ) {
    console.error( `Stopped because this file doesn't exist: ${doesntExist}.` );
    process.exit( 1 );
}

// verify that all the files for the desired app exist
doesntExist = Object.values( paths.newMode ).find( path => !fs.existsSync(path) );
if ( doesntExist ) {
    console.error( `Stopped because this file doesn't exist: ${doesntExist}.` );
    process.exit( 1 );
}

// rename current active files, "deactivating" them
fs.renameSync( paths.active.envApp, paths.currentMode.envApp );
fs.renameSync( paths.active.package, paths.currentMode.package );
fs.renameSync( paths.active.config, paths.currentMode.config );

// "activate" files for the desired mode by renaming the new mode files to "active"
fs.renameSync( paths.newMode.envApp, paths.active.envApp );
fs.renameSync( paths.newMode.package, paths.active.package );
fs.renameSync( paths.newMode.config, paths.active.config );

// remove platforms and plugins so they eventually get re-prepared and rebuilt with the correct plugins
fsx.remove( './platforms' );
fsx.remove( './plugins' );

// copy some items from old package to new package.json.
// there will be many compiler errors if the installed packages don't remain the same between the two apps.
// however, the cordova plugins should stay different.
// config.xml files should also stay different.
const currentPack = JSON.parse( fs.readFileSync(paths.currentMode.package, { encoding: 'utf-8' }) );
const activePack = JSON.parse( fs.readFileSync(paths.active.package, { encoding: 'utf-8' }) );
activePack.scripts = currentPack.scripts;
activePack.dependencies = currentPack.dependencies;
activePack.devDependencies = currentPack.devDependencies;
fs.writeFileSync( paths.active.package, JSON.stringify(activePack, undefined, 2), { encoding: 'utf-8' } );

// install and uninstall packages as needed
execSync( `npm i`, { stdio: 'inherit' } );

console.log( `\nSwitched from ${currentMode} to ${newMode}` );
