var creds = require('../../ptibot.conf')

var reddit = {
    checkResponse: function(ajaxData) {
        rest.checkResponse(ajaxData, JSON.parse)
        var error = jsonPath.eval(ajaxData.body, '$..errors')
        if (error && _.flatten(error) && _.flatten(error).length) {
            var errorString = JSON.stringify(error);
            console.log(errorString)
            var errorMatch = null
            if (errorMatch = errorString.match(/RATELIMIT.*you are doing that too much. try again in (\d+) (\w+).*vdelay/)) {
                switch (true) {
                    case /hour.*/.test(errorMatch[2]): {
                        var multiply = 3600000
                        break;
                    }
                    case /minute.*/.test(errorMatch[2]): {
                        var multiply = 60000
                        break;
                    }
                    case /second.*/.test(errorMatch[2]): {
                        var multiply = 1000
                        break;
                    }
                    default: {
                        throw ptiError.Fatal('couldnot match hours, minutes or seconds in YouAreDoingThatTooMuch error')
                    }
                }
                throw ptiError.YouAreDoingThatTooMuch(errorMatch[1] * multiply)
            } else if (errorString.match(/.*WRONG_PASSWORD.*wrong password.*passwd/)) {
                throw ptiError.WrongPassword()
            } else {
                throw ptiError.RedditError(errorString)
            }
        }
    },
    findChildren: function(response) {
        var more = jsonPath.eval(response.body, "$..children").filter(function (children) {
            return _.every(children, _.isString)
        })
        var uniqueMore = _.chain(more).flatten().unique().value()
        return uniqueMore
    },
    login: function*(context) {
        var it = cmn.checkSetIterator.call(this, context, reddit.login)
        var ajaxData = yield* rest.ajax(context,
            rest.options(null,
                '/api/login',
                'POST',
                rest.data({'api_type': 'json', 'user': creds.user, 'passwd': creds.password, 'rem': true}))
        );
        reddit.checkResponse(ajaxData)
        return ajaxData
    },
    thread: function* (context, path) {
        var it = cmn.checkSetIterator.call(this, context, reddit.thread)
        var ajaxData = yield* rest.ajax(context, rest.options(null, path + '.json'))
        reddit.checkResponse(ajaxData)
        return ajaxData
    },
    subreddit: function* (context, subreddit, jsonPathFilterExpression) {
        jsonPathFilterExpression = jsonPathFilterExpression ? cmn.jsonPathFilter(jsonPathFilterExpression) : cmn.jsonPathFilter(conf.subredditFilter)
        var it = cmn.checkSetIterator.call(this, context, reddit.subreddit)
        var ajaxData = yield* rest.ajax(context, rest.options(null, '/r/' + subreddit + '.json'))
        reddit.checkResponse(ajaxData)
        console.log(jsonPathFilterExpression)
        var posts = _.flatten(jsonPath.eval(ajaxData.body, '$..children' + jsonPathFilterExpression))
        return posts
    }
}

module.exports = reddit