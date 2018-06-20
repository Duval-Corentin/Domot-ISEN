const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const JSONValidator = require('jsonschema').Validator;
const nodemailer = require('nodemailer');
const { spawn } = require('child_process');

/**
 * @class Authentification Module to create Users and Admins members, passwords are hashed and salted
 */
module.exports = class Auth {
    /**
     * @param {Boolean} verbose enable or disable debug message on console
     */
    constructor(verbose) {
        this.verbose = verbose;

        this.users = [];
        this.db = new sqlite3.Database('../SQLite/Domotisen.db', error => {
            if (error) throw error;
            if (this.verbose) console.log("Connected to the dataBase");
        });
        this.db.each("SELECT * FROM user", (error, row) => {
            if (error) throw error;
            row.is_admin = row.is_admin ? true : false;
            this.users.push(row);
        });

        this.recover_codes = new Map();
        this.recover_codes_timeout = new Map();
    }

    /**
     * @description add a new user or admin in the user database after checked email and password format 
     * @param {UserJSON} new_user object of the new user
     */
    addUser(new_user) {
        this.users.forEach(user => {
            if (user.username == new_user.username) {
                throw `user ${new_user.username} already exit`;
            }
        });

        if (this.testNew_UserJSON(new_user)) {
            const hash = crypto.createHash('sha256');
            const salt = crypto.randomBytes(128).toString('base64');
            hash.update(salt + new_user.password);
            const hashed_password = hash.digest('base64');

            console.log(hashed_password);

            var date = new Date();

            const user_json = {
                "username": new_user.username,
                "recover_email": new_user.recover_email,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "salt": salt,
                "hashed_password": hashed_password,
                "is_admin": new_user.is_admin ? true : false,
                "creation_date": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            }
            this.users.push(user_json);

            this.db.run(`INSERT INTO user VALUES ('${new_user.username}', '${new_user.recover_email}', '${new_user.first_name ? new_user.first_name : ""}', '${new_user.last_name ? new_user.last_name : ""}', '${salt}', '${hashed_password}', ${new_user.is_admin ? 1 : 0}, date('now'))`);

            if(new_user.is_admin) spawn("mosquitto_passwd", ["-b", "../MQTT/mosquitto_password", new_user.username, new_user.password]);

            return user_json;
        } else {
            throw "Unable to create user, bad email/password format";
        }
    }

    /**
     * @description remove a user of the User database
     * @param {String} username username of the account to remove
     * @param {String} password password of the account to remove
     */
    removeUser(username, password) {
        if(this.users.length <= 1) throw "Cannot Remove the last user of the system";
        try {
            if (this.testUser(username, password)) {
                for (let user of this.users) {
                    if (user.username == username) {
                        this.db.run(`DELETE FROM user WHERE username = '${username}'`);
                        this.users.splice(this.users.indexOf(user), 1);

                        spawn("mosquitto_passwd", ["-D", "../MQTT/mosquitto_password", username]);

                        return user;
                    }
                }
            } else {
                throw "Bad Password, cannot remove user"
            }
        } catch (error) {
            throw "Error removeUser : " + error;
        }
    }

    /**
     * @description send a recover Email to the recover_email of the user, need to be connected to internet, otherwise it will throw a email exception
     * @param {String} querry   
     * @return {String} email where the code has been send 
     */
    sendRecoverEmail(querry) {

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'domotisen01@gmail.com',
                pass: 'D0m0tisen'
            }
        });

        var user_find = false;
        for (let user of this.users) {

            if (querry == user.username || querry == user.recover_email) {
                require('dns').lookup('google.com', error => {
                    if(error && error.code == "ENOTFOUND") throw "No internet connection, cannot send mail"
                })
                user_find = true;

                const recover_code = crypto.randomBytes(8).toString('base64').toUpperCase();
                this.recover_codes.set(user.username, recover_code);
                this.recover_codes_timeout.set(user.username, setTimeout(() => {
                    this.recover_codes.delete(user.username);
                }, 1000 * 60 * 30));

                var mailOptions = {
                    from: '"Domot\'ISEN Box" <domotisen01@gmail.com>',
                    to: user.recover_email,
                    subject: 'Reset your Password, ' + user.username,
                    text: "code : " + this.recover_codes.get(user.username)
                };

                this.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) throw error;
                    if (this.verbose) console.log("Recover Email send: " + info.response);
                });
                return user.recover_email;
            }
        }

        if (!user_find) throw String(`${querry} didn't match any registed user`);
    }

    /**
     * @description change the password of a user 
     * @param {String} username name of the user 
     * @param {String} recover_code code send in the email with the function sendRecoverEmail
     * @param {String} new_password new password for the user, must be at least 8 characters long with capitals letters and digits
     * @return {String} new hashed_password 
     */
    changePassword(username, recover_code, new_password) {
        if (this.recover_codes.has(username) && this.recover_codes.get(username) == recover_code) {
            const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            if (!password_regex.test(new_password)) throw "Bad password format";

            const hash = crypto.createHash('sha256');
            const salt = crypto.randomBytes(128).toString('base64');
            hash.update(salt + new_password);
            const hashed_password = hash.digest('base64');

            for (let user of this.users) {
                if (user.username == username) {
                    this.db.run(`UPDATE user SET hashed_password = '${hashed_password}', salt = '${salt}' WHERE username = '${username}'`);
                    this.recover_codes.delete(username);
                    clearTimeout(this.recover_codes_timeout.get(username));
                    return hashed_password;
                }
            }
        }else{
            throw "Bad recover code";
        }
    }

    /**
     * @description test if this username/paswword match an existing user throw exception if username didn't exist 
     * @param {String} username 
     * @param {String} password
     * @return {Boolean} true if the username/password is correct, false otherwise 
     */
    testUser(username, password) {
        for (let user of this.users) {
            if (user.username == username) {
                const hash = crypto.createHash('sha256');
                hash.update(user.salt + password);
                const test_password = hash.digest('base64');

                if (this.verbose) console.log("test password : ", test_password);
                if (this.verbose) console.log("stored password", user.hashed_password);

                if (test_password === user.hashed_password) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        throw "username didn't match any registed user"
    }

    /**
     * @description test if this username/paswword match an existing admin throw exceptions if username didn't exist or if the user isn't an admin
     * @param {String} username 
     * @param {String} password
     * @return {Boolean} true if the username/password is correct, false otherwise 
     */
    testAdmin(username, password) {
        for (let user of this.users) {
            if (user.username == username) {
                const hash = crypto.createHash('sha256');
                hash.update(user.salt + password);
                const test_password = hash.digest('base64');

                if (this.verbose) console.log("test password : ", test_password);
                if (this.verbose) console.log("stored password", user.hashed_password);

                if (!user.is_admin) throw `${user.username} is not an Admin`;


                if (test_password === user.hashed_password) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        throw "username didn't match any registed user"
    }

    /**
     * @description return the list of all users and admins
     * @return {Array} users 
     */
    getUsers() {
        return this.users;
    }

    /**
     * @description test the format of a new_user JSON
     * @param {JSON} new_user Json of the new_user
     * @return {Boolean} true if the JSON is correct, false otherwise 
     */
    testNew_UserJSON(new_user) {
        var validator = new JSONValidator();

        const new_userJSONSchema = {
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
        if (!email_regex.test(new_user.recover_email)) throw "Bad email format";

        const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        if (!password_regex.test(new_user.password)) throw "Bad password format";

        try {
            if (validator.validate(new_user, new_userJSONSchema).errors.length == 0) {
                return true;
            } else {
                return false;
            }
        } catch (result) {
            throw String("bad User JSON Format : " + result);
        }
    }
}