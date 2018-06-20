const Auth_class = require('./Authentification');

var Auth = new Auth_class();

var alice = {
    "username" : "alice",
    "recover_email" : "corentin.duval9@gmail.com",
    "first_name" : "alice",
    "last_name" : "bob",
    "password" : "Bob123456",
    "is_admin" : false
}

Auth.addUser(alice);