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
    "recover_email": "alice@gmail.com",
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
                console.log(auth.testUser("alice02", "My_d0g_is_the_best"));
                break;
            case "e":
                console.log(auth.getUsers());
        }
    } catch (error){
     console.log(error);   
    }
});