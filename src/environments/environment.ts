// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDtBAXnyEvQgbdRHS4fyDvkxtyKQvV4c1c',
    authDomain: 'truckers-against-trafficking.firebaseapp.com',
    databaseURL: 'https://truckers-against-trafficking.firebaseio.com',
    projectId: 'truckers-against-trafficking',
    storageBucket: 'truckers-against-trafficking.appspot.com',
    messagingSenderId: '1062876332765'
  },
  // proxyServerURL: 'https://localhost/tatproxy/api/',
  proxyServerURL: 'https://macl4185.lasp.colorado.edu/~christof/tatproxy/api/',
  // proxyServerURL: 'https://app-proxy.truckersagainsttrafficking.org/api/'

  // surveysURL: 'https://localhost/tatproxy/exported-surveys/surveys.js',
  surveysURL: 'https://macl4185.lasp.colorado.edu/~christof/tatproxy/exported-surveys/surveys.js',
  // surveysURL: 'https://app-proxy.truckersagainsttrafficking.com/exported-surveys/surveys.js',

  emailVerificationRequired: false
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
