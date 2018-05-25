const Schedule = require("node-schedule");
const Mopidy_lib = require("mopidy");

module.exports = class Alarm {

    contructor(mopidy_instance){

        this.mopidy = new Mopidy_lib({
            webSocketUrl: "ws://localhost:6680/mopidy/ws/",
            autoConnect: false,
            callingConvention: "by-position-only"
        });

        this.mopidy_ready = mopidy_instance.isReady();
        if(this.mopidy_ready){
           this.mopidy.connect(); 
        }else{
            mopidy_instance.getEventEmitter().on("mopidy-ready", () => {
                this.mopidy_ready = true;
                this.mopidy.connect();
            });
        }

        this.alarms = new Map();

    }

    addAlarm(alarm){
        if(!this.testAlarmJSON(alarm)){
            return false;
        }else{
            mopidy.playlists.getPlaylists().then(playlists => {
                var playlist_find = false;
                for(let playlist of playlits){
                    if(playlist.name == alarm.playlist_name){
                        playlist_find = true;
                        break;
                    }
                }
                if(!playlist_find){
                    return false;
                }else{
                    if(alarm.active){
                        const cron_task = Schedule.scheduledJob(this.play_timeToCron(alarm.play_time), () => {
                            this.play(alarm.playlist_name);
                            if(alarm.unique){
                                this.removeAlarm(alarm);
                            }
                        });
                    }else{
                        const cron_task = undefined;
                    }
                    this.alarms.set(alarm, cron_task);
                    return alarm;
                }
            });
        }
    }

    editAlarm(alarm){

    }

    removeAlarm(alarm){

    }

    play(playlistName){

    }

    stop(){

    }

    snooze(){

    }

    setVolume(level){

    }

    setRandom(random){

    }

    testAlarmJSON(alarm){
        if(typeof alarm.name == "string" && typeof alarm.playlist_name == "string" && typeof alarm.play_time == "number" && typeof alarm.play_time > 0 && typeof alarm.snooze_time == "number" && typeof alarm.snooze_time > 0 && typeof alarm.unique == "boolean" && typeof alarm.active == "boolean" && typeof alarm.play_time.hour == "number" && alarm.play_time.hour >= 0 && alarm.play_time.hour <= 23 && typeof alarm.play_time.minute == "number" && alarm.play_time.minute >= 0 && alarm.play_time.minute <= 59){
            return true;
        }else{
            return false;
        }
    }

    play_timeToCron(play_time){
        var cron = "0 ";
        var day = false;
        cron += String(play_time.minute) + " ";
        cron += String(play_time.hour) + " * * ";
        if(play_time.days.sunday){
            cron += "0,";
            day = true;
        }
        if(play_time.days.monday){
            cron += "1,";
            day = true;
        }
        if(play_time.days.tuesday){
            cron += "2,";
            day = true;
        }
        if(play_time.days.wednesday){
            cron += "3,";
            day = true;
        }
        if(play_time.days.thursday){
            cron += "4,";
            day = true;
        }
        if(play_time.days.friday){
            cron += "5,";
            day = true;
        }
        if(play_time.days.saturday){
            cron += "6,";
            day = true;
        }
        if(!day){
            cron += "*";
        }else{
            cron.substring(0, cron.length - 1);
        }

        return cron;
    }
}


/**
 * Alarm JSON 
 */

 var Alarm = {
    "name": String,
    "playlist_name": String,
    "play_time": Number,
    "snooze_time": Number,
    "unique": Boolean,
    "active": Boolean,
    "play_time": {
        "days": {
            "monday": Boolean,
            "tuesday": Boolean,
            "wednesday": Boolean,
            "thursday": Boolean,
            "friday": Boolean,
            "saturday": Boolean,
            "sunday": Boolean
        },
        "hour": Number,
        "minute": Number
    }
 }