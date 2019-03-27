const proxy = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(proxy('/api/variant',
        {target: `http://${process.env.SERVICES_HOST}`}
    ));
};