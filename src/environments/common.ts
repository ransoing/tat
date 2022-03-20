import { version } from '../../package.json';
/** ./apps/app gets replaced when `npm run switch-app` is run */
import { app } from './apps/app';
/** ./buildTargets/target gets fileReplaced depending on which configuration is used during build */
import { buildTarget } from './buildTargets/target';

/**
 * This file contains environment variables that are the same between dev and prod builds
 */

export const commonEnvironment = {
    /** `app` changes depending on which package.json and config.xml is used */
    app: app,
    /** `buildTarget` changes depending on the build configuration used */
    buildTarget: buildTarget,

    version: version,

    webAppResourcesPage: 'https://app.truckersagainsttrafficking.org/#/tabs/resources'
}

export const commonFirebaseConfig = {
    authDomain: 'truckers-against-trafficking.firebaseapp.com',
    databaseURL: 'https://truckers-against-trafficking.firebaseio.com',
    projectId: 'truckers-against-trafficking',
    storageBucket: 'truckers-against-trafficking.appspot.com',
    messagingSenderId: '1062876332765'
}
