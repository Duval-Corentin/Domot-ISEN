const Mopidy = require("../Mopidy/MopidyHandler");
const Alarm = require("../Alarm/Alarm");
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


var mopidy = new Mopidy();
mopidy.generatePlaylists();
var alarm_handler = new Alarm(mopidy, true);

const alarm = {
    "name": "my_alarm_01",
    "playlist_name": "playlist_1",
    "volume": 70,
    "play_time": 20,
    "snooze_time": 5,
    "unique": false,
    "active": true,
    "trigger": {
        "days": {
            "monday": true,
            "tuesday": true,
            "wednesday": true,
            "thursday": true,
            "friday": true,
            "saturday": true,
            "sunday": true
        },
        "hour": 16,
        "minute": 10
    }
}

rl.on('line', (input) => {
    console.log(`Received: ${input}`);

    switch(input){
        case "a":
            alarm_handler.play(alarm);
            break;
        case "z":
            alarm_handler.snooze();
            break;
        case "e":
            alarm_handler.stop();
            break;
        case "r": 
            alarm_handler.removeAlarm(alarm);
            break;
        case "t":
            alarm_handler.addAlarm(alarm);
            break;
        case "y":
            alarm_handler.getAvailablesPlaylists().then( playlists => {
                console.log(playlists);
            });
    }
  });


  process.on('uncaughtException', (err) => {
      console.log(err);
      mopidy.close();
  })