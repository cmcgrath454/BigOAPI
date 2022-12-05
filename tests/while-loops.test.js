const getSourceCodeBigO = require("../get-code-big-o");

test("LinearIncrement", () => {
	expect(
		getSourceCodeBigO(
			`
            int x = 0;
            while (x < n) {
                x++;
            }
            `
		)
	).toStrictEqual({ result: "O(N)", unsupported: [] });
});

test("SquaredNested", () => {
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
		)
	).toBe("O(N^2)");
});

test("LinearDecrement", () => {
	expect(
		getSourceCodeBigO(
			`
            int x = n;
            while (x > 0) {
                x--;
            }
            `
		)
	).toBe("O(N)");
});

test("ConstantTimeDecrement", () => {
	expect(
		getSourceCodeBigO(
			`
            int x = n;
            while (x < n) {
                x--;
            }
            `
		)
	).toBe("O(1)");
});

test("ConstantTimeIncrement", () => {
	expect(
		getSourceCodeBigO(
			`
            int x = 0;
            while (x > n) {
                x++;
            }
            `
		)
	).toBe("O(1)");
});
