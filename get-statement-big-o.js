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
    let initializer = {}, updater = {}, terminator = {};

    if (!elementsAreSupported(stmt))
        return CONSTANT_TIME;

    /* Destructure for loop element object arrays provided by parser  */
    if (stmt.init.length == 3) /* Initializer without declaration */
        if (stmt.init[2].hasOwnProperty('DecimalLiteral'))
            [{ Identifier: initializer.lhs }, , { DecimalLiteral: initializer.rhs }] = stmt.init;
        else if (stmt.init[2].hasOwnProperty('FloatLiteral'))
            [{ Identifier: initializer.lhs }, , { FloatLiteral: initializer.rhs }] = stmt.init;
        else
            [{ Identifier: initializer.lhs }, , { Identifier: initializer.rhs }] = stmt.init;
    else /* Initializer with declaration */
        if (stmt.init[3].hasOwnProperty('DecimalLiteral'))
            [, { Identifier: initializer.lhs }, , { DecimalLiteral: initializer.rhs }] = stmt.init;
        else if (stmt.init[2].hasOwnProperty('FloatLiteral'))
            [, { Identifier: initializer.lhs }, , { FloatLiteral: initializer.rhs }] = stmt.init;
        else
            [, { Identifier: initializer.lhs }, , { Identifier: initializer.rhs }] = stmt.init;

    [{ Identifier: terminator.operand1 }, { Identifier: terminator.operand2 }, { BinaryOperator: terminator.operator }] = stmt.terminate;
    if (!terminator.operand1)
        [{ DecimalLiteral: terminator.operand1 }, ,] = stmt.terminate;
    if (!terminator.operand2)
        [, { DecimalLiteral: terminator.operand2 },] = stmt.terminate;

    if (stmt.update.length == 2)
        [{ Identifier: updater.operand1 }, { UnarySuffixOperator: updater.operator }] = stmt.update;
    if (stmt.update.length == 3)
        [{ Identifier: updater.operand1 }, { AssignmentOperator: updater.operator }, { DecimalLiteral: updater.operand2 }] = stmt.update;
    if (stmt.update.length == 5)
        throw ("Only shorthand assignment and unary expressions are supported in for loops"); // TODO: Add support

    return analyzeBigO(initializer, updater, terminator);
}

function analyzeBigO(initializer, updater, terminator) {
    if (isNaN(initializer.rhs)) {
        if (!(initializer.rhs == 'n'))
            return CONSTANT_TIME; /* Unsupported */
        if (!(initializer.lhs == terminator.operand1 || initializer.lhs == terminator.operand2))
            return CONSTANT_TIME; /* Unsupported */
        if (terminator.operand1 == 'n' || terminator.operand2 == 'n')
            return CONSTANT_TIME;
        if (!(updater.operand1 == initializer.lhs))
            return CONSTANT_TIME;

        /* Standardize Terminate Expression */
        if (terminator.operand2 == 'n') {
            terminator.operand2 = terminator.operand1;
            terminator.operand1 = 'n';
            if (terminator.operator.includes('>'))
                terminator.operator = terminator.operator.replace('>', '<');
            else
                terminator.operator.replace('<', '>');
        }

        if (terminator.operator.includes('<'))
            return CONSTANT_TIME;

        switch (updater.operator) { 
            case '++':
            case '+':
                return CONSTANT_TIME;
            case '--':
            case '-':
                return LINEAR_TIME;
            case '*=':
            case '*':
                return CONSTANT_TIME;
            case '/=':
            case '/':
                return LOG_TIME;
            default:
                throw ("Unexpected case"); 
        }
    } else {
        if (!(terminator.operand1 == 'n' || terminator.operand2 == 'n'))
            return CONSTANT_TIME;
        if (!((terminator.operand1 == initializer.lhs || terminator.operand2 == initializer.lhs) && updater.operand1 == initializer.lhs))
            return CONSTANT_TIME;

        // TODO: Abstract similar occurences into function
        if (terminator.operand1 == 'n') {
            terminator.operand1 = terminator.operand2;
            terminator.operand2 = 'n';
            if (terminator.operator.includes('>'))
                terminator.operator = terminator.operator.replace('>', '<');
            else
                terminator.operator.replace('<', '>');
        }

        if (terminator.operator.includes('>')) {
            return CONSTANT_TIME;
        }

        switch (updater.operator) {
            case '++':
            case '+':
                return LINEAR_TIME;
            case '--':
            case '-':
                return CONSTANT_TIME;
            case '*=':
            case '*':
                return LOG_TIME;
            case '/=':
            case '/':
                return CONSTANT_TIME;  
            default:
                throw ("Unexpected case");  
        }
    }
}

function getWhileLoopBigO(stmt) {
    let initializer = {}, updater = {}, terminator = {};
    const userInputStartIndex = 67; /* Index where user code starts (omits class name) */
    whileLoop = javaCode.slice(stmt.location.start, stmt.location.end + 1);
    beforeWhileLoop = javaCode.slice(userInputStartIndex, stmt.location.start);

    /* Destructure while loop elements from parser */
    [{ Identifier: terminator.operand1 }, { Identifier: terminator.operand2 }, { BinaryOperator: terminator.operator }] = stmt.terminate;
    if (!terminator.operand1)
        [{ DecimalLiteral: terminator.operand1 }, ,] = stmt.terminate;
    if (!terminator.operand2)
        [, { DecimalLiteral: terminator.operand2 },] = stmt.terminate;

    /* TODO: Write methods that validate that the while loop elements are supported before analyzing */
    if (!(terminator.operand1 && terminator.operand2 && terminator.operator))
        

    /* TODO: Write methods that find the initializer and updater expressions 
     of variable found in the terminating expression */

     return analyzeBigO(initializer, updater, terminator);
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
        if (!stmt.init || !stmt.terminate || !stmt.update) {
            unsupported.push(stmt.locations.fullStmt);
            return false;
        }

        if (stmt.init.length > 4)
            return false;

        const numPropName = Object.getOwnPropertyNames(stmt.init[stmt.init.length - 1])[0];

        if (isNaN(stmt.init[stmt.init.length - 1][numPropName]) && stmt.init[stmt.init.length - 1][numPropName] != 'n')
            return false;

        if (stmt.terminate[2].BinaryOperator == "==" || stmt.terminate[2].BinaryOperator == "!=")
            return false;

        if (stmt.update.length > 5)
            return false;

        if (stmt.update[1].AssignmentOperator && stmt.update[1].AssignmentOperator == "%=")
            return false;

        if (stmt.update.length > 3 && stmt.update[4].BinaryOperator && stmt.update[4].BinaryOperator == "%")
            return false;

        if (stmt.update[0].Identifier == 'n') {
            return false;
        }

        return true;
    }
}

module.exports = { getForLoopBigO, getWhileLoopBigO };