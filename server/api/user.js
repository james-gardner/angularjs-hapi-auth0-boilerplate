
module.exports = function (server, mountpoint, User, acl) {

    var Handler = new (require('../../server/simpleCRUD'))({model: User});

    server.route({
        method: 'GET',
        path: mountpoint + '/users',
        config: {
            handler: acl.hapiAllowed('users', 'list', Handler.list),
            auth: 'auth0'
        }
    });

    server.route({
        method: 'POST',
        path: mountpoint + '/users',
        config: {
            handler: acl.hapiAllowed('users', 'create', Handler.create),
            auth: 'auth0'
        }
    });

    server.route({
        method: 'GET',
        path: mountpoint + '/users/{_id}',
        config: {
            handler: acl.hapiAllowed('users', 'read', Handler.read),
            auth: 'auth0'
        }
    });

    server.route({
        method: 'PUT',
        path: mountpoint + '/users',
        config: {
            handler: acl.hapiAllowed('users', 'update', Handler.update),
            auth: 'auth0'
        }
    });

    server.route({
        method: 'DELETE',
        path: mountpoint + '/users/{_id}',
        config: {
            handler: acl.hapiAllowed('users', 'delete',Handler.delete), // jshint ignore:line
            auth: 'auth0'
        }
    });

};

