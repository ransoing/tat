const fse = require( 'fs-extra' );
const { execSync } = require( 'child_process' );

// remove old external dist directory
fse.removeSync( 'external/dist' );

// compile external ts
execSync( 'npx tsc -p external/tsconfig.json' );

// pack compiled external ts
execSync( 'npx webpack-cli --config external/webpack.config.js' );

// remove build folder
fse.removeSync( 'build' );

// create external i18n directory
const i18nDir = 'external/dist/i18n';
fse.ensureDirSync( i18nDir );

// copy i18n files to external i18n directory
fse.copySync( 'src/assets/i18n', i18nDir );

// copy the version number from package.json
const version = fse.readJSONSync( 'package.json' ).version;
fse.writeFileSync( 'external/dist/version', '"' + version + '"' );
