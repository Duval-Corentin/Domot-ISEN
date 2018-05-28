const Schedule = require("node-schedule");
const Mopidy_lib = require("mopidy");
const JSONValidator = require('jsonschema').Validator;
const sqlite3 = require('sqlite3');

module.exports = class Alarm {

    constructor(mopidy_instance, verbose) {

        this.verbose = verbose;

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

    addAlarm(new_alarm) {
        if (this.verbose) console.log("Add new_alarm : ", new_alarm);
        if (!this.testAlarmJSON(new_alarm)) {
            throw "Bad JSON Format";
        } else if (!this.mopidy_ready) {
            throw "Mopidy is not ready yet"
        } else {

            for(let alarm of this.alarms.keys()){
                if(alarm.name == new_alarm.name) throw `alarm with name '${alarm.name}' allready exist, cannot create 2 alarms with same name'`;
                if(alarm.play_time == new_alarm.play_time) throw 'An alarm allready exist with the same play_time, cannot trigger 2 alarm at the same time';
            }
            this.mopidy.playlists.getPlaylists().then(playlists => {
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
                                this.removeAlarm(new_alarm);
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

    editAlarm(new_alarm) {
        if (!this.testAlarmJSON(new_alarm)) {
            throw "Bad JSON Format";
        } else if (!this.mopidy_ready) {
            throw "Mopidy is not ready yet";
        } else {
            for (let alarm of this.alarms.keys()) {
                if (new_alarm.name === alarm.name || new_alarm.trigger === alarm.trigger) {
                    this.removeAlarm(alarm);
                    this.addAlarm(new_alarm);
                    return new_alarm;
                }
            }
            throw "new_alarm didn't match any existing alarm";
        }
    }

    removeAlarm(new_alarm) {
        for (let alarm of this.alarms.keys()) {
            if (new_alarm.name == alarm.name) {
                this.alarms.get(alarm).cancel();
                this.alarms.delete(alarm);

                this.db.run(`DELETE FROM alarm WHERE name = '${new_alarm.name}'`, error => {
                    if (error) throw error;
                });
                if (this.verbose) console.log("Remove ", new_alarm);
                return new_alarm;
            }
        }
        throw "alarm to remove didn't match any existing alarm";
    }

    getAlarms(){
        var alarms = []
        for(let alarm of this.alarms.keys()){
            alarms.push(alarm);
        }
        return alarms;
    }

    play(alarm) {
        if (!this.playing && !this.snoozed) {
            if (!this.mopidy_ready) {
                throw "Mopidy is not ready";
            } else {
                this.mopidy.playlists.getPlaylists().then(playlists => {
                    var playlist_find = false;
                    for (let playlist of playlists) {
                        if (playlist.name === alarm.playlist_name) {
                            playlist_find = true;
                            this.mopidy.playback.setVolume(alarm.volume).then(() => {
                                return this.mopidy.tracklist.add(playlist.tracks).then(() => {
                                    return this.mopidy.tracklist.setRandom(true).then(() => {
                                        return this.mopidy.playback.play().then(() => {
                                            this.playing = alarm;
                                            this.stop_timeout = setTimeout(() => {
                                                this.stop();
                                            }, 1000 * alarm.play_time);
                                        });
                                    });
                                });
                            });
                            break;
                        }
                    }
                    if (!playlist_find) {
                        throw "Playlist to play not find"
                    }
                }).catch(console.error.bind(console)).done();
            }
        }
    }

    getAvailablesPlaylists() {
        if (!this.mopidy_ready) {
            throw "Mopidy is not ready";
        } else {
            return this.mopidy.playlists.getPlaylists().then(playlists => {
                var playlists_names = [];
                for (let playlist of playlists) {
                    playlists_names.push(playlist.name)
                }
                return playlists_names;
            });
        }
    }

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
            return Promise.resolve(old_playing);

        } else {
            return Promise.resolve(false);
        }
    }

    snooze() {
        if (this.playing) {
            this.stop().then(alarm => {
                this.snoozed = alarm;
                this.playing = undefined;

                this.play_timeout = setTimeout(() => {
                    const alarm = this.snoozed;
                    this.snoozed = undefined;
                    this.play(alarm);
                }, 1000 * alarm.snooze_time);

            });
        }
    }

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
                            "minimum": "0",
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
            console.log(result);
        }
    }

    getAlarmJSONFormat() {
        return this.alarmJSONSchema;
    }

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
}