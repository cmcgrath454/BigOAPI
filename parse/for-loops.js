import { BaseJavaCstVisitorWithDefaults } from "java-parser";
import { getLeafNodes } from "../util.js";

class ForLoopCollector extends BaseJavaCstVisitorWithDefaults {
    constructor() {
        super();
        this.loops = [];
        this.validateVisitor();
    }

    basicForStatement(ctx) {
        const forLoop = {
            type: 'forLoop',
            init: ctx.hasOwnProperty('forInit') ? getLeafNodes(ctx.forInit[0].children) : null,
            expr: ctx.hasOwnProperty('expression') ? getLeafNodes(ctx.expression[0].children) : null,
            update: ctx.hasOwnProperty('forUpdate') ? getLeafNodes(ctx.forUpdate[0].children) : null,
            blockCst: ctx.hasOwnProperty('statement') ? ctx.statement[0] : null
        };
        this.loops.push(forLoop);
    }
}

export function getForLoops(cst) {
    let forLoopCollector = new ForLoopCollector();
    forLoopCollector.visit(cst);
    if (forLoopCollector.loops > 0) throw ('Too many loops in forLoopCollector'); //For dev purposes only, delete later
    return forLoopCollector.loops[0];
}

export function getForLoopBigO(stmt) {
    if (stmt.init) {
        if (stmt.init.length == 3)
            // no declaration
            var [{ Identifier: initVar }, { Equals: initOperator }, { DecimalLiteral: initVal }] = stmt.init;
        else if (stmt.init.length == 4)
            // includes declaration
            var [{ Int: initType }, { Identifier: initVar }, { Equals: initOperator }, { DecimalLiteral: initVal }] = stmt.init;
    } else { throw ("For loops without initializers aren't supported."); }

    if (stmt.expr) {
        var [{ Identifier: termOperand1 }, { Identifier: termOperand2 }, { BinaryOperator: termOperator }] = stmt.expr;
    } else { throw ("For loops without terminating expressions aren't supported."); }

    if (stmt.update) {
        if (stmt.update.length == 2)
            var [{ Identifier: updateOperand1 }, { UnarySuffixOperator: updateOperator }] = stmt.update;
        else if (stmt.update.length == 3)
            var [{ Identifier: updateOperand1 }, { Identifier: updateOperand2 }, { BinaryOperator: updateOperator }] = stmt.update;
    } else { throw ("For loops without update expressions aren't supported."); }

    if (termOperand2 == 'n' && termOperand1 == initVar)
        return 1;
    else
        return 0;
}
