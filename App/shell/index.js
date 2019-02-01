define(function(require) {
    var app = require('durandal/app'),
        system = require('durandal/system'),
        activator = require('durandal/activator'),
        assetDatabase = require('infrastructure/assetDatabase'),
        bindingHandlers = require('infrastructure/bindingHandlers'),
        $ = require('jquery'),
        gui = require('nw.gui');

    bindingHandlers.install();

    var shell = {
        activeDocument: activator.create()
    };

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