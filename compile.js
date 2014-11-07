window = {}
fs = require('fs')
_ = require('underscore')
PTITemplates = require('../PlayTheInternet/kladecytI/web/js/lib/templates')
require('../PlayTheInternet/kladecytI/web/js/lib/SiteHandlers')
require('../PlayTheInternet/kladecytI/web/js/lib/parse')

var templates = ''
for (i in PTITemplates.prototype ) {
    templates += "PTITemplates.prototype." + i + " = " + PTITemplates.prototype[i].source
}


fs.writeFile('./src/cparse.js', window.playTheInternetParseString + '\r\nmodule.exports = playTheInternetParse')
fs.writeFile('../PlayTheInternet/kladecytI/web/js/lib/cparse.js', window.playTheInternetParseString)
fs.writeFile('../PlayTheInternet/kladecytI/web/js/lib/ctemplates.js', templates)
