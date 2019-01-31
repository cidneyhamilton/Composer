define(function(require) {
    var app = require('durandal/app'),
        system = require('durandal/system'),
        activator = require('durandal/activator'),
        assetDatabase = require('infrastructure/assetDatabase'),
        bindingHandlers = require('infrastructure/bindingHandlers'),
        $ = require('jquery'),
        gui = require('nw.gui');

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

    bindingHandlers.install();

    var shell = {
        activeDocument: activator.create(),
        activate: function() {
        }
    };

    app.on('app:navigate:loadProject').then(function(project) {
        shell.activeProjectDir = project.dir;
        shell.activeProjectFormat = project.format;        
            return $.when(
                assetDatabase.load(),
                installFeatures(),
                system.wait(1000)
            );
    });

    app.on('app:navigate:feature').then(function(metadata) {
        system.acquire(metadata.moduleId).then(function(section) {
            section.metadata = metadata;
            shell.activeDocument.activateItem(section);
        });
    });

    app.on('app:navigate:screen').then(function(screen) {
        shell.activeDocument.activateItem(screen);
    });

    var win = gui.Window.get();

    win.on('close', function() {
        var doc = shell.activeDocument();

        if(doc && doc.canDeactivate){
            var result = doc.canDeactivate();
            if(result.then){
                result.then(function(actualResult){
                    if(actualResult){
                        if(doc.deactivate){
                            result = doc.deactivate();
                            if(result.then){
                                result.then(function(){
                                    win.close(true);
                                });
                            }else{
                                win.close(true);
                            }
                        }else{
                            win.close(true);
                        }
                    }
                });
            }else if(result){
                if(doc.deactivate){
                    result = doc.deactivate();
                    if(result && result.then){
                        result.then(function(){
                            win.close(true);
                        });
                    }else{
                        win.close(true);
                    }
                }else{
                    win.close(true);
                }
            }
        }else{
            win.close(true);
        }
    });

    return shell;
});