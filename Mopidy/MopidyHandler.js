const { spawn } = require('child_process');
const EventEmitter = require("events");


module.exports = class MopidyHandler{

    constructor(){
        this.mopidyProcess = spawn("mopidy");
        this.eventEmitter = new EventEmitter();

        this.stderr = "";

        this.mopidy_ready = false;
        this.spotify_connected = false;

        this.mopidyProcess.stderr.on('data', data => {
            this.stderr += String(data);

            if(this.stderr.includes("HTTP server running at [::ffff:127.0.0.1]:6680") && !this.mopidy_ready){
                this.eventEmitter.emit("mopidy-ready");
                this.mopidy_ready = true;
            }
            if(this.stderr.includes("Logged in to Spotify in online mode") && !this.spotify_connected){
                this.eventEmitter.emit("mopidy-spotify-connected");
                this.spotify_connected = true;
            }
        });

        this.mopidyProcess.on("close", (code, signal) => {
            this.eventEmitter.emit("mopidy-close", code, signal);
        })

    }

    getEventEmitter(){
        return this.eventEmitter;
    }

    isReady(){
        return this.mopidy_ready;
    }

    isSpotifyConnected(){
        return this.spotify_connected;
    }

    close(){
        this.mopidyProcess.kill('SIGKILL');
    }



}