// import readJson from readfile module
//import {readJson} from './readfile'
import * as core from '@actions/core'
// import  github from '@actions/github'

import { readJson, createMessage , commitValidation} from '.'; // this implied as ./index.ts

// we need two additional imports.
// These are created by github and are especially built
// for github actions.
// You can find more information here:
// https://github.com/actions/toolkit
// const core = require("@actions/core");
const github = require("@actions/github");

// Main function of this action: read in the files and produce the comment.
// The async keyword makes the run function controlled via
// an event loop - which is beyond the scope of the blog.
// Just remember: we will use a library which has asynchronous
// functions, so we also need to call them asynchronously.
async function run() {
  // The github module has a member called "context",
  // which always includes information on the action workflow
  // we are currently running in.
  // For example, it let's us check the event that triggered the workflow.
  core.info("Testing main!");

  if (github.context?.eventName !== "pull_request") {
    // The core module on the other hand let's you get
    // inputs or create outputs or control the action flow
    // e.g. by producing a fatal error
    core.info("This function Can only run on pull requests!" + github.context?.eventName);
    return;
  }

  // get the inputs of the action. The "token" input
  // is not defined so far - we will come to it later.
  const githubToken = core.getInput("token");
  console.log("This is github token : " + githubToken);

  const benchmarkFileName = core.getInput("json_file");
  const oldBenchmarkFileName = core.getInput("comparison_json_file");

  // Now read in the files with the function defined above
  const benchmarks = readJson(benchmarkFileName);
  let oldBenchmarks = undefined;
  if(oldBenchmarkFileName) {
    try {
      oldBenchmarks = readJson(oldBenchmarkFileName);
    } catch (error) {
      console.log("Can not read comparison file. Continue without it.");
    }
  }
  // and create the message
  const message = createMessage(benchmarks, oldBenchmarks);
  // output it to the console for logging and debugging
  console.log(message);
  console.log(message);

  // the context does for example also include information
  // in the pull request or repository we are issued from
  const context = github.context;
  const repo =  github.context.repo;
  const pullRequestNumber =  github.context.payload.pull_request!.number;

  // The Octokit is a helper, to interact with
  // the github REST interface.
  // You can look up the REST interface
  // here: https://octokit.github.io/rest.js/v18
  const octokit = github.getOctokit(githubToken);

  // Get all comments we currently have...
  // (this is an asynchronous function)

 // let data: github.comments;

  const { data } = await octokit.rest.issues.listComments({
    ...repo,
    issue_number: pullRequestNumber,
  });

  console.log(data);

  // ... and check if there is already a comment by us
  const comment = data.find((comment) => {
    return (
      comment.user?.login === "github-actions[bot]" &&
      comment.body?.startsWith("## Result of benchmark test \n")
    );
  });

  console.log(comment);

  // If yes, update that
  if (comment) {
    await octokit.rest.issues.updateComment({
      ...repo,
      comment_id: comment.id,
      body: message
    });
  // if not, create a new comment
  } else {
    await octokit.rest.issues.createComment({
      ...repo,
      issue_number: pullRequestNumber,
      body: message
    });
  }
}

// Our main method: call the run() function and report any errors
run()
  .catch(error => core.setFailed("Workflow failed! " + error.message));

// calling the commitMsg function to get the commit message from last commit
commitValidation()
  .then(res => core.info(res))
  .catch(error => core.setFailed(error.message));
