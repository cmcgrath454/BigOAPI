import { getStatements } from './get-statements.js';
import { parse } from "java-parser";

export function parseCodeToTree(sourceCode) {
    const cst = parse(sourceCode);
    return buildStmtTree(cst);
}

function buildStmtTree(cst, parent = null) {
    const stmts = getStatements(cst);
    if (stmts.length == 0) return null;
  
    stmts.forEach((stmt, index) => {
      stmts[index]['parent'] = parent;
      stmts[index]['childStmts'] = [];

      const childStmt = stmt.hasOwnProperty('blockCst') ? buildStmtTree(stmt.blockCst, stmt) : null;
      
      if (stmt.hasOwnProperty('blockCst')) {
        buildStmtTree(stmt.blockCst, stmt);
        if (childStmt != null && childStmt.length > 1) throw ('Too many items in child statement array'); // TODO: For dev purposes only, remove later
        if (childStmt != null) stmts[index]['childStmts'].push(childStmt[0]);
      }
    })

    return stmts;
}