const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const JSONValidator = require('jsonschema').Validator;
const nodemailer = require('nodemailer');

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
                "is_admin": new_user.is_admin ? true : false,
                "creation_date": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            });

            this.db.run(`INSERT INTO user VALUES ('${new_user.username}', '${new_user.recover_email}', '${new_user.first_name ? new_user.first_name : ""}', '${new_user.last_name ? new_user.last_name : ""}', '${salt}', '${hashed_password}', ${new_user.is_admin ? 1 : 0}, date('now'))`);

            return true;
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
        try{
            if(this.testUser(username, password)){
                for(let user of this.users){
                    if(user.username == username){
                        this.users.splice(this.users.indexOf(user), 1);
                    }
                    return user;
                }
            }else{
                throw "Bad Password, cannot remove user"
            }
        }catch(error){
            throw "Error removeUser : " + error;
        }
    }

    sendRecoverEmail(username){

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'domotisen01@gmail.com',
                pass: 'D0m0tisen'
            }
        });

        var user_find = false;
        for(let user of this.users){

            if(username == user.username){

                user_find = true;

                const recover_code = crypto.randomBytes(8).toString('base64').toUpperCase();
                this.recover_codes.set(user.username, recover_code);
                this.recover_codes_timeout.set(user.username, setTimeout( () => {
                    this.recover_codes.delete(user.username);
                }, 1000 * 60 * 30));

                console.log(user.recover_email);

                var mailOptions = {
                    from: '"Domot\'ISEN Box" <domotisen01@gmail.com>',
                    to: user.recover_email,
                    subject: 'Reset your Password, ' + user.username,
                    text: "code : " + this.recover_codes.get(user.username)
                };

                this.transporter.sendMail(mailOptions, (error, info) => {
                    if(error) throw error;
                    if(this.verbose) console.log("Recover Email send: " + info.response);
                });
                return user.recover_email;
            }
        }

        if(!user_find) throw "username didn't match any registed user";
    }

    changePassword(username, recover_code, new_password){
        if(this.recover_codes.has(username)){
            if(this.recover_codes.get(username) == recover_code){
                const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
                if(!password_regex.test(user.password)) throw "Bad password format";

                for(let user of this.users){
                    if(user.username == username){
                        this.removeUser(user);
                        try { 
                            this.addUser({
                            "username": user.username,
                            "recover_email": user.recover_email,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "password": new_password,
                            "is_admin": user.is_admin
                            });
                        } catch(error){
                            throw "Change_password : " + error;
                        }

                        this.recover_codes.delete(username);
                        clearTimeout(this.recover_codes_timeout.get(username));
                    }
                }
            }
        }
    }

    testUser(username, password) {
        for (let user of this.users) {
            if (user.username == username) {
                const hash = crypto.createHash('sha256');
                hash.update(user.salt + password);
                const test_password = hash.digest('base64');

                if(this.verbose) console.log("test password : ", test_password);
                if(this.verbose) console.log("stored password", user.hashed_password);

                if (test_password === user.hashed_password) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        throw "username didn't match any registed user"
    }

    testAdmin(username, password){

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