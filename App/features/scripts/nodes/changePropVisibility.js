define(function (require) {
    var system = require('durandal/system');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.propId = attributes.propId;
        this.sceneId = attributes.sceneId || currentSceneId;
        this.visible = attributes.visible;  // Deprecated use status instead.
        this.status = attributes.status || 'Visible';
        this.wait = attributes.wait;

        if (this.wait === null || this.wait === undefined) {
            this.wait = true;
        }

        // Patch old data
        if (this.visible === true) {
            this.status = 'Visible'
        }
        if (this.visible === false) {
            this.status = 'Hidden'
        }
    };



    ctor.type = 'nodes.changePropVisibility';
    ctor.displayName = 'Prop Status';

    return ctor;
});