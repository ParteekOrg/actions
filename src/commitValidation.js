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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitValidation = void 0;
const github = __importStar(require("@actions/github"));
// checking for commit message in the git commit history
// for the moment we are only checking the head commit.
function commitValidation() {
    return __awaiter(this, void 0, void 0, function* () {
        if (github.context.eventName === 'pull_request') {
            // get the commit message as per the last commit which was pushed
            let commitmsg = github.context.payload.head_commit.message;
            console.log(commitmsg);
            // getting  the length of commit message
            let commitmsg_length = commitmsg.length;
            // initiating the regular expression constructor
            let commitmsgpattern = new RegExp('^\[[a-z]+-[0-9]+\]', 'i');
            if ( commitmsg_length >= 5) {
                // if (commitmsgpattern.test(commitmsg) && commitmsg_length >= 20) {
                //core.info("Commit Message is valid");
                return "Commit message is valid";
            }
            else {
                //core.setFailed("Commit Message should always start with Reference number in the format as [Test.js] and should be >= 20 characters");
                throw new Error("Commit Message should always start with Reference number in the format as [Test.js] and should be >= 20 characters");
            }
        }
        else {
            //core.info("Can only run on push to a branch");
            return "Can only run on push to a branch";
        }
    });
}
exports.commitValidation = commitValidation;
