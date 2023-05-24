"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJson = void 0;
// We are use the standard fs library to run the code. 
const fs = require('fs');
// read and parse the JSON file
let readJson = (filename) => {
    // read the file passed as argument to the function
    const rawdata = fs.readFileSync(filename);
    // Once we read the file. let's parse it
    const benchmarkJSON = JSON.parse(rawdata);
    return benchmarkJSON;
};
exports.readJson = readJson;
