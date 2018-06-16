const JSONValidator = require('jsonschema').Validator;


module.exports = class InputAPI{
    constructor(){

    }

    addInputDevice(input_device_JSON){

    }

    
    removeInputDevice(input_device_JSON){
        
    }
    
    testInputDeviceJSON(input_device_JSON){
        var validator = new JSONValidator();

        const base_schema = {
            "type": "object",
            "required": ["device_name", "device_password", "transmition_type", "device_type"],
            "propreties": {
                "device_name": {
                    "type": "string"
                },
                "device_password": {
                    "type": "string"
                },
                "transmition_type": {
                    "type": "string"
                },
                "device_type": {
                    "type": "string"
                }
            }
        };
        if(!validator.validate(input_device_JSON, base_schema)) throw "Bad JSON format";

        switch(input_device_JSON.transmition_type){
            case 'HTTPS':
                break;
            
            case 'nrf24l01':
                break;

            case '433Mhz':
                break;
            
            default: 
                throw `${input_device_JSON.transmition_type} is not a correct transmition type (HTTPS, nrf24l01, 433Mhz)`;
        }

        switch(input_device_JSON.device_type){
            case 'sensor':

                break;

            case 'user_interface':
                
                break;

            default: 
                throw `${input_device_JSON.device_type} is not a correct device type (sensor, user_interface)`;
        }
    }

    getDevices(){

    }

    storeValue(sensor, value){

    }

    on(event, callback_function){

    }
}