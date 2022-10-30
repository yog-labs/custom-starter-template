export interface approvalContext {
  owner: String
  org: String
  repo: String
  title: String
  body: String
  assignees: String[]
  token: String
  timeout: number
  labels: String
  runId?: number
  issueNumber?: number
  status?: String
  closedComments?: String
}
