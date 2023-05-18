import { key } from '../../google-api-key-dev.json';
import { commonEnvironment, commonFirebaseConfig } from './common';


// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Both environment files take items from `commonEnvironment`. You cannot use Object.assign() to cleverly combine
// this with the common environment properties, because AOT can't properly analyze things when Object.assign() is used.

export const environment = {
  production: false,
  emailVerificationRequired: false,

  // proxyServerURL: 'https://tatproxy.ransomchristofferson.com/api/',
  // externalResourcesURL: 'https://tatproxy.ransomchristofferson.com/external-resources/',
  proxyServerURL: 'http://localhost/~christof/tatproxy/api/',
  externalResourcesURL: 'http://localhost/~christof/tatproxy/external-resources/',
  // a URL which should contain the contents of `external/dist/`, after running `npm run build-external`
  // proxyServerURL: 'https://app-proxy.truckersagainsttrafficking.org/api/',
  // externalResourcesURL: 'https://app-proxy.truckersagainsttrafficking.org/external-resources/'

  webAppResourcesPage: commonEnvironment.webAppResourcesPage,

  firebaseConfig: {
    apiKey: key,
    authDomain: commonFirebaseConfig.authDomain,
    databaseURL: commonFirebaseConfig.databaseURL,
    projectId: commonFirebaseConfig.projectId,
    storageBucket: commonFirebaseConfig.storageBucket,
    messagingSenderId: commonFirebaseConfig.messagingSenderId,
    measurementId: commonFirebaseConfig.measurementId
  },

  app: commonEnvironment.app,
  buildTarget: commonEnvironment.buildTarget,
  version: commonEnvironment.version
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
