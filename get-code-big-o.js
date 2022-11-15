const { getForLoopBigO, getWhileLoopBigO }  = require("./get-statement-big-o");
const { parseCodeToTree }  = require("./parse-code");
const { mapTree }  = require("./util");

function getSourceCodeBigO(input) {
  javaCode = 'public class DummyClass{ public static void main(String args[]) {' + input + '}}';

  const stmtTree = parseCodeToTree(javaCode);

  mapTree(stmtTree, addStmtBigO);

  const res = findLargestBigO(stmtTree);
  if (res == 1)
    return "O(N)";
  else
    return "O(N^" + res + ")";
}

function findLargestBigO(tree) {
  bigOList = [];
  mapTree(tree, bigOs);
  return Math.max(...bigOList);
}

var bigOList;

function bigOs(stmt) {
  bigOList.push(stmt.bigO);
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
    stmt.bigO = stmt.parent.bigO + bigO;
  } else {
    stmt.bigO = bigO;
  }
}

module.exports = getSourceCodeBigO;