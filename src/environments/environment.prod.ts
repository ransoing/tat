import pack from '../../package.json';

export const environment = {
  production: true,
  version: pack.version,
  firebaseConfig: {
    apiKey: 'AIzaSyDtBAXnyEvQgbdRHS4fyDvkxtyKQvV4c1c',
    authDomain: 'truckers-against-trafficking.firebaseapp.com',
    databaseURL: 'https://truckers-against-trafficking.firebaseio.com',
    projectId: 'truckers-against-trafficking',
    storageBucket: 'truckers-against-trafficking.appspot.com',
    messagingSenderId: '1062876332765'
  },
  proxyServerURL: 'https://app-proxy.truckersagainsttrafficking.org/api/',
  externalResourcesURL: 'https://app-proxy.truckersagainsttrafficking.org/external-resources/',
  emailVerificationRequired: true
};
