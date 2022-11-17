const CONSTANT_TIME = {
    "n": 0,
    "logn": 0
}

const LINEAR_TIME = {
    "n": 1,
    "logn": 0
}

const LOG_TIME = {
    "n": 0,
    "logn": 1
}

function getForLoopBigO(stmt) {
    elementsAreSupported(stmt);


    /* Destructure for loop element object arrays provided by parser  */
    if (stmt.init.length == 3) /* Initializer without declaration */
        if (stmt.init[2].hasOwnProperty('DecimalLiteral'))
            var [{ Identifier: initVar }, , { DecimalLiteral: initVal }] = stmt.init;
        else
            var [{ Identifier: initVar }, , { Identifier: initVal }] = stmt.init;
    else /* Initializer with declaration */
        if (stmt.init[2].hasOwnProperty('DecimalLiteral'))
            var [, { Identifier: initVar }, , { DecimalLiteral: initVal }] = stmt.init;
        else
            var [, { Identifier: initVar }, , { Identifier: initVal }] = stmt.init;

    let termOperand1, termOperand2, termOperator;
    [{ Identifier: termOperand1 }, { Identifier: termOperand2 }, { BinaryOperator: termOperator }] = stmt.terminate;
    if (!termOperand1)
        [{ DecimalLiteral: termOperand1 }, ,] = stmt.terminate;
    if (!termOperand2)
        [, { DecimalLiteral: termOperand2 },] = stmt.terminate;

    if (stmt.update.length == 2)
        var [{ Identifier: updateOperand1 }, { UnarySuffixOperator: updateOperator }] = stmt.update;
    if (stmt.update.length == 3)
        var [{ Identifier: updateOperand1 }, { AssignmentOperator: updateOperator }, { DecimalLiteral: updateOperand2 }] = stmt.update;
    if (stmt.update.length == 5)
        throw ("Only shorthand assignment and unary expressions are supported in for loops"); // TODO: Add support

    /* Constant Time if n isn't considered in either terminator or initializer */
    // TODO: Add case for when n is assigned to another variable then used in for loop
    if (termOperand1 != 'n' && termOperand2 != 'n' && initVal != 'n')
        return CONSTANT_TIME;

    /* Move n to rhs for normalized analysis */
    if (termOperand1 == 'n') {
        termOperand1 = termOperand2;
        termOperand2 = 'n';
        if (termOperator.includes('>')) termOperator = termOperator.replace('>', '<');
        else if (termOperator.includes('<')) termOperator = termOperator.replace('<', '>');
    }

    /* Analyze Big O */
    switch (updateOperator) {
        case '++':
        case '+=':
            if (termOperator.includes('<') || termOperator.includes("!="))
                return LINEAR_TIME;
            else
                return CONSTANT_TIME;
        case '--':
        case '-=':
            if ((termOperator.includes('>') || termOperator.includes("!=")) && !isNaN(termOperand2))
                return LINEAR_TIME;
            else
                return CONSTANT_TIME;
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

function getWhileLoopBigO(stmt) {
    const userInputStartIndex = 67; /* Index where added class declarations end */
    whileLoop = javaCode.slice(stmt.location.start, stmt.location.end + 1);
    beforeWhileLoop = javaCode.slice(userInputStartIndex, stmt.location.start);

    /* Destructure while loop elements from parser */
    let termOperand1, termOperand2, termOperator;
    [{ Identifier: termOperand1 }, { Identifier: termOperand2 }, { BinaryOperator: termOperator }] = stmt.terminate;
    if (!termOperand1)
        [{ DecimalLiteral: termOperand1 }, ,] = stmt.terminate;
    if (!termOperand2)
        [, { DecimalLiteral: termOperand2 },] = stmt.terminate;

    /* If terminator elements don't fit in destructure assignments, case not supported */
    if (!(termOperand1 && termOperand2 && termOperator))
        throw ("Unsupported while loop expression");

    // TODO: If no 'n' found, check if n was assigned to another variable in terminator before returning 0
    if (termOperand1 != 'n' && termOperand2 != 'n')
        return CONSTANT_TIME;

    /* Moves n to rhs for normalized analysis */
    if (termOperand1 == 'n') {
        termOperand1 = termOperand2;
        termOperand2 = 'n';
        if (termOperator.includes('>')) termOperator = termOperator.replace('>', '<');
        else if (termOperator.includes('<')) termOperator = termOperator.replace('<', '>');
    }

    /* Analyze Big-O */
    if (termOperand2 == 'n' && termOperator.includes('<')) {
        if (whileLoop.match(buildRegex(termOperand1, '++')))
            return LINEAR_TIME;
        if (whileLoop.match(buildRegex(termOperand1, '--')))
            return CONSTANT_TIME;
    }

    // TODO: Add analysis for break statement
}

function buildRegex(variable, operator) {
    let findStr = variable;

    switch (operator) {
        case '++':
            findStr += '\\W*\\+\\+\\W*';
            break;
    }
    // TODO: Build out all possible operators

    findStr += ';'
    return new RegExp(findStr);
}

function elementsAreSupported(stmt) {
    // TODO: Add in locations for text highlighting
    if (stmt.type = "forLoop") {
        if (!stmt.init || !stmt.terminate || !stmt.update)
            return false;

        if (stmt.init.length > 4)
            return false;

        if (isNaN(stmt.init[stmt.init.length - 1]))
            return false;

        if (stmt.update.length > 5)
            return false;
    }
}

module.exports = { getForLoopBigO, getWhileLoopBigO };