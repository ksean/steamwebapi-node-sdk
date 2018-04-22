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
    isDefined: function(obj) {
        return !(typeof obj === 'undefined') && obj !== null;
    },

    /**
     * Is object a number
     *
     * Helper function to determine if the provided object is a number
     *
     * @param obj                               The object to check if a number
     * @returns {boolean}                       True if the object is a number, else false
     */
    isNumber: function(obj) {
        return !isNaN(obj) && obj % 1 === 0;
    },

    /**
     * Is object an array
     *
     * Helper function to determine if the provided object is an array
     *
     * @param obj                               The object to check if an array
     * @returns {boolean}                       True if the object is an array, else false
     */
    isArray: function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
};