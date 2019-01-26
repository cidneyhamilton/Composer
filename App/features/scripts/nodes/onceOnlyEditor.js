define(function(require) {
    var NodeEditor = require('./nodeEditor'),
        dialog = require('plugins/dialog');

    var ctor = function() {
        NodeEditor.call(this);
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});