import * as core from '@actions/core'
import * as github from '@actions/github'
import * as template from './issuebodycontents'
import * as approvalContext from './approvalcontext'
import * as constants from './constants'
import request from 'request-promise'

const actionContext: approvalContext.approvalContext = {
  owner: core.getInput('owner'),
  org: core.getInput('org'),
  repo: core.getInput('repo'),
  assignees: core.getInput('approvers').split(','),
  token: core.getInput('secret'),
  timeout: ~~core.getInput('timeout'),
  title: core.getInput('issue_title'),
  body: core.getInput('body_message'),
  labels: core.getInput('labels').split(',')
}

const repoUrl = `https://api.github.com/repos/${actionContext.org}/${actionContext.repo}`
const headers = {
      'Authorization': `Bearer ${actionContext.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'user-agent': 'manual-approval-action'
}

let timeTrigger: any
let timeDurationCheck: any

function getBodyContent(): string {
  return `
  ${template.getWorkflowDetails(github.context)}
  ## Issue Details 
  ${actionContext.body}
  ${template.getApprovalTextDetails()}
  `
}

async function createApprovalIssue(): Promise<any> {
  let createIssuePayload = {
    owner: `${actionContext.owner}`,
    repo: `${actionContext.repo}`,
    title: `${actionContext.title}`,
    body: `${getBodyContent()}`,
    assignees: actionContext.assignees,
    labels: actionContext.labels
  }

  let createIssueRequest = {
    method: 'POST',
    uri: `${repoUrl}/issues`,
    headers: headers,
    json: true,
    body: createIssuePayload
  }

  return await request.post(createIssueRequest)
    .then(res => {
      console.log('Github Approval Issue successfully created !!')
      console.log(JSON.stringify(res))
      console.log("Issue Number "+ res.body.number)
      actionContext.issueNumber = res.body.number
      actionContext.status = res.body.state
    })
    .catch(error => {
      console.log('Failed to create an Github Approval Issue.' + error)
      if (error instanceof Error) core.setFailed(error.message)
      throw error
    })
}

async function updateApprovalIssueOnComments(): Promise<any> {
  var commentListRequest = {
    method: 'GET',
    uri: `${repoUrl}/issues/${actionContext.issueNumber}/comments`,
    headers: headers,
    json: true
  }

  return await request.get(commentListRequest)
    .then(async res => {
      console.log("Comments list is " + JSON.stringify(res));
      if (res.body.length > 0) {
        if (
          constants.approvedWords.includes(
            res.data[res.body.length - 1].body.toLowerCase()
          )
        ) {
          console.log(`${actionContext.assignees} Approved to proceed.`)
          await closeIssue("Approval received, workflow will continue..", false)
        } else if (
          constants.deniedWords.includes(res.body[res.body.length - 1].body.toLowerCase())
        ) {
          console.log(`${actionContext.assignees} Denied to proceed.`)
          // Fail the build..
          await closeIssue("Approval denied!!. Workflow will be marked to failure. ", true)
        } else {
          console.log('No matching comments provided.. for Approve or Deny')
        }
      } else {
        console.log('Pending approval, awaiting ..')
      }
    })
    .catch(error => {
      console.log('Error Occured..' + error)
    })
}

async function closeIssue(comment: string, failWorkflow: boolean): Promise<any> {
  var closeIssuePayload = JSON.stringify({
    owner: `${actionContext.owner}`,
    repo: `${actionContext.repo}`,
    state: 'closed'
  })

  var closeIssueRequest = {
    method: 'PATCH',
    uri: `${repoUrl}/issues/${actionContext.issueNumber}`,
    headers: headers,
    json: true,
    data: closeIssuePayload
  }

  let commentIssuePayload = JSON.stringify({
    owner: `${actionContext.owner}`,
    repo: `${actionContext.repo}`,
    issue_number: `${actionContext.issueNumber}`,
    body: `${comment}`
  })

  let commentIssueRequest = {
    method: 'POST',
    uri: `${repoUrl}/issues/${actionContext.issueNumber}/comments`,
    headers: headers,
    json: true,
    data: commentIssuePayload
  }

  let updateIssuePayloadApproved = JSON.stringify({
    owner: `${actionContext.owner}`,
    repo: `${actionContext.repo}`,
    labels: ["scan failure","approved"]
  })
  
  let updateIssuePayloadRejected = JSON.stringify({
    owner: `${actionContext.owner}`,
    repo: `${actionContext.repo}`,
    labels: ["scan failure","rejected"]
  })

  let updateIssueRequest = {
    method: 'PATCH',
    uri: `${repoUrl}/issues/${actionContext.issueNumber}`,
    headers: headers,
    json: true,
    data: failWorkflow ? updateIssuePayloadRejected : updateIssuePayloadApproved
  }

  return await request.post(commentIssueRequest)
    .then(async res => {
      console.log('Github Issue comment created !!');
      await request.patch(closeIssueRequest)
        .then(async cresp => {
          console.log('Approval Request Closed!!');
          await request.patch(updateIssueRequest)
          .then(uresp => {
            console.log("Approval Issue updated with label");
          }).catch(uerror => {
            console.log("Error! Unable to update labels on Issue "+ uerror );
            throw uerror;
          })
          clearInterval(timeTrigger);
          clearTimeout(timeDurationCheck);
          timeTrigger = false;
          if (failWorkflow) {
            core.setFailed(comment);
          }
        })
        .catch(cerror => {
          console.log("Error occured while closing the issue "+ cerror);
          throw cerror;
        })
    })
    .catch(error => {
      console.log('Failed to comments an Approval Issue.' + error)
      if (error instanceof Error) core.setFailed(error.message)
      throw error
    })
}

async function run(): Promise<void> {
  try {
    await createApprovalIssue()
    timeTrigger = setInterval(updateApprovalIssueOnComments, 5000)
    timeDurationCheck = setTimeout(async function () {
      console.log(
        'Approval waiting period elapsed. Approval request will be automatically closed and workflow status will be marked to Failed.'
      )
      await closeIssue('Approval waiting period elapsed. Approval request is automatically closed and workflow status is marked to Failed.', true)
    }, actionContext.timeout * 60 * 1000)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
