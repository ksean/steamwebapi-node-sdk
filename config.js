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