define(function(require) {
    var Section = require('./section'),
	app = require('durandal/app'),
    path = requireNode('path'),
    fileSystem = require('infrastructure/fileSystem'),
    serializer = require('plugins/serializer'),
    runner = require('features/build/runner'),    
    selectedGame = require('features/projectSelector/index');

    var toolbar = {
        activeSection: null,
        select: function(section) {
            if (this.activeSection) {
                this.activeSection.isSelected = false;
            }

            this.activeSection = section;

            if (this.activeSection) {
                this.activeSection.isSelected = true;
                app.trigger('app:navigate:feature', section);
            }
        },
        sections: [
            new Section('Game', 'icon-sitemap', 'features/projectSelector/index'),
            new Section('Home', 'icon-home'),
            new Section('Events', 'icon-film', 'features/storyEvents/index'),
            new Section('Actors', 'icon-user'),
            new Section('Scenes', 'icon-picture'),
            new Section('Labels', 'icon-tag', 'features/localization/index'),
            new Section('Build Config', 'icon-building', 'features/build/index')
        ],
        build: function() {
            var projectPath = path.join(selectedGame.activeProject.dir, 'Data/project.json');

            if(fileSystem.exists(projectPath)) {
                var data = fileSystem.read(projectPath);
                var rawJsonText = String(data);
                var project = serializer.deserialize(rawJsonText);
                runner.run(project, 'debug');
            } else {
                alert("No build config found at: " + projectPath);
            }
        }
    };

    toolbar.select(toolbar.sections[0]);
    var myArgs = require('nw.gui').App.argv;
    // AUTOMATED BUILD MODE! THIS BUILDS AND SHUTS DOWN COMPOSER!
    if(myArgs.indexOf('batchBuild') > -1)
    {
        toolbar.select(toolbar.sections[6]);
        // HACK: We can't click the build button right away because of the transition
        // above. If we click the build button right away then we won't
        // have the full build transition handled.
        setTimeout(function() 
        { 
            // Automated builds always build in release mode.
            // but you can override that if need be.
            document.getElementById("buildTypeOption").value="release";
            if(myArgs.indexOf('debug') > -1) {
                document.getElementById("buildTypeOption").value="debug";
            }

            // Click the build button! 
            document.getElementById("buildClick").click(); 
            // NOTE: Exit is handled by a parallel check at the
            //       end of the build runner as it is tearing
            //       down the build indicator.

        }, 5000);
    }    

    return toolbar;
})