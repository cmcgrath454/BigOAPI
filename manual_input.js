/* File for manual input for debugging purposes */

const getSourceCodeBigO = require("./get-code-big-o");

let input = `
for (int i = 0; i < n; i++) {
    for (int j = n; j >= 0; j = j + 2) {
      int k = 0;
      while (k < n) {
        System.out.println("Hello World");
        k = k + 1;
      }
    }
  }`

var javaCode = undefined;
var unsupported = undefined;
const result = getSourceCodeBigO(input);
console.log(result);