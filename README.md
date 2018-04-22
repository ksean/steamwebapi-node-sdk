Steam Web API Node.js SDK
=========

![Travis CI](https://travis-ci.org/ksean/steamwebapi-node-sdk.svg?branch=master)

Node.js SDK for interfacing with Steam's Web API.

## Requirements

Node.js >= 6.0

## Installation

Run the following command:  
```javascript
npm install steamwebapi
```

## Usage

Require the SDK in your module by adding the following code  
```javascript
var SteamWebAPI = require('steamwebapi');
```

Set your API Key _(Optional, but required for most API requests)_
```javascript
SteamWebAPI.setAPIKey('***My Steam API Key***');
```

Set your response format (Default `json`)
```javascript
SteamWebAPI.setFormat('xml');
```

## Example

Example for retrieving a list of the 5 most recently played games for a given Steam 64 bit ID, and logging the response in console:
```javascript
SteamWebAPI.getRecentlyPlayedGames('76561198020275445', 5, function(response) {
    console.log(response);
});
```

Handling any errors in your request:
```javascript
SteamWebAPI.getRecentlyPlayedGames('76561198020275445', 5, function(response) {
    if (typeof response.error !== 'undefined') {
        console.log(response.error)
    }
    ...
});
```


## Testing

`npm test`

## Documentation

The official Steam documentation is found at: [https://developer.valvesoftware.com/wiki/Steam_Web_API](https://developer.valvesoftware.com/wiki/Steam_Web_API)

SDK Documentation:

`out/module-SteamWebAPI.html`

### Supported Enpoints:

+ `getFriendList`
+ `getGlobalAchievementPercentagesForApp`
+ `getGlobalStatsForGame`
+ `getNewsForApp`
+ `getOwnedGames`
+ `getPlayerAchievements`
+ `getPlayerSummaries`
+ `getRecentlyPlayedGames`
+ `getUserStatsForGame`
+ `isPlayingSharedGame`


## License
[The Unlicense](http://unlicense.org/)

## Latest version

`0.0.4`