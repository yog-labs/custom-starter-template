<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Create a JavaScript Action using TypeScript

Use this template to bootstrap the creation of a TypeScript action.:rocket:

This template includes compilation support, tests, a validation workflow, publishing, and versioning guidance.  

If you are new, there's also a simpler introduction.  See the [Hello World JavaScript Action](https://github.com/actions/hello-world-javascript-action)

## Create an action from this template

Click the `Use this Template` and provide the new repo details for your action

## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Manual Approval Action Flow Chart

```mermaid
flowchart TD
   A([Start/WorkflowTrigger]) --> B[Create Issue];
    B ----> |SetInterval Thread| C1[Repeat every 'P Seconds'];
    B ----> |Sleep Thread| C2[Sleep for 'T Seconds'];
    C1 ----> C1A{IsTimerActive?};
    C1A -- No --> Stop[Stop]
    C1A -- Yes --> C1B{IssueCommented?}
    C1B -- No --> C1
    C1B -- Yes --> C1C{approvedKey?}
    C1C -- Yes --> C1D[Set Workflow=Continue]
    C1D ---->  I[Close Issue]
    C1C -- No --> C1E{deniedKey?}
    C1E -- Yes --> C1F[Set Workflow=BreakWithError]
    C1E -- No --> C1
    C1F ----> I[Close Issue]
    I ----> J[Set TimerActive=false]
    J ----> Stop([Stop])
    C2 ----> C2A{TimeOut?}
    C2A -- Yes --> C2B[Set TimerActive=false]
    C2B ----> C2C[Set Workflow=BreakWithError]
    C2A -- No --> C2
    C2C ----> I
    style A fill:#f96;
    style Stop fill:#f96;
    style C1D fill:#0FFF50
    style C1F fill:#FF5733
    style C2C fill:#FF5733

```

## Change action.yml

The action.yml defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try { 
      ...
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
