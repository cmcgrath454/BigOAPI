const getSourceCodeBigO = require("../get-code-big-o");

test('ForLoop1', () => {
    expect(
        getSourceCodeBigO(
            `
            for (int i = 0; i < n; i++) {}
            `
            ))
            .toBe("O(N)");
})

test('ForLoop2', () => {
    expect(
        getSourceCodeBigO(
            `
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    for (int k = 0; k < n; k++);
                }
            }
            `
            ))
            .toBe("O(N^3)");
})

test('ForLoop3', () => {
    expect(
        getSourceCodeBigO(
            `
            for (int i = n; i > 0; i--) {}
            `
            ))
            .toBe("O(N)");
})

test('ForLoop4', () => {
    expect(
        getSourceCodeBigO(
            `
            for (int i = n; i > 0; i--) {
                for (int j = n; j > 0; j--) {}
            }
            `
            ))
            .toBe("O(N^2)");
})
