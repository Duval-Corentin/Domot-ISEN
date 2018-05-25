const Mopidy = require("../Mopidy/MopidyHandler");


const mopidy = new Mopidy();
const mopidy_event = mopidy.getEventEmitter();

mopidy_event.on("mopidy-ready", () => {
    console.log("mopidy connected");
});

mopidy_event.on("mopidy-spotify-connected", () => {
    console.log("spotify connected");
});

mopidy_event.on("mopidy-close", (code, signal) => {
    console.log(`mopidy close with code ${code} and signal ${signal}`);
});

setTimeout( () => {
    mopidy.close();
}, 10000); 