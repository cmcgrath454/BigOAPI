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

    if (!forLoopIsSupported(stmt))
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

    return analyzeBigO(initializer, updater, terminator);
}

function getWhileLoopBigO(stmt) {
    let initializer = {}, updater = {}, terminator = {};

    /* Destructure while loop elements from parser */
    [{ Identifier: terminator.operand1 }, { Identifier: terminator.operand2 }, { BinaryOperator: terminator.operator }] = stmt.terminate;
    if (!terminator.operand1)
        [{ DecimalLiteral: terminator.operand1 }, ,] = stmt.terminate;
    if (!terminator.operand2)
        [, { DecimalLiteral: terminator.operand2 },] = stmt.terminate;

    if (!(terminator.operand1 && terminator.operand2 && terminator.operator)
        || terminator.operator == "=="
        || terminator.operator == "!=") {
        unsupported.push(stmt.location);
        return CONSTANT_TIME;
    }

    javaCodeWithoutClassDecl = javaCode.slice(67,);
    whileLoop = javaCodeWithoutClassDecl.slice(stmt.location.start, stmt.location.end + 1);
    beforeWhileLoop = javaCodeWithoutClassDecl.slice(0, stmt.location.start);

    if (terminator.operand1 == 'n') {
        terminator.operand1 = terminator.operand2;
        terminator.operand2 = 'n';
        if (terminator.operator.includes('>'))
            terminator.operator = terminator.operator.replace('>', '<');
        else
            terminator.operator.replace('<', '>');
    }

    initializer.lhs = terminator.operand1;

    const initRegex = new RegExp("\\S*\\s" + initializer.lhs + "\\s*=\\s*(\\S+);", "g");
    const init = initRegex.exec(beforeWhileLoop);

    if (!init) {
        unsupported.push(stmt.location);
        return CONSTANT_TIME;
    }

    initializer.rhs = init[1];

    updater.operand1 = terminator.operand1;
    
    const incrementRegex = new RegExp(updater.operand1 + "\\s*(\\+\\+|--)\\s*");
    let update = incrementRegex.exec(whileLoop);

    


    if (!update) {
        const updateRegex = new RegExp(updater.operand1 + "\\s*([-+*\\/%]\\s*=)\\s*(\\S+)");
        update = updateRegex.exec(whileLoop);
        updater.operand2 = update ? update[2] : null;
    }

    if (!update) {
        unsupported.push(stmt.location);
        return CONSTANT_TIME;
    }

    updater.operator = update[1];

    return analyzeBigO(initializer, updater, terminator);
}

function analyzeBigO(initializer, updater, terminator) {
    if (isNaN(initializer.rhs)) {
        if (!(initializer.lhs == terminator.operand1 || initializer.lhs == terminator.operand2))
            return CONSTANT_TIME; /* TODO: Add unsupported location */
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
            case '+=':
                return CONSTANT_TIME;
            case '--':
            case '-':
            case '-=':
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
            case '+=':
            case '+':
                return LINEAR_TIME;
            case '--':
            case '-':
            case '-=':
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

function forLoopIsSupported(stmt) {
    if (stmt.type = "forLoop") {
        if (!stmt.init || !stmt.terminate || !stmt.update) {
            unsupported.push(stmt.location);
            return false;
        }

        if (stmt.init.length < 3 || stmt.init.length > 4) {
            unsupported.push(stmt.location);
            return false;
        }

        const initValuePropName = Object.getOwnPropertyNames(stmt.init[stmt.init.length - 1])[0];
        const initValue = stmt.init[stmt.init.length - 1][initValuePropName];

        if (isNaN(initValue) && initValue != 'n') {
            unsupported.push(stmt.locations);
            return false;
        }

        if (stmt.terminate.length != 3
            || stmt.terminate[2].BinaryOperator == "=="
            || stmt.terminate[2].BinaryOperator == "!=") {
            unsupported.push(stmt.locations);
            return false;
        }


        if (stmt.update.length < 2 || stmt.update.length > 3
            || (stmt.update[1].AssignmentOperator && stmt.update[1].AssignmentOperator == "%=")
            || (stmt.update.length > 3 && stmt.update[4].BinaryOperator && stmt.update[4].BinaryOperator == "%")
            || (stmt.update[0].Identifier == 'n')) {
            unsupported.push(stmt.locations);
            return false;
        }

        return true;
    }
}

module.exports = { getForLoopBigO, getWhileLoopBigO };