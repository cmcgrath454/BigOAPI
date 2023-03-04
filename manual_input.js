/* File for manual input for debugging purposes */

const getSourceCodeBigO = require("./get-code-big-o");

var javaCode = undefined;
var unsupported = undefined;

let input = `
for (int i = 0; i < n; i++) {
  for (int j = n; j >= 0; j/=2) {
    int k = 0;
    while (k < n) {
      k++;
    }
  }
}
  `


const result = getSourceCodeBigO(input);

console.log(result);