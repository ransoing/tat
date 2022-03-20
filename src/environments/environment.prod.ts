import { key } from '../../google-api-key-prod.json';
import { commonEnvironment, commonFirebaseConfig } from './common';

export const environment = {
  production: true,
  emailVerificationRequired: true,

  proxyServerURL: 'https://app-proxy.truckersagainsttrafficking.org/api/',
  externalResourcesURL: 'https://app-proxy.truckersagainsttrafficking.org/external-resources/',

  webAppResourcesPage: commonEnvironment.webAppResourcesPage,

  firebaseConfig: {
    apiKey: key,
    authDomain: commonFirebaseConfig.authDomain,
    databaseURL: commonFirebaseConfig.databaseURL,
    projectId: commonFirebaseConfig.projectId,
    storageBucket: commonFirebaseConfig.storageBucket,
    messagingSenderId: commonFirebaseConfig.messagingSenderId
  },

  app: commonEnvironment.app,
  buildTarget: commonEnvironment.buildTarget,
  version: commonEnvironment.version

};
