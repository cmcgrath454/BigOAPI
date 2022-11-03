const getSourceCodeBigO = require('../analyze');

test('WhileLoop1', () => {
    expect(
        getSourceCodeBigO(
            `
            int x = 0;
            while (x < n) {
                x++;
            }
            `
            ))
            .toBe("O(N)");
})

test('WhileLoop2', () => {
    expect(
        getSourceCodeBigO(
            `
            int x = 0;
            while (x < n) {
                x++;
                int y = 0;
                while (y < n) {
                    y++;
                }
            }
            `
            ))
            .toBe("O(N^2)");
})
