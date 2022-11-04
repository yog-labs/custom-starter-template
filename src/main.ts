import * as core from '@actions/core'
import * as github from '@actions/github'
import * as template from './issuebodycontents'
import * as approvalContext from './approvalcontext'
import * as constants from './constants'
import fetch from 'node-fetch'

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
let timeTrigger: any
let timeDurationCheck: any
actionContext.issueNumber = 46

function getBodyContent(): string {
  return `
  ${template.getWorkflowDetails(github.context)}
  ## Issue Details 
  ${actionContext.body}
  ${template.getApprovalTextDetails()}
  `
}


async function testApiCall(): Promise<any> {
  console.log("Creating a new Issue");
  await createIssue()
  console.log("Gettting issues comments");
  await getCommentsFromIssue()
}

async function createIssue(): Promise<any> {

  let createIssuePayload = JSON.stringify({
    owner: `${actionContext.owner}`,
    repo: `${actionContext.repo}`,
    title: `${actionContext.title}`,
    body: `${getBodyContent()}`,
    assignees: actionContext.assignees,
    labels: actionContext.labels
  })
  
  let createIssue_Request = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${actionContext.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'user-agent': 'manual-approval-action'
    },
    body: createIssuePayload
  }
  
  await fetch(`${repoUrl}/issues`, createIssue_Request).then(res => res.json()).then( (data:any)=>{
    console.log(data.number)
    console.log(data.title)
  }).catch(error => {
    console.log('Failed to create an Github Approval Issue.' + error)
    if (error instanceof Error) core.setFailed(error.message)
    throw error
  })
}

async function getCommentsFromIssue(): Promise<any> {
  const getComments_Request = {
    method: 'GET',
    uri: `${repoUrl}/issues/${actionContext.issueNumber}/comments`,
    headers: {
      'Authorization': `Bearer  ${actionContext.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
    }
  }
  await fetch(`${repoUrl}/issues/${actionContext.issueNumber}/comments`, getComments_Request).then(res => res.json()).then( (data:any)=>{
    console.log(data)
  }).catch(error => {
    console.log("Failed to get Issue Comments");
    if (error instanceof Error) core.setFailed(error.message)
    throw error
  })

}

testApiCall()

