(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./node_modules/@ionic/core/dist/esm/es5/build/chunk-12e0f551.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/es5/build/chunk-12e0f551.js ***!
  \***********************************************************************/
/*! exports provided: a, b, c, d, e, f, g, h, i, j, k, l */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BACKDROP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return dismiss; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return eventMethod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isCancel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return present; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return createOverlay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return dismissOverlay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return getOverlay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return hapticSelectionChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return hapticSelectionEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return hapticSelectionStart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return hapticSelection; });
/* harmony import */ var _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/tslib.js */ "./node_modules/@ionic/core/dist/esm/es5/polyfills/tslib.js");

var lastId = 0;
function createOverlay(element, opts) {
    var doc = element.ownerDocument;
    connectListeners(doc);
    Object.assign(element, opts);
    element.classList.add('ion-page-invisible');
    var overlayIndex = lastId++;
    element.overlayIndex = overlayIndex;
    if (!element.hasAttribute('id')) {
        element.id = "ion-overlay-" + overlayIndex;
    }
    getAppRoot(doc).appendChild(element);
    return element.componentOnReady();
}
function closeTopOverlay(doc) {
    var lastOverlay = getOverlay(doc);
    if (lastOverlay && lastOverlay.backdropDismiss) {
        return lastOverlay.dismiss(undefined, BACKDROP);
    }
    return Promise.resolve();
}
function connectListeners(doc) {
    if (lastId === 0) {
        lastId = 1;
        doc.addEventListener('ionBackButton', function (ev) {
            ev.detail.register(100, function () { return closeTopOverlay(doc); });
        });
        doc.addEventListener('keyup', function (ev) {
            if (ev.key === 'Escape') {
                closeTopOverlay(doc);
            }
        });
    }
}
function dismissOverlay(doc, data, role, overlayTag, id) {
    var overlay = getOverlay(doc, overlayTag, id);
    if (!overlay) {
        return Promise.reject('overlay does not exist');
    }
    return overlay.dismiss(data, role);
}
function getOverlays(doc, overlayTag) {
    var overlays = Array.from(getAppRoot(doc).children);
    if (overlayTag === undefined) {
        return overlays;
    }
    overlayTag = overlayTag.toUpperCase();
    return overlays.filter(function (c) { return c.tagName === overlayTag; });
}
function getOverlay(doc, overlayTag, id) {
    var overlays = getOverlays(doc, overlayTag);
    return (id === undefined)
        ? overlays[overlays.length - 1]
        : overlays.find(function (o) { return o.id === id; });
}
function present(overlay, name, iosEnterAnimation, mdEnterAnimation, opts) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var animationBuilder, completed;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (overlay.presented) {
                        return [2 /*return*/];
                    }
                    overlay.presented = true;
                    overlay.willPresent.emit();
                    animationBuilder = (overlay.enterAnimation)
                        ? overlay.enterAnimation
                        : overlay.config.get(name, overlay.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
                    return [4 /*yield*/, overlayAnimation(overlay, animationBuilder, overlay.el, opts)];
                case 1:
                    completed = _a.sent();
                    if (completed) {
                        overlay.didPresent.emit();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function dismiss(overlay, data, role, name, iosLeaveAnimation, mdLeaveAnimation, opts) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var animationBuilder, err_1;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!overlay.presented) {
                        return [2 /*return*/, false];
                    }
                    overlay.presented = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    overlay.willDismiss.emit({ data: data, role: role });
                    animationBuilder = (overlay.leaveAnimation)
                        ? overlay.leaveAnimation
                        : overlay.config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
                    return [4 /*yield*/, overlayAnimation(overlay, animationBuilder, overlay.el, opts)];
                case 2:
                    _a.sent();
                    overlay.didDismiss.emit({ data: data, role: role });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 4];
                case 4:
                    overlay.el.remove();
                    return [2 /*return*/, true];
            }
        });
    });
}
function getAppRoot(doc) {
    return doc.querySelector('ion-app') || doc.body;
}
function overlayAnimation(overlay, animationBuilder, baseEl, opts) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var aniRoot, animation, _a;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!overlay.animation) return [3 /*break*/, 1];
                    overlay.animation.destroy();
                    overlay.animation = undefined;
                    return [2 /*return*/, false];
                case 1:
                    baseEl.classList.remove('ion-page-invisible');
                    aniRoot = baseEl.shadowRoot || overlay.el;
                    _a = overlay;
                    return [4 /*yield*/, overlay.animationCtrl.create(animationBuilder, aniRoot, opts)];
                case 2:
                    animation = _a.animation = _b.sent();
                    overlay.animation = animation;
                    if (!overlay.animated) {
                        animation.duration(0);
                    }
                    if (overlay.keyboardClose) {
                        animation.beforeAddWrite(function () {
                            var activeElement = baseEl.ownerDocument.activeElement;
                            if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
                                activeElement.blur();
                            }
                        });
                    }
                    return [4 /*yield*/, animation.playAsync()];
                case 3:
                    _b.sent();
                    animation.destroy();
                    overlay.animation = undefined;
                    return [2 /*return*/, animation.hasCompleted];
            }
        });
    });
}
function eventMethod(element, eventName) {
    var resolve;
    var promise = new Promise(function (r) { return resolve = r; });
    onceEvent(element, eventName, function (event) {
        resolve(event.detail);
    });
    return promise;
}
function onceEvent(element, eventName, callback) {
    var handler = function (ev) {
        element.removeEventListener(eventName, handler);
        callback(ev);
    };
    element.addEventListener(eventName, handler);
}
function isCancel(role) {
    return role === 'cancel' || role === BACKDROP;
}
var BACKDROP = 'backdrop';
function hapticSelection() {
    var engine = window.TapticEngine;
    if (engine) {
        engine.selection();
    }
}
function hapticSelectionStart() {
    var engine = window.TapticEngine;
    if (engine) {
        engine.gestureSelectionStart();
    }
}
function hapticSelectionChanged() {
    var engine = window.TapticEngine;
    if (engine) {
        engine.gestureSelectionChanged();
    }
}
function hapticSelectionEnd() {
    var engine = window.TapticEngine;
    if (engine) {
        engine.gestureSelectionEnd();
    }
}



/***/ }),

/***/ "./node_modules/@ionic/core/dist/esm/es5/build/chunk-5f438245.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/es5/build/chunk-5f438245.js ***!
  \***********************************************************************/
/*! exports provided: a, b, c, d */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return deepReady; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return lifecycle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setPageHidden; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return transition; });
/* harmony import */ var _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/tslib.js */ "./node_modules/@ionic/core/dist/esm/es5/polyfills/tslib.js");

var iosTransitionAnimation = function () { return __webpack_require__.e(/*! import() */ 163).then(__webpack_require__.bind(null, /*! ./ios.transition.js */ "./node_modules/@ionic/core/dist/esm/es5/build/ios.transition.js")); };
var mdTransitionAnimation = function () { return __webpack_require__.e(/*! import() */ 164).then(__webpack_require__.bind(null, /*! ./md.transition.js */ "./node_modules/@ionic/core/dist/esm/es5/build/md.transition.js")); };
function transition(opts) {
    return new Promise(function (resolve, reject) {
        opts.queue.write(function () {
            beforeTransition(opts);
            runTransition(opts).then(function (result) {
                if (result.animation) {
                    result.animation.destroy();
                }
                afterTransition(opts);
                resolve(result);
            }, function (error) {
                afterTransition(opts);
                reject(error);
            });
        });
    });
}
function beforeTransition(opts) {
    var enteringEl = opts.enteringEl;
    var leavingEl = opts.leavingEl;
    setZIndex(enteringEl, leavingEl, opts.direction);
    if (opts.showGoBack) {
        enteringEl.classList.add('can-go-back');
    }
    else {
        enteringEl.classList.remove('can-go-back');
    }
    setPageHidden(enteringEl, false);
    if (leavingEl) {
        setPageHidden(leavingEl, false);
    }
}
function runTransition(opts) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var animationBuilder, ani;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAnimationBuilder(opts)];
                case 1:
                    animationBuilder = _a.sent();
                    ani = (animationBuilder)
                        ? animation(animationBuilder, opts)
                        : noAnimation(opts);
                    return [2 /*return*/, ani];
            }
        });
    });
}
function afterTransition(opts) {
    var enteringEl = opts.enteringEl;
    var leavingEl = opts.leavingEl;
    enteringEl.classList.remove('ion-page-invisible');
    if (leavingEl !== undefined) {
        leavingEl.classList.remove('ion-page-invisible');
    }
}
function getAnimationBuilder(opts) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var builder, _a;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!opts.leavingEl || !opts.animated || opts.duration === 0) {
                        return [2 /*return*/, undefined];
                    }
                    if (opts.animationBuilder) {
                        return [2 /*return*/, opts.animationBuilder];
                    }
                    if (!(opts.mode === 'ios')) return [3 /*break*/, 2];
                    return [4 /*yield*/, iosTransitionAnimation()];
                case 1:
                    _a = (_b.sent()).iosTransitionAnimation;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, mdTransitionAnimation()];
                case 3:
                    _a = (_b.sent()).mdTransitionAnimation;
                    _b.label = 4;
                case 4:
                    builder = _a;
                    return [2 /*return*/, builder];
            }
        });
    });
}
function animation(animationBuilder, opts) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var trns;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitForReady(opts, true)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, opts.animationCtrl.create(animationBuilder, opts.baseEl, opts)];
                case 2:
                    trns = _a.sent();
                    fireWillEvents(opts.window, opts.enteringEl, opts.leavingEl);
                    return [4 /*yield*/, playTransition(trns, opts)];
                case 3:
                    _a.sent();
                    if (trns.hasCompleted) {
                        fireDidEvents(opts.window, opts.enteringEl, opts.leavingEl);
                    }
                    return [2 /*return*/, {
                            hasCompleted: trns.hasCompleted,
                            animation: trns
                        }];
            }
        });
    });
}
function noAnimation(opts) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var enteringEl, leavingEl;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0:
                    enteringEl = opts.enteringEl;
                    leavingEl = opts.leavingEl;
                    return [4 /*yield*/, waitForReady(opts, false)];
                case 1:
                    _a.sent();
                    fireWillEvents(opts.window, enteringEl, leavingEl);
                    fireDidEvents(opts.window, enteringEl, leavingEl);
                    return [2 /*return*/, {
                            hasCompleted: true
                        }];
            }
        });
    });
}
function waitForReady(opts, defaultDeep) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var deep, promises;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0:
                    deep = opts.deepWait !== undefined ? opts.deepWait : defaultDeep;
                    promises = deep ? [
                        deepReady(opts.enteringEl),
                        deepReady(opts.leavingEl),
                    ] : [
                        shallowReady(opts.enteringEl),
                        shallowReady(opts.leavingEl),
                    ];
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, notifyViewReady(opts.viewIsReady, opts.enteringEl)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function notifyViewReady(viewIsReady, enteringEl) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!viewIsReady) return [3 /*break*/, 2];
                    return [4 /*yield*/, viewIsReady(enteringEl)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function playTransition(trans, opts) {
    var progressCallback = opts.progressCallback;
    var promise = new Promise(function (resolve) { return trans.onFinish(resolve); });
    if (progressCallback) {
        trans.progressStart();
        progressCallback(trans);
    }
    else {
        trans.play();
    }
    return promise;
}
function fireWillEvents(win, enteringEl, leavingEl) {
    lifecycle(win, leavingEl, "ionViewWillLeave");
    lifecycle(win, enteringEl, "ionViewWillEnter");
}
function fireDidEvents(win, enteringEl, leavingEl) {
    lifecycle(win, enteringEl, "ionViewDidEnter");
    lifecycle(win, leavingEl, "ionViewDidLeave");
}
function lifecycle(win, el, eventName) {
    if (el) {
        var CEvent = win.CustomEvent;
        var event = new CEvent(eventName, {
            bubbles: false,
            cancelable: false,
        });
        el.dispatchEvent(event);
    }
}
function shallowReady(el) {
    if (el && el.componentOnReady) {
        return el.componentOnReady();
    }
    return Promise.resolve();
}
function deepReady(el) {
    return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var element, stencilEl;
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0:
                    element = el;
                    if (!element) return [3 /*break*/, 4];
                    if (!(element.componentOnReady != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, element.componentOnReady()];
                case 1:
                    stencilEl = _a.sent();
                    if (stencilEl != null) {
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, Promise.all(Array.from(element.children).map(deepReady))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function setPageHidden(el, hidden) {
    if (hidden) {
        el.setAttribute('aria-hidden', 'true');
        el.classList.add('ion-page-hidden');
    }
    else {
        el.hidden = false;
        el.removeAttribute('aria-hidden');
        el.classList.remove('ion-page-hidden');
    }
}
function setZIndex(enteringEl, leavingEl, direction) {
    if (enteringEl !== undefined) {
        enteringEl.style.zIndex = (direction === 'back')
            ? '99'
            : '101';
    }
    if (leavingEl !== undefined) {
        leavingEl.style.zIndex = '100';
    }
}



/***/ })

}]);
//# sourceMappingURL=common.js.map