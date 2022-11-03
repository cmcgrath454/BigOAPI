const { BaseJavaCstVisitorWithDefaults } = require("java-parser");
const { getLeafNodes } = require("./util");

class WhileLoopCollector extends BaseJavaCstVisitorWithDefaults {
    constructor() {
        super();
        this.loops = [];
        this.validateVisitor();
    }

    whileStatement(ctx) {
        const whileLoop = {
            type: 'whileLoop',
            expr: ctx.hasOwnProperty('expression') ? getLeafNodes(ctx.expression[0].children) : null,
            blockCst: ctx.hasOwnProperty('statement') ? ctx.statement[0] : null,
            location: { start: ctx.statement[0].location.startOffset, end: ctx.statement[0].location.endOffset }
        };
        this.loops.push(whileLoop);
    }
}

function getWhileLoops(cst) {
    let whileLoopCollector = new WhileLoopCollector();
    whileLoopCollector.visit(cst);
    if (whileLoopCollector.loops > 0) throw ('Too many loops in whileLoopCollector'); //For dev purposes only, delete later
    return whileLoopCollector.loops[0];
}

function getWhileLoopBigO(stmt) {
    whileLoop = javaCode.slice(stmt.location.start, stmt.location.end + 1);
    let [{ Identifier: termOperand1 }, { Identifier: termOperand2 }, { BinaryOperator: termOperator }] = stmt.expr;

    if (termOperand1 != 'n' && termOperand2 != 'n') // TODO: If no n, find if n was assigned to variable used in terminator
        return 0;

    // Move n to rhs for normalized analysis 
    if (termOperand1 == 'n') {
        termOperand1 = termOperand2;
        termOperand2 = 'n';
        if (termOperator.includes('>')) termOperator = termOperator.replace('>', '<');
        else if (termOperator.includes('<')) termOperator = termOperator.replace('<', '>');
    }

    if (whileLoop.match(buildRegex(termOperand1, '++'))) {
        return 1;
    }
}

function buildRegex(variable, operator) {
    let findStr = variable;

    switch (operator) {
        case '++':
            findStr += '\\W*\\+\\+\\W*';
            break;
    }

    findStr += ';'
    console.log(findStr);
    return new RegExp(findStr, 'g');
}

exports.getWhileLoops = getWhileLoops;
exports.getWhileLoopBigO = getWhileLoopBigO;