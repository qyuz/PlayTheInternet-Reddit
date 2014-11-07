var express = require('express');
var router = express.Router();

var reddit = require('../src/reddit')

function *main(context, req, res) {
    try {
    var mainContext = { domain: context && context.domain, it: this }
    //    throw error.Close('yo')
    //    throw new Error('yo1')
    //    var login = yield* reddit.login(mainContext)
    //
    //    console.log(login)
    //    console.log(reddit.checkResponse(login))
    //    res.send(login);
    //    var redditResponse
        var thread = yield* reddit.thread(mainContext, '/r/Music/comments/2jitn4/what_are_some_bands_or_artists_who_started_off.json')
        res.send(cmn.playlistUri(thread.body))
    //        var posts = yield* reddit.subreddit(mainContext, 'Music')
    //        res.send(posts)
    //    var thread = yield* reddit.thread(mainContext, '/r/Music/comments/2g6skz/what_song_blew_you_away_the_first_time_you_heard.json')
    //    res.send(thread.body)
    //    console.log(redditResponse = reddit.checkResponse(thread))
    //    res.send(reddit.findChildren(thread))
    //    console.log('main end')
    } catch (e) {
        console.log(e)
//        if(e instanceof error.RestError) {
//            res.send('close initiated')
//        } else {
            throw e
//        }
    }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    var d = require('domain').create()
    d.on('error', next)
    d.run(function () {
        new main({domain: d}, req, res, next).next()
    })
})


module.exports = router;
