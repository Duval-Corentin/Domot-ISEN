define({ "api": [
  {
    "type": "post",
    "url": "/alarms",
    "title": "AddAlarm",
    "name": "AddAlarm",
    "group": "Alarm",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.name",
            "description": "<p>name of the new alarm</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.playlist_name",
            "description": "<p>name of the playlist to play on trigger</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.volume",
            "description": "<p>volume of the trigger music</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.play_time",
            "description": "<p>time to play the playlist at maximum (in seconds)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.snooze_time",
            "description": "<p>time to wait between 2 play after a snooze event (in seconds)</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.active",
            "description": "<p>if the alarm is active</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.unique",
            "description": "<p>if true the alarm will play 1 and be forget by the Module</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request.trigger",
            "description": "<p>trigger Object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request.trigger.days",
            "description": "<p>on wich day the alarm must be triggered</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.monday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.tuesday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.wednesday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.thursday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.friday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.saturday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.sunday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.trigger.hour",
            "description": "<p>on wich hour the alarm must be triggered</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.trigger.minute",
            "description": "<p>on wich minute the alarm must be triggered</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "auth",
            "description": "<p>Auth object of the user who make the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.username",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.password",
            "description": "<p>password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\t\"auth\" : {\n\t\t\"username\" : \"admin\",\n\t\t\"password\" : \"Admin123456\"\n\t},\n\t\"request\" : {\n\t\t\"name\": \"alarm_test 2\",\n\t\t\"playlist_name\": \"playlist_1\",\n\t\t\"volume\": 100,\n\t\t\"play_time\": 100,\n\t\t\"snooze_time\": 200,\n\t\t\"unique\": true,\n\t\t\"active\": true,\n\t\t\"trigger\": {\n\t\t\t\"days\": {\n\t\t\t\t\"monday\": true,\n\t\t\t\t\"tuesday\": true,\n\t\t\t\t\"wednesday\": true,\n\t\t\t\t\"thursday\": false,\n\t\t\t\t\"friday\": false,\n\t\t\t\t\"saturday\": false,\n\t\t\t\t\"sunday\": false\n\t\t\t},\n\t\t\t\"hour\": 12,\n\t\t\t\"minute\": 15\n\t\t}\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "AlarmObject",
            "description": "<p>stored object of the alarm</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n\t\"name\": \"alarm_test 2\",\n\t\"playlist_name\": \"playlist_1\",\n\t\"volume\": 100,\n\t\"play_time\": 100,\n\t\"snooze_time\": 200,\n\t\"unique\": true,\n\t\"active\": true,\n\t\"trigger\": {\n\t\t\"days\": {\n\t\t\t\"monday\": true,\n\t\t\t\"tuesday\": true,\n\t\t\t\"wednesday\": true,\n\t\t\t\"thursday\": false,\n\t\t\t\"friday\": false,\n\t\t\t\"saturday\": false,\n\t\t\t\"sunday\": false\n\t\t},\n\t\t\"hour\": 12,\n\t\t\"minute\": 15\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "string",
            "optional": false,
            "field": "AlarmError",
            "description": "<p>errors from the Alarm module</p>"
          }
        ]
      }
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm"
  },
  {
    "type": "delete",
    "url": "/alarms",
    "title": "DeleteAlarm",
    "name": "DeleteAlarm",
    "group": "Alarm",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.alarm_name",
            "description": "<p>name of the alarm to remove</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "auth",
            "description": "<p>Auth object of the user who make the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.username",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.password",
            "description": "<p>password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"auth\" : {\n\t\t\t\"username\" : \"Alice\",\n\t\t\t\"password\" : \"Bob123456\"\t\n\t\t},\n\t\t\"request\" : {\n\t\t\t\"alarm_name\" : \"my_alarm_01\"\n\t\t}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "AlarmJSON",
            "description": "<p>object of the removed alarm</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n\t\"name\": \"alarm_test 2\",\n\t\"playlist_name\": \"playlist_1\",\n\t\"volume\": 10,\n\t\"play_time\": 10,\n\t\"snooze_time\": 205555555,\n\t\"unique\": true,\n\t\"active\": true,\n\t\"trigger\": {\n\t\t\"days\": {\n\t\t\t\"monday\": true,\n\t\t\t\"tuesday\": true,\n\t\t\t\"wednesday\": true,\n\t\t\t\"thursday\": false,\n\t\t\t\"friday\": false,\n\t\t\t\"saturday\": false,\n\t\t\t\"sunday\": false\n\t\t},\n\t\t\"hour\": 12,\n\t\t\"minute\": 15\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm"
  },
  {
    "type": "get",
    "url": "/alarms",
    "title": "GetAlarm(S)",
    "name": "GetAlarm_S_",
    "group": "Alarm",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "request.alarm_name",
            "description": "<p>name of the alarm to remove</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "auth",
            "description": "<p>Auth object of the user who make the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.username",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.password",
            "description": "<p>password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"auth\" : {\n     \"username\" : \"alice\",\n     \"password\" : \"Bob123456\"\n     },\n     \"request\" : {\n         \"alarm_name\" : \"My_Alarm_01\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "AlarmArray",
            "description": "<p>Array with all selectionned Alarms</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "[\n\t{\n\t\t\"name\": \"alarm_test 2\",\n\t\t\"playlist_name\": \"playlist_2\",\n\t\t\"volume\": 10,\n\t\t\"play_time\": 10,\n\t\t\"snooze_time\": 20,\n\t\t\"unique\": true,\n\t\t\"active\": true,\n\t\t\"trigger\": {\n\t\t\t\"days\": {\n\t\t\t\t\"monday\": true,\n\t\t\t\t\"tuesday\": true,\n\t\t\t\t\"wednesday\": true,\n\t\t\t\t\"thursday\": false,\n\t\t\t\t\"friday\": false,\n\t\t\t\t\"saturday\": false,\n\t\t\t\t\"sunday\": false\n\t\t\t},\n\t\t\t\"hour\": 12,\n\t\t\t\"minute\": 15\n\t\t}\n\t},\n\t{\n\t\t\"name\": \"my_alarm_01\",\n\t\t\"playlist_name\": \"playlist_1\",\n\t\t\"volume\": 70,\n\t\t\"play_time\": 60,\n\t\t\"snooze_time\": 5,\n\t\t\"unique\": false,\n\t\t\"active\": true,\n\t\t\"trigger\": {\n\t\t\t\"days\": {\n\t\t\t\t\"monday\": true,\n\t\t\t\t\"tuesday\": true,\n\t\t\t\t\"wednesday\": true,\n\t\t\t\t\"thursday\": false,\n\t\t\t\t\"friday\": true,\n\t\t\t\t\"saturday\": true,\n\t\t\t\t\"sunday\": true\n\t\t\t},\n\t\t\t\"hour\": 10,\n\t\t\t\"minute\": 51\n\t\t}\n\t}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "CannotFindAlarm",
            "description": "<p>Cannot find any alarm with this alarm_name</p>"
          }
        ]
      }
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm"
  },
  {
    "type": "get",
    "url": "/alarms/playlists",
    "title": "GetPlaylists",
    "name": "GetPlaylists",
    "group": "Alarm",
    "version": "0.0.2",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "playlistsArray",
            "description": "<p>Array with all playlists objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "[\n\t{\n\t\t\"name\": \"playlist_1\",\n\t\t\"tracks\": [\n\t\t\t\"Marvin_Gaye-Lets_get_it_on\",\n\t\t\t\"Marvin_Gaye_-_Sexual_Healing\",\n\t\t\t\"Serge_Gainsbourg_-_La_Javanaise_(1968)\",\n\t\t\t\"Stacey_Kent_-_Ces_petits_riens\",\n\t\t\t\"Stacey_Kent_-_Jardin_dHiver\",\n\t\t\t\"Stacey_Kent_-_Que_reste-t-il_de_nos_amours\"\n\t\t]\n\t},\n\t{\n\t\t\"name\": \"playlist_2\",\n\t\t\"tracks\": [\n\t\t\t\"Marvin_Gaye-Lets_get_it_on\",\n\t\t\t\"Marvin_Gaye_-_Sexual_Healing\",\n\t\t\t\"Stacey_Kent_-_Jardin_dHiver\",\n\t\t\t\"Stacey_Kent_-_Que_reste-t-il_de_nos_amours\"\n\t\t]\n\t}\n]",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"request\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      }
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm"
  },
  {
    "type": "put",
    "url": "/alarms",
    "title": "UpdateAlarm",
    "name": "UpdateAlarm",
    "group": "Alarm",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.name",
            "description": "<p>name of the new alarm</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.playlist_name",
            "description": "<p>name of the playlist to play on trigger</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.volume",
            "description": "<p>volume of the trigger music</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.play_time",
            "description": "<p>time to play the playlist at maximum (in seconds)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.snooze_time",
            "description": "<p>time to wait between 2 play after a snooze event (in seconds)</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.active",
            "description": "<p>if the alarm is active</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.unique",
            "description": "<p>if true the alarm will play 1 and be forget by the Module</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request.trigger",
            "description": "<p>trigger Object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request.trigger.days",
            "description": "<p>on wich day the alarm must be triggered</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.monday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.tuesday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.wednesday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.thursday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.friday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.saturday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.trigger.days.sunday",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.trigger.hour",
            "description": "<p>on wich hour the alarm must be triggered</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.trigger.minute",
            "description": "<p>on wich minute the alarm must be triggered</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "auth",
            "description": "<p>Auth object of the user who make the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.username",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.password",
            "description": "<p>password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\t\"auth\" : {\n\t\t\"username\" : \"admin\",\n\t\t\"password\" : \"Admin123456\"\n\t},\n\t\"request\" : {\n\t\t\"name\": \"alarm_test 2\",\n\t\t\"playlist_name\": \"playlist_1\",\n\t\t\"volume\": 100,\n\t\t\"play_time\": 100,\n\t\t\"snooze_time\": 200,\n\t\t\"unique\": true,\n\t\t\"active\": true,\n\t\t\"trigger\": {\n\t\t\t\"days\": {\n\t\t\t\t\"monday\": true,\n\t\t\t\t\"tuesday\": true,\n\t\t\t\t\"wednesday\": true,\n\t\t\t\t\"thursday\": false,\n\t\t\t\t\"friday\": false,\n\t\t\t\t\"saturday\": false,\n\t\t\t\t\"sunday\": false\n\t\t\t},\n\t\t\t\"hour\": 12,\n\t\t\t\"minute\": 15\n\t\t}\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "AlarmObject",
            "description": "<p>new stored object of the alarm</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n\t\"name\": \"alarm_test 2\",\n\t\"playlist_name\": \"playlist_1\",\n\t\"volume\": 100,\n\t\"play_time\": 100,\n\t\"snooze_time\": 200,\n\t\"unique\": true,\n\t\"active\": true,\n\t\"trigger\": {\n\t\t\"days\": {\n\t\t\t\"monday\": true,\n\t\t\t\"tuesday\": true,\n\t\t\t\"wednesday\": true,\n\t\t\t\"thursday\": false,\n\t\t\t\"friday\": false,\n\t\t\t\"saturday\": false,\n\t\t\t\"sunday\": false\n\t\t},\n\t\t\"hour\": 12,\n\t\t\"minute\": 15\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "string",
            "optional": false,
            "field": "AlarmError",
            "description": "<p>errors from the Alarm module</p>"
          }
        ]
      }
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm"
  },
  {
    "type": "get",
    "url": "/alarms/playback/current_track",
    "title": "GetPlayingTrack",
    "name": "GetPlayingTrack",
    "group": "Alarm_Playback",
    "version": "0.0.2",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "TrackName",
            "description": "<p>name of the playing song or false if no songs is playing</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "Stacey_Kent_-_Que_reste-t-il_de_nos_amours",
          "type": "String"
        }
      ]
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm_Playback"
  },
  {
    "type": "get",
    "url": "/alarms/playback/volume",
    "title": "GetVolume",
    "name": "GetVolume",
    "group": "Alarm_Playback",
    "version": "0.0.2",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "Volume",
            "description": "<p>volume of the audio server in percentage</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "85",
          "type": "Number"
        }
      ]
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm_Playback"
  },
  {
    "type": "patch",
    "url": "/alarms/playback",
    "title": "Play",
    "name": "PlayPlayback",
    "group": "Alarm_Playback",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request.alarm",
            "description": "<p>Alarm Object to play, not all field are mandatory</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.state",
            "description": "<p>Must be at &quot;play&quot; value to play the alarm</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.alarm.playlist_name",
            "description": "<p>name of the playlist to play</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.alarm.play_time",
            "description": "<p>time to play the playlist</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.alarm.snooze_time",
            "description": "<p>time to snooze the alarm</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "request.alarm.volume",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "auth",
            "description": "<p>Auth object of the user who make the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.username",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.password",
            "description": "<p>password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"auth\" : {\n\t\t\t\"username\" : \"Alice08\",\n\t\t\t\"password\" : \"Bob123456\"\n\t\t},\n\t\t\"request\" : {\n\t\t\t\"state\" : \"play\",\n\t\t\t\"alarm\" : {\n\t\t\t\t\"playlist_name\" : \"my_playlist_01\",\n\t\t\t\t\"play_time\" : 300,\n\t\t\t\t\"snooze_time\" : 100,\n\t\t\t\t\"volume\" : 80\n\t\t\t}\n\t\t}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "AlarmJSON",
            "description": "<p>Object of the played alarm as it was send</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n\t\t\t\t\"playlist_name\" : \"my_playlist_01\",\n\t\t\t\t\"play_time\" : 300,\n\t\t\t\t\"snooze_time\" : 100,\n\t\t\t\t\"volume\" : 80\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm_Playback"
  },
  {
    "type": "patch",
    "url": "/alarms/playback",
    "title": "Snooze",
    "name": "Snooze",
    "group": "Alarm_Playback",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.state",
            "description": "<p>must be at &quot;snooze&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"request\" : {\n\t\t\"state\" : \"snooze\"\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "SnoozedAlarm",
            "description": "<p>Alarm Object of the previously playing alarm or false if not alarm was playing</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n\t\t\t\t\"playlist_name\" : \"my_playlist_01\",\n\t\t\t\t\"play_time\" : 300,\n\t\t\t\t\"snooze_time\" : 100,\n\t\t\t\t\"volume\" : 80\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm_Playback"
  },
  {
    "type": "patch",
    "url": "/alarms/playback",
    "title": "Stop",
    "name": "Stop",
    "group": "Alarm_Playback",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.state",
            "description": "<p>must be at &quot;stop&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"request\" : {\n\t\t\"state\" : \"stop\"\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "StopedAlarm",
            "description": "<p>Alarm Object of the previously playing alarm or false if not alarm was playing</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n\t\t\t\t\"playlist_name\" : \"my_playlist_01\",\n\t\t\t\t\"play_time\" : 300,\n\t\t\t\t\"snooze_time\" : 100,\n\t\t\t\t\"volume\" : 80\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./Alarm/Alarm-router.js",
    "groupTitle": "Alarm_Playback"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Root",
    "name": "GetRoot",
    "group": "Root",
    "version": "0.0.2",
    "filename": "./Core/Core.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "AddUser",
    "name": "AddUser",
    "group": "User",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.username",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.recover_email",
            "description": "<p>email used for recover the password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.first_name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.last_name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.password",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "request.is_admin",
            "description": "<p>if the user have admin permmitions or not</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "auth",
            "description": "<p>Auth object of the user who make the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.username",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.password",
            "description": "<p>password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"auth\" : {\n        \"username\" : \"Alice01\",\n        \"password\" : \"Bob123456\"\n    },\n    \"request\" : {\n         \"username\" : \"Joe03\",\n         \"password\" : \"Bob12345\",\n         \"recover_email\" : \"Joe@gmail.com\",\n         \"first_name\" : \"Bob\",\n         \"last_name\" : \"Doe\",\n         \"is_admin\" : false\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "UserObject",
            "description": "<p>JSON Object of the new created user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n     \"username\" : \"Bob123456\",\n     \"recover_email\" : \"bob@gmail.com\",\n     \"first_name\" : \"Bob\",\n     \"last_name\" : \"Doe\",\n     \"salt\" : \"vdsvdqvdqvfdsvfds\",\n     \"hashed_password\" : \"cdsqcdqscdsqcdqsvdsq\",\n     \"is_admin\" : false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "AuthError",
            "description": "<p>Error From the Auth Module</p>"
          }
        ]
      }
    },
    "filename": "./Core/Core.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/users/change_password",
    "title": "ChangePassword",
    "name": "ChangePassword",
    "group": "User",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username of the account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "recover_code",
            "description": "<p>recover code find in the email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "new_password",
            "description": "<p>new password with at least 1 digit, 1 upper and 1 lower case letter</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"request\" : {\n         \"username\" : \"Alice02\",\n         \"recover_code\" : \"CECE45FECE\",\n         \"password\" : \"New_passw0rd\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "NewHashedPassword",
            "description": "<p>Salted hash of the new password</p>"
          }
        ]
      }
    },
    "filename": "./Core/Core.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/users",
    "title": "DeleteUser",
    "name": "DeleteUser",
    "group": "User",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.username",
            "description": "<p>username of the user to remove</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.password",
            "description": "<p>password of the user to remove</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "auth",
            "description": "<p>Auth object of the user who make the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.username",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.password",
            "description": "<p>password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "removed",
            "description": "<p>user JSON object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "{\n     \"username\" : \"Bob123456\",\n     \"recover_email\" : \"bob@gmail.com\",\n     \"first_name\" : \"Bob\",\n     \"last_name\" : \"Doe\",\n     \"salt\" : \"vdsvdqvdqvfdsvfds\",\n     \"hashed_password\" : \"cdsqcdqscdsqcdqsvdsq\",\n     \"is_admin\" : false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "Auth",
            "description": "<p>Module Error</p>"
          }
        ]
      }
    },
    "filename": "./Core/Core.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "GetUser(S)",
    "name": "GetUser_S_",
    "group": "User",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "request.username",
            "description": "<p>username of the searched user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "auth",
            "description": "<p>Auth object of the user who make the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.username",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "auth.password",
            "description": "<p>password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"auth\" : {\n        \"username\" : \"Alice01\",\n        \"password\" : \"Bob123456\"\n    },\n    \"request\" : {\n        \"username\" : \"Joe03\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "Users",
            "description": "<p>Array of Users depending of the Querry</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "[ {\n     \"username\" : \"Bob123456\",\n     \"recover_email\" : \"bob@gmail.com\",\n     \"first_name\" : \"Bob\",\n     \"last_name\" : \"Doe\",\n     \"salt\" : \"vdsvdqvdqvfdsvfds\",\n     \"hashed_password\" : \"cdsqcdqscdsqcdqsvdsq\",\n     \"is_admin\" : false\n  }]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "NotFindError",
            "description": "<p>Cannot Find (The) User(s)</p>"
          }
        ]
      }
    },
    "filename": "./Core/Core.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/recover_email",
    "title": "SendRecoverEmail",
    "name": "SendRecoverEmail",
    "group": "User",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "request.username",
            "description": "<p>username of the lost account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "request.recover_email",
            "description": "<p>email of the lost account</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"request\" : {\n        \"username\" : \"Bob34\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "Email",
            "description": "<p>email where the recovery code has been send</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Example:",
          "content": "\"Bob34@gmail.com\"",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "MissingArgument",
            "description": "<p>missing 1 argument (need a username or a email address)</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "EmailError",
            "description": "<p>error from the Google's Gmail Module</p>"
          }
        ]
      }
    },
    "filename": "./Core/Core.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/users",
    "title": "TestUser",
    "name": "TestUser",
    "group": "User",
    "version": "0.0.2",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.username",
            "description": "<p>username of the user to test</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request.password",
            "description": "<p>password of the user to test</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>object with parameters of the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example ",
          "content": "{\n    \"request\" : {\n        \"username\" : \"Alice01\",\n        \"password\" : \"Bob123456\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Username",
            "description": "<p>username of the authentified user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "BadUsername/Password",
            "description": "<p>Bad username and/or password</p>"
          }
        ]
      }
    },
    "filename": "./Core/Core.js",
    "groupTitle": "User"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./Docs/apidoc/main.js",
    "group": "_home_corentin_MEGA_Projet_domotique_Docs_apidoc_main_js",
    "groupTitle": "_home_corentin_MEGA_Projet_domotique_Docs_apidoc_main_js",
    "name": ""
  }
] });
