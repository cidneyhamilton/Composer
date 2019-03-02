define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor'),
        InkWriter = require('infrastructure/inkWriter'),
        path = requireNode('path'),
        htmlTagRegex = /(<([^>]+)>)/ig,

        knownBadHtmlTags = [  '<?>', '<blows kiss>', '<blush>', '<burp>', '<chuckle>', '<claps hands>', '<clears throat>', '<cough>', '<deep sigh>', '<flips the coin>',
                                      '<gasp>', '<glare>', '<grin>', '<grits teeth>', '<groan>', '<growl>', '<grrrr>', '<grrrrrr>', '<grump>',
                                      '<hands the Kwirk the tart>', '<hands over stationery>', '<hands Shawn something>', '<Hssss!>', '<hug>', '<hugs Shawn>', '<IMG:Map/>', '<kiss>',
                                      "<kisses Shawn's cheek>", '<knock>', '<laugh>', '<Low Growl>', '<meow>', '<mrow>', '<Mroww>', '<nod>',
                                      '<Prrrrrrrr>', '<raarr!!>', '<rolls eyes>', '<shakes head>', '<shrug>', '<shudder>', '<sigh>',
                                      '<smile>', '<smirk>', '<sniff>', '<slurp>', '<snort>', '<swallow>', '<Tail Wag>', '<Wags Tail>',
                                      '<wags tail>', '<whine>', '<whisper>', '<Whoof!>', '<yawn>'];

    var ctor = function () {
        baseReportProcessor.call(this, 'badHtml');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseAndLogHtmlTags = function(text, sceneName, scriptName) {
        var allTags = text.match(htmlTagRegex);
        if (allTags) {
            var badHtmlTags = [];
            var tagsSeen = [];
            for (var i in allTags) {
                var currTag = allTags[i];
                 // If the tag is a known "bad" tag (ie - non-html), don't report it
                if (knownBadHtmlTags.indexOf(currTag) >= 0) {
                    continue;
                }
                // If it's a closing tag, check if it closes the last tag
                if (currTag.indexOf('/') > -1) {
                    var splitCurrTag = currTag.split('/');
                    var expectedStartTag = splitCurrTag[0] + splitCurrTag[1];
                    var lastTag = tagsSeen.pop();
                    if (lastTag != expectedStartTag) {
                        badHtmlTags.push(currTag);
                        // It's possible there was no last tag seen, if the closing tag was
                        // the first tag seen.
                        if (lastTag) {
                            tagsSeen.push(lastTag);
                        }
                    }
                } else {
                    tagsSeen.push(currTag);
                }
            }

            for (var i in tagsSeen) {
                badHtmlTags.push(tagsSeen[i]);
            }

            if (badHtmlTags.length > 0) {
                this.report.log(sceneName + ' : ' + scriptName, badHtmlTags + " : " + text);
            }
        }
    };

    ctor.prototype.parseNode = function(idMap, sceneName, script, node) {
        if (node.description) {
            this.parseAndLogHtmlTags(node.description, sceneName, script.name);
        }
        if (node.text) {
            this.parseAndLogHtmlTags(node.text, sceneName, script.name);
        }
        if (node.title) {
            this.parseAndLogHtmlTags(node.title, sceneName, script.name);
        }
    };

    ctor.prototype.finish = function(context) {
        // generate the htmlTag report
        baseReportProcessor.prototype.finish.call(this, context);
    }

    return new ctor();
});