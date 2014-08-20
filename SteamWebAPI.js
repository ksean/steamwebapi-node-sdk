/**
 * Steam Web API Node SDK
 *
 * SDK for interfacing with Steam's Web API using Node
 * Copyright (C) 2014  Sean Kennedy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Sean Kennedy
 * @version 0.0.1
 */


/**********************************************************************************************************************
                                          Includes & variable declaration
 **********************************************************************************************************************/
// Required modules
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Default response formats
const VALID_RESPONSE_FORMATS = ['json', 'xml', 'vdf'];
var responseFormat = 'json';

// Valid user relationships
const VALID_RELATIONSHIPS = ['all', 'friend'];

// API Key
var apiKey;

// Endpoint specification
const STEAM_API_BASE_URL = 'http://api.steampowered.com/';
const STEAM_ENDPOINTS = {
    'GetNewsForApp': {
        'version': 'v0002/',
        'category': 'ISteamNews/',
        'key': false,
        "parameters": {
            'appid': true,
            'count': true,
            'maxLength': true
        }
    },
    'GetGlobalAchievementPercentagesForApp': {
        'version': 'v0002/',
        'category': 'ISteamUserStats/',
        'key': false,
        "parameters": {
            'gameid': true
        }
    },
    'GetGlobalStatsForGame': {
        'version': 'v0001/',
        'category': 'ISteamUserStats/',
        'key': false,
        "parameters": {
            'gameid': true,
            'count': true,
            'name': true
        }
    },
    'GetPlayerSummaries': {
        'version': 'v0002/',
        'category': 'ISteamUser/',
        'key': true,
        "parameters": {
            'steamids': true
        }
    },
    'GetFriendList': {
        'version': 'v0001/',
        'category': 'ISteamUser/',
        'key': true,
        "parameters": {
            'steamid': true,
            'relationship': true
        }
    },
    'GetPlayerAchievements': {
        'version': 'v0001/',
        'category': 'ISteamUserStats/',
        'key': true,
        "parameters": {
            'steamid': true,
            'appid': true
        }
    },
    'GetUserStatsForGame': {
        'version': 'v0002/',
        'category': 'ISteamUserStats/',
        'key': true,
        "parameters": {
            'steamid': true,
            'appid': true
        }
    },
    'GetOwnedGames': {
        'version': 'v0001/',
        'category': 'IPlayerService/',
        'key': true,
        "parameters": {
            'steamid': true,
            'include_appinfo': false,
            'include_played_free_games': false,
            'appids_filter': false
        }
    },
    'GetRecentlyPlayedGames': {
        'version': 'v0001/',
        'category': 'IPlayerService/',
        'key': true,
        "parameters": {
            'steamid': true,
            'count': false
        }
    },
    'IsPlayingSharedGame': {
        'version': 'v0001/',
        'category': 'IPlayerService/',
        'key': true,
        "parameters": {
            'steamid': true,
            'appid_playing': true
        }
    }
};

// Error messages
const API_KEY_NOT_SET = 'API key is not set';
const PARAMETERS_MISSING = 'Missing parameter(s)';
const PARAMETERS_INVALID_VALUE = 'Required parameters are present but invalid';
const PARAMETERS_INVALID_FORMAT = 'Parameters were not provided as an object';
const METHOD_NOT_EXIST = 'That API method does not exist';


/**********************************************************************************************************************
                                                Helper functions
 **********************************************************************************************************************/
/**
 * Is object defined
 *
 * Helper function to determine if the obj parameter has been defined
 *
 * @param obj                               The object to check if defined
 * @returns {boolean}                       True if the object is defined, else false
 */
function isDefined(obj) {
    return !(typeof obj === 'undefined') && obj !== null;
}

/**
 * Validate parameters
 *
 * Does light validation on the provided set of parameters to an API request
 *
 * @param parameters                        The object containing the parameters for the request
 * @returns {boolean}                       True if all parameters are valid, else false
 */
function parametersAreValid(parameters) {
    var parametersValid = true;
    // Iterate through all the provided parameters
    for (var property in parameters) {
        // Filter out prototype properties
        if (parameters.hasOwnProperty(property)) {
            // Verify the property is a string
            if (typeof property === 'string') {

                // Store the value of the property
                var value = parameters[property];

                switch (property.toLowerCase()) {
                    case 'count':
                    case 'maxlength':
                    case 'appid':
                    case 'appid_playing':
                    case 'gameid':
                        if (!isNumber(value) || value < 0) {
                            parametersValid = false;
                        }
                        break;
                    case 'name':
                        if (!isArray(value)) {
                            parametersValid = false;
                        }
                        break;
                    case 'steamids':
                        var steamids = value.split(',');
                        if (steamids.length > 100) {
                            parametersValid = false;
                        } else {
                            // Iterate through all provided IDs
                            for (var id in steamids) {
                                // Filter prototype properties
                                if (steamids.hasOwnProperty(id)) {
                                    if (!isNumber(id) || id.length !== 17) {
                                        parametersValid = false;
                                    }
                                }
                            }
                        }
                        break;
                    case 'steamid':
                        if (!isNumber(value) || value.length !== 17) {
                            parametersValid = false;
                        }
                        break;
                    case 'relationship':
                        if (VALID_RELATIONSHIPS.indexOf(value) < 0) {
                            parametersValid = false;
                        }
                        break;
                    case 'appids_filter':
                        if (isArray(value)) {
                            for (var appid in value) {
                                // Filter prototype properties
                                if (value.hasOwnProperty(appid)) {
                                    if (!isNumber(appid) || appid < 0) {
                                        parametersValid = false;
                                        break;
                                    }
                                }
                            }
                            // Special case handling to pass appids_filter as "input_json"
                            parameters['input_json'] = encodeURIComponent(JSON.stringify(value));
                            delete parameters[property];
                        } else {
                            parametersValid = false;
                        }
                        break;
                    default:
                        break;
                }
            } else {
                parametersValid = false;
            }
        }
    }

    return parametersValid;
}

/**
 * Is object a number
 *
 * Helper function to determine if the provided object is a number
 *
 * @param obj                               The object to check if a number
 * @returns {boolean}                       True if the object is a number, else false
 */
function isNumber(obj) {
    return !isNaN(obj) && obj % 1 === 0;
}

/**
 * Is object an array
 *
 * Helper function to determine if the provided object is an array
 *
 * @param obj                               The object to check if an array
 * @returns {boolean}                       True if the object is an array, else false
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}


/**********************************************************************************************************************
                                             API SDK module exports
 **********************************************************************************************************************/
module.exports.SteamWebAPI = {
    /**
     * Set response format
     *
     * Sets the default response format for responses from the Steam Web API
     *
     * @param newFormat         The new preferred response format
     * @returns {boolean}       If this function successfully set the provided format
     */
    setFormat: function(newFormat) {
        // Verify the inputted format is valid
        var isValidFormat = VALID_RESPONSE_FORMATS.indexOf(newFormat) > -1;

        // If it's valid then set it as the new default
        if (isValidFormat) {
            responseFormat = newFormat;
        }

        return isValidFormat;
    },

    /**
     * Set API Key
     *
     * Sets the API key that will be used to validate the API requests
     *
     * @param newAPIKey                     The new API key to use
     * @returns {boolean}                   If this function successfully set the provided API key
     */
    setAPIKey: function(newAPIKey) {
        // Verify the inputted api key is valid
        var isValidAPIKey = (typeof newAPIKey === 'string' && newAPIKey.length === 32);

        // If it's valid then set it as the API Key
        if (isValidAPIKey) {
            apiKey = newAPIKey;
        }

        return isValidAPIKey;
    },

    /**
     * Send API request
     *
     * Send the specified request to the Steam Web API and execute the callback upon success or failure
     *
     * @param method                        The method name on the Steam Web API
     * @param parameters                    An object containing all the required parameters for the API request
     * @param callback                      The function to call upon success or failure
     */
    send: function(method, parameters, callback) {
        // Use XMLHttpRequest for sending requests to the API
        var request = new XMLHttpRequest();

        // Check if attempting to send valid request method to the API
        if (STEAM_ENDPOINTS.hasOwnProperty(method)) {

            // Load the specification for the method
            var requestSpecification = STEAM_ENDPOINTS[method];

            // Check if all required variables have been provided
            if (typeof parameters === 'object') {

                var requirementsMet = true;
                var urlParameters = '?';

                // If the API method requires a key, check that it has been defined
                if (requestSpecification.key === true) {
                    if (isDefined(apiKey)) {
                        urlParameters += 'key=' + apiKey + '&';
                    } else {
                        callback({'error': API_KEY_NOT_SET});
                        return;
                    }
                }

                // Call this validation before checking if meeting requirements for special case handling
                // (i.e. appids_filter for GetOwnedGames must be formatted as JSON string and passed as "input_json")
                var parametersValid = parametersAreValid(parameters);

                // Iterate through all required variables from the specification
                for (var requiredParameter in requestSpecification.parameters) {
                    // Filter out prototype properties
                    if (requestSpecification.parameters.hasOwnProperty(requiredParameter)) {
                        // Check if the provided params have the required variables
                        if (parameters.hasOwnProperty(requiredParameter)) {
                            requestSpecification[requiredParameter] = parameters[requiredParameter];
                            urlParameters += requiredParameter + '=' + parameters[requiredParameter] + '&';
                        } else {
                            // Check if this missing parameter is required
                            if (requestSpecification.parameters[requiredParameter] === true) {
                                requirementsMet = false;
                            }
                        }
                    }
                }

                if (requirementsMet) {
                    if (parametersValid) {
                        // Remove trailing & from url parameters string
                        urlParameters = urlParameters.substring(0, urlParameters.length - 1);

                        // Set request details
                        request.open('GET', STEAM_API_BASE_URL + requestSpecification.category + method + '/' +
                            requestSpecification.version + urlParameters, true);

                        // Handle request response
                        request.onreadystatechange = function () {
                            if (request.readyState === 4 && request.status === 200) {
                                try {
                                    // Handle the different preferred response types
                                    if (responseFormat === 'json') {
                                        var jsonObj = JSON.parse(request.responseText);
                                        callback(jsonObj);
                                    } else if (responseFormat === 'xml') {
                                        callback(request.responseXML);
                                    } else {
                                        callback(request.responseText);
                                    }
                                } catch (error) {
                                    callback({'error': error});
                                }
                            }
                        };

                        // Send the request
                        request.send();
                    } else {
                        callback({'error': PARAMETERS_INVALID_VALUE});
                    }
                } else {
                    callback({'error': PARAMETERS_MISSING});
                }
            } else {
                callback({'error': PARAMETERS_INVALID_FORMAT});
            }
        } else {
            callback({'error': METHOD_NOT_EXIST});
        }
    },

    /******************************************************************************************************************
                                                    SDK interfaces
     ******************************************************************************************************************/
    // Pre-built interfaces for the send function for the supported API endpoints
    /**
     * Get news for an app ID
     *
     * GetNewsForApp returns the latest of a game specified by its appID
     *
     * @param appid                         AppID of the game you want the news of
     * @param count                         How many news enties you want to get returned
     * @param maxLength                     Maximum length of each news entry
     * @param callback                      Function to handle the response
     */
    getNewsForApp: function(appid, count, maxLength, callback) {
        this.send('GetNewsForApp', {
            'appid': appid,
            'count': count,
            'maxLength': maxLength
        }, callback);
    },

    /**
     * Get global achievement percentages for an app ID
     *
     * Returns on global achievements overview of a specific game in percentages
     *
     * @param gameid                        AppID of the game you want the percentages of
     * @param callback                      Function to handle the response
     */
    getGlobalAchievementPercentagesForApp: function(gameid, callback) {
        this.send('GetGlobalAchievementPercentagesForApp', {
            'gameid': gameid
        }, callback);
    },

    /**
     * Get global stats for game
     *
     * Get the global stats for the provided achievement names
     *
     * @param gameid                        AppID of the game you want the stats of
     * @param count                         Length of the array of global stat names you will be passing
     * @param name                          Name of the achievement as defined in Steamworks
     * @param callback                      Function to handle the response
     */
    getGlobalStatsForGame: function(gameid, count, name, callback) {
        this.send('GetGlobalStatsForGame', {
            'gameid': gameid,
            'count': count,
            'name': name
        }, callback);
    },

    /**
     * Get player summaries
     *
     * Returns basic profile information for a list of 64-bit Steam IDs
     *
     * @param steamids                      Comma-delimited list of 64 bit Steam IDs to return profile information for. Up to 100 Steam IDs can be requested
     * @param callback                      Function to handle the response
     */
    getPlayerSummaries: function(steamids, callback) {
        this.send('GetPlayerSummaries', {
            'steamids': steamids
        }, callback);
    },

    /**
     * Get friend list
     *
     * Returns the friend list of any Steam user, provided his Steam Community profile visibility is set to "Public"
     *
     * @param steamid                       64 bit Steam ID to return friend list for
     * @param relationship                  Relationship filter. Possibles values: all, friend
     * @param callback                      Function to handle the response
     */
    getFriendList: function(steamid, relationship, callback) {
        this.send('GetFriendList', {
            'steamid': steamid,
            'relationship': relationship
        }, callback);
    },

    /**
     * Get player achievements
     *
     * Returns a list of achievements for this user by app id
     *
     * @param steamid                       64 bit Steam ID to return friend list for
     * @param appid                         The ID for the game you're requesting
     * @param callback                      Function to handle the response
     */
    getPlayerAchievements: function(steamid, appid, callback) {
        this.send('GetPlayerAchievements', {
            'steamid': steamid,
            'appid': appid
        }, callback);
    },

    /**
     * Get user stats for game
     *
     * Returns a list of achievements for this user by app id
     *
     * @param steamid                       64 bit Steam ID to return friend list for
     * @param appid                         The ID for the game you're requesting
     * @param callback                      Function to handle the response
     */
    getUserStatsForGame: function(steamid, appid, callback) {
        this.send('GetUserStatsForGame', {
            'steamid': steamid,
            'appid': appid
        }, callback);
    },

    /**
     * Get owned games
     *
     * GetOwnedGames returns a list of games a player owns along with some playtime information, if the profile is
     * publicly visible. Private, friends-only, and other privacy settings are not supported unless you are asking for
     * your own personal details (ie the WebAPI key you are using is linked to the steamid you are requesting).
     *
     * @param steamid                       The SteamID of the account
     * @param include_appinfo               Include game name and logo information in the output. The default is to return appids only
     * @param include_played_free_games     By default, free games like Team Fortress 2 are excluded (as technically everyone owns them). If include_played_free_games is set, they will be returned if the player has played them at some point. This is the same behavior as the games list on the Steam Community
     * @param appids_filter                 You can optionally filter the list to a set of appids. Note that these cannot be passed as a URL parameter, instead you must use the JSON format described in Steam_Web_API#Calling_Service_interfaces. The expected input is an array of integers
     * @param callback                      Function to handle the response
     */
    getOwnedGames: function(steamid, include_appinfo, include_played_free_games, appids_filter, callback) {
        var parameters = {
            'steamid': steamid
        };

        // Optional parameters
        if (isDefined(include_appinfo)) {
            parameters.include_appinfo = include_appinfo;
        }
        if (isDefined(include_played_free_games) && isDefined(include_played_free_games.length) && include_played_free_games.length > 0) {
            parameters.include_played_free_games = include_played_free_games;
        }
        if (isDefined(appids_filter)) {
            parameters.appids_filter = appids_filter;
        }

        this.send('GetOwnedGames', parameters, callback);
    },

    /**
     * Get recently played games
     *
     * GetRecentlyPlayedGames returns a list of games a player has played in the last two weeks, if the profile is
     * publicly visible. Private, friends-only, and other privacy settings are not supported unless you are asking for
     * your own personal details (ie the WebAPI key you are using is linked to the steamid you are requesting).
     *
     * @param steamid                       The SteamID of the account
     * @param count                         Optionally limit to a certain number of games (the number of games a person has played in the last 2 weeks is typically very small)
     * @param callback                      Function to handle the response
     */
    getRecentlyPlayedGames: function(steamid, count, callback) {
        var parameters = {
            'steamid': steamid
        };

        // Optional parameters
        if (isDefined(count)) {
            parameters.count = count;
        }

        this.send('GetRecentlyPlayedGames', parameters, callback);
    },

    /**
     * Is playing shared game
     *
     * IsPlayingSharedGame returns the original owner's SteamID if a borrowing account is currently playing this game.
     * If the game is not borrowed or the borrower currently doesn't play this game, the result is always 0.
     *
     * @param steamid                       The SteamID of the account playing
     * @param appid_playing                 The AppID of the game currently playing
     * @param callback                      Function to handle the response
     */
    isPlayingSharedGame: function(steamid, appid_playing, callback) {
        this.send('GetUserStatsForGame', {
            'steamid': steamid,
            'appid_playing': appid_playing
        }, callback);
    }
};