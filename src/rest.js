var request = require("request");

var rest = {
    ajax: function*(context, requestOptions) {
        var it = cmn.checkSetIterator.call(this, context, rest.ajax)
        function callback(error, response, body) {
            console.log(arguments)
            it.next({ body: body, request: requestOptions, error: error, response: response})
        }
        var output = yield request(requestOptions, callback)
        return output
    },
    checkResponse: function (ajaxData, json) {
        if (ajaxData.response && ajaxData.response.statusCode == 404) {
            throw ptiError.PageNotFound(ajaxData.request.uri)
        } else if(ajaxData.error) {
            throw ptiError.RestError(ajaxData.request.uri)
        }
        if (!_.isObject(ajaxData.body) && json) {
            try {
                var body = JSON.parse(ajaxData.body)
                ajaxData.body = body
            } catch (e) {
                throw ptiError.TransformJSON(ajaxData.request.uri)
            }
        }
        if(ajaxData.response.statusCode != 200) {
            throw ptiError.StatusCode(ajaxData.response.statusCode + ' for ' + ajaxData.request.uri)
        }
    },
    data: function (applicationEncoded, json) {
        var data = {}
        applicationEncoded && (data.form = applicationEncoded)
        json && (data.json = json)
        return data
    },
    options: function (host, path, method, data, headers) {
        var options = {
            uri: (host || 'http://www.reddit.com') + (path || '/r/Music/comments/2g6skz/what_song_blew_you_away_the_first_time_you_heard.json'),
            method: method || 'GET',
            headers: headers || { 'Content-Type': 'application/text', 'User-Agent': 'PlayTheInternetDEV by sichain' },
            proxy: 'http://localhost:8888'
        }
        _.extend(options, data)
        _.extend(options.headers, headers)
        return options
    }
}

module.exports = rest;

//function *rest(context) {
//    var it = cmn.checkSetIterator.call(this, context, rest)
//    var me = this
//    me.debug = 1
//    this.debug && console.log("rest::get");
//    var prot = this.port == 443 ? https : http;
//    function go() {
//        var req = prot.request({
//            host: 'www.reddit.com',
//            path: "/r/Music/comments/2g6skz/what_song_blew_you_away_the_first_time_you_heard.json",
//            method: 'GET',
//            headers: {
//                'Content-Type': 'application/text'
//            }}, function (res) {
//            var output = '';
////        me.debug && console.log(me.options.host + ':' + res.statusCode);
//            res.setEncoding('utf8');
//
//            res.on('data', function (chunk) {
//                me.debug && console.log('onData')
//                output += chunk;
//            });
//
//            res.on('end', function () {
//                me.debug && console.log('onEnd')
//                it.next(output);
//                me.debug && console.log('onAfterEnd')
//            });
//        });
//
//        req.on('error', function (err) {
//            me.debug && console.log('onError')
//            //res.send('error: ' + err.message);
//        });
//
//        req.end();
//    }
//
//    var output = yield go()
//    return output
//}