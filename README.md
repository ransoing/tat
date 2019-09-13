
Parts:
    Angular app
        main
        externals
            loaded dynamically (i18n files also loaded dynamically)
    Firebase
        what is stored here?
    Proxy
        what does this do?
    firebaseui-en-es, firebaseui-angular-en-es
        why I have this, and how to build it

Tools:
    i18n-editor

How to update various things:
    The app itself
    Salesforce junk
    Registration codes
    How to help users with login issues or delete users
    Surveys
    Images and videos (URLs in firebase)

What in salesforce mustn't you touch?


how to run in browser for dev? how to set env file?
how to run on device for testing?
how to build for production? (and where are the keys, how to sign them)


when updating, update the version number ...
  update the major version when the app is completely overhauled
  update the minor version whenever translation keys are added, removed, or changed (translation keys used only in surveys don't count). Or if interactions with surveys change (what is passed to them, or what is rec'd by them)
  update the patch version whenever translation text is merely changed, and/or translation keys and text are added/removed/changed only in surveys
...THEN build. build externals, or the app, or whatever.

an update to the major version or minor version means that an old version of the app won't work properly with the latest external stuff -- the external stuff is always at the latest version.

update the version number both in config.xml and package.json? and the environments files. Update the version number when updating either the app or the externals.
publish the app whenever there's an update to the major or minor version, or a patch change other than just the 18n or surveys files


when testing updates to i18n files, you may not see any changes... because the app is using the remote version of the files, or the cached version!