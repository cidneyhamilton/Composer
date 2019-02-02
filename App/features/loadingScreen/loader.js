define(function(require) {
    var system = require('durandal/system'),
        $ = require('jquery'),
        assetDatabase = require('infrastructure/assetDatabase');

    var featureMains = [];

    function installFeatures() {
        return system.defer(function(dfd) {
            require(featureMains, function() {
                for (var i = 0; i < arguments.length; i++) {
                    arguments[i].install();
                }
                dfd.resolve();
            });
        }).promise();
    }

    function features() {
        for (var i = 0; i < arguments.length; i++) {
            featureMains.push('features/' + arguments[i] + '/main');
        }
    }

    features('components', 'scripts', 'actors', 'storyEvents', 'props', 'scenes', 'localization');

    var ctor = {
    	load: function() {
			setTimeout(function(){
				assetDatabase.load(),
				installFeatures();
			});
		}
    };

    return ctor;
});