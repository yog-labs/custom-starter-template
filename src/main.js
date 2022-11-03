"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
var axios_1 = require("axios");
var core = require("@actions/core");
var github = require("@actions/github");
var template = require("./issuebodycontents");
var constants = require("./constants");
var request_promise_1 = require("request-promise");
var actionContext = {
    /*owner: core.getInput('owner'),
    org: core.getInput('org'),
    repo: core.getInput('repo'),
    assignees: core.getInput('approvers').split(','),
    token: core.getInput('secret'),
    timeout: ~~core.getInput('timeout'),
    title: core.getInput('issue_title'),
    body: core.getInput('body_message'),
    labels: core.getInput('labels').split(',')*/
    owner: 'Yog4Prog',
    org: 'Yog4Prog',
    repo: 'custom-starter-template',
    assignees: ['Yog4Prog'],
    token: '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',
    timeout: 2,
    title: 'A Scan has a failure.. Please approve to proceed',
    body: 'Found an Issue while performing SCA Scan',
    labels: ['scan failure', 'approval required']
};
var repoUrl = "https://api.github.com/repos/".concat(actionContext.org, "/").concat(actionContext.repo);
var timeTrigger;
var timeDurationCheck;
function getBodyContent() {
    return "\n  ".concat(template.getWorkflowDetails(github.context), "\n  ## Issue Details \n  ").concat(actionContext.body, "\n  ").concat(template.getApprovalTextDetails(), "\n  ");
}
function createApprovalIssue() {
    return __awaiter(this, void 0, void 0, function () {
        var createIssuePayload, createIssueRequest;
        return __generator(this, function (_a) {
            createIssuePayload = {
                owner: "".concat(actionContext.owner),
                repo: "".concat(actionContext.repo),
                title: "".concat(actionContext.title),
                body: "".concat(getBodyContent()),
                assignees: actionContext.assignees,
                labels: actionContext.labels
            };
            createIssueRequest = {
                method: 'POST',
                uri: "".concat(repoUrl, "/issues"),
                headers: {
                    Authorization: "Bearer ".concat(actionContext.token),
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.github.v3+json',
                    'user-agent': 'manual-approval-action'
                },
                body: createIssuePayload
            };
            request_promise_1["default"].post(createIssueRequest, function (error, resp) {
                if (error) {
                    console.log('Error OCcured: ' + error);
                }
                else {
                    console.log('Status code ' + resp.statusCode);
                    console.log('response is ' + JSON.stringify(resp));
                    console.log('Response is ' + resp);
                }
            });
            return [2 /*return*/];
        });
    });
}
function updateApprovalIssueOnComments() {
    return __awaiter(this, void 0, void 0, function () {
        var commentListRequest, res;
        return __generator(this, function (_a) {
            commentListRequest = {
                method: 'GET',
                url: "".concat(repoUrl, "/issues/").concat(actionContext.issueNumber, "/comments"),
                headers: {
                    Authorization: "Bearer  ".concat(actionContext.token),
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.github.v3+json'
                },
                json: true
            };
            console.log("Repo is: ".concat(repoUrl, "/issues/").concat(actionContext.issueNumber, "/comments"));
            res = axios_1["default"]
                .get("".concat(repoUrl, "/issues/").concat(actionContext.issueNumber, "/comments"), {
                headers: {
                    Authorization: "Bearer  ".concat(actionContext.token),
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.github.v3+json'
                }
            })
                .then(function (resp) {
                console.log('response is ' + JSON.stringify(resp.data));
            });
            return [2 /*return*/, res];
        });
    });
}
function updateApprovalIssueOnComments1() {
    return __awaiter(this, void 0, void 0, function () {
        var commentListRequest;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commentListRequest = {
                        method: 'GET',
                        url: "".concat(repoUrl, "/issues/").concat(actionContext.issueNumber, "/comments"),
                        headers: {
                            Authorization: "Bearer  ".concat(actionContext.token),
                            'Content-Type': 'application/json',
                            Accept: 'application/vnd.github.v3+json'
                        }
                    };
                    return [4 /*yield*/, (0, axios_1["default"])(commentListRequest)
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(res.data.length > 0)) return [3 /*break*/, 6];
                                        if (!constants.approvedWords.includes(res.data[res.data.length - 1].body.toLowerCase())) return [3 /*break*/, 2];
                                        console.log("".concat(actionContext.assignees, " Approved to proceed."));
                                        return [4 /*yield*/, closeIssue('Approval received, workflow will continue..', false)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 2:
                                        if (!constants.deniedWords.includes(res.data[res.data.length - 1].body.toLowerCase())) return [3 /*break*/, 4];
                                        console.log("".concat(actionContext.assignees, " Denied to proceed."));
                                        // Fail the build..
                                        return [4 /*yield*/, closeIssue('Approval denied!!. Workflow will be marked to failure. ', true)];
                                    case 3:
                                        // Fail the build..
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        console.log('No matching comments provided.. for Approve or Deny');
                                        _a.label = 5;
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        console.log('Pending approval, awaiting ..');
                                        _a.label = 7;
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); })["catch"](function (error) {
                            console.log('Error Occured..' + error);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function closeIssue(comment, failWorkflow) {
    return __awaiter(this, void 0, void 0, function () {
        var closeIssuePayload, closeIssueRequest, commentIssuePayload, commentIssueRequest, updateIssuePayloadApproved, updateIssuePayloadRejected, updateIssueRequest;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    closeIssuePayload = JSON.stringify({
                        owner: "".concat(actionContext.owner),
                        repo: "".concat(actionContext.repo),
                        state: 'closed'
                    });
                    closeIssueRequest = {
                        method: 'PATCH',
                        url: "".concat(repoUrl, "/issues/").concat(actionContext.issueNumber),
                        headers: {
                            Authorization: "Bearer  ".concat(actionContext.token),
                            'Content-Type': 'application/json',
                            Accept: 'application/vnd.github.v3+json'
                        },
                        data: closeIssuePayload
                    };
                    commentIssuePayload = JSON.stringify({
                        owner: "".concat(actionContext.owner),
                        repo: "".concat(actionContext.repo),
                        issue_number: 'ISSUE_NUMBER',
                        body: "".concat(comment)
                    });
                    commentIssueRequest = {
                        method: 'POST',
                        url: "".concat(repoUrl, "/issues/").concat(actionContext.issueNumber, "/comments"),
                        headers: {
                            Authorization: "Bearer  ".concat(actionContext.token),
                            'Content-Type': 'application/json',
                            Accept: 'application/vnd.github.v3+json'
                        },
                        data: commentIssuePayload
                    };
                    updateIssuePayloadApproved = JSON.stringify({
                        owner: "".concat(actionContext.owner),
                        repo: "".concat(actionContext.repo),
                        labels: ['scan failure', 'approved']
                    });
                    updateIssuePayloadRejected = JSON.stringify({
                        owner: "".concat(actionContext.owner),
                        repo: "".concat(actionContext.repo),
                        labels: ['scan failure', 'rejected']
                    });
                    updateIssueRequest = {
                        method: 'PATCH',
                        url: "".concat(repoUrl, "/issues/").concat(actionContext.issueNumber),
                        headers: {
                            Authorization: "Bearer  ".concat(actionContext.token),
                            'Content-Type': 'application/json',
                            Accept: 'application/vnd.github.v3+json'
                        },
                        data: failWorkflow ? updateIssuePayloadRejected : updateIssuePayloadApproved
                    };
                    return [4 /*yield*/, (0, axios_1["default"])(commentIssueRequest)
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('Github Issue comment created !!');
                                        return [4 /*yield*/, (0, axios_1["default"])(closeIssueRequest)
                                                .then(function (cresp) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            console.log('Approval Request Closed!!');
                                                            return [4 /*yield*/, (0, axios_1["default"])(updateIssueRequest)
                                                                    .then(function (uresp) {
                                                                    console.log('Approval Issue updated with label');
                                                                })["catch"](function (uerror) {
                                                                    console.log('Error! Unable to update labels on Issue ' + uerror);
                                                                    throw uerror;
                                                                })];
                                                        case 1:
                                                            _a.sent();
                                                            clearInterval(timeTrigger);
                                                            clearTimeout(timeDurationCheck);
                                                            timeTrigger = false;
                                                            if (failWorkflow) {
                                                                core.setFailed(comment);
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })["catch"](function (cerror) {
                                                console.log('Error occured while closing the issue ' + cerror);
                                                throw cerror;
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })["catch"](function (error) {
                            console.log('Failed to comments an Approval Issue.' + error);
                            if (error instanceof Error)
                                core.setFailed(error.message);
                            throw error;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, createApprovalIssue()
                        /*  timeTrigger = setInterval(updateApprovalIssueOnComments, 5000)
                        timeDurationCheck = setTimeout(async function () {
                          console.log(
                            'Approval waiting period elapsed. Approval request will be automatically closed and workflow status will be marked to Failed.'
                          )
                          await closeIssue('Approval waiting period elapsed. Approval request is automatically closed and workflow status is marked to Failed.', true)
                        }, actionContext.timeout * 60 * 1000)*/
                    ];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    if (error_1 instanceof Error)
                        core.setFailed(error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
run();
