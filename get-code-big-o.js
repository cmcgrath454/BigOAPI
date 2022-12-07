const { getForLoopBigO, getWhileLoopBigO } = require("./get-statement-big-o");
const { parseCodeToTree } = require("./parse-code");
const { mapTree } = require("./util");

/**
 * This function handles the control flow of getting a source code snippet's 
 * Big O by calling other functions to analyze the runtime complexity.
 * @param {String} input - Java code to analyze
 * @returns Object that includes the locations of any unsupported code and the
 * Big O notation
 */

function getSourceCodeBigO(input) {
  javaCode = input.replace(/\n/g, " ");
  javaCode = 'public class DummyClass { public static void main(String args[]) {' + javaCode + '}}';

  unsupported = [];

  const stmtTree = parseCodeToTree(javaCode);

  mapTree(stmtTree, addStmtBigO);

  const result = findLargestBigO(stmtTree);
  let bigOStr = '';

  if (result.n == 0 && result.logn == 0) {
    bigOStr = 'O(1)';
  }
  else {
    if (result.n > 0) {
      let nStr = result.n > 1 ? `O(N^${result.n}` : 'O(N'
      bigOStr += nStr;
    } else {
      bigOStr += 'O(';
    }

    if (result.logn > 0) {
      let logStr = result.logn > 1 ? `log(N)^${result.logn}` : 'log(N)';
      bigOStr += logStr;
    }
    bigOStr += ')';
  }

  return {
    result: bigOStr,
    unsupported: unsupported
  };
}

/**
 * This function is used to map through the tree and gather all the Big O
 * notations of each statement. Then, it finds the largest resulting Big O
 * which is included in the result.
 * @param {Object} tree Object tree of statements with their Big O notations
 * @returns Object that represents the maximum Big O notation
 */
function findLargestBigO(tree) {
  bigOList = [];
  mapTree(tree, stmt => {
    bigOList.push(stmt.bigO);
  });

  maxN = Math.max(...bigOList.map(bigO => bigO.n));
  bigOList = bigOList.filter(bigO => bigO.n == maxN);
  return bigOList.reduce((prev, current) => {
    return prev.logn > current.logn ? prev : current;
  })

}

/**
 * This function takes a statement and calls the corresponding analysis
 * function to get the statement's Big O notation. It then aggregates that
 * with it's parent statement's Big O (if any) to find the Big O of the
 * statement and add it to the statement object.
 * @param {Object} stmt A statement object such as a for loop or while loop
 */
function addStmtBigO(stmt) {
  let bigO;
  switch (stmt.type) {
    case 'forLoop':
      bigO = getForLoopBigO(stmt);
      break;
    case 'whileLoop':
      bigO = getWhileLoopBigO(stmt);
      break;
    default:
      bigO = {
        "n": 0,
        "logn": 0
      };
      break;
  }

  if (stmt.parent != null) {
    stmt.bigO = {
      "n": stmt.parent.bigO.n + bigO.n,
      "logn": stmt.parent.bigO.logn + bigO.logn
    }
  } else {
    stmt.bigO = bigO;
  }
}

module.exports = getSourceCodeBigO;