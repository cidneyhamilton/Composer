define(function (require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.eventId = attributes.eventId || null;
    };

    ctor.prototype.getDescription = function () {
        var that = this;

        var storyEvent = assetDatabase.storyEvents.lookup[that.eventId] || { name: '???' };

        return 'during <span class="event">' + storyEvent.name + '</span>';
    };

    ctor.type = 'expressions.inEvent';
    ctor.displayName = 'In Event';

    return ctor;
});