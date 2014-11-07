var express = require('express');
var router = express.Router();

function requ(it, ex) {
    setTimeout(function () {
        it.next('respond with a resource!!11');
    }, 2000)
}

function *main(req, res) {
    var text = yield requ(this);
    text = yield requ(this);
    text = yield requ(this, 1);
    res.send(text);
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    var d = require('domain').create()
    d.on('error', next)
    d.run(function () {
        new main(req, res).next()
    })
})


module.exports = router;
