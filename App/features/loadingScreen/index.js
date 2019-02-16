define(function(require) {
    var selectedGame = require('features/projectSelector/index'),
        path = requireNode('path'), 
        system = require('durandal/system'),
        app = require('durandal/app'),
        $ = require('jquery'),
        observable = require('plugins/observable'),
        ko = require('knockout'),
        assetDatabase = require('infrastructure/assetDatabase'),
        loader = require('features/loadingScreen/loader'),
        fileSystem = require('infrastructure/fileSystem');

    var ctor = function() {
		this.imgSrc = path.join(selectedGame.activeProject.dir, '/Content/images/splash.jpg');

        // If the game doesn't have a custom splash screen, use the Standalone default
        if (!fileSystem.exists(this.imgSrc)) {
            this.imgSrc = path.join(process.cwd(), '/Content/images/splash.jpg');
        }

		this.loadAssets = function() {
			setTimeout(function(){
				// this code is queued until after the component is rendered.
				return $.when(
                    loader.load()
				).done(
					// Only trigger the redirect to the next window after all the assets are loaded.
					app.trigger('app:navigate:projectLoaded', selectedGame.activeProject)
				);
			}, 1500);
		}
    };

    return ctor;
});