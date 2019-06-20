define(function(require) {
    var Section = require('./section'),
	app = require('durandal/app'),
    path = requireNode('path'),
    fileSystem = require('infrastructure/fileSystem'),
    serializer = require('plugins/serializer'),
    runner = require('features/build/runner'),
    buildConfig = require('features/build/buildConfig'),
    $ = require('jquery'),
    loader = require('features/loadingScreen/loader'),
    selectedGame = require('features/projectSelector/index');


    var getSections = function() {
        var sections = [
            new Section('Select Game', 'icon-play', 'features/projectSelector/index', true),
            new Section('Home', 'icon-home'),
            new Section('Constants', 'icon-pushpin'),
            new Section('Actors', 'icon-user'),
            new Section('Scenes', 'icon-picture'),
        ];

        if (selectedGame.showAdvanced) {
            sections.push(new Section('Events', 'icon-film', 'features/storyEvents/index'));
            sections.push(new Section('Labels', 'icon-tag', 'features/localization/index'));
            sections.push(new Section('Build Config', 'icon-building', 'features/build/index'));
        }

        return sections;
    };


    var toolbar = {
        hasButtonsEnabled: false,
        isVisible: true,
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
        sections: getSections(),
        build: function() {
            buildConfig.activate();
            runner.run(buildConfig.project, 'debug');
        }
    };

    app.on('app:navigate:loadProject').then(function(project) {
            return $.when(
                app.trigger('app:navigate:screen','features/loadingScreen/index')
            ).done(
                setTimeout(function(){
                toolbar.isVisible = false
            }, 600)
            );
    });

    app.on('app:navigate:projectLoaded').then(function(project) {
        setTimeout(function(){
            toolbar.sections[0].name = project.gameName;
            return $.when(
                toolbar.select(toolbar.sections[1])
            ).done(
                // The window-switching has a 1s transition fade.
                // Re-enable the toolbar after the fade.
                setTimeout(function(){
                    toolbar.hasButtonsEnabled = true;
                    toolbar.isVisible = true;
                    toolbar.sections = getSections()
                }, 1300)
            )
        }, 1000);
    });

    var myArgs = require('nw.gui').App.argv;
    // AUTOMATED BUILD MODE! THIS BUILDS AND SHUTS DOWN COMPOSER!
    if(myArgs.indexOf('batchBuild') > -1)
    {
        toolbar.hasButtonsEnabled = true;
        selectedGame.activate();

        if (myArgs.indexOf('SummerDazeM') > -1) {
            selectedGame.activeProject = selectedGame.projects.SummerDazeM;
        } else if (myArgs.indexOf('SummerDazeF') > -1) {
            selectedGame.activeProject = selectedGame.projects.SummerDazeF;
        } else if (myArgs.indexOf('wizardsWay') > -1) {
            selectedGame.activeProject = selectedGame.projects.wizardsWay;
        } else if (myArgs.indexOf('r2rDemo') > -1) {
            selectedGame.activeProject = selectedGame.projects.r2rDemo;
        } else {
            selectedGame.activeProject = selectedGame.projects.heroU;
        }

        loader.load();
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
    } else {
        // For the normal UI flow, go to the project select screen.
        toolbar.select(toolbar.sections[0]);
    }

    return toolbar;
})