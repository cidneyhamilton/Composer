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
	    new Section('Labels', 'icon-tag', 'features/localization/index')
        ];

        if (selectedGame.showAdvanced) {
            sections.push(new Section('Events', 'icon-film', 'features/storyEvents/index'));
        }

        sections.push(new Section('Build Config', 'icon-building', 'features/build/index'));

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
            runner.run(buildConfig.project, 'debug', false);
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
            return $.when(
                toolbar.select(toolbar.sections[1])
            ).done(
                // The window-switching has a 1s transition fade.
                // Re-enable the toolbar after the fade.
                setTimeout(function(){
                    toolbar.hasButtonsEnabled = true;
                    toolbar.isVisible = true;
                    toolbar.sections = getSections()
                    toolbar.sections[0].name = project.gameName;
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
        var isDemo="false";

        if (myArgs.indexOf('SummerDazeM') > -1) {
            selectedGame.activeProject = selectedGame.projects.SummerDazeM;
        } else if (myArgs.indexOf('SummerDazeF') > -1) {
            selectedGame.activeProject = selectedGame.projects.SummerDazeF;
        } else if (myArgs.indexOf('wizardsWay') > -1) {
            selectedGame.activeProject = selectedGame.projects.wizardsWay;
        } else {
            selectedGame.activeProject = selectedGame.projects.heroU;
            isDemo="false";
        }

        loader.load();
        var buildConfigSectionNum = -1;
        for(var i = 0; i < toolbar.sections.length; i++) { if(toolbar.sections[i].name == "Build Config") { buildConfigSectionNum = i; } }
        if(buildConfigSectionNum == -1) { alert("Unable to batch build: error locating section 'Build Config'"); }
        toolbar.sections[buildConfigSectionNum].name="BATCH BUILD MODE!!!";
        toolbar.select(toolbar.sections[buildConfigSectionNum]);
        // HACK: We can't click the build button right away because of the transition
        // above. If we click the build button right away then we won't
        // have the full build transition handled.

        var StartBuild = function() 
        { 
            // Automated builds always build in release mode.
            // but you can override that if need be.
            document.getElementById("buildTypeOption").value="release";
            if(myArgs.indexOf('debug') > -1) {
                document.getElementById("buildTypeOption").value="debug";
            }

            if(myArgs.indexOf('demo') > -1) {
                var isDemo="true";
            }

            document.getElementById("demoOption").value=isDemo;

            // Click the build button!
            toolbar.sections[buildConfigSectionNum].name="BATCH BUILD MODE: Initiating Build";
            document.getElementById("buildClick").click();
            // NOTE: Exit is handled by a parallel check at the
            //       end of the build runner as it is tearing
            //       down the build indicator.

        }

        var WaitForPageLoad = function()
        {
            if(!document.getElementById("buildTypeOption") || !document.getElementById("demoOption") || !document.getElementById("buildClick")) {
                setTimeout(WaitForPageLoad, 1000);
            } else {
                setTimeout(StartBuild, 2000);
            }
        }

        setTimeout(WaitForPageLoad, 1000);
    } else {
        // For the normal UI flow, go to the project select screen.
        toolbar.select(toolbar.sections[0]);
    }

    return toolbar;
})
