const getSourceCodeBigO = require('./analyze');

exports.handler = async (event) => {
    const json = JSON.parse(event.body);
    const input = json.code;
    const response = {
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
        },
        statusCode: 200,
        body: JSON.stringify(getSourceCodeBigO(input))
    };
    return response;
};

/* Uncomment Below for Testing */

const input = `
while (x < n) {
    x++;
}
`

var javaCode = undefined;

console.log(getSourceCodeBigO(input));
