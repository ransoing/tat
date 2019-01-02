(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[29],{

/***/ "./node_modules/@ionic/core/dist/esm/es5/build/8xoefha8.sc.entry.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/es5/build/8xoefha8.sc.entry.js ***!
  \**************************************************************************/
/*! exports provided: IonReorder, IonReorderGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IonReorder", function() { return Reorder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IonReorderGroup", function() { return ReorderGroup; });
/* harmony import */ var _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/tslib.js */ "./node_modules/@ionic/core/dist/esm/es5/polyfills/tslib.js");
/* harmony import */ var _ionic_core_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ionic.core.js */ "./node_modules/@ionic/core/dist/esm/es5/ionic.core.js");
/* harmony import */ var _chunk_12e0f551_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chunk-12e0f551.js */ "./node_modules/@ionic/core/dist/esm/es5/build/chunk-12e0f551.js");

/*!
 * (C) Ionic http://ionicframework.com - MIT License
 * Built with http://stenciljs.com
 */


var Reorder = /** @class */ (function () {
    function Reorder() {
    }
    Reorder.prototype.render = function () {
        return (Object(_ionic_core_js__WEBPACK_IMPORTED_MODULE_1__["h"])("slot", null, Object(_ionic_core_js__WEBPACK_IMPORTED_MODULE_1__["h"])("ion-icon", { name: "reorder", lazy: false, class: "reorder-icon" })));
    };
    Object.defineProperty(Reorder, "is", {
        get: function () { return "ion-reorder"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reorder, "encapsulation", {
        get: function () { return "shadow"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reorder, "style", {
        get: function () { return "[slot].sc-ion-reorder-md-h{display:none;line-height:0;z-index:100}.reorder-icon.sc-ion-reorder-md{display:block;font-size:31px;opacity:.3}"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reorder, "styleMode", {
        get: function () { return "md"; },
        enumerable: true,
        configurable: true
    });
    return Reorder;
}());
var ReorderGroup = /** @class */ (function () {
    function ReorderGroup() {
        this.lastToIndex = -1;
        this.cachedHeights = [];
        this.scrollElTop = 0;
        this.scrollElBottom = 0;
        this.scrollElInitial = 0;
        this.containerTop = 0;
        this.containerBottom = 0;
        this.activated = false;
        this.disabled = true;
    }
    ReorderGroup.prototype.disabledChanged = function () {
        if (this.gesture) {
            this.gesture.setDisabled(this.disabled);
        }
    };
    ReorderGroup.prototype.componentDidLoad = function () {
        return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var contentEl, _a, _b;
            var _this = this;
            return _polyfills_tslib_js__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_c) {
                switch (_c.label) {
                    case 0:
                        contentEl = this.el.closest('ion-content');
                        if (!contentEl) return [3 /*break*/, 3];
                        return [4 /*yield*/, contentEl.componentOnReady()];
                    case 1:
                        _c.sent();
                        _a = this;
                        return [4 /*yield*/, contentEl.getScrollElement()];
                    case 2:
                        _a.scrollEl = _c.sent();
                        _c.label = 3;
                    case 3:
                        _b = this;
                        return [4 /*yield*/, __webpack_require__.e(/*! import() */ 162).then(__webpack_require__.bind(null, /*! ./gesture.js */ "./node_modules/@ionic/core/dist/esm/es5/build/gesture.js"))];
                    case 4:
                        _b.gesture = (_c.sent()).createGesture({
                            el: this.doc.body,
                            queue: this.queue,
                            gestureName: 'reorder',
                            gesturePriority: 90,
                            disableScroll: true,
                            threshold: 0,
                            direction: 'y',
                            passive: false,
                            canStart: function (detail) { return _this.canStart(detail); },
                            onStart: function (ev) { return _this.onStart(ev); },
                            onMove: function (ev) { return _this.onMove(ev); },
                            onEnd: function () { return _this.onEnd(); },
                        });
                        this.disabledChanged();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReorderGroup.prototype.componentDidUnload = function () {
        this.onEnd();
    };
    ReorderGroup.prototype.canStart = function (ev) {
        if (this.selectedItemEl) {
            return false;
        }
        var target = ev.event.target;
        var reorderEl = target.closest('ion-reorder');
        if (!reorderEl) {
            return false;
        }
        var item = findReorderItem(reorderEl, this.el);
        if (!item) {
            console.error('reorder node not found');
            return false;
        }
        ev.data = item;
        return true;
    };
    ReorderGroup.prototype.onStart = function (ev) {
        ev.event.preventDefault();
        var item = this.selectedItemEl = ev.data;
        var heights = this.cachedHeights;
        heights.length = 0;
        var el = this.el;
        var children = el.children;
        if (!children || children.length === 0) {
            return;
        }
        var sum = 0;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            sum += child.offsetHeight;
            heights.push(sum);
            child.$ionIndex = i;
        }
        var box = this.el.getBoundingClientRect();
        this.containerTop = box.top;
        this.containerBottom = box.bottom;
        if (this.scrollEl) {
            var scrollBox = this.scrollEl.getBoundingClientRect();
            this.scrollElInitial = this.scrollEl.scrollTop;
            this.scrollElTop = scrollBox.top + AUTO_SCROLL_MARGIN;
            this.scrollElBottom = scrollBox.bottom - AUTO_SCROLL_MARGIN;
        }
        else {
            this.scrollElInitial = 0;
            this.scrollElTop = 0;
            this.scrollElBottom = 0;
        }
        this.lastToIndex = indexForItem(item);
        this.selectedItemHeight = item.offsetHeight;
        this.activated = true;
        item.classList.add(ITEM_REORDER_SELECTED);
        Object(_chunk_12e0f551_js__WEBPACK_IMPORTED_MODULE_2__["k"])();
    };
    ReorderGroup.prototype.onMove = function (ev) {
        var selectedItem = this.selectedItemEl;
        if (!selectedItem) {
            return;
        }
        var scroll = this.autoscroll(ev.currentY);
        var top = this.containerTop - scroll;
        var bottom = this.containerBottom - scroll;
        var currentY = Math.max(top, Math.min(ev.currentY, bottom));
        var deltaY = scroll + currentY - ev.startY;
        var normalizedY = currentY - top;
        var toIndex = this.itemIndexForTop(normalizedY);
        if (toIndex !== this.lastToIndex) {
            var fromIndex = indexForItem(selectedItem);
            this.lastToIndex = toIndex;
            Object(_chunk_12e0f551_js__WEBPACK_IMPORTED_MODULE_2__["i"])();
            this.reorderMove(fromIndex, toIndex);
        }
        selectedItem.style.transform = "translateY(" + deltaY + "px)";
    };
    ReorderGroup.prototype.onEnd = function () {
        var _this = this;
        this.activated = false;
        var selectedItem = this.selectedItemEl;
        if (!selectedItem) {
            return;
        }
        var children = this.el.children;
        var toIndex = this.lastToIndex;
        var fromIndex = indexForItem(selectedItem);
        var ref = (fromIndex < toIndex)
            ? children[toIndex + 1]
            : children[toIndex];
        this.el.insertBefore(selectedItem, ref);
        var len = children.length;
        for (var i = 0; i < len; i++) {
            children[i].style['transform'] = '';
        }
        var reorderInactive = function () {
            if (_this.selectedItemEl) {
                _this.selectedItemEl.style.transition = '';
                _this.selectedItemEl.classList.remove(ITEM_REORDER_SELECTED);
                _this.selectedItemEl = undefined;
            }
        };
        if (toIndex === fromIndex) {
            selectedItem.style.transition = 'transform 200ms ease-in-out';
            setTimeout(reorderInactive, 200);
        }
        else {
            reorderInactive();
            this.ionItemReorder.emit({
                from: fromIndex,
                to: toIndex
            });
        }
        Object(_chunk_12e0f551_js__WEBPACK_IMPORTED_MODULE_2__["j"])();
    };
    ReorderGroup.prototype.itemIndexForTop = function (deltaY) {
        var heights = this.cachedHeights;
        var i = 0;
        for (i = 0; i < heights.length; i++) {
            if (heights[i] > deltaY) {
                break;
            }
        }
        return i;
    };
    ReorderGroup.prototype.reorderMove = function (fromIndex, toIndex) {
        var itemHeight = this.selectedItemHeight;
        var children = this.el.children;
        for (var i = 0; i < children.length; i++) {
            var style = children[i].style;
            var value = '';
            if (i > fromIndex && i <= toIndex) {
                value = "translateY(" + -itemHeight + "px)";
            }
            else if (i < fromIndex && i >= toIndex) {
                value = "translateY(" + itemHeight + "px)";
            }
            style['transform'] = value;
        }
    };
    ReorderGroup.prototype.autoscroll = function (posY) {
        if (!this.scrollEl) {
            return 0;
        }
        var amount = 0;
        if (posY < this.scrollElTop) {
            amount = -SCROLL_JUMP;
        }
        else if (posY > this.scrollElBottom) {
            amount = SCROLL_JUMP;
        }
        if (amount !== 0) {
            this.scrollEl.scrollBy(0, amount);
        }
        return this.scrollEl.scrollTop - this.scrollElInitial;
    };
    ReorderGroup.prototype.hostData = function () {
        return {
            class: {
                'reorder-enabled': !this.disabled,
                'reorder-list-active': this.activated,
            }
        };
    };
    Object.defineProperty(ReorderGroup, "is", {
        get: function () { return "ion-reorder-group"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReorderGroup, "properties", {
        get: function () {
            return {
                "activated": {
                    "state": true
                },
                "disabled": {
                    "type": Boolean,
                    "attr": "disabled",
                    "watchCallbacks": ["disabledChanged"]
                },
                "doc": {
                    "context": "document"
                },
                "el": {
                    "elementRef": true
                },
                "queue": {
                    "context": "queue"
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReorderGroup, "events", {
        get: function () {
            return [{
                    "name": "ionItemReorder",
                    "method": "ionItemReorder",
                    "bubbles": true,
                    "cancelable": true,
                    "composed": true
                }];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReorderGroup, "style", {
        get: function () { return ".reorder-list-active>*{-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s;will-change:transform}.reorder-enabled{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.reorder-enabled ion-reorder{display:block;cursor:-webkit-grab;cursor:grab;pointer-events:all;-ms-touch-action:none;touch-action:none}.reorder-selected,.reorder-selected ion-reorder{cursor:-webkit-grabbing;cursor:grabbing}.reorder-selected{position:relative;-webkit-transition:none!important;transition:none!important;-webkit-box-shadow:0 0 10px rgba(0,0,0,.4);box-shadow:0 0 10px rgba(0,0,0,.4);opacity:.8;z-index:100}.reorder-visible ion-reorder .reorder-icon{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}"; },
        enumerable: true,
        configurable: true
    });
    return ReorderGroup;
}());
function indexForItem(element) {
    return element['$ionIndex'];
}
function findReorderItem(node, container) {
    var nested = 0;
    var parent;
    while (node && nested < 6) {
        parent = node.parentNode;
        if (parent === container) {
            return node;
        }
        node = parent;
        nested++;
    }
    return undefined;
}
var AUTO_SCROLL_MARGIN = 60;
var SCROLL_JUMP = 10;
var ITEM_REORDER_SELECTED = 'reorder-selected';



/***/ }),

/***/ "./node_modules/@ionic/core/dist/esm/es5/polyfills/tslib.js":
/*!******************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/es5/polyfills/tslib.js ***!
  \******************************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __await, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
// REV: 9dd9aa322c893e5e0b3f1609b1126314ccf37bbb

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
          t[p[i]] = s[p[i]];
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

function __exportStar(m, exports) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
  var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
  if (m) return m.call(o);
  return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result.default = mod;
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

/***/ })

}]);
//# sourceMappingURL=29.js.map