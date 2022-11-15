function mapTree(tree, fnc) {
    tree.forEach(stmt => {
        fnc(stmt);
        if (stmt.childStmts.length > 0) {
            mapTree(stmt.childStmts, fnc);
        }
    })
}

exports.mapTree = mapTree;