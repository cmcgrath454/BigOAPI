const getSourceCodeBigO = require("../get-code-big-o");

test("ForLoop1", () => {
	expect(
		getSourceCodeBigO(
			`
            for (int i = 0; i < n; i++) {}
            `
		)
	).toStrictEqual({ result: "O(N)", unsupported: [] });
});

test("ForLoop2", () => {
	expect(
		getSourceCodeBigO(
			`
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    for (int k = 0; k < n; k++);
                }
            }
            `
		)
	).toStrictEqual({ result: "O(N^3)", unsupported: [] });
});

test("ForLoop3", () => {
	expect(
		getSourceCodeBigO(
			`
            for (int i = n; i > 0; i--) {}
            `
		)
	).toStrictEqual({ result: "O(N)", unsupported: [] });
});

test("ForLoop4", () => {
	expect(
		getSourceCodeBigO(
			`
            for (int i = n; i > 0; i--) {
                for (int j = n; j > 0; j--) {}
            }
            `
		)
	).toStrictEqual({ result: "O(N^2)", unsupported: [] });
});

// LOG N case
test("ForLoop5", () => {
	expect(
		getSourceCodeBigO(
			`
            for (int i = n; i > 0; i/=2) {
                
            }
            `
		)
	).toStrictEqual({ result: "O(log(N))", unsupported: [] });
});

//N LOG N case
test("ForLoop6", () => {
	expect(
		getSourceCodeBigO(
			`
            for(int i = 0; i < n; i++) 
            {
                for(int j = n; j > 0; j/=2) 
                {

                }
            }
            `
		)
	).toStrictEqual({ result: "O(N * log(N))", unsupported: [] });
});
