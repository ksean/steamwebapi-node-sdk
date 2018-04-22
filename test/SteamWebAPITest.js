/**
 * steamwebapi
 *
 * Unofficial Steam Node.js SDK for interfacing with Steam's Web API
 *
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://unlicense.org/>
 *
 * @author Kennedy Software Solutions Inc.
 * @version 0.0.4
 */

let assert = require('assert');
let SteamWebAPI = require('../SteamWebAPI');

const STEAM_ID = '76561198020275445'; // TimmyCZ
const APP_ID = '440'; // Team Fortress 2
const COUNT = '5';
const LENGTH = '100';
const ACHIEVEMENT_NAME = ['tf_pyro_burn_spy_taunt'];

suite('Array', function(){
    setup(function(){
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