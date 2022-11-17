const { getForLoopBigO, getWhileLoopBigO }  = require("./get-statement-big-o");
const { parseCodeToTree }  = require("./parse-code");
const { mapTree }  = require("./util");

function getSourceCodeBigO(input) {
  javaCode = input.replace(/\n/g, " ");
  javaCode = 'public class DummyClass { public static void main(String args[]) {' + javaCode + '}}';

  const stmtTree = parseCodeToTree(javaCode);

  mapTree(stmtTree, addStmtBigO);

  return findLargestBigO(stmtTree);
}

function findLargestBigO(tree) {
  bigOList = [];
  mapTree(tree, stmt => {
    bigOList.push(stmt.bigO);
  });

  maxN = Math.max(...bigOList.map(bigO => bigO.n));
  bigOList = bigOList.filter(bigO => bigO.n == maxN);
  return bigOList.reduce( (prev, current) => {
    return prev.logn > current.logn ? prev : current;
  })
  
}

function addStmtBigO(stmt) {
  let bigO = 0;
  switch (stmt.type) {
    case 'forLoop':
      bigO = getForLoopBigO(stmt);
      break;
    case 'whileLoop':
      bigO = getWhileLoopBigO(stmt);
      break;
    case 'ifStmt':
      bigO = 0;
      // TODO: Add BigO Function
      break;
    default:
      bigO = 0;
      // TODO: Throw error?
      break;
  }
  if (stmt.parent != null) {
    stmt.bigO = {
      "n" : stmt.parent.bigO.n + bigO.n,
      "logn": stmt.parent.bigO.logn + bigO.logn
    }
  } else {
    stmt.bigO = bigO;
  }
}

module.exports = getSourceCodeBigO;