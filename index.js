const getSourceCodeBigO = require("./get-code-big-o");

var javaCode = undefined;
var unsupported = undefined;

exports.handler = async (event) => {
    const json = JSON.parse(event.body);
    const input = json.code;
    const result = getSourceCodeBigO(input);

    const response = {
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
        },
        statusCode: 200,
        body: JSON.stringify(result)
    };

    console.log(JSON.stringify(response));

    return response;

};

/* Uncomment Below for Testing */

// const input = `
// for (int i = n; i > 0;) {
//     for (int i = n; i > 0; i++) {}
// }
// `

// console.log(getSourceCodeBigO(input));