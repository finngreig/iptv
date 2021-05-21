const fetch = require('node-fetch');

module.exports = (req, res) => {
    fetch('https://i.mjh.nz/nz/tv.json')
        .then(r => r.json())
        .then(r => res.json(r));
}