const getSourceCodeBigO = require("./get-code-big-o");

var javaCode = undefined;
var unsupported = undefined;

/**
 * This event handler is the entry point for API calls and handles the request and response
 * @param {*} event - The API call event details (handled by AWS)
 */
exports.handler = async (event) => {
    let response = {}
    try {
        const result = getSourceCodeBigO(event.body);
        response = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
                'Access-Control-Allow-Credentials': true

            },
            statusCode: 201,
            body: JSON.stringify(result)
        };
    } catch (e) {
        console.error(e);

        response = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
                'Access-Control-Allow-Credentials': true

            },
            statusCode: 422,
            body: JSON.stringify(e, Object.getOwnPropertyNames(e))
        }
    }
    return response;
};