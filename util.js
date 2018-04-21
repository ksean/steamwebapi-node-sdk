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