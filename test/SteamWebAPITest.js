var assert = require('assert');
var SteamWebAPI = require('../SteamWebAPI').SteamWebAPI;

const STEAM_ID = '76561198020275445'; // TimmyCZ
const APP_ID = '440'; // Team Fortress 2
const COUNT = '5';
const LENGTH = '100';
const ACHIEVEMENT_NAME = ['tf_pyro_burn_spy_taunt'];

suite('Array', function(){
    setup(function(){
//        SteamWebAPI.setAPIKey('');
    });

    suite('getNewsForApp', function(){
        test('should not have error', function() {
            SteamWebAPI.getNewsForApp(APP_ID, COUNT, LENGTH, function(response) {
                assert.equal('object', typeof response);
                assert.equal('undefined', typeof response.error);
            });
        });
    });

    suite('getGlobalAchievementPercentagesForApp', function(){
        test('should not have error', function() {
            SteamWebAPI.getGlobalAchievementPercentagesForApp(APP_ID, function(response) {
                assert.equal('object', typeof response);
                assert.equal('undefined', typeof response.error);
            });
        });
    });

    suite('getGlobalStatsForGame', function(){
        test('should not have error', function() {
            SteamWebAPI.getGlobalStatsForGame(APP_ID, COUNT, ACHIEVEMENT_NAME, function(response) {
                assert.equal('object', typeof response);
                assert.equal('undefined', typeof response.error);
            });
        });
    });
});