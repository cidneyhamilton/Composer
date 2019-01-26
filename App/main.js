requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal':'../Scripts/durandal/js',
        'plugins' : '../Scripts/durandal/js/plugins',
        'transitions' : '../Scripts/durandal/js/transitions',
        'knockout': '../Scripts/knockout-3.0.0rc',
        'bootstrap': '../Scripts/bootstrap',
        'jquery': '../Scripts/jquery-1.9.1',
        'toastr': '../Scripts/toastr',
        'jqueryui':'../Scripts/jquery-ui',
        'jsplumb':'../Scripts/jquery.jsPlumb-1.3.16-all-min',
        'papaparse':'../Scripts/papaparse-4.6.min',
        'touchable':'../Scripts/touchable',
        'speakingurl':'../Scripts/speakingurl.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jqueryui':{
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jsplumb':{
            deps: ['jquery'],
            exports: 'jsPlumb'
        },
        'touchable':{
            deps: ['jquery'],
            exports: 'jQuery'
        }
    },
    // waitSeconds is used to determine how long require.js will wait for a required resource to be loaded.
    // The default is 7 seconds, according to http://requirejs.org/docs/api.html#config-waitSeconds
    // Unfortunately, some of Composer's files take FOREVER to load (since it parses every *.json file)
    // On some systems, this seems to cause Composer to timeout / fail to load on a fresh boot
    // (it's usually faster once some of the files are loaded in ram)
    // Setting the value to 0 disables the timeout. 
    // This means that if Composer gets fubar'd (ex: due to bad data), it'll just be stuck loading forever.
    // So for now, let's set it to 30 seconds per resource, and adjust upwards (or to 0) if needed.
    waitSeconds: 30
});

define('nw.gui', window.gui);
delete window.gui;

define(function(require) {
    var app = require('durandal/app'),
        system = require('durandal/system'),
        viewLocator = require('durandal/viewLocator'),
        toastr = require('toastr');

    require('bootstrap');
    require('jqueryui');
    require('jsplumb');
    require('touchable');

    system.debug(true);

    app.title = 'Hero-U Composer';

    app.configurePlugins({
        dialog: true,
        widget: true,
        observable:true
    });

    app.start().then(function() {
        toastr.options.positionClass = "toast-bottom-right";

        viewLocator.translateViewIdToArea = function(viewId, area) {
            return area + "/" + viewId;
        };

        app.setRoot('shell/index', 'entrance');
    });
});