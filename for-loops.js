const { BaseJavaCstVisitorWithDefaults } = require("java-parser");
const { getLeafNodes } = require("./util");

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

function getForLoops(cst) {
    let forLoopCollector = new ForLoopCollector();
    forLoopCollector.visit(cst);
    if (forLoopCollector.loops > 0) throw ('Too many loops in forLoopCollector'); //For dev purposes only, delete later
    return forLoopCollector.loops[0];
}

function getForLoopBigO(stmt) {
    // Handle Error Cases
    if (stmt.init) {
        if (!(stmt.init.length == 3 || stmt.init.length == 4)) throw ("Only for loops with one initialized variable are supported");
        if (stmt.init.length == 4 && !isSupportedType(stmt.init[0])) throw ("Only for loop initializers with primitive whole number data types are supported");
    } else throw ("Only for loops with an initialized variable are supported");

    if (!stmt.expr) throw ("Only for loops with a boolean terminating expression are supported");

    if (stmt.update) {
        if (stmt.update.length < 2 || stmt.update.length > 5) throw ("Only for loops with exactly one increment statement are supported");
    } else throw ("Only for loops with increment statement are supported");

    // Destructure Initializer
    // TODO: Add case for initialization to n or other variable
    if (stmt.init.length == 3) // No Declaration
        if (stmt.init[2].hasOwnProperty('DecimalLiteral'))
            var [{ Identifier: initVar }, , { DecimalLiteral: initVal }] = stmt.init;
        else
            var [{ Identifier: initVar }, , { Identifier: initVal }] = stmt.init;
    else // Includes Declaration
        if (stmt.init[2].hasOwnProperty('DecimalLiteral'))
            var [, { Identifier: initVar }, , { DecimalLiteral: initVal }] = stmt.init;
        else
            var [, { Identifier: initVar }, , { Identifier: initVal }] = stmt.init;

    // Destructure Terminator
    let termOperand1, termOperand2, termOperator;
    [{ Identifier: termOperand1 }, { Identifier: termOperand2 }, { BinaryOperator: termOperator }] = stmt.expr;
    if (!termOperand1)
        [{ DecimalLiteral: termOperand1 }, ,] = stmt.expr;
    if (!termOperand2)
        [, { DecimalLiteral: termOperand2 }, ] = stmt.expr;

    // Destructure Updater
    if (stmt.update.length == 2)
        var [{ Identifier: updateOperand1 }, { UnarySuffixOperator: updateOperator }] = stmt.update;
    if (stmt.update.length == 3)
        var [{ Identifier: updateOperand1 }, { AssignmentOperator: updateOperator }, { DecimalLiteral: updateOperand2 }] = stmt.update;
    if (stmt.update.length == 5)
        throw ("Only shorthand assignment and unary expressions are supported in for loops"); // TODO: Add support

    // Constant Time if n isn't considered in terminator or initializer
    if (termOperand1 != 'n' && termOperand2 != 'n' && initVal != 'n')
        return 0;

    // Move n to rhs for normalized analysis 
    if (termOperand1 == 'n') {
        termOperand1 = termOperand2;
        termOperand2 = 'n';
        if (termOperator.includes('>')) termOperator = termOperator.replace('>', '<');
        else if (termOperator.includes('<')) termOperator = termOperator.replace('<', '>');
    }

    switch (updateOperator) {
        case '++':
        case '+=':
            if (termOperator.includes('<') || termOperator.includes("!="))
                return (1);
            else
                return 0;
        case '--':
        case '-=':
            if ((termOperator.includes('>') || termOperator.includes("!=")) && !isNaN(termOperand2))
                return (1);
            else
                return 0;
        case '*=':
            throw ("Unsupported update operator");
        case '/=':
            throw ("Unsupported update operator");
        case '%=':
            throw ("Unsupported update operator");
        default:
            throw ("Update operator unsupported" + updateOperator);
    }

}

function isSupportedType(typeObject) {
    let supportedTypes = ["byte", "int", "short", "long"];

    // Destructure typeObject
    const [, type] = Object.entries(typeObject)[0];

    return supportedTypes.includes(type);
}

exports.getForLoops = getForLoops;
exports.getForLoopBigO = getForLoopBigO;