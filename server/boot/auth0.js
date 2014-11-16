
var Auth0 = require('auth0');

module.exports = function (server, config, User, cb) {

    var auth0_api = new Auth0({
        domain:       config.get('auth0:domain'),
        clientID:     config.get('auth0:clientId'),
        clientSecret: config.get('auth0:clientSecret')
    });

    function findUser(auth0_user, cb) {
        User.findOne({ auth0_id: auth0_user.user_id}, function (err, user) {
            if (err) {
                server.log(['auth0', 'error', 'db'], err);
                return;
            }
            if (user) {
                server.log(['auth0', 'info', 'db', 'found'], user);
                cb(null, user);
                return;
            }
            user = new User({ email: auth0_user.email, auth0_id: auth0_user.user_id});
            user.save(function (err) {
                if (err) {
                    server.log(['auth0', 'error', 'db'], err);
                    return;
                }
                server.log(['auth0', 'info', 'db', 'created'], user);
                cb(null, user);
            });
        });
    }

    server.pack.register(require('hapi-auth-jwt'), function (err) {
        if (err) {
            return cb(err);
        }
        server.auth.strategy('auth0', 'jwt', {
            validateFunc: function (token, callback) {
                auth0_api.getUser(token['sub'], function (err, user){
                    server.log(['auth0'], user);

                    findUser(user, function (err, user) {
                        if (err) {
                            server.log(['auth0', 'error'], err);
                            callback(err, false);
                            return;
                        }
                        callback(null, true, user);
                    });
                });
            },
            key: new Buffer(config.auth0.clientSecret, 'base64')
        });

        return cb();
    });
};

