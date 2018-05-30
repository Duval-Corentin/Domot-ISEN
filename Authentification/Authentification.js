const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const JSONValidator = require('jsonschema').Validator;

module.exports = class Auth {
    constructor(verbose) {
        this.verbose = verbose;

        this.users = [];
        this.db = new sqlite3.Database('../SQLite/Domotisen.db', error => {
            if (error) throw error;
            if (this.verbose) console.log("Connected to the dataBase");
        });
        this.db.each("SELECT * FROM user", (error, row) => {
            if (error) throw error;
    
            this.users.push(row);
        });
    }

    addUser(new_user) {
        this.users.forEach(user => {
            if (user.username == new_user.username) {
                throw `user ${new_user.username} already exit`;
            }
        });

        if (this.testUserJSON(new_user)) {
            const hash = crypto.createHash('sha256');
            const salt = crypto.randomBytes(128).toString('base64');
            hash.update(salt + new_user.password);
            const hashed_password = hash.digest('base64');

            console.log(hashed_password);

            var date = new Date();

            this.users.push({
                "username": new_user.username,
                "recover_email": new_user.recover_email,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "salt": salt,
                "hashed_password": hashed_password,
                "is_admin": new_user.is_admin,
                "creation_date": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            });

            this.db.run(`INSERT INTO user VALUES ('${new_user.username}', '${new_user.recover_email}', '${new_user.first_name ? new_user.first_name : ""}', '${new_user.last_name ? new_user.last_name : ""}', '${salt}', '${hashed_password}', ${new_user.is_admin ? 1 : 0}, date('now'))`);

            return true;
        } else {
            throw "Unable to create user, bad email/password format";
        }
    }

    removeUser(username, password) {

    }

    testUser(username, password) {
        for (let user of this.users) {
            if (user.username == username) {
                const hash = crypto.createHash('sha256');
                hash.update(user.salt + password);
                const test_password = hash.digest('base64');

                console.log("test password : ", test_password);
                console.log("stored password", user.hashed_password);

                if (test_password === user.hashed_password) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        throw "username didn't match any registed user"
    }

    getUsers() {
        return this.users;
    }

    testUserJSON(user) {
        var validator = new JSONValidator();

        this.userJSONSchema = {
            "type": "object",
            "required": ["username", "recover_email", "password"],
            "propreties": {
                "username": {
                    "type": "string"
                },
                "recover_email": {
                    "type": "string"
                },
                "first_name": {
                    "type": "string"
                },
                "last_name": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "is_admin": {
                    "type": "boolean"
                }
            }
        }

        const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email_regex.test(user.recover_email)) throw "Bad email format";

        const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        if(!password_regex.test(user.password)) throw "Bad password format";
        
        try {
            if (validator.validate(user, this.userJSONSchema).errors.length == 0) {
                return true;
            } else {
                return false;
            }
        } catch (result) {
            throw "bad User JSON Format : " + result;
        }
    }
}