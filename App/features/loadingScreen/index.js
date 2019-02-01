define(function(require) {
    var selectedGame = require('features/projectSelector/index'),
        path = requireNode('path'), 
        system = require('durandal/system'),
        app = require('durandal/app'),
        $ = require('jquery'),
        observable = require('plugins/observable'),
        ko = require('knockout'),
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

    var ctor = function() {
		this.imgSrc = path.join(selectedGame.activeProject.dir, '/Content/images/splash.jpg');

		this.loadAssets = function() {
			setTimeout(function(){
				// this code is queued until after the component is rendered.
				return $.when(
					assetDatabase.load(),
					installFeatures()
				).done(
					// Only trigger the redirect to the next window after all the assets are loaded.
					app.trigger('app:navigate:projectLoaded', selectedGame.activeProject)
				);
			}, 1500);
		}
    };

    return ctor;
});