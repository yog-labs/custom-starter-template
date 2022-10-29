export const approvalBodyContent:string = `
| Left-aligned | Center-aligned | Right-aligned | 
| :---         |     :---:      |          ---: | 
| git status   | git status     | git status    | 
| git diff     | git diff       | git diff      |` 

export function getWorkflowContext(context:any):string {
    return `
** Issue Created for following Workflow Details ** 
| WorkflowName        | Workflow#             | BranchName     | TriggerEvent         | LastCommitUser   |
| :---                | :---:                 | :---:          | :---:                | ---:             |
| ${context.workflow} | ${context.runNumber}  | ${context.ref} | ${context.eventName} | ${context.actor} |`
}
