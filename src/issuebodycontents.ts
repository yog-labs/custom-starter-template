import * as constants from './constants'

export function getWorkflowDetails(context: any): string {
    let linkUrl = `[${context.workflow}](${context.payload.repository.clone_url.split('.git')[0]}/actions/runs/${context.runId})`
    return `
# Issue created for following Workflow. 
| WorkflowName | Workflow#             | BranchName     | TriggerEvent         | LastCommitUser   | 
| :---         | :---:                 | :---:          | :---:                | ---:             | 
| ${linkUrl}   | ${context.runNumber}  | ${context.ref} | ${context.eventName} | ${context.actor} |`
}

export function getApprovalTextDetails(): string {
    let approvalKeyWords = ""
    constants.approvedWords.forEach((key) => {
        approvalKeyWords = `${approvalKeyWords} \`${key}\`  `
        return `${approvalKeyWords}`
    })
    let deniedKeyWords = ""
    constants.deniedWords.forEach((key) => {
        deniedKeyWords = `${deniedKeyWords} \`${key}\` (Or)`
        return `${deniedKeyWords}`
    })
    return `###### You are required to Approve (or) Reject the issue

 Approve or Reject by commenting the below section with any of the following keywords
   :green_book: ** Approved Keys ** ${approvalKeyWords}
   :closed_book: ** Reject Keys ** ${deniedKeyWords}


**Note:** If left uncommented the issue will be closed after the timeout period and the workflow will be marked unsuccessful.
`
}