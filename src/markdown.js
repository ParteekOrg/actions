"use strict";
// supplying an export statement
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = void 0;
// create the markdown message from the json files
let createMessage = (benchmark, compbenchmark) => {
    let msg = "## Result of benchmark test \n";
    // title
    msg += "| Key | Current PR | Default Branch |\n";
    // table column definitions
    msg += "| :--- | :---: | :---: |\n";
    for (const key in benchmark) {
        msg += `|${key}`;
        // second column. value with 2 digits
        const value = benchmark[key];
        msg += `|${value.toFixed(2)}`;
        try {
            const oldValue = compbenchmark[key];
            msg += `| ${oldValue.toFixed(2)}`;
        }
        catch (error) {
            console.log(`can't read ${key} from the comparision file`);
            msg += "| ";
        }
        msg += "| \n";
    }
    return msg;
};
exports.createMessage = createMessage;
