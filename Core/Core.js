const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');

const Auth_class = require('../Authentification/Authentification');
const alarm_router = require('../Alarm/Alarm-router');
const Mosquitto_class = require('../MQTT/Mosquitto_server');

const Auth = new Auth_class(true);
const Mosquitto = new Mosquitto_class(true);

// ------ EXPRESS MIDDLEWARES ------

// parse request to JSON
app.use(bodyParser.json());

/**
 * @apiDefine Request
 * @apiParam {Object} request object with parameters of the request
 */
/**
 * @apiDefine Auth
 * @apiParam {Object} auth Auth object of the user who make the request
 * @apiParam {String} auth.username name of the user
 * @apiParam {String} auth.password password of the user
 */
const check_user = (req, res, next) => {
    try {
        if (!req.body.auth.username || !req.body.auth.password) {
            res.status(401).send("Must be authentified with proper username and password");
        } else if (!Auth.testUser(req.body.auth.username, req.body.auth.password)) {
            res.status(403).send("Bad username/password");
        } else {
            next();
        }
    } catch (error) {
        res.status(404).send(String(error));
    }
}

// ------ EXPRESS ROUTERS ------

// Alarms Modules
app.use('/api/alarms', alarm_router.router);
app.use('/api/alarms', check_user, alarm_router.auth_router);

/**
 * Root of the API 
 * @api {get} / Root 
 * @apiName GetRoot
 * @apiGroup Root
 * @apiVersion  0.0.2  
 */
app.use(express.static(__dirname + "/../Docs/apidoc"));
app.get('/api/', (req, res) => {
    res.sendFile('/../Docs/apidoc/index.html', {root : __dirname});
});


// ------ SERVER CREATION ------
https.createServer({
        key: fs.readFileSync('./SSL_Certificates/server.key'),
        cert: fs.readFileSync('./SSL_Certificates/server.cert')
    }, app)
    .listen(3500, function () {
        console.log('Domot\'ISEN running on port 3500');
    });

// ------ AUTH MODULE ------
/** -- test user --
 * @api {put} /users TestUser
 * @apiName TestUser
 * @apiGroup User
 * @apiVersion  0.0.2
 * 
 * @apiUse Request
 * @apiParam {String} request.username username of the user to test
 * @apiParam {String} request.password password of the user to test  
 * 
 * @apiParamExample {json} Request-Example 
 *  {
 *      "request" : {
 *          "username" : "Alice01",
 *          "password" : "Bob123456"
 *      }
 *  }
 * 
 * @apiSuccess {String} Username username of the authentified user
 * @apiError {String} BadUsername/Password Bad username and/or password
 */
app.put("/api/users", (req, res) => {
    const request = req.body.request;

    try {
        const is_auth = Auth.testUser(request.username, request.password);
        if (is_auth) {
            res.send(request.username);
        } else {
            res.status(404).send("Bad Username / Password");
        }
    } catch (error) {
        res.status(400).send(String(error));
    }
})

/** -- get user(s) -- 
 * @api {get} /users GetUser(S)
 * @apiName GetUser(S)
 * @apiGroup User
 * @apiVersion  0.0.2
 * 
 * 
 * @apiUse Auth
 * @apiUse Request
 * @apiParam {String} [request.username] username of the searched user
 * 
 * @apiSuccess (200) {Object[]} Users Array of Users depending of the Querry
 * 
 * @apiError (404) {String} NotFindError Cannot Find (The) User(s)
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     "auth" : {
 *         "username" : "Alice01",
 *         "password" : "Bob123456"
 *     },
 *     "request" : {
 *         "username" : "Joe03"
 *     }
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Example:
 * [ {
 *      "username" : "Bob123456",
 *      "recover_email" : "bob@gmail.com",
 *      "first_name" : "Bob",
 *      "last_name" : "Doe",
 *      "salt" : "vdsvdqvdqvfdsvfds",
 *      "hashed_password" : "cdsqcdqscdsqcdqsvdsq",
 *      "is_admin" : false
 *   }]
 */
app.get("/api/users", check_user, (req, res) => {
    const request = req.body.request;
    const users = Auth.getUsers();
    if (request) {
        for (let user of users) {
            if (user.username == request.username) {
                res.send(user);
                return;
            }
        }
        res.status(404).send(String(`Cannot find user with username : "${request.username}"`))
    } else {
        res.send(users);
    }
});

/** -- add User --
 * @api {post} /users AddUser
 * @apiName AddUser
 * @apiGroup User
 * @apiVersion  0.0.2
 * 
 * 
 * @apiUse Auth
 * @apiUse Request
 * @apiParam {String} request.username 
 * @apiParam {String} request.recover_email email used for recover the password of the user
 * @apiParam {String} request.first_name 
 * @apiParam {String} request.last_name
 * @apiParam {String} request.password 
 * @apiParam {Boolean} request.is_admin if the user have admin permmitions or not 
 * 
 * @apiSuccess (200) {Object} UserObject JSON Object of the new created user
 * 
 * @apiError (400) {String} AuthError Error From the Auth Module
 * @apiParamExample  {json} Request-Example:
 * {
 *     "auth" : {
 *         "username" : "Alice01",
 *         "password" : "Bob123456"
 *     },
 *     "request" : {
 *          "username" : "Joe03",
 *          "password" : "Bob12345",
 *          "recover_email" : "Joe@gmail.com",
 *          "first_name" : "Bob",
 *          "last_name" : "Doe",
 *          "is_admin" : false
 *     }
 * }
 * 
 * @apiSuccessExample {json} Success-Example:
 * {
 *      "username" : "Bob123456",
 *      "recover_email" : "bob@gmail.com",
 *      "first_name" : "Bob",
 *      "last_name" : "Doe",
 *      "salt" : "vdsvdqvdqvfdsvfds",
 *      "hashed_password" : "cdsqcdqscdsqcdqsvdsq",
 *      "is_admin" : false
 * }
 */
app.post("/api/users", check_user, (req, res) => {
    const request = req.body.request;
    try {
        const created_user = Auth.addUser(request);
        if (created_user) res.send(created_user);
    } catch (error) {
        if (error) res.status(400).send(String(error));
    }
});

/** -- send recover password email --
 * @api {post} /users/recover_email SendRecoverEmail
 * @apiName SendRecoverEmail
 * @apiGroup User
 * @apiVersion  0.0.2
 * 
 * 
 * @apiUse Request 
 * @apiParam {String} [request.username] username of the lost account 
 * @apiParam {String} [request.recover_email] email of the lost account
 * 
 * @apiSuccess (200) {String} Email email where the recovery code has been send
 * 
 * @apiError (404) {String} EmailError error from the Google's Gmail Module
 * @apiError (400) {String} MissingArgument missing 1 argument (need a username or a email address)
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     "request" : {
 *         "username" : "Bob34"
 *     }
 * }
 * 
 * @apiSuccessExample {String} Success-Example:
 * "Bob34@gmail.com"
 */
app.post("/api/users/recover_email", (req, res) => {
    const request = req.body.request;
    if(request.username || request.recover_email){
        try {
            const email_address = Auth.sendRecoverEmail(request.username);
            if (email_address) res.send(email_address);
        } catch (error) {
            if (error) res.status(404).send(error);
        }
    } else {
        res.status(400).send("Missing Argument (username or email)");
    }
});

/** -- change password -- 
 * @api {put} /users/change_password ChangePassword
 * @apiName ChangePassword
 * @apiGroup User
 * @apiVersion  0.0.2
 * 
 * 
 * @apiUse Request
 * @apiParam {String} username username of the account
 * @apiParam {String} recover_code recover code find in the email
 * @apiParam {String} new_password new password with at least 1 digit, 1 upper and 1 lower case letter   
 * 
 * @apiSuccess (200) {String} NewHashedPassword Salted hash of the new password
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     "request" : {
 *          "username" : "Alice02",
 *          "recover_code" : "CECE45FECE",
 *          "password" : "New_passw0rd"
 *      }
 * }
 */
app.put("/api/users/change_password", (req, res) => {
    const request = req.body.request;

    try {
        const hashed_password = Auth.changePassword(request.username, request.recover_code, request.password);
        if (hashed_password) res.send(hashed_password);
    } catch (error) {
        if (error) res.status(403).send(String(error));
    }
});

/** -- delete user --
 * @api {delete} /users DeleteUser
 * @apiName DeleteUser
 * @apiGroup User
 * @apiVersion  0.0.2
 * 
 * 
 * @apiUse Auth
 * @apiUse Request
 * @apiParam {String} request.username username of the user to remove
 * @apiParam {String} request.password password of the user to remove
 * 
 * @apiSuccess (200) {Object} removed user JSON object 
 * 
 * @apiError (400) {String} Auth Module Error
 * 
 * 
 * @apiSuccessExample {json} Success-Example:
 * {
 *      "username" : "Bob123456",
 *      "recover_email" : "bob@gmail.com",
 *      "first_name" : "Bob",
 *      "last_name" : "Doe",
 *      "salt" : "vdsvdqvdqvfdsvfds",
 *      "hashed_password" : "cdsqcdqscdsqcdqsvdsq",
 *      "is_admin" : false
 * }
 */
app.delete("/api/users", check_user, (req, res) => {
    const request = req.body.request;
    try {
        const removed_user = Auth.removeUser(request.username, request.password);
        if (removed_user) res.send(removed_user);
    } catch (error) {
        if (error) res.status(400).send(error);
    }
});