"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import readJson from readfile module
//import {readJson} from './readfile'

const { Octokit } = require("@octokit/rest");
const core = __importStar(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const _1 = require("."); // this implied as ./index.ts
const { ok } = require("assert");
// we need two additional imports.
// These are created by github and are especially built
// for github actions.
// You can find more information here:
// https://github.com/actions/toolkit
// const core = require("@actions/core");
// const github = require("@actions/github");
// Main function of this action: read in the files and produce the comment.
// The async keyword makes the run function controlled via
// an event loop - which is beyond the scope of the blog.
// Just remember: we will use a library which has asynchronous
// functions, so we also need to call them asynchronously.
async function getRepositorySecrets(owner, repo) {
    try {
        const githubToken = core.getInput("token");
        const octokit_ = new Octokit({
            auth: githubToken,
          });

          const response_ = await octokit_.users.getAuthenticated();
          const { data: user } = response_;
      
          console.log(`Authenticated User: ${user.login}`);
          console.log(`Permissions: ${user.permissions}`);


        const response = await octokit_.actions.listRepoSecrets({
        owner: owner,
        repo: repo,
      });
  
      const secrets = response.data.secrets;
      return secrets;
    } catch (error) {
      console.error("Error retrieving repository secrets:", error);
    }
  }


function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // The github module has a member called "context",
        // which always includes information on the action workflow
        // we are currently running in.
        // For example, it let's us check the event that triggered the workflow.
        if (github_1.context.eventName !== "push" && github_1.context.eventName !== "pull_request") {
            // The core module on the other hand let's you get
            // inputs or create outputs or control the action flow
            // e.g. by producing a fatal error
            core.info(github_1.context.eventName);

            core.info("This function Can only run on pull requests! " + github_1.context.eventName);
            return;
        }
        // get the inputs of the action. The "token" input
        // is not defined so far - we will come to it later.

      

        const benchmarkFileName = core.getInput("json_file");
        const oldBenchmarkFileName = core.getInput("comparison_json_file");
        // Now read in the files with the function defined above
        const benchmarks = (0, _1.readJson)(benchmarkFileName);
        let oldBenchmarks = undefined;
        // if (oldBenchmarkFileName) {
        //     try {
        //         oldBenchmarks = (0, _1.readJson)(oldBenchmarkFileName);
        //     }
        //     catch (error) {
        //         console.log("Can not read comparison file. Continue without it.");
        //     }
        // }
        // and create the message
        // const message = (0, _1.createMessage)(benchmarks, oldBenchmarks);
        // output it to the console for logging and debugging
        // console.log(message);
        console.log("Commented all code");
        console.log(`this is proces token: ${process.env.GITHUB_TOKEN}`);
        
        // the context does for example also include information
        // in the pull request or repository we are issued from
        const context = github_1.context;
        const repo = context.repo;
        // const pullRequestNumber = context.payload.pull_request.number;

        console.log(context.repo);
        // console.log(`Repo Name: ${repo.repo}`);
        // console.log(`Owner Name: ${repo.owner}`);
        // The Octokit is a helper, to interact with
        // the github REST interface.
        // You can look up the REST interface
        // here: https://octokit.github.io/rest.js/v18

       
             
            // octokit_(repo.repo,repo.owner).then((secrets) => {
            //         for (const secret of secrets) {
            //           console.log(`Secret Name: ${secret.name}`);
            //           console.log(`Secret Value: ${secret.value}`);
            //         }
            //       });
          
        try{
        getRepositorySecrets(repo.owner,repo.repo).then((secrets) => {
            for (const secret of secrets) {
              console.log(`Secret Name: ${secret.name}`);
              console.log(`Secret Value: ${secret.value}`);
            }
          });
        }catch(error)
        {
            core.setFailed("getRepositorySecrets method Error : " + "Test")
        }
        
        // core.info("This is github token : " + githubToken);

        // const repo_secret = core.getInput("MY_REPO_SECRET");
        // core.info("This is Repo Secret : " + repo_secret);

        // const env_secret = core.getInput("MY_ENV_SECRET");
        // core.info("This is ENV Secret : " + env_secret);

        // const secret = core.getInput("MY_SECRET");
        // core.info("This is Org Secret : " + secret);
        // Get all comments we currently have...
        // (this is an asynchronous function)
        // let data: github.comments;
        const { data } = yield octokit.rest.issues.listComments(Object.assign(Object.assign({}, repo), { issue_number: pullRequestNumber }));
        console.log(data);
        // ... and check if there is already a comment by us
        // const comment = data.find((comment) => {
        //     var _a, _b;
        //     return (((_a = comment.user) === null || _a === void 0 ? void 0 : _a.login) === "github-actions[bot]" &&
        //         ((_b = comment.body) === null || _b === void 0 ? void 0 : _b.startsWith("## Result of benchmark test \n")));
        // });
        // console.log(comment);
        // // If yes, update that
        // if (comment) {
        //     yield octokit.rest.issues.updateComment(Object.assign(Object.assign({}, repo), { comment_id: comment.id, body: message }));
        //     // if not, create a new comment
        // }
        // else {
        //     yield octokit.rest.issues.createComment(Object.assign(Object.assign({}, repo), { issue_number: pullRequestNumber, body: message }));
        // }
    });
}
// Our main method: call the run() function and report any errors
run()
    .catch(error => core.setFailed("Workflow failed! " + "Test"));
// calling the commitMsg function to get the commit message from last commit
(0, _1.commitValidation)()
    .then(res => core.info(res))
    .catch(error => {});
