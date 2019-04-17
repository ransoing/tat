var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
define("src/app/models/survey", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SurveyFieldType;
    (function (SurveyFieldType) {
        SurveyFieldType["TEXT"] = "text";
        SurveyFieldType["EMAIL"] = "email";
        SurveyFieldType["TEL"] = "tel";
        SurveyFieldType["NUMBER"] = "number";
        SurveyFieldType["SELECT"] = "select";
        SurveyFieldType["CHOICE"] = "choice";
        SurveyFieldType["TEXTAREA"] = "textarea";
        SurveyFieldType["DATE"] = "date"; // datepicker popup
    })(SurveyFieldType = exports.SurveyFieldType || (exports.SurveyFieldType = {}));
});
define("src/app/models/user-data", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VolunteerType;
    (function (VolunteerType) {
        VolunteerType["TRUCK_STOP_VOLUNTEER"] = "truckStopVolunteer";
        VolunteerType["EVENT_VOLUNTEER"] = "freedomDriversVolunteer";
        VolunteerType["AMBASSADOR_VOLUNTEER"] = "ambassadorVolunteer";
    })(VolunteerType = exports.VolunteerType || (exports.VolunteerType = {}));
    var OutreachLocationType;
    (function (OutreachLocationType) {
        OutreachLocationType["CDL_SCHOOL"] = "cdlSchool";
        OutreachLocationType["TRUCKING_COMPANY"] = "truckingCompany";
        OutreachLocationType["TRUCK_STOP"] = "truckStop";
    })(OutreachLocationType = exports.OutreachLocationType || (exports.OutreachLocationType = {}));
    // bitmask flags for passing into fetchUserData()
    var UserDataRequestFlags;
    (function (UserDataRequestFlags) {
        UserDataRequestFlags[UserDataRequestFlags["BASIC_USER_DATA"] = 1] = "BASIC_USER_DATA";
        UserDataRequestFlags[UserDataRequestFlags["HOURS_LOGS"] = 2] = "HOURS_LOGS";
        UserDataRequestFlags[UserDataRequestFlags["UNFINISHED_ACTIVITIES"] = 4] = "UNFINISHED_ACTIVITIES";
        UserDataRequestFlags[UserDataRequestFlags["ALL"] = 7] = "ALL";
    })(UserDataRequestFlags = exports.UserDataRequestFlags || (exports.UserDataRequestFlags = {}));
});
define("external/surveys.external.service", ["require", "exports", "src/app/models/survey", "src/app/models/user-data"], function (require, exports, survey_1, user_data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // contains objects defining all surveys.
    var SurveyService = /** @class */ (function () {
        function SurveyService(userDataService, proxyAPI, miscService) {
            this.userDataService = userDataService;
            this.proxyAPI = proxyAPI;
            this.miscService = miscService;
            this._yesNoOptions = [
                { value: 'yes', labelTranslationKey: 'misc.buttons.yes' },
                { value: 'no', labelTranslationKey: 'misc.buttons.no' }
            ];
        }
        SurveyService.prototype.hoursLogSurvey = function () {
            var _this = this;
            return {
                pages: [{
                        // page 1
                        topTextTranslationKey: 'volunteer.forms.hoursLog.labels.describe',
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXTAREA,
                                name: 'description',
                                isRequired: true
                            }]
                    }, {
                        // page 2
                        fields: [{
                                type: survey_1.SurveyFieldType.DATE,
                                labelTranslationKey: 'volunteer.forms.hoursLog.labels.date',
                                name: 'date',
                                isRequired: true
                            }, {
                                type: survey_1.SurveyFieldType.NUMBER,
                                labelTranslationKey: 'volunteer.forms.hoursLog.labels.numHours',
                                name: 'numHours',
                                isRequired: true
                            }]
                    }],
                onSubmit: function (vals) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // modify some of the form values before submitting to the proxy
                                _a = vals;
                                return [4 /*yield*/, this.userDataService.firebaseUser.getIdToken()];
                            case 1:
                                // modify some of the form values before submitting to the proxy
                                _a.firebaseIdToken = _b.sent();
                                vals.date = this.miscService.dateToLocalYYYYMMDD(vals.date);
                                vals.numHours = parseFloat(vals.numHours);
                                // send to the proxy and show an error message if appropriate
                                return [2 /*return*/, this.genericProxyPOST('createHoursLogEntry', vals)];
                        }
                    });
                }); }
            };
        };
        SurveyService.prototype.preOutreachSurvey = function () {
            var _this = this;
            var udata = this.userDataService.data;
            return {
                pages: [{
                        // page 1
                        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatLocation',
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationName',
                                name: 'locationName',
                                isRequired: true
                            }, {
                                type: survey_1.SurveyFieldType.SELECT,
                                labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationType',
                                name: 'locationType',
                                options: [
                                    { value: user_data_1.OutreachLocationType.CDL_SCHOOL, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.cdlSchool' },
                                    { value: user_data_1.OutreachLocationType.TRUCK_STOP, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.truckStop' },
                                    { value: user_data_1.OutreachLocationType.TRUCKING_COMPANY, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.truckingCompany' }
                                ],
                                isRequired: true
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.address',
                                name: 'locationAddress',
                                isRequired: true
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.city',
                                name: 'locationCity',
                                isRequired: true
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.state',
                                name: 'locationState',
                                isRequired: true
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.zip',
                                name: 'locationZip',
                                isRequired: true
                            }]
                    }, {
                        // page 2
                        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.haveYouContacted',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'hasContactedManager',
                                options: this._yesNoOptions,
                                isRequired: true
                            }]
                    }, {
                        // page 3
                        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.areYouReady',
                        isVisible: function (vals) { return vals.hasContactedManager == 'yes'; },
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'isReadyToReceive',
                                options: this._yesNoOptions,
                                isRequired: true
                            }]
                    }, {
                        // page 4
                        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatAddress',
                        isVisible: function (vals) { return vals.hasContactedManager == 'yes' && vals.isReadyToReceive == 'yes'; },
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.address',
                                name: 'mailingAddress',
                                isRequired: true,
                                defaultValue: udata.address
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.city',
                                name: 'mailingCity',
                                isRequired: true,
                                defaultValue: udata.city
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.state',
                                name: 'mailingState',
                                isRequired: true,
                                defaultValue: udata.state
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.zip',
                                name: 'mailingZip',
                                isRequired: true,
                                defaultValue: udata.zip
                            }]
                    }],
                onSubmit: function (vals) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = vals;
                                return [4 /*yield*/, this.userDataService.firebaseUser.getIdToken()];
                            case 1:
                                _a.firebaseIdToken = _b.sent();
                                // convert some yes/no values to booleans
                                vals.hasContactedManager = vals.hasContactedManager === 'yes';
                                vals.isReadyToReceive = vals.isReadyToReceive === 'yes';
                                // send to the proxy and show an error message if appropriate
                                return [2 /*return*/, this.genericProxyPOST('createPreOutreachSurvey', vals)];
                        }
                    });
                }); }
            };
        };
        SurveyService.prototype.postOutreachSurvey = function (outreachTarget) {
            var _this = this;
            return {
                pages: [{
                        // page 1: truck stop
                        isVisible: function (vals) { return outreachTarget.type === user_data_1.OutreachLocationType.TRUCK_STOP; },
                        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'accomplishments',
                                multi: true,
                                // The form will submit the English versions of the text, but the user's language will be displayed
                                options: [{
                                        value: 'Truck stop is now distributing TAT materials at their location',
                                        labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.distributing'
                                    }, {
                                        value: 'Truck stop will now train employees with TAT materials',
                                        labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.training'
                                    }, {
                                        value: 'Truck stop has asked for an in-person training for all employees',
                                        labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.inPersonTraining'
                                    }, {
                                        value: 'Truck stop is open to having an outreach at their location to speak with drivers in an appropriate format',
                                        labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.hostOutreach'
                                    }]
                            }, {
                                type: survey_1.SurveyFieldType.TEXTAREA,
                                name: 'otherAccomplishments',
                                labelTranslationKey: 'misc.other'
                            }]
                    }, {
                        // page 2: CDL school
                        isVisible: function (vals) { return outreachTarget.type === user_data_1.OutreachLocationType.CDL_SCHOOL; },
                        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'accomplishments',
                                multi: true,
                                // The form will submit the English versions of the text, but the user's language will be displayed
                                options: [{
                                        value: 'CDL instructor will begin using TAT training with students',
                                        labelTranslationKey: 'volunteer.forms.postOutreach.labels.cdlSchool.using'
                                    }, {
                                        value: 'CDL instructor plans to pass on TAT information to other faculty',
                                        labelTranslationKey: 'volunteer.forms.postOutreach.labels.cdlSchool.passInfo'
                                    }]
                            }, {
                                type: survey_1.SurveyFieldType.TEXTAREA,
                                name: 'otherAccomplishments',
                                labelTranslationKey: 'misc.other'
                            }]
                    }, {
                        // page 3: trucking company
                        isVisible: function (vals) { return outreachTarget.type === user_data_1.OutreachLocationType.TRUCKING_COMPANY; },
                        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'accomplishments',
                                multi: true,
                                // The form will submit the English versions of the text, but the user's language will be displayed
                                options: [{
                                        value: 'Trucking company plans to show their drivers the TAT training video and hand out wallet cards.',
                                        labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckingCompany.showDrivers'
                                    }]
                            }, {
                                type: survey_1.SurveyFieldType.TEXTAREA,
                                name: 'otherAccomplishments',
                                labelTranslationKey: 'misc.other'
                            }]
                    }, {
                        // page 4
                        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.followUp',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'willFollowUp',
                                isRequired: true,
                                options: this._yesNoOptions
                            }]
                    }, {
                        // page 5
                        isVisible: function (vals) { return vals.willFollowUp === 'yes'; },
                        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.followUpWhen',
                        fields: [{
                                type: survey_1.SurveyFieldType.DATE,
                                name: 'followUpDate',
                                labelTranslationKey: 'volunteer.forms.postOutreach.labels.followUpDate',
                                isRequired: true
                            }]
                    }],
                onSubmit: function (vals) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // alter some values before sending to the proxy
                                _a = vals;
                                return [4 /*yield*/, this.userDataService.firebaseUser.getIdToken()];
                            case 1:
                                // alter some values before sending to the proxy
                                _a.firebaseIdToken = _b.sent();
                                vals.willFollowUp = vals.willFollowUp === 'yes';
                                vals.followUpDate = this.miscService.dateToLocalYYYYMMDD(vals.followUpDate);
                                // merge 'accomplishments' and 'other accomplishments'
                                vals.accomplishments += ' ' + vals.otherAccomplishments;
                                // send to the proxy and show an error message if appropriate
                                return [2 /*return*/, this.genericProxyPOST('createPostOutreachReport', vals)];
                        }
                    });
                }); }
            };
        };
        // preEventSurvey
        // postEventSurvey
        SurveyService.prototype.testimonialFeedbackSurvey = function () {
            var _this = this;
            return {
                pages: [{
                        topTextTranslationKey: 'volunteer.forms.feedback.labels.whatAdvice',
                        fields: [{ type: survey_1.SurveyFieldType.TEXTAREA, name: 'advice' }]
                    }, {
                        topTextTranslationKey: 'volunteer.forms.feedback.labels.bestPart',
                        fields: [{ type: survey_1.SurveyFieldType.TEXTAREA, name: 'bestPart' }]
                    }, {
                        topTextTranslationKey: 'volunteer.forms.feedback.labels.improvements',
                        fields: [{ type: survey_1.SurveyFieldType.TEXTAREA, name: 'improvements' }]
                    }, {
                        topTextTranslationKey: 'volunteer.forms.feedback.labels.giveAnonPermission',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'givesAnonPermission',
                                isRequired: true,
                                options: this._yesNoOptions
                            }]
                    }, {
                        topTextTranslationKey: 'volunteer.forms.feedback.labels.giveNamePermission',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'givesNamePermission',
                                isRequired: true,
                                options: this._yesNoOptions
                            }]
                    }],
                onSubmit: function (vals) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // modify some of the form values before submitting to the proxy
                                _a = vals;
                                return [4 /*yield*/, this.userDataService.firebaseUser.getIdToken()];
                            case 1:
                                // modify some of the form values before submitting to the proxy
                                _a.firebaseIdToken = _b.sent();
                                vals.givesAnonPermission = vals.givesAnonPermission === 'yes';
                                vals.givesNamePermission = vals.givesNamePermission === 'yes';
                                // send to the proxy and show an error message if appropriate
                                return [2 /*return*/, this.genericProxyPOST('createTestimonial', vals)];
                        }
                    });
                }); }
            };
        };
        SurveyService.prototype.trainingVideoFeedbackSurvey = function () {
            var _this = this;
            return {
                pages: [{
                        // page 1
                        topTextTranslationKey: this.userDataService.data.volunteerType === user_data_1.VolunteerType.TRUCK_STOP_VOLUNTEER ?
                            'volunteer.forms.trainingFeedback.labels.equippedForOutreach' :
                            'volunteer.forms.trainingFeedback.labels.confidentInPresenting',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'feelsPrepared',
                                options: this._yesNoOptions,
                                isRequired: true
                            }]
                    }, {
                        // page 2
                        isVisible: function (vals) { return vals.feelsPrepared === 'no'; },
                        topTextTranslationKey: 'volunteer.forms.trainingFeedback.labels.whatQuestions',
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXTAREA,
                                name: 'questions'
                            }]
                    }],
                onSubmit: function (vals) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // modify some of the form values before submitting to the proxy
                                _a = vals;
                                return [4 /*yield*/, this.userDataService.firebaseUser.getIdToken()];
                            case 1:
                                // modify some of the form values before submitting to the proxy
                                _a.firebaseIdToken = _b.sent();
                                vals.feelsPrepared = vals.feelsPrepared === 'yes';
                                // send to the proxy and show an error message if appropriate
                                return [2 /*return*/, this.genericProxyPOST('createTrainingVideoFeedback', vals)];
                        }
                    });
                }); }
            };
        };
        SurveyService.prototype.signupSurvey = function () {
            var _this = this;
            var salesforceId;
            return {
                pages: [{
                        // page 1
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXT,
                                name: 'registrationCode',
                                labelTranslationKey: 'volunteer.forms.signup.labels.registrationCode',
                                isRequired: true,
                            }],
                        onContinue: function (vals) {
                            // check if the registration code is valid
                            return _this.proxyAPI.get('checkRegistrationCode?code=' + encodeURIComponent(vals.registrationCode))
                                .then(function (response) {
                                if (!response || !response.success)
                                    throw '';
                            }).catch(function (e) {
                                // check the error code to show an appropriate message
                                var errorKey = (e.error && e.error.errorCode && e.error.errorCode === 'INCORRECT_REGISTRATION_CODE') ?
                                    'volunteer.forms.signup.invalidCode' :
                                    'misc.messages.requestError';
                                // show an error message.
                                throw _this.miscService.showErrorPopup(errorKey);
                            });
                        }
                    }, {
                        // page 2
                        topTextTranslationKey: 'volunteer.forms.signup.labels.intro',
                        fields: [{
                                type: survey_1.SurveyFieldType.EMAIL,
                                name: 'email',
                                labelTranslationKey: 'volunteer.forms.signup.labels.email',
                                isRequired: true
                            }, {
                                type: survey_1.SurveyFieldType.TEL,
                                name: 'phone',
                                labelTranslationKey: 'volunteer.forms.signup.labels.phone',
                                isRequired: true
                            }],
                        onContinue: function (vals) {
                            salesforceId = undefined;
                            // search for whether there is an existing salesforce Contact that matches the phone/email
                            return _this.proxyAPI.get('contactSearch?email=' + encodeURIComponent(vals.email) + '&phone=' + encodeURIComponent(vals.phone))
                                .then(function (response) {
                                if (response && response.salesforceId) {
                                    salesforceId = response.salesforceId;
                                    return;
                                }
                                else
                                    throw '';
                            }).catch(function (e) {
                                // check error code and show an appropriate error message
                                var errorKey = 'misc.messages.requestError';
                                if (e.error && e.error.errorCode) {
                                    if (e.error.errorCode === 'NO_MATCHING_ENTRY') {
                                        return; // it's ok to continue with the survey
                                    }
                                    else if (e.error.errorCode === 'ENTRY_ALREADY_HAS_ACCOUNT') {
                                        errorKey = 'volunteer.forms.signup.accountAlreadyExists';
                                    }
                                }
                                // show an appropriate error message
                                _this.miscService.showErrorPopup(errorKey);
                                throw '';
                            });
                        }
                    }, {
                        // page 3: details for a new salesforce entry
                        isVisible: function (vals) { return !salesforceId; },
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXT,
                                name: 'firstName',
                                labelTranslationKey: 'volunteer.forms.signup.labels.firstName',
                                isRequired: true
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                name: 'lastName',
                                labelTranslationKey: 'volunteer.forms.signup.labels.lastName',
                                isRequired: true
                            }]
                    }, {
                        // page 4
                        fields: [{
                                type: survey_1.SurveyFieldType.SELECT,
                                name: 'volunteerType',
                                labelTranslationKey: 'volunteer.forms.signup.labels.volunteerType',
                                isRequired: true,
                                options: [
                                    { value: user_data_1.VolunteerType.TRUCK_STOP_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.truckStop' },
                                    { value: user_data_1.VolunteerType.EVENT_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.event' },
                                    { value: user_data_1.VolunteerType.AMBASSADOR_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.ambassador' }
                                ]
                            }]
                    }, {
                        // page 5
                        topTextTranslationKey: 'volunteer.forms.signup.labels.whatAddress',
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.address',
                                name: 'mailingAddress'
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.city',
                                name: 'mailingCity'
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.state',
                                name: 'mailingState'
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.zip',
                                name: 'mailingZip'
                            }]
                    }, {
                        // page 6
                        topTextTranslationKey: 'volunteer.forms.signup.labels.partOfTeam',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'partOfTeam',
                                isRequired: true,
                                options: this._yesNoOptions
                            }]
                    }, {
                        // page 7
                        isVisible: function (vals) { return vals.partOfTeam === 'yes'; },
                        topTextTranslationKey: 'volunteer.forms.signup.labels.isCoordinator',
                        fields: [{
                                type: survey_1.SurveyFieldType.CHOICE,
                                name: 'isCoordinator',
                                isRequired: true,
                                options: this._yesNoOptions
                            }]
                    }, {
                        isVisible: function (vals) { return vals.partOfTeam === 'yes' && vals.isCoordinator === 'no'; },
                        topTextTranslationKey: 'volunteer.forms.signup.labels.whatName',
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXT,
                                name: 'coordinatorName',
                                labelTranslationKey: 'volunteer.forms.signup.labels.coordinatorName',
                                isRequired: true
                            }]
                    }],
                onSubmit: function (vals) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // modify some of the form values before submitting to the proxy
                                _a = vals;
                                return [4 /*yield*/, this.userDataService.firebaseUser.getIdToken()];
                            case 1:
                                // modify some of the form values before submitting to the proxy
                                _a.firebaseIdToken = _b.sent();
                                vals.partOfTeam = vals.partOfTeam === 'yes';
                                vals.isCoordinator = vals.isCoordinator === 'yes';
                                if (salesforceId) {
                                    vals.salesforceId = salesforceId;
                                }
                                // the registration code is verified near the beginning of this survey, but that's just a courtesy to the user,
                                // so that the user doesn't fill out a long survey just to be stopped by a registration code.
                                // the code is needed to authorize the request that actually creates the new account, so it's send with this request.
                                // (it's already in 'vals')
                                return [2 /*return*/, this.proxyAPI.post('createNewUser', vals)
                                        .then(function (response) {
                                        if (!(response && response.contactId))
                                            throw '';
                                    }).catch(function (e) {
                                        var errorKey = e.error && e.errorCode === 'INCORRECT_REGISTRATION_CODE' ?
                                            'volunteer.forms.signup.invalidCode' :
                                            'misc.messages.requestError';
                                        // show an error message.
                                        _this.miscService.showErrorPopup(errorKey);
                                        throw '';
                                    })];
                        }
                    });
                }); }
            };
        };
        // a survey to edit volunteer type and default mailing address
        SurveyService.prototype.editAccountSurvey = function () {
            var _this = this;
            var udata = this.userDataService.data;
            return {
                pages: [{
                        // page 1
                        fields: [{
                                type: survey_1.SurveyFieldType.SELECT,
                                name: 'volunteerType',
                                labelTranslationKey: 'volunteer.forms.signup.labels.volunteerType',
                                isRequired: true,
                                defaultValue: udata.volunteerType,
                                options: [
                                    { value: user_data_1.VolunteerType.TRUCK_STOP_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.truckStop' },
                                    { value: user_data_1.VolunteerType.EVENT_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.event' },
                                    { value: user_data_1.VolunteerType.AMBASSADOR_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.ambassador' }
                                ]
                            }]
                    }, {
                        // page 2
                        topTextTranslationKey: 'volunteer.forms.signup.labels.whatAddress',
                        fields: [{
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.address',
                                name: 'mailingAddress',
                                defaultValue: udata.address
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.city',
                                name: 'mailingCity',
                                defaultValue: udata.city
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.state',
                                name: 'mailingState',
                                defaultValue: udata.state
                            }, {
                                type: survey_1.SurveyFieldType.TEXT,
                                labelTranslationKey: 'misc.location.zip',
                                name: 'mailingZip',
                                defaultValue: udata.zip
                            }]
                    }],
                onSubmit: function (vals) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // modify some of the form values before submitting to the proxy
                                _a = vals;
                                return [4 /*yield*/, this.userDataService.firebaseUser.getIdToken()];
                            case 1:
                                // modify some of the form values before submitting to the proxy
                                _a.firebaseIdToken = _b.sent();
                                // send to the proxy and show an error message if appropriate
                                return [2 /*return*/, this.genericProxyPOST('updateUser', vals)];
                        }
                    });
                }); }
            };
        };
        // makes a POST request to the proxy, and expects a response of `{"success": true}`.
        // Shows an error message alert upon failure.
        SurveyService.prototype.genericProxyPOST = function (urlSegment, payload) {
            var _this = this;
            return this.proxyAPI.post(urlSegment, payload)
                .then(function (response) {
                if (!(response && response.success))
                    throw '';
            }).catch(function (e) {
                _this.miscService.showErrorPopup();
                throw '';
            });
        };
        return SurveyService;
    }());
    exports.SurveyService = SurveyService;
    window['SurveyService'] = SurveyService;
});
