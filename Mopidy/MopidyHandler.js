const { spawn } = require('child_process');
const EventEmitter = require("events");
const fs = require("fs");
const fsPromises = fs.promises;


module.exports = class MopidyHandler{

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