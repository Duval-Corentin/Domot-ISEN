const { spawn } = require('child_process');
const EventEmitter = require("events");
const Mqtt = require("mqtt");

/**
 * @class MosquittoServer run a mosquitto Broker on a thread 
 */
module.exports = class MosquittoServer{

    constructor(verbose){
        this.mosquitto_instance = spawn("mosquitto", ["-c", "../MQTT/mosquitto.conf"]);
        this.eventEmitter = new EventEmitter();

        this.verbose = verbose;

        this.mosquitto_ready = false;
        this.stderr = "";
        this.mosquitto_instance.stderr.on("data", chunk => {
            this.stderr += String(chunk);
            
            if(!this.mosquitto_ready && this.stderr.includes("Opening ipv4 listen socket on port")){
                if(this.verbose) console.log("MQTT Server Listening on port 3501");
                this.mosquitto_ready = true;
                this.eventEmitter.emit("mosquitto-ready");

                this.mqtt_client = Mqtt.connect({hostname : "127.0.0.1", port : 3501, username : "intern", password : "Intern01"});
                if(this.verbose){
                    this.mqtt_client.on("connect", () => {
                        console.log("connected");
                        this.mqtt_client.subscribe("#");
                        this.mqtt_client.on("message", (topic, message) => {
                            console.log("MQTT Server : New message on topic " + topic + " : " + message);
                        });
                    });
                }
            }
        });

        this.mosquitto_instance.on("close", (code, signal) => {
            this.eventEmitter.emit("mosquitto-close");
        });

    }

    /**
     * @description return a Event Object with events : "mosquitto-ready", "mopidy-spotify-connected", "mosquitto-close"
     */
    getEventEmitter(){
        return this.eventEmitter;
    }

    /**
     * @description return true if the event "mosquitto-ready" have allready been emit
     */
    isReady(){
        return this.mosquitto_ready;
    }

    /**
     * @description launch SIGKILL signal to mosquitto thread
     */
    close(){
        this.mopidyProcess.kill('SIGKILL');
    }
}