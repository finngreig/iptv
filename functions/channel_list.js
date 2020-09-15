const fetch = require('node-fetch');

exports.handler = function(event, context, callback) {
    fetch('https://i.mjh.nz/nz/tv.json')
        .then(res => res.json())
        .then(res => callback(null, {
            statusCode: 200,
            body: JSON.stringify(res)
        }));
};