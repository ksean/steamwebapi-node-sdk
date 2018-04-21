/**
 * Steam Web API Node SDK
 *
 * SDK for interfacing with Steam's Web API using Node
 * Copyright (C) 2018 Kennedy Software Solutions Inc.
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
 * @author Kennedy Software Solutions Inc.
 * @version 0.0.3
 */


/**********************************************************************************************************************
                                          Includes & letiable declaration
 **********************************************************************************************************************/
// Required modules
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Helper modules
let config = require('./config');
let util = require('./util');
let endpoints = require('./endpoints');

// Instance variables
let responseFormat = 'json';
let apiKey;

/**
 * Validate parameters
 *
 * Does light validation on the provided set of parameters to an API request
 *
 * @param parameters                        The object containing the parameters for the request
 * @returns {boolean}                       True if all parameters are valid, else false
 */
function parametersValid(parameters) {

    // Iterate through all the provided parameters
    for (let property in parameters) {
        
        // Filter out prototype properties
        if (parameters.hasOwnProperty(property)) {
            
            // Each parameter must be a string
            if (typeof property !== 'string') {
                return false;
            }

            // Store the value of the property
            let value = parameters[property];

            switch (property.toLowerCase()) {

                case 'count':
                case 'maxlength':
                case 'appid':
                case 'appid_playing':
                case 'gameid':

                    if (!util.isNumber(value) || value < 0) {

                        return false;
                    }

                    break;

                case 'name':

                    if (!util.isArray(value)) {

                        return false;
                    }

                    break;

                case 'steamids':

                    let steamids = value.split(',');

                    if (steamids.length > 100) {

                        return false;

                    } else {

                        // Iterate through all provided IDs
                        for (let id in steamids) {

                            // Filter prototype properties
                            if (steamids.hasOwnProperty(id)) {

                                if (!util.isNumber(id) || id.length !== 17) {

                                    return false;
                                }
                            }
                        }
                    }

                    break;

                case 'steamid':

                    if (!util.isNumber(value) || value.length !== 17) {

                        return false;
                    }

                    break;

                case 'relationship':

                    if (config.VALID_RELATIONSHIPS.indexOf(value) < 0) {

                        return false;
                    }

                    break;

                case 'appids_filter':

                    if (!util.isArray(value)) {
                        return false;
                    }

                    for (let appid in value) {

                        // Filter prototype properties
                        if (value.hasOwnProperty(appid)) {

                            if (!util.isNumber(appid) || appid < 0) {

                                return false;
                            }
                        }
                    }

                    // Special case handling to pass appids_filter as "input_json"
                    parameters['input_json'] = encodeURIComponent(JSON.stringify(value));
                    delete parameters[property];

                    break;

                default:
                    break;
            }
        }
    }

    return true;
}


/**********************************************************************************************************************
                                             API SDK module exports
 **********************************************************************************************************************/
/**
 * This module exports the API helper functions
 * @module SteamWebAPI
 */
module.exports = {
    /**
     * Set response format
     *
     * Sets the default response format for responses from the Steam Web API
     *
     * @param newFormat         The new preferred response format
     */
    setFormat: function(newFormat) {

        // If it's valid then set it as the new default
        if (config.VALID_RESPONSE_FORMATS.includes(newFormat)) {
            responseFormat = newFormat;
        }
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
        let isValidAPIKey = (typeof newAPIKey === 'string' && newAPIKey.length === 32);

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
        let request = new XMLHttpRequest();

        // Check if attempting to send valid request method to the API
        if (!(endpoints.hasOwnProperty(method))) {
            callback({'error': config.METHOD_NOT_EXIST})
            return;
        }

        // Load the specification for the method
        let requestSpecification = endpoints[method];

        // Check if all required letiables have been provided
        if (!(typeof parameters === 'object')) {

            callback({'error': config.PARAMETERS_INVALID_FORMAT});
            return;
        }

        let requirementsMet = true;
        let urlParameters = '?';

        // If the API method requires a key, check that it has been defined
        if (requestSpecification.key === true) {

            if (!(util.isDefined(apiKey))) {
                callback({'error': config.API_KEY_NOT_SET});
                return;
            }

            urlParameters += 'key=' + apiKey + '&';
        }

        // Call this validation before checking if meeting requirements for special case handling
        // (i.e. appids_filter for GetOwnedGames must be formatted as JSON string and passed as "input_json")
        if (!(parametersValid(parameters))) {
            callback({'error': config.PARAMETERS_INVALID_VALUE});
        }

        // Iterate through all required letiables from the specification
        for (let requiredParameter in requestSpecification.parameters) {

            // Filter out prototype properties
            if (requestSpecification.parameters.hasOwnProperty(requiredParameter)) {

                // Check if the provided params have the required letiables
                if (parameters.hasOwnProperty(requiredParameter)) {

                    requestSpecification[requiredParameter] = parameters[requiredParameter];
                    urlParameters += requiredParameter + '=' + parameters[requiredParameter] + '&';
                } else {

                    // Check if this missing parameter is required
                    if (requestSpecification.parameters[requiredParameter] === true) {

                        callback({'error': config.PARAMETERS_MISSING});
                        return;
                    }
                }
            }
        }

        // Remove trailing & from url parameters string
        urlParameters = urlParameters.substring(0, urlParameters.length - 1);

        // Set request details
        request.open('GET', config.STEAM_API_BASE_URL + requestSpecification.category + method + '/' +
            requestSpecification.version + urlParameters, true);

        // Handle request response
        request.onreadystatechange = function () {

            // Ignore incomplete requests
            if (!(request.readyState === 4 && request.status === 200)) {

                return;
            }

            try {

                // Handle the different preferred response types
                if (responseFormat === 'json') {

                    let jsonObj = JSON.parse(request.responseText);
                    callback(jsonObj);

                } else if (responseFormat === 'xml') {

                    callback(request.responseXML);
                } else {

                    callback(request.responseText);
                }
            } catch (error) {
                callback({'error': error});
            }
        };

        // Send the request
        request.send();
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
        let parameters = {
            'steamid': steamid
        };

        // Optional parameters
        if (util.isDefined(include_appinfo)) {
            parameters.include_appinfo = include_appinfo;
        }
        if (util.isDefined(include_played_free_games) && util.isDefined(include_played_free_games.length) && include_played_free_games.length > 0) {
            parameters.include_played_free_games = include_played_free_games;
        }
        if (util.isDefined(appids_filter)) {
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
        let parameters = {
            'steamid': steamid
        };

        // Optional parameters
        if (util.isDefined(count)) {
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