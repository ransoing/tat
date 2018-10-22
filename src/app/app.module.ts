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
  return new TranslateHttpLoader( http, './assets/i18n/', '.json' );
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

// app
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalGuard } from './modal-guard.service';
import {
  PlacesComponent, EmailReportComponent, WhatToReportComponent, VideosComponent, RecommendedBooksComponent, AboutTatComponent, HumanTraffickingLawsComponent,
  CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent
} from './modals';

@NgModule({
  declarations: [
    AppComponent,
    PlacesComponent, EmailReportComponent, WhatToReportComponent, VideosComponent, RecommendedBooksComponent, AboutTatComponent, HumanTraffickingLawsComponent,
    CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent
  ],
  entryComponents: [
    PlacesComponent, EmailReportComponent, WhatToReportComponent, VideosComponent, RecommendedBooksComponent, AboutTatComponent, HumanTraffickingLawsComponent,
    CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent
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
  ],
  providers: [
    StatusBar, SplashScreen, Dialogs, Network, AndroidPermissions,
    ModalGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
