const fetch = require('node-fetch');

module.exports = (req, res) => {
    const fileName = req.query.q;

    fetch('https://i.mjh.nz/nz/' + fileName)
        .then (r => {
            res.status(302).set("Location", r.url).end();
        });
}