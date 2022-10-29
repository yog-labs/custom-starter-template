export const approvalBodyContent:string = `
| Left-aligned | Center-aligned | Right-aligned | 
| :---         |     :---:      |          ---: | 
| git status   | git status     | git status    | 
| git diff     | git diff       | git diff      |` 

export function getWorkflowContext(context:any):string {
    let linkUrl = `[${context.workflow}](${context.payload.repository.clone_url.split('.git')[0]}/actions/runs/${context.runId})`
    return `
# Issue Created for following Workflow Details 
| WorkflowName | Workflow#             | BranchName     | TriggerEvent         | LastCommitUser   | 
| :---         | :---:                 | :---:          | :---:                | ---:             | 
| ${linkUrl}   | ${context.runNumber}  | ${context.ref} | ${context.eventName} | ${context.actor} |`
}
