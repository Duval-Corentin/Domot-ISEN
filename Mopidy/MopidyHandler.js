const { spawn } = require('child_process');
const EventEmitter = require("events");
const fs = require("fs");
const fsPromises = fs.promises;

/**
 * @class Handler of Mopidy instance and playlists manager
 */
module.exports = class MopidyHandler{

    /**
     * @description create a thread and run a mopidy instance 
     */
    constructor(){
        this.mopidyProcess = spawn("mopidy", ["--conf", '../Mopidy/mopidy.conf']);
        this.eventEmitter = new EventEmitter();

        this.stderr = "";

        this.mopidy_ready = false;
        this.spotify_connected = false;

        this.mopidyProcess.stderr.on('data', data => {
            this.stderr += String(data);

            if(this.stderr.includes("HTTP server running at [::ffff:127.0.0.1]:6680") && !this.mopidy_ready){
                this.eventEmitter.emit("mopidy-ready");
                console.log("Mopidy is ready");
                this.mopidy_ready = true;
            }
            if(this.stderr.includes("Logged in to Spotify in online mode") && !this.spotify_connected){
                this.eventEmitter.emit("mopidy-spotify-connected");
                console.log("Mopidy is connected to spotify");
                this.spotify_connected = true;
            }
        });

        this.mopidyProcess.on("close", (code, signal) => {
            this.eventEmitter.emit("mopidy-close", code, signal);
        })

    }

    /**
     * @description return a Event Object with events : "mopidy-ready", "mopidy-spotify-connected", "mopidy-close"
     */
    getEventEmitter(){
        return this.eventEmitter;
    }

    /**
     * @description return true if the event "mopidy-ready" have allready been emit
     */
    isReady(){
        return this.mopidy_ready;
    }

    /**
     * @description return true if the event "mopidy-spotify-connected" have allready been emit
     */
    isSpotifyConnected(){
        return this.spotify_connected;
    }

    /**
     * @description launch SIGKILL signal to mopidy thread
     */
    close(){
        this.mopidyProcess.kill('SIGKILL');
    }

    /**
     * @description generate m3u files from playlists folder in my_playlist folder
     */
    generatePlaylists(){
        const music_folder_path = "../Mopidy/my_playlists/";
        const m3u_folder_path = "../Mopidy/m3u_files/"
        fs.readdirSync(music_folder_path).forEach(folder => {
            var m3u_content = "";
            fs.readdirSync(music_folder_path + folder + "/").forEach(file => {
                fs.renameSync(music_folder_path + folder + "/" + file, music_folder_path + folder + "/" + file.replace(" ", "_"));
                m3u_content += "../my_playlists/" + folder + "/" + file.replace(" ", "-") + "\n"; 
            });
            fs.writeFile(m3u_folder_path + folder + ".m3u", m3u_content, err => {
                if(err) throw err;
                console.log("playlist " + folder + " created");
            });
        });
    }
}