define(function (require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.eventId = attributes.eventId || null;
    };

    ctor.prototype.getDescription = function () {
        var that = this;

        var results = assetDatabase.storyEvents.entries.filter(function (item) {
            return item.id == that.eventId;
        });

        var storyEvent = results[0] || { name: '???' };

        return 'during <span class="event">' + storyEvent.name + '</span>';
    };

    ctor.type = 'expressions.inEvent';
    ctor.displayName = 'In Event';

    return ctor;
});