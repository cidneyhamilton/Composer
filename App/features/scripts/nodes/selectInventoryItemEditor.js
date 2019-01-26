define(function(require) {
    var NodeEditor = require('./nodeEditor');

    var ctor = function() {
        NodeEditor.call(this);
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});