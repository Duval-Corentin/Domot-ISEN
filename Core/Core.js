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
    "name": "my_alarm_04",
    "playlist_name": "playlist_1",
    "volume": 100,
    "play_time": 60,
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
        "hour": 11,
        "minute": 38
    }
}

rl.on('line', (input) => {
    console.log(`Received: ${input}`);

    try{
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
                break;
            case 'u':
                console.log(alarm_handler.getAlarms());
                break;
        }
    }catch(error){
        console.log(error);
    }

  });


  process.on('uncaughtException', (err) => {
      console.log(err);
      mopidy.close();
  })