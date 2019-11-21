# Truckers Against Trafficking (TAT) mobile app

This mobile app helps to combat human trafficking in the trucking industry.

Features:
* A reference of how to recognize signs of trafficking
* Quick links to call or email the national human trafficking hotline, to report instances of trafficking
* Educational resources: videos, news stories, books, documentaries, etc
* A volunteer portal, for TAT volunteers to report their activity
* Dual language: English and Spanish

This app is built with Ionic (which uses Angular) and packaged as a native app using Cordova.

## Quickstart

`npm install` and `npm start` to run the app in the browser. Some features will not work in the browser.

To develop new volunteer features without touching the live Salesforce database, you'll need to run a local copy of the Salesforce proxy (see the "Salesforce proxy" section below). Edit `environment.ts` and change `proxyServerURL` and `externalResourcesURL`.

## Updating external resources

The app fetches a few things from a server during runtime, such as translation files and volunteer survey code. These are kept in the `external/`. After making updates and incrementing the app's version number, run `npm run build-external` and copy the resources from `external/dist/` to the proxy server.

## Services

### Firebase

The app uses Firebase for:

* volunteer user authentication
* storing URLs of videos and some images, so these can be updated without pushing an app update
* storing some volunteer registration codes
* push notifications

### Salesforce

Salesforce stores:

* the data from all volunteer reports
* volunteers' personal user data

### Salesforce proxy

The Salesforce proxy provides a secure way for the app's users to fetch data from and insert data into Salesforce.

The proxy also stores i18n data and the code for the volunteer surveys; these are fetched by the mobile app, and can be updated without pushing an app update.

See more about the proxy at the (live instance)[https://app-proxy.truckersagainsttrafficking.org/] or the (repo)[https://github.com/ransoing/tatproxy]

## Helpful tools

(i18n-editor)[https://github.com/jcbvm/i18n-editor] - Use this to manage translations

## Building and deploying

The app cannot be built with PhoneGap, as it uses plugins that PhoneGap does not support. So, you must install the relevant SDKs and run cordova commands to build the app.
