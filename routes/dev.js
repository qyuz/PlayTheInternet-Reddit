var express = require('express'), router = express.Router(), Rest = require('../src/rest')

function *main(req, res) {
    var text = '';
    text = yield* new Rest("/r/Music/comments/2g6skz/what_song_blew_you_away_the_first_time_you_heard.json", "text", 1);
    console.log('before next')
//    it.next()
//    text = it.next()
//    console.log('after next')
////    var text = new rest.get().next();
    res.send(text);
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    var d = require('domain').create()
    d.on('error', next)
    d.run(function () {
//        var it = new Rest("/r/Music/comments/2g6skz/what_song_blew_you_away_the_first_time_you_heard.json", "text", 1, res)
//        var text = it.next()
//        res.send(text)
        var m = new main(req, res)
        console.log('main start')
        console.log(m.next())
//        console.log(m.next())
        console.log('main end')
//        res.send(m.next())
    })
})


module.exports = router;
