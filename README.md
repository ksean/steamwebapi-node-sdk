Steam Web API Node SDK
=========

SDK for interfacing with Steam's Web API using Node

## Installation

+ Run the following command:  
```javascript
npm install steamwebapi
```

+ Include the SDK in your module by adding the require code  
```javascript
var SteamWebAPI = require('steamwebapi').SteamWebAPI;
```

+ Set your API Key (Optional, but required for specific API requests)
```javascript
SteamWebAPI.setAPIKey('***My Steam API Key***');
```

## Example

Example for retrieving a list of the 5 most recently played games for a given Steam 64 bit ID, and logging the response in console
```javascript
SteamWebAPI.getRecentlyPlayedGames('*** 64 Bit Steam ID ***', 5, function(response) {
    console.log(response);
});
```

## Tests

* Added Travis compatibility
* Manually run tests using npm test

## Documentation

The official Steam documentation is found at: [https://developer.valvesoftware.com/wiki/Steam_Web_API](https://developer.valvesoftware.com/wiki/Steam_Web_API)

## Release History

* 0.0.1 Initial release
