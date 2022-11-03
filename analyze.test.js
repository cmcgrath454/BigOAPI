const getSourceCodeBigO = require('./analyze');

const test1string = `for (int i = 0; i < n; i++) {for (int j = 0; j < n; j++) {}}`

test('test1', () => {
    expect(getSourceCodeBigO(test1string)).toBe("O(N^2)");
})