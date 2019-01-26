define(function(require){
    var speakingurl = require('speakingurl');

    return function(text){
        var temp = speakingurl(text, {separator: "_", maintainCase: true});
        return temp.replace(/-/, '_');
    };
});
