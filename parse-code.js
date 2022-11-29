const { parse, BaseJavaCstVisitorWithDefaults } = require("java-parser");

function parseCodeToTree(sourceCode) {
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
            if (childStmt != null) stmts[index]['childStmts'].push(childStmt[0]);
        }
    })

    return stmts;
}

class StatementCollector extends BaseJavaCstVisitorWithDefaults {
    constructor() {
        super();
        this.blocks = [];
        this.validateVisitor();
    }

    statement(ctx) {
        for (const stmt in ctx) {
            if (stmt == 'statementWithoutTrailingSubstatement' || stmt == 'labeledStatement')
                this.visit(ctx[stmt]);
            else
                this.blocks.push(ctx[stmt]);
        }
    }
}

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
            terminate: ctx.hasOwnProperty('expression') ? getLeafNodes(ctx.expression[0].children) : null,
            update: ctx.hasOwnProperty('forUpdate') ? getLeafNodes(ctx.forUpdate[0].children) : null,
            blockCst: ctx.hasOwnProperty('statement') ? ctx.statement[0] : null,
            locations: {
                init: ctx.hasOwnProperty('forInit') ? { start: ctx.forInit[0].location.startOffset, end: ctx.forInit[0].location.endOffset } : null,
                terminate: ctx.hasOwnProperty('expression') ? { start: ctx.expression[0].location.startOffset, end: ctx.expression[0].location.endOffset } : null,
                update: ctx.hasOwnProperty('forUpdate') ? { start: ctx.forUpdate[0].location.startOffset, end: ctx.forUpdate[0].location.endOffset } : null,
                fullStmt: { start: ctx.LBrace[0].startOffset, end: ctx.RBrace[0].endOffset }
            }
        };
        this.loops.push(forLoop);
    }
}

class WhileLoopCollector extends BaseJavaCstVisitorWithDefaults {
    constructor() {
        super();
        this.loops = [];
        this.validateVisitor();
    }

    whileStatement(ctx) {
        const whileLoop = {
            type: 'whileLoop',
            terminate: ctx.hasOwnProperty('expression') ? getLeafNodes(ctx.expression[0].children) : null,
            blockCst: ctx.hasOwnProperty('statement') ? ctx.statement[0] : null,
            location: { start: ctx.statement[0].location.startOffset, end: ctx.statement[0].location.endOffset }
        };
        this.loops.push(whileLoop);
    }
}

class IfStmtCollector extends BaseJavaCstVisitorWithDefaults {
    constructor() {
        super();
        this.loops = [];
        this.validateVisitor();
    }

    ifStatement(ctx) {
        const ifStmt = {
            type: 'ifStmt',
            terminate: ctx.hasOwnProperty('expression') ? getLeafNodes(ctx.expression[0].children) : null,
            blockCst: ctx.hasOwnProperty('statement') ? ctx.statement[0] : null
        };
        this.loops.push(ifStmt);
    }
}

function getStatements(cst) {
    let stmtCollector = new StatementCollector();
    stmtCollector.visit(cst);
    let stmts = [...stmtCollector.blocks];

    stmts.forEach((stmt, index) => {
        switch (stmt[0].name) {
            case 'forStatement':
                stmts[index] = getForLoops(stmt);
                break;
            case 'ifStatement':
                stmts[index] = getIfStmts(stmt);
                break;
            case 'whileStatement':
                stmts[index] = getWhileLoops(stmt);
                break;
            default:
                getStatements(stmts);
        }
    })
    return stmts;
}

function getForLoops(cst) {
    let forLoopCollector = new ForLoopCollector();
    forLoopCollector.visit(cst);
    return forLoopCollector.loops[0];
}

function getWhileLoops(cst) {
    let whileLoopCollector = new WhileLoopCollector();
    whileLoopCollector.visit(cst);
    return whileLoopCollector.loops[0];
}

function getIfStmts(cst) {
    let ifStmtCollector = new IfStmtCollector();
    ifStmtCollector.visit(cst);
    return ifStmtCollector.loops[0];
}

function getLeafNodes(ctx) {
    const nodes = [];
    recursiveGetLeafNodes(ctx, nodes);
    return nodes;
}

function recursiveGetLeafNodes(ctx, arr) {
    const props = Object.getOwnPropertyNames(ctx);
    props.forEach(prop => {
        ctx[prop].forEach(elem => {
            const childCtx = elem.children;
            if (childCtx != null) {
                recursiveGetLeafNodes(childCtx, arr);
            } else {
                arr.push({
                    [prop]: elem.image
                });
            }
        });
    })
}

exports.parseCodeToTree = parseCodeToTree;