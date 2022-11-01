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

function mapTree(tree, fnc) {
    tree.forEach(stmt => {
        fnc(stmt);
        if (stmt.childStmts.length > 0) {
            mapTree(stmt.childStmts, fnc);
        }
    })
}

exports.getLeafNodes = getLeafNodes;
exports.mapTree = mapTree;