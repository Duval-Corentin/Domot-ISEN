const readline = require('readline');

const Mopidy = require("../Mopidy/MopidyHandler");
const Alarm = require("../Alarm/Alarm");
const Auth = require("../Authentification/Authentification");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const auth = new Auth(true);


const user_1 = {
    "username": "alice08",
    "recover_email": "corentin.duval9@gmail.com",
    "first_name": "alice",
    "last_name": "foo",
    "password": "vfvfd0vfDvf6dvd",
    "is_admin": false
};

rl.on("line", line => {
    try{
        switch (line) {
            case "a": 
                auth.addUser(user_1);
                break;
            case "z":
                auth.send_recover_email(user_1.username);
                break;
            case "e":
                auth.change_password(user_1.username, "FD4FRZ", "New_PassW0rd");
        }
    } catch (error){
     console.log(error);   
    }
});