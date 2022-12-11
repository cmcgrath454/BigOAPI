const getSourceCodeBigO = require("./get-code-big-o");

var javaCode = undefined;
var unsupported = undefined;

/**
 * This event handler is the entry point for API calls and handles the request and response
 * @param {*} event - The API call event details (handled by AWS)
 */
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