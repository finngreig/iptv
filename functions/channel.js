const fetch = require('node-fetch');

exports.handler = function(event, context, callback) {
    const fileName = event.queryStringParameters.q;

    fetch('https://i.mjh.nz/nz/' + fileName)
        .then (res => {
            callback(null, {
                statusCode: 302,
                headers: {
                    "Location": res.url
                }
            });
        });
};