const Schedule = require("node-schedule");
const Mopidy_lib = require("mopidy");
const JSONValidator = require('jsonschema').Validator;
const sqlite3 = require('sqlite3');
const Mqtt = require("mqtt");

/**
 * @class Manage a set of alarms and play songs with Mopidy Audio server 
 */
module.exports = class Alarm {
    
    /**
     * @description Create Alarm, get Alarm from DataBase
     * @param {MopidyHandler} mopidy_instance an instance of MopidyHandler  
     * @param {Boolean} verbose print details on console if activated
     */
    constructor(mopidy_instance, mosquitto_instance, verbose) {
        this.verbose = verbose;

        try{
            this.mqtt_client = Mqtt.connect({hostname : "127.0.0.1", port : 3501, username : "alarm", password : "Alarm01"});
        }catch(error){
            console.log(error);
        }
        if(this.verbose) this.mqtt_client.on("connect", () => console.log("connected"));

        this.mopidy = new Mopidy_lib({
            webSocketUrl: "ws://localhost:6680/mopidy/ws/",
            autoConnect: false,
            callingConvention: "by-position-only"
        });
        
        this.db = new sqlite3.Database('../SQLite/Domotisen.db', error => {
            if (error) throw error;
            if (this.verbose) console.log("Connected to the dataBase");
        });
        
        this.alarms = new Map();
        mopidy_instance.getEventEmitter().on("mopidy-ready", () => {
            this.mopidy_ready = true;
            this.mopidy.connect();

            this.mopidy.on("state:online", () => {

                this.db.each("SELECT * FROM alarm", (error, row) => {
                    if (error) throw error;

                    const alarm = {
                        "name": row.name,
                        "playlist_name": row.playlist_name,
                        "volume": row.volume,
                        "play_time": row.play_time,
                        "snooze_time": row.snooze_time,
                        "unique": (row.unique_trigger == 1) ? true : false,
                        "active": (row.active == 1) ? true : false,
                        "trigger": {
                            "days": {
                                "monday": (row.mon == 1) ? true : false,
                                "tuesday": (row.tue == 1) ? true : false,
                                "wednesday": (row.wed == 1) ? true : false,
                                "thursday": (row.thu == 1) ? true : false,
                                "friday": (row.fri == 1) ? true : false,
                                "saturday": (row.sat == 1) ? true : false,
                                "sunday": (row.sun == 1) ? true : false
                            },
                            "hour": row.hour,
                            "minute": row.minute
                        }
                    }; 
                    
                    const cron_task = Schedule.scheduleJob(this.triggerToCron(alarm.trigger), () => {
                        this.play(alarm);
                        if (alarm.unique) {
                            this.removeAlarm(alarm);
                        }
                    });

                    this.alarms.set(alarm, cron_task);

                    if(this.verbose) console.log('Initialised Alarms with : ', alarm);
                });
            });

            if (this.verbose) console.log("Mopidy connected");
        });

        if (mopidy_instance.isReady()) {
            mopidy_instance.getEventEmitter().emit("mopidy-ready");
        }

    }

    /**
     * @description add an Alarm to the object, schedule trigger of the alarm and return Promise with the Alarm
     * @param {AlarmJSON} new_alarm object of the Alarm to add
     */
    addAlarm(new_alarm) {
        if (this.verbose) console.log("Add new_alarm : ", new_alarm);
        if (!this.testAlarmJSON(new_alarm)) {
            throw "Bad JSON Format";
        } else if (!this.mopidy_ready) {
            throw "Mopidy is not ready yet"
        } else {

            for(let alarm of this.alarms.keys()){
                if(alarm.name == new_alarm.name) throw `alarm with name '${alarm.name}' allready exist, cannot create 2 alarms with same name'`;
                if(alarm.trigger == new_alarm.trigger) throw 'An alarm allready exist with the same trigger time, cannot trigger 2 alarm at the same time';
            }
            return this.mopidy.playlists.getPlaylists().then(playlists => {
                var playlist_find = false;
                for (let playlist of playlists) {
                    if (playlist.name == new_alarm.playlist_name) {
                        playlist_find = true;
                        break;
                    }
                }
                if (!playlist_find) {
                    throw "playlist_name didn't match any mopidy playlist"
                } else {
                    var cron_task;
                    if (new_alarm.active) {
                        cron_task = Schedule.scheduleJob(this.triggerToCron(new_alarm.trigger), () => {
                            this.play(new_alarm);
                            if (new_alarm.unique) {
                                this.removeAlarm(new_alarm.name);
                            }
                        });

                        this.db.run(`INSERT INTO alarm VALUES ('${new_alarm.name}', '${new_alarm.playlist_name}', ${new_alarm.volume}, ${new_alarm.play_time}, ${new_alarm.snooze_time}, ${new_alarm.unique ? 1 : 0}, ${new_alarm.active ? 1 : 0}, ${new_alarm.trigger.days.monday ? 1 : 0}, ${new_alarm.trigger.days.tuesday ? 1 : 0}, ${new_alarm.trigger.days.wednesday ? 1 : 0}, ${new_alarm.trigger.days.thuesday ? 1 : 0}, ${new_alarm.trigger.days.friday ? 1 : 0}, ${new_alarm.trigger.days.saturday ? 1 : 0}, ${new_alarm.trigger.days.sunday ? 1 : 0}, ${new_alarm.trigger.hour}, ${new_alarm.trigger.minute}, datetime('now'))`, error => {
                            if (error) throw error;
                        });
                    } else {
                        cron_task = undefined;
                    }
                    this.alarms.set(new_alarm, cron_task);
                    return new_alarm;
                }
            });
        }
    }

    /**
     * @description Edit an existing playlist 
     * @param {AlarmJSON} new_alarm Alarm to change, name proprety must be the same of one existing playlist
     */
    editAlarm(new_alarm) {
        if (!this.testAlarmJSON(new_alarm)) {
            throw "Bad JSON Format";
        } else if (!this.mopidy_ready) {
            throw "Mopidy is not ready yet";
        } else {
            for (let alarm of this.alarms.keys()) {
                if (new_alarm.name === alarm.name || new_alarm.trigger === alarm.trigger) {
                    this.removeAlarm(alarm.name);
                    this.addAlarm(new_alarm);
                    return new_alarm;
                }
            }
            throw "new_alarm didn't match any existing alarm";
        }
    }

    /**
     * @description remove an alarm 
     * @param {String} alarm_name Alarm to remove, name must match an existing playlist
     */
    removeAlarm(alarm_name) {
        for (let alarm of this.alarms.keys()) {
            if (alarm_name == alarm.name) {
                this.alarms.get(alarm).cancel();
                this.alarms.delete(alarm);

                this.db.run(`DELETE FROM alarm WHERE name = '${alarm.name}'`, error => {
                    if (error) throw error;
                });
                if (this.verbose) console.log("Remove ", alarm);
                return alarm;
            }
        }
        throw "alarm to remove didn't match any existing alarm";
    }

    /**
     * @returns return object with all stored alarms
     */
    getAlarms(){
        var alarms = []
        for(let alarm of this.alarms.keys()){
            alarms.push(alarm);
        }
        return alarms;
    }

    /**
     * @description launch the playlist of the alarm 
     * @param {AlarmJSON} alarm alarm to play
     */
    play(alarm) {
        if (!this.playing && !this.snoozed) {
            if (!this.mopidy_ready) {
                throw "Mopidy is not ready";
            } else {
                return this.mopidy.playlists.getPlaylists().then(playlists => {
                    var playlist_find = false;
                    for (let playlist of playlists) {
                        if (playlist.name === alarm.playlist_name) {
                            playlist_find = true;
                            return this.mopidy.playback.setVolume(alarm.volume).then(() => {
                                return this.mopidy.tracklist.add(playlist.tracks).then(() => {
                                    return this.mopidy.tracklist.shuffle().then(() => {
                                        return this.mopidy.playback.play().then(() => {
                                            this.playing = alarm;
                                            if(this.verbose) console.log("playing : ", alarm);
                                            this.stop_timeout = setTimeout(() => {
                                                this.stop();
                                            }, 1000 * alarm.play_time);

                                            console.log(JSON.stringify(alarm));
                                            try{
                                                this.mqtt_client.publish("/alarms/trigger", JSON.stringify(alarm));
                                            }catch(error){
                                                console.log(error);
                                            }
                                            return Promise.resolve(alarm);
                                        });
                                    });
                                });
                            });
                        }
                    }
                    if (!playlist_find) {
                        throw "Playlist to play not find"
                    }
                }).catch(console.error.bind(console));
            }
        }
        throw "an other alarm is allready playing, cannot trigger 2 alarms at the same time";
    }

    /**
     * @returns array of playlist objects
     */
    getAvailablesPlaylists() {
        if (!this.mopidy_ready) {
            throw "Mopidy is not ready";
        } else {
            return this.mopidy.playlists.getPlaylists().then(playlists => {
                var playlists_return = [];
                for (let playlist of playlists) {
                    var my_playlist = {
                        "name": "",
                        "tracks": []
                    }
                    my_playlist.name = playlist.name;
                    for(let track of playlist.tracks){
                        my_playlist.tracks.push(track.name);
                    }
                    playlists_return.push(my_playlist);
                }
                return playlists_return;
            });
        }
    }

    /**
     * @description stop the playing alarm if it was currently playing 
     */
    stop() {
        if (this.playing) {
            return this.mopidy.playback.stop().then(() => {
                const old_playing = this.playing;
                this.playing = undefined;
                return old_playing;
            });
        } else if (this.snoozed) {
            clearTimeout(this.play_timeout);
            const old_playing = this.snoozed;
            this.snoozed = undefined;
            this.mqtt_client.publish("/alarms/stop", JSON.stringify(old_playing));
            return Promise.resolve(old_playing);

        } else {
            return Promise.resolve(false);
        }
    }

    /**
     * @description snooze the currently trigger alarm and play it again in snooze_time
     */
    snooze() {
        if (this.playing) {
            return this.stop().then(alarm => {
                this.snoozed = alarm;
                this.playing = undefined;

                this.play_timeout = setTimeout(() => {
                    const alarm = this.snoozed;
                    this.snoozed = undefined;
                    this.play(alarm);
                }, 1000 * alarm.snooze_time);
                this.mqtt_client.publish("/alarms/snooze", JSON.stringify(this.snooze));
                return Promise.resolve(this.snooze);
            });
        }
        return Promise.resolve(false);
    }

    /**
     * @description test the schema of the AlarmJSON
     * @param {AlarmJSON} alarm object of the Alarm to test
     */
    testAlarmJSON(alarm) {
        var validator = new JSONValidator();
        this.alarmJSONSchema = {
            "type": "object",
            "required": ["name", "playlist_name", "volume", "play_time", "snooze_time", "unique", "active", "trigger"],
            "properties": {
                "name": {
                    "type": "string"
                },
                "playlist_name": {
                    "type": "string"
                },
                "volume": {
                    "type": "number",
                    "minimum": 1,
                    "maximum": 100
                },
                "play_time": {
                    "type": "number"
                },
                "snooze_time": {
                    "type": "number"
                },
                "unique": {
                    "type": "boolean"
                },
                "active": {
                    "type": "boolean"
                },
                "trigger": {
                    "type": "object",
                    "required": ["days", "hour", "minute"],
                    "properties": {
                        "days": {
                            "type": "object",
                            "required": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
                            "properties": {
                                "monday": {
                                    "type": "boolean"
                                },
                                "tuesday": {
                                    "type": "boolean"
                                },
                                "wednesday": {
                                    "type": "boolean"
                                },
                                "thursday": {
                                    "type": "boolean"
                                },
                                "friday": {
                                    "type": "boolean"
                                },
                                "saturday": {
                                    "type": "boolean"
                                },
                                "sunday": {
                                    "type": "boolean"
                                }
                            }
                        },
                        "hour": {
                            "type": "number",
                            "minimum": 0,
                            "maximum": 23
                        },
                        "minute": {
                            "type": "number",
                            "minimum": 0,
                            "maximum": 59
                        }
                    }
                }
            }
        }


        try {
            if (validator.validate(alarm, this.alarmJSONSchema).errors.length == 0) {
                return true;
            } else {
                return false;
            }
        } catch (result) {
            throw "bad Alarm JSON Format : " + result;
        }
    }

    /**
     * @description return the JSON Schema of Alarm
     */
    getAlarmJSONFormat() {
        return this.alarmJSONSchema;
    }

    /**
     * @param {JSON} trigger trigger propriety of the AlarmJSON
     */
    triggerToCron(trigger) {
        var cron = "0 ";
        var day = false;
        cron += String(trigger.minute) + " ";
        cron += String(trigger.hour) + " * * ";
        if (trigger.days.sunday) {
            cron += "0,";
            day = true;
        }
        if (trigger.days.monday) {
            cron += "1,";
            day = true;
        }
        if (trigger.days.tuesday) {
            cron += "2,";
            day = true;
        }
        if (trigger.days.wednesday) {
            cron += "3,";
            day = true;
        }
        if (trigger.days.thursday) {
            cron += "4,";
            day = true;
        }
        if (trigger.days.friday) {
            cron += "5,";
            day = true;
        }
        if (trigger.days.saturday) {
            cron += "6,";
            day = true;
        }
        if (!day) {
            cron += "*";
        } else {
            cron = cron.substring(0, cron.length - 1);
        }
        return cron;
    }

    getCurrentTrack(){
        return this.mopidy.playback.getCurrentTrack().then(track => {
            return track.name;
        }); 
    }

    getVolume(){
        return this.mopidy.playback.getVolume().then(volume => {
            return volume;
        });
    }
}