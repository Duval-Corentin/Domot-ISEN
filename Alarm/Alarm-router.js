const Alarm_class = require('./Alarm');
const Mopidy_class = require('../Mopidy/MopidyHandler');
const auth_router = require('express').Router();
const router = require('express').Router();

var Mopidy = new Mopidy_class();
var Alarm = new Alarm_class(Mopidy, false);

/**
 * 
 * @api {post} /alarms AddAlarm
 * @apiName AddAlarm
 * @apiGroup Alarm
 * @apiVersion  0.0.2
 * 
 * @apiDescription Add a new alarm
 * 
 * @apiUse Auth
 * @apiUse Request 
 * @apiParam {String} request.name name of the new alarm
 * @apiParam {String} request.playlist_name name of the playlist to play on trigger
 * @apiParam {Number} request.volume volume of the trigger music
 * @apiParam {Number} request.play_time time to play the playlist at maximum (in seconds)
 * @apiParam {Number} request.snooze_time time to wait between 2 play after a snooze event (in seconds)
 * @apiParam {Boolean} request.active if the alarm is active
 * @apiParam {Boolean} request.unique if true the alarm will play 1 and be forget by the Module
 * @apiParam {Object} request.trigger trigger Object
 * @apiParam {Object} request.trigger.days on wich day the alarm must be triggered 
 * @apiParam {Boolean} request.trigger.days.monday
 * @apiParam {Boolean} request.trigger.days.tuesday
 * @apiParam {Boolean} request.trigger.days.wednesday
 * @apiParam {Boolean} request.trigger.days.thursday
 * @apiParam {Boolean} request.trigger.days.friday
 * @apiParam {Boolean} request.trigger.days.saturday
 * @apiParam {Boolean} request.trigger.days.sunday
 * @apiParam {Number} request.trigger.hour on wich hour the alarm must be triggered
 * @apiParam {Number} request.trigger.minute  on wich minute the alarm must be triggered
 * 
 * @apiSuccess (200) {Object} AlarmObject stored object of the alarm
 * 
 * @apiError (400) {string} AlarmError errors from the Alarm module 
 * 
 * @apiParamExample  {json} Request-Example:
{
	"auth" : {
		"username" : "admin",
		"password" : "Admin123456"
	},
	"request" : {
		"name": "alarm_test 2",
		"playlist_name": "playlist_1",
		"volume": 100,
		"play_time": 100,
		"snooze_time": 200,
		"unique": true,
		"active": true,
		"trigger": {
			"days": {
				"monday": true,
				"tuesday": true,
				"wednesday": true,
				"thursday": false,
				"friday": false,
				"saturday": false,
				"sunday": false
			},
			"hour": 12,
			"minute": 15
		}
	}
}
 * 
 * 
 * @apiSuccessExample {json} Success-Example:
{
	"name": "alarm_test 2",
	"playlist_name": "playlist_1",
	"volume": 100,
	"play_time": 100,
	"snooze_time": 200,
	"unique": true,
	"active": true,
	"trigger": {
		"days": {
			"monday": true,
			"tuesday": true,
			"wednesday": true,
			"thursday": false,
			"friday": false,
			"saturday": false,
			"sunday": false
		},
		"hour": 12,
		"minute": 15
	}
}
 */
auth_router.post('/', (req, res) => {
	const request = req.body.request;
	try {
		Alarm.addAlarm(request).then(new_alarm => {
			res.send(new_alarm);
		});
	} catch (error) {
		res.status(400).send(String(error));
	}
});

/**
 * -- get Alarm(S) -- 
 * @api {get} /alarms GetAlarm(S)
 * @apiName GetAlarm(S)
 * @apiGroup Alarm
 * @apiVersion  0.0.2
 * 
 * @apiDescription get all alarm's Objects if "alarm_name" parameter is missing or just the alarm with the requested name  
 * 
 * @apiUse Auth
 * @apiUse Request
 * @apiParam {String} [request.alarm_name] name of the alarm to remove
 * 
 * @apiSuccess (200) {Object[]} AlarmArray Array with all selectionned Alarms 
 * 
 * @apiError (404) {String} CannotFindAlarm Cannot find any alarm with this alarm_name
 *  
 * @apiParamExample  {json} Request-Example:
 * {
 *     "auth" : {
 *      "username" : "alice",
 *      "password" : "Bob123456"
 *      },
 *      "request" : {
 *          "alarm_name" : "My_Alarm_01"
 *      }
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Example:
[
	{
		"name": "alarm_test 2",
		"playlist_name": "playlist_2",
		"volume": 10,
		"play_time": 10,
		"snooze_time": 20,
		"unique": true,
		"active": true,
		"trigger": {
			"days": {
				"monday": true,
				"tuesday": true,
				"wednesday": true,
				"thursday": false,
				"friday": false,
				"saturday": false,
				"sunday": false
			},
			"hour": 12,
			"minute": 15
		}
	},
	{
		"name": "my_alarm_01",
		"playlist_name": "playlist_1",
		"volume": 70,
		"play_time": 60,
		"snooze_time": 5,
		"unique": false,
		"active": true,
		"trigger": {
			"days": {
				"monday": true,
				"tuesday": true,
				"wednesday": true,
				"thursday": false,
				"friday": true,
				"saturday": true,
				"sunday": true
			},
			"hour": 10,
			"minute": 51
		}
	}]
 */
auth_router.get('/', (req, res) => {
	if (req.body.request.alarm_name) {
		for (let alarm of Alarm.getAlarms()) {
			if (req.body.request.alarm_name == alarm.name) {
				res.send(alarm);
			}
		}
		res.status(404).send(String(`alarm with name ${req.body.request.alarm_name} dosen\'t exist`));
	} else {
		res.send(Alarm.getAlarms());
	}
});

/**
 * 
 * @api {delete} /alarms DeleteAlarm
 * @apiName DeleteAlarm
 * @apiGroup Alarm
 * @apiVersion  0.0.2
 * 
 * @apiDescription Remove the alarm with the name "alarm_name" from the program  
 * 
 * @apiUse Auth
 * @apiUse Request
 * @apiParam {String} request.alarm_name name of the alarm to remove
 * 
 * @apiSuccess (200) {Object} AlarmJSON object of the removed alarm 
 * 
 * @apiError (400) {string} AlarmError error from the Alarm module
 * @apiParamExample  {json} Request-Example:
 * {
 *     "auth" : {
 * 			"username" : "Alice",
 * 			"password" : "Bob123456"	
 * 		},
 * 		"request" : {
 * 			"alarm_name" : "my_alarm_01"
 * 		}
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Example:
{
	"name": "alarm_test 2",
	"playlist_name": "playlist_1",
	"volume": 10,
	"play_time": 10,
	"snooze_time": 205555555,
	"unique": true,
	"active": true,
	"trigger": {
		"days": {
			"monday": true,
			"tuesday": true,
			"wednesday": true,
			"thursday": false,
			"friday": false,
			"saturday": false,
			"sunday": false
		},
		"hour": 12,
		"minute": 15
	}
}
 */
auth_router.delete('/', (req, res) => {
	const request = req.body.request;

	try {
		const alarmJSON = Alarm.removeAlarm(request.alarm_name);
		res.send(alarmJSON);
	} catch (error) {
		res.status(400).send(String(error));
	}
});

/**
 * -- Update alarm -- 
 * @api {put} /alarms UpdateAlarm
 * @apiName UpdateAlarm
 * @apiGroup Alarm
 * @apiVersion  0.0.2
 * 
 * @apiDescription Change 1 or multiples parameter of an existing alarm, names must match anyway
 * 
 * @apiUse Auth
 * @apiUse Request 
 * @apiParam {String} request.name name of the new alarm
 * @apiParam {String} request.playlist_name name of the playlist to play on trigger
 * @apiParam {Number} request.volume volume of the trigger music
 * @apiParam {Number} request.play_time time to play the playlist at maximum (in seconds)
 * @apiParam {Number} request.snooze_time time to wait between 2 play after a snooze event (in seconds)
 * @apiParam {Boolean} request.active if the alarm is active
 * @apiParam {Boolean} request.unique if true the alarm will play 1 and be forget by the Module
 * @apiParam {Object} request.trigger trigger Object
 * @apiParam {Object} request.trigger.days on wich day the alarm must be triggered 
 * @apiParam {Boolean} request.trigger.days.monday
 * @apiParam {Boolean} request.trigger.days.tuesday
 * @apiParam {Boolean} request.trigger.days.wednesday
 * @apiParam {Boolean} request.trigger.days.thursday
 * @apiParam {Boolean} request.trigger.days.friday
 * @apiParam {Boolean} request.trigger.days.saturday
 * @apiParam {Boolean} request.trigger.days.sunday
 * @apiParam {Number} request.trigger.hour on wich hour the alarm must be triggered
 * @apiParam {Number} request.trigger.minute  on wich minute the alarm must be triggered
 * 
 * @apiSuccess (200) {Object} AlarmObject new stored object of the alarm
 * 
 * @apiError (400) {string} AlarmError errors from the Alarm module 
 * 
 * @apiParamExample  {json} Request-Example:
{
	"auth" : {
		"username" : "admin",
		"password" : "Admin123456"
	},
	"request" : {
		"name": "alarm_test 2",
		"playlist_name": "playlist_1",
		"volume": 100,
		"play_time": 100,
		"snooze_time": 200,
		"unique": true,
		"active": true,
		"trigger": {
			"days": {
				"monday": true,
				"tuesday": true,
				"wednesday": true,
				"thursday": false,
				"friday": false,
				"saturday": false,
				"sunday": false
			},
			"hour": 12,
			"minute": 15
		}
	}
}
 * 
 * 
 * @apiSuccessExample {json} Success-Example:
{
	"name": "alarm_test 2",
	"playlist_name": "playlist_1",
	"volume": 100,
	"play_time": 100,
	"snooze_time": 200,
	"unique": true,
	"active": true,
	"trigger": {
		"days": {
			"monday": true,
			"tuesday": true,
			"wednesday": true,
			"thursday": false,
			"friday": false,
			"saturday": false,
			"sunday": false
		},
		"hour": 12,
		"minute": 15
	}
}
 */
auth_router.put('/', (req, res) => {
	const request = req.body.request;

	try {
		const alarm = Alarm.editAlarm(request);
		res.send(alarm);
	} catch (error) {
		res.status(400).send(String(error));
	}
})


/**
 * -- get playlists --
 * @api {get} /alarms/playlists GetPlaylists
 * @apiName GetPlaylists
 * @apiGroup Alarm
 * @apiVersion  0.0.2
 * 
 * @apiDescription return an array of all playlist wich can be used for alarms
 * 
 * @apiUse Request
 * 
 * @apiSuccess (200) {json} playlistsArray Array with all playlists objects
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     "request" : {}
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Example:
[
	{
		"name": "playlist_1",
		"tracks": [
			"Marvin_Gaye-Lets_get_it_on",
			"Marvin_Gaye_-_Sexual_Healing",
			"Serge_Gainsbourg_-_La_Javanaise_(1968)",
			"Stacey_Kent_-_Ces_petits_riens",
			"Stacey_Kent_-_Jardin_dHiver",
			"Stacey_Kent_-_Que_reste-t-il_de_nos_amours"
		]
	},
	{
		"name": "playlist_2",
		"tracks": [
			"Marvin_Gaye-Lets_get_it_on",
			"Marvin_Gaye_-_Sexual_Healing",
			"Stacey_Kent_-_Jardin_dHiver",
			"Stacey_Kent_-_Que_reste-t-il_de_nos_amours"
		]
	}
]
 */
router.get("/playlists/", (req, res) => {
	res.type('json');
	Alarm.getAvailablesPlaylists().then(playlists => {
		res.send(playlists);
	})
});

/**
 * @api {patch} /alarms/playback Play
 * @apiName PlayPlayback
 * @apiGroup Alarm.Playback
 * @apiVersion  0.0.2
 * 
 * @apiDescription play a playlist. /!\ Must be used for test/demo purpose only !! /!\  
 * 
 * @apiUse Auth
 * @apiUse Request
 * @apiParam {Object} request.alarm Alarm Object to play, not all field are mandatory
 * @apiParam {String} request.state Must be at "play" value to play the alarm
 * @apiParam {String} request.alarm.playlist_name name of the playlist to play
 * @apiParam {Number} request.alarm.play_time time to play the playlist
 * @apiParam {Number} request.alarm.snooze_time time to snooze the alarm
 * @apiParam {Number} request.alarm.volume 
 * 
 * @apiSuccess (200) {Object} AlarmJSON Object of the played alarm as it was send 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     "auth" : {
 * 			"username" : "Alice08",
 * 			"password" : "Bob123456"
 * 		},
 * 		"request" : {
 * 			"state" : "play",
 * 			"alarm" : {
 * 				"playlist_name" : "my_playlist_01",
 * 				"play_time" : 300,
 * 				"snooze_time" : 100,
 * 				"volume" : 80
 * 			}
 * 		}
 * }
 * @apiSuccessExample {json} Success-Example:
{
 * 				"playlist_name" : "my_playlist_01",
 * 				"play_time" : 300,
 * 				"snooze_time" : 100,
 * 				"volume" : 80
}
 */

/**
  * @api {patch} /alarms/playback Snooze
  * @apiName Snooze
  * @apiGroup Alarm.Playback
  * @apiVersion  0.0.2
  * 
  * @apiDescription snooze the playing alarm 
  * 
  * @apiUse Request
  * @apiParam {String} request.state must be at "snooze"
  * 
  * @apiSuccess (200) {json} SnoozedAlarm Alarm Object of the previously playing alarm or false if not alarm was playing 
  * 
  * @apiParamExample {json} Request-Example:
  * {
  *     "request" : {
  * 		"state" : "snooze"
  * 	}
  * }
  * 
  * @apiSuccessExample {json} Success-Example:
{
 * 				"playlist_name" : "my_playlist_01",
 * 				"play_time" : 300,
 * 				"snooze_time" : 100,
 * 				"volume" : 80
}
*/

/**
  * @api {patch} /alarms/playback Stop
  * @apiName Stop
  * @apiGroup Alarm.Playback
  * @apiVersion  0.0.2
  * 
  * @apiDescription stop the playing alarm 
  * 
  * @apiUse Request
  * @apiParam {String} request.state must be at "stop"
  * 
  * @apiSuccess (200) {json} StopedAlarm Alarm Object of the previously playing alarm or false if not alarm was playing 
  * 
  * @apiParamExample {json} Request-Example:
  * {
  *     "request" : {
  * 		"state" : "stop"
  * 	}
  * }
  * 
  * @apiSuccessExample {json} Success-Example:
{
 * 				"playlist_name" : "my_playlist_01",
 * 				"play_time" : 300,
 * 				"snooze_time" : 100,
 * 				"volume" : 80
}
*/
router.patch('/playback/', (req, res) => {
	const request = req.body.request;

	if (!request || !request.state) {
		res.status(400).send("Missing Argument \"state\"");
	}
	switch (request.state) {
		case "play":
			if (!request.alarm) res.status(400).send("Need \"Alarm\" parameter to play");

			try {
				Alarm.play(request.alarm).then(alarm => {
					res.send(alarm);
				}).catch();
			} catch (error) {
				res.status(400).send(String(error));
			}
			break;

		case "stop":
			try {
				Alarm.stop().then(old_playing => {
					if (!old_playing) res.send("Alarm was not playing");
					res.send(old_playing);
				}).catch();
			} catch (error) {
				res.status(400).send(error);
			}
			break;

		case "snooze":
			try {
				Alarm.snooze().then(old_playing => {
					if (!old_playing) res.send("Alarm was not playing");
					res.send(old_playing);
				}).catch();
			} catch (error) {
				res.status(400).send(error);
			}
			break;

		default:
			res.status(400).send("Bad \"state\" value (accepted values : \'play\', \'pause\', \'snooze\')")
	}
});

/**
 * 
 * @api {get} /alarms/playback/current_track GetPlayingTrack
 * @apiName GetPlayingTrack		
 * @apiGroup Alarm.Playback
 * @apiVersion  0.0.2
 * 
 * @apiDescription return the current playing song 
 * 
 * @apiSuccess (200) {json} TrackName name of the playing song or false if no songs is playing 
 * @apiSuccessExample {String} Success-Response:
 * Stacey_Kent_-_Que_reste-t-il_de_nos_amours 
 */
router.get("/playback/current_track/", (req, res) => {
	Alarm.getCurrentTrack().then(track => {
		res.send(track);
	})
});

/**
 * 
 * @api {get} /alarms/playback/volume GetVolume
 * @apiName GetVolume
 * @apiGroup Alarm.Playback
 * @apiVersion  0.0.2
 * 
 * @apiDescription return the current volume of the audio server 
 * 
 * @apiSuccess (200) {Number} Volume volume of the audio server in percentage
 * 
 * @apiSuccessExample {Number} Success-Response:
 * 85
 */
router.get("/playback/volume/", (req, res) => {
	Alarm.getVolume().then(volume => {
		res.send(volume);
	});
});

module.exports = {
	auth_router,
	router
}