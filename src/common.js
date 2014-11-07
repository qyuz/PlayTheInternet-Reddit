var playTheInternetParse = require('../src/cparse')

var common = {
    checkSetIterator: function(context, type) {
        if (_.isFunction(type) && this instanceof type) {
            console.log('this')
            return this
        } else {
            if(context && context.it) {
                return context.it
            } else {
                throw new Error('pass iterator')
            }
        }
    },
    jsonPathFilter: function(expression) {
        return expression ? '[?(@.' + expression + ')]' : ''
    },
    playlistUri: function(redditBody) {
        var urls = _.isString(redditBody) ? playTheInternetParse(redditBody) : playTheInternetParse(JSON.stringify(redditBody))
        return conf.ptiHost + urls
    }
}

module.exports = common