(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tabs-tabs-module"],{

/***/ "./src/app/tabs/tabs.module.ts":
/*!*************************************!*\
  !*** ./src/app/tabs/tabs.module.ts ***!
  \*************************************/
/*! exports provided: TabsPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabsPageModule", function() { return TabsPageModule; });
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _components_common_components_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/common-components.module */ "./src/app/components/common-components.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _tabs_router_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tabs.router.module */ "./src/app/tabs/tabs.router.module.ts");
/* harmony import */ var _tabs_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tabs.page */ "./src/app/tabs/tabs.page.ts");
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pages */ "./src/app/pages/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var TabsPageModule = /** @class */ (function () {
    function TabsPageModule() {
    }
    TabsPageModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _ionic_angular__WEBPACK_IMPORTED_MODULE_0__["IonicModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _tabs_router_module__WEBPACK_IMPORTED_MODULE_5__["TabsPageRoutingModule"],
                _components_common_components_module__WEBPACK_IMPORTED_MODULE_3__["CommonComponentsModule"],
                _pages__WEBPACK_IMPORTED_MODULE_7__["HomePageModule"], _pages__WEBPACK_IMPORTED_MODULE_7__["RedFlagsPageModule"], _pages__WEBPACK_IMPORTED_MODULE_7__["ReportPageModule"], _pages__WEBPACK_IMPORTED_MODULE_7__["ResourcesPageModule"], _pages__WEBPACK_IMPORTED_MODULE_7__["VolunteerPageModule"]
            ],
            declarations: [_tabs_page__WEBPACK_IMPORTED_MODULE_6__["TabsPage"]]
        })
    ], TabsPageModule);
    return TabsPageModule;
}());



/***/ }),

/***/ "./src/app/tabs/tabs.page.html":
/*!*************************************!*\
  !*** ./src/app/tabs/tabs.page.html ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-tabs>\n  <ion-tab label=\"{{ 'nav.home' | translate }}\" icon=\"wheel\" href=\"/tabs/(home:home)\">\n    <ion-router-outlet name=\"home\"></ion-router-outlet>\n  </ion-tab>\n  <ion-tab label=\"{{ 'nav.report' | translate }}\" icon=\"triangle\" href=\"/tabs/(report:report)\">\n    <ion-router-outlet name=\"report\"></ion-router-outlet>\n  </ion-tab>\n  <ion-tab label=\"{{ 'nav.redFlags' | translate }}\" icon=\"redflag\" href=\"/tabs/(red-flags:red-flags)\">\n    <ion-router-outlet name=\"red-flags\"></ion-router-outlet>\n  </ion-tab>\n  <ion-tab label=\"{{ 'nav.resources' | translate }}\" icon=\"magnifier\" href=\"/tabs/(resources:resources)\">\n    <ion-router-outlet name=\"resources\"></ion-router-outlet>\n  </ion-tab>\n  <ion-tab label=\"{{ 'nav.volunteer' | translate }}\" icon=\"volunteer\" href=\"/tabs/(volunteer:volunteer)\">\n    <ion-router-outlet name=\"volunteer\"></ion-router-outlet>\n  </ion-tab>\n</ion-tabs>\n"

/***/ }),

/***/ "./src/app/tabs/tabs.page.scss":
/*!*************************************!*\
  !*** ./src/app/tabs/tabs.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/tabs/tabs.page.ts":
/*!***********************************!*\
  !*** ./src/app/tabs/tabs.page.ts ***!
  \***********************************/
/*! exports provided: TabsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabsPage", function() { return TabsPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TabsPage = /** @class */ (function () {
    function TabsPage() {
    }
    TabsPage.prototype.ngOnInit = function () {
        // when the tab icons have been fully initialized, use brute force to alter some styles in the shadow DOM
        var hackInterval = setInterval(function () {
            try {
                var styleEl = document.querySelector('ion-tabs').shadowRoot.querySelector('ion-tabbar').shadowRoot.querySelector('style');
                // get rid of some goofy styling for active tab label text and for active icon
                styleEl.innerHTML = styleEl.innerHTML.replace('--label-transform:scale3d(1.16667, 1.16667, 1);', '').replace(/--icon-transform-selected:translate3d\(.*?\)/g, '--icon-transform-selected:none');
                clearInterval(hackInterval);
            }
            catch (e) {
                // do nothing. just let the interval run again
            }
        }, 16);
        setTimeout(function () { return clearInterval(hackInterval); }, 5000);
    };
    TabsPage = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tabs',
            template: __webpack_require__(/*! ./tabs.page.html */ "./src/app/tabs/tabs.page.html"),
            styles: [__webpack_require__(/*! ./tabs.page.scss */ "./src/app/tabs/tabs.page.scss")]
        })
    ], TabsPage);
    return TabsPage;
}());



/***/ }),

/***/ "./src/app/tabs/tabs.router.module.ts":
/*!********************************************!*\
  !*** ./src/app/tabs/tabs.router.module.ts ***!
  \********************************************/
/*! exports provided: TabsPageRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabsPageRoutingModule", function() { return TabsPageRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _guards__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../guards */ "./src/app/guards/index.ts");
/* harmony import */ var _tabs_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tabs.page */ "./src/app/tabs/tabs.page.ts");
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pages */ "./src/app/pages/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [
    {
        path: 'tabs',
        component: _tabs_page__WEBPACK_IMPORTED_MODULE_3__["TabsPage"],
        canDeactivate: [_guards__WEBPACK_IMPORTED_MODULE_2__["ModalGuard"]],
        children: [
            {
                path: '',
                redirectTo: '/tabs/(home:home)',
                pathMatch: 'full',
                canDeactivate: [_guards__WEBPACK_IMPORTED_MODULE_2__["ModalGuard"]]
            }, {
                path: 'home',
                outlet: 'home',
                component: _pages__WEBPACK_IMPORTED_MODULE_4__["HomePage"],
                canDeactivate: [_guards__WEBPACK_IMPORTED_MODULE_2__["ModalGuard"]]
            }, {
                path: 'report',
                outlet: 'report',
                component: _pages__WEBPACK_IMPORTED_MODULE_4__["ReportPage"],
                canDeactivate: [_guards__WEBPACK_IMPORTED_MODULE_2__["ModalGuard"]]
            }, {
                path: 'red-flags',
                outlet: 'red-flags',
                component: _pages__WEBPACK_IMPORTED_MODULE_4__["RedFlagsPage"],
                canDeactivate: [_guards__WEBPACK_IMPORTED_MODULE_2__["ModalGuard"]]
            }, {
                path: 'resources',
                outlet: 'resources',
                component: _pages__WEBPACK_IMPORTED_MODULE_4__["ResourcesPage"],
                canDeactivate: [_guards__WEBPACK_IMPORTED_MODULE_2__["ModalGuard"]]
            }, {
                path: 'volunteer',
                outlet: 'volunteer',
                component: _pages__WEBPACK_IMPORTED_MODULE_4__["VolunteerPage"],
                canDeactivate: [_guards__WEBPACK_IMPORTED_MODULE_2__["ModalGuard"]],
                canActivate: [_guards__WEBPACK_IMPORTED_MODULE_2__["AuthGuard"]]
            }
        ]
    }, {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full'
    }
];
var TabsPageRoutingModule = /** @class */ (function () {
    function TabsPageRoutingModule() {
    }
    TabsPageRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], TabsPageRoutingModule);
    return TabsPageRoutingModule;
}());



/***/ })

}]);
//# sourceMappingURL=tabs-tabs-module.js.map