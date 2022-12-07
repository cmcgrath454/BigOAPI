const { getForLoopBigO, getWhileLoopBigO } = require("./get-statement-big-o");
const { parseCodeToTree } = require("./parse-code");
const { mapTree } = require("./util");

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
      if (result.n > 0)
        bigOStr += ' * '
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