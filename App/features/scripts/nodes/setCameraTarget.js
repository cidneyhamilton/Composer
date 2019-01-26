define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.actorId = attributes.actorId || null;
        this.time = attributes.time || 0;
        this.translateX = attributes.translateX || 0;
        this.translateY = attributes.translateY || 0;
        this.translateZ = attributes.translateZ || 0;
        this.postWaitTime = attributes.postWaitTime || 0;
        this.wait = attributes.wait;
        this.scope = attributes.scope || 'relative';
    };

    // Upgrade legacy term
    if (this.scope == 'root') {
        this.scope = 'relative';
    }

    ctor.type = 'nodes.setCameraTarget';
    ctor.displayName = 'Set Camera Target';

    return ctor;
});