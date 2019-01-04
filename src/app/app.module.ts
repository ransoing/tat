// angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// NG Translate
import { TranslateModule, TranslateLoader, TranslateCompiler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, './assets/i18n/trx_', '.json' );
}
import { SelfReferentialCompiler } from './translate-compiler';

// ionic
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// native cordova/ionic
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

// firebase and firebase auth
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
/*
@@
AngularFireDatabaseModule
AngularFireFunctionsModule
AngularFirestoreModule
AngularFireStorageModule
AngularFireMessagingModule
*/
const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'redirect',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      scopes: [ 'email' ]
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<@@your-tos-link>',
  privacyPolicyUrl: '<@@your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

// app
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalGuard, AuthGuard } from './guards';
import {
  PlacesComponent, EmailReportComponent, WhatToReportComponent, VideosComponent, RecommendedBooksComponent,
  AboutTatComponent, HumanTraffickingLawsComponent, VolunteerSettingsComponent, VolunteerResourcesComponent, HoursLogComponent,
  HoursLogFormComponent, FeedbackComponent, PhotosComponent, PostOutreachSelectionComponent, TrainingVideoComponent, LoginComponent,
  CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent
} from './modals';
import {
  POSPart1Page, POSPart2Page, POSPart3Page, POSPart4Page,
  PORPart1Page, PORPart2Page, PORPart3Page
} from './pages';

@NgModule({
  declarations: [
    AppComponent,
    PlacesComponent, EmailReportComponent, WhatToReportComponent, VideosComponent, RecommendedBooksComponent,
    AboutTatComponent, HumanTraffickingLawsComponent, VolunteerSettingsComponent, VolunteerResourcesComponent, HoursLogComponent,
    HoursLogFormComponent, FeedbackComponent, PhotosComponent, PostOutreachSelectionComponent, TrainingVideoComponent, LoginComponent,
    CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent,
    POSPart1Page, POSPart2Page, POSPart3Page, POSPart4Page,
    PORPart1Page, PORPart2Page, PORPart3Page
  ],
  entryComponents: [
    PlacesComponent, EmailReportComponent, WhatToReportComponent, VideosComponent, RecommendedBooksComponent,
    AboutTatComponent, HumanTraffickingLawsComponent, VolunteerSettingsComponent, VolunteerResourcesComponent, HoursLogComponent,
    HoursLogFormComponent, FeedbackComponent, PhotosComponent, PostOutreachSelectionComponent, TrainingVideoComponent, LoginComponent,
    CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent,
    POSPart1Page, POSPart2Page, POSPart3Page, POSPart4Page,
    PORPart1Page, PORPart2Page, PORPart3Page
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: SelfReferentialCompiler
      }
    }),
    AngularFireModule.initializeApp( environment.firebaseConfig ),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot( firebaseUiAuthConfig )
  ],
  providers: [
    StatusBar, SplashScreen, Dialogs, Network, AndroidPermissions,
    ModalGuard, AuthGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
