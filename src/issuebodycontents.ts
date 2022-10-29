import * as constants from './constants'

export function getWorkflowDetails(context:any):string {
    let linkUrl = `[${context.workflow}](${context.payload.repository.clone_url.split('.git')[0]}/actions/runs/${context.runId})`
    return `
# Issue created for following Workflow. 
| WorkflowName | Workflow#             | BranchName     | TriggerEvent         | LastCommitUser   | 
| :---         | :---:                 | :---:          | :---:                | ---:             | 
| ${linkUrl}   | ${context.runNumber}  | ${context.ref} | ${context.eventName} | ${context.actor} |`
}

export function getApprovalTextDetails():string {
    let approvalKeyWords = "| "
    constants.approvedWords.forEach((key) => {
        approvalKeyWords = `${approvalKeyWords} ${key} |`
        return `${approvalKeyWords}`
    })
    return `
    ### You are required to Approve (or) Reject the issue
    You can approve by commenting following keywords
    ${approvalKeyWords}
    `
}