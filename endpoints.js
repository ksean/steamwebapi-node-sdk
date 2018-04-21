module.exports = {
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