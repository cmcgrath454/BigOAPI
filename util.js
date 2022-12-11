/**
 * This function maps over a given tree using a function
 * provided.
 * @param {Object} tree tree to map over
 * @param {Function} fnc functino to map over tree
 */
function mapTree(tree, fnc) {
    tree.forEach(stmt => {
        fnc(stmt);
        if (stmt.childStmts.length > 0) {
            mapTree(stmt.childStmts, fnc);
        }
    })
}

exports.mapTree = mapTree;