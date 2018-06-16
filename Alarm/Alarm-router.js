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
 * 
 * 
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
				return;
			}
		}
		res.status(404).send(String(`alarm with name ${req.body.request.alarm_name} dosen\'t exist`));
	} else {
		res.send(Alarm.getAlarms());
	}
});


auth_router.delete('/', (req, res) => {
	const request = req.body.request;

	try{
		const alarmJSON = Alarm.removeAlarm(request.alarm_name);
		res.send(alarmJSON);
	}catch(error){
		res.status(400).send(String(error));
	}
});

/**
 * -- get playlists --
 * @api {get} /alarms/playlists GetPlaylists
 * @apiName GetPlaylists
 * @apiGroup Alarm
 * @apiVersion  0.0.2
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

module.exports = {
	auth_router,
	router
}