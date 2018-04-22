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
module.exports = {
    // API Configuration
    STEAM_API_BASE_URL: 'https://api.steampowered.com/',
    VALID_RESPONSE_FORMATS: ['json', 'xml', 'vdf'],
    VALID_RELATIONSHIPS: ['all', 'friend'],

    // Error messages
    API_KEY_NOT_SET: 'API key is not set',
    PARAMETERS_MISSING: 'Missing parameter(s)',
    PARAMETERS_INVALID_VALUE: 'Required parameters are present but invalid',
    PARAMETERS_INVALID_FORMAT: 'Parameters were not provided as an object',
    METHOD_NOT_EXIST: 'That API method does not exist',
    INVALID_REQUEST_STATUS: 'The response from the server returned an invalid state',
};