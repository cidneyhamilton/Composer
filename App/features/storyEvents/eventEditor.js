define(function(require) {
    var Editor = require('features/shared/editor'),
        EventDetail = require('./eventDetail');

    var ctor = function(owner, entry) {
        Editor.call(this, owner, entry, new EventDetail(), 'storyEventId');
    };

    Editor.baseOn(ctor);

    return ctor;
});