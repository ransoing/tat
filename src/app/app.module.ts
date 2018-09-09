import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  WhatToReportComponent, VideosComponent, RecommendedBooksComponent, AboutTatComponent, HumanTraffickingLawsComponent,
  CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent
} from './modals';

@NgModule({
  declarations: [
    AppComponent,
    WhatToReportComponent, VideosComponent, RecommendedBooksComponent, AboutTatComponent, HumanTraffickingLawsComponent,
    CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent
  ],
  entryComponents: [
    WhatToReportComponent, VideosComponent, RecommendedBooksComponent, AboutTatComponent, HumanTraffickingLawsComponent,
    CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
