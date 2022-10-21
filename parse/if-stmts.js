import { BaseJavaCstVisitorWithDefaults } from "java-parser";
import { getLeafNodes } from "./util.js";

class IfStmtCollector extends BaseJavaCstVisitorWithDefaults {
    constructor() {
        super();
        this.loops = [];
        this.validateVisitor();
    }

    ifStatement(ctx) {
        const ifStmt = {
            type: 'ifStmt',
            expr: ctx.hasOwnProperty('expression') ? getLeafNodes(ctx.expression[0].children) : null,
            blockCst: ctx.hasOwnProperty('statement') ? ctx.statement[0] : null
        };
        this.loops.push(ifStmt);
    }
}

export function getIfStmts(cst) {
    let ifStmtCollector = new IfStmtCollector();
    ifStmtCollector.visit(cst);
    if (ifStmtCollector.loops > 0) throw ('Too many loops in ifStmtCollector'); //For dev purposes only, delete later
    return ifStmtCollector.loops[0];
}

export function getIfStmtBigO(stmt) {
    
}