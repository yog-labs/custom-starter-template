"use strict";
exports.__esModule = true;
exports.getApprovalTextDetails = exports.getWorkflowDetails = void 0;
var constants = require("./constants");
function getWorkflowDetails(context) {
    var linkUrl = "[".concat(context.workflow, "](").concat(context.payload.repository.clone_url.split('.git')[0], "/actions/runs/").concat(context.runId, ")");
    return "\n# Approval required for following Workflow to proceed. \n| WorkflowName | Workflow#             | BranchName     | TriggerEvent         | LastCommitUser   | \n| :---         | :---:                 | :---:          | :---:                | ---:             | \n| ".concat(linkUrl, "   | ").concat(context.runNumber, "  | ").concat(context.ref, " | ").concat(context.eventName, " | ").concat(context.actor, " |");
}
exports.getWorkflowDetails = getWorkflowDetails;
function getApprovalTextDetails() {
    var approvalKeyWords = '';
    constants.approvedWords.forEach(function (key) {
        approvalKeyWords = "".concat(approvalKeyWords, " `").concat(key, "`  ");
        return "".concat(approvalKeyWords);
    });
    var deniedKeyWords = '';
    constants.deniedWords.forEach(function (key) {
        deniedKeyWords = "".concat(deniedKeyWords, " `").concat(key, "` ");
        return "".concat(deniedKeyWords);
    });
    return "###### :point_right: You are required to Approve (or) Reject the issue\n\n Approve or Reject by commenting in the below section with any of the following keywords\n   :green_book:  **Approved Keys:** ".concat(approvalKeyWords, "\n   :closed_book: **Reject Keys:** ").concat(deniedKeyWords, "\n\n\n   :point_right: **Note:** If left uncommented the issue will be closed after the timeout period and the workflow will be marked unsuccessful.\n");
}
exports.getApprovalTextDetails = getApprovalTextDetails;
