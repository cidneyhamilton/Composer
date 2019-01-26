define(function(require) {
    var ctor = function() {
        this.name = 'Notes';
    };

    ctor.prototype.attached = function(view) {
        var html = this.item.notes,
            that = this,
            config = {
            extraPlugins: 'maxheight,onchange',
            removePlugins: 'resize, elementspath'
        };

        this.editor = CKEDITOR.appendTo('notes', config, html);
        this.editor.on('change', function(e) {
            that.item.notes = that.editor.getData();
        });
    };

    ctor.prototype.beforeSave = function() {
        if (this.editor) {
            this.item.notes = this.editor.getData();
        }
    };

    ctor.prototype.deactivate = function() {
        this.item.notes = this.editor.getData();
        this.editor.destroy();
        this.editor = null;
    };

    return ctor;
});