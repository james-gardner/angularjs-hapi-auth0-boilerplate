
var mongoose = require('mongoose');

module.exports = function (config, test, cb) {

    if (test) {
        mongoose.connect(config.get('MONGODB:TESTURI'));
    } else {
        mongoose.connect(config.get('MONGODB:URI'));
    }

    mongoose.connection.on('connected', function (err) {
        if (err) {
            return cb(err);
        }
        cb(null, {
            models: {
                User: require('../model/user'),
                Message: require('../model/message')
            },
            mongoose: mongoose,
            mongodb: mongoose.connection.db,
            disconnect: function () {
                mongoose.connection.close();
            }
        });
    });
};
