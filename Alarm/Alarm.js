const Schedule = require("node-schedule");
const Mopidy_lib = require("mopidy");
const JSONValidator = require('jsonschema').Validator;

module.exports = class Alarm {

    constructor(mopidy_instance, verbose) {

        this.verbose = verbose;

        this.mopidy = new Mopidy_lib({
            webSocketUrl: "ws://localhost:6680/mopidy/ws/",
            autoConnect: false,
            callingConvention: "by-position-only"
        });

        this.mopidy_ready = mopidy_instance.isReady();
        if (this.mopidy_ready) {
            this.mopidy.connect();
            if(this.verbose) console.log("Mopidy connected");
        } else {
            mopidy_instance.getEventEmitter().on("mopidy-ready", () => {
                this.mopidy_ready = true;
                this.mopidy.connect();
                if(this.verbose) console.log("Mopidy connected");
            });
        }

        this.alarms = new Map();

    }

    addAlarm(alarm) {
        if(this.verbose) console.log("Add alarm : ", alarm);
        if (!this.testAlarmJSON(alarm)) {
            throw "Bad JSON Format";
        } else if (!this.mopidy_ready) {
            throw "Mopidy is not ready yet"
        } else {
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
                    if (alarm.active) {
                        const cron_task = Schedule.scheduledJob(this.triggerToCron(new_alarm.trigger), () => {
                            this.play(new_alarm);
                            if (new_alarm.unique) {
                                this.removeAlarm(new_alarm);
                            }
                        });
                    } else {
                        const cron_task = undefined;
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
            if (new_alarm === alarm) {
                this.alarms[new_alarm].cancel();
                this.alarms.delete(new_alarm);
                if (this.verbose) console.log("Remove ", new_alarm);
                return new_alarm;
            }
        }
        throw "alarm to remove didn't match any existing alarm";
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

    getAvailablesPlaylists(){
        if(!this.mopidy_ready){
            throw "Mopidy is not ready";
        }else{
            return this.mopidy.playlists.getPlaylists().then( playlists => {
                var playlists_names = [];
                console.log(playlists);
                for(let playlist of playlists){
                    playlists_names.push(playlist.name)
                    console.log(playlist);
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
            this.snoozed = this.stop();
            this.play_timeout = setTimeout(() => {
                const alarm = this.snooze;
                this.snooze = undefined;
                this.play(alarm);
            }, 1000 * this.playing.snooze_time);
            this.playing = undefined;
        }
    }

    testAlarmJSON(alarm) {
        var validator = new JSONValidator();
        var alarmJSONSchema = {
            "type": "object",
            "required": [],
            "properties": {
                "name": {
                    "type": "string"
                },
                "playlist_name": {
                    "type": "string"
                },
                "volume": {
                    "type": "number"
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
                    "required": [],
                    "properties": {
                        "days": {
                            "type": "object",
                            "required": [],
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
                            "type": "number"
                        },
                        "minute": {
                            "type": "number"
                        }
                    }
                }
            }
        }

        try {
            if(validator.validate(alarm, alarmJSONSchema).errors.length == 0){
                return true;
            }else{
                return false;
            }
        } catch (result) {
            console.log(result);
        }
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
            cron.substring(0, cron.length - 1);
        }

        return cron;
    }
}