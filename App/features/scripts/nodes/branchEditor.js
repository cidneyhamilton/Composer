define(function(require) {
    var NodeEditor = require('./nodeEditor'),
        BranchSection = require('./branchSection'),
        ko = require('knockout'),
        dialog = require('plugins/dialog');

    var ctor = function() {
        NodeEditor.call(this);
        this.pathClipboard = ctor.pathClipboard;
    };

    var deepCopy = false;

    NodeEditor.baseOn(ctor);

    ctor.prototype.addPathAfter = function(currPath) {
        this.addPath(currPath, 1);
    };

    ctor.prototype.addPathBefore = function(currPath) {
        this.addPath(currPath, 0);
    };

    ctor.prototype.addPath = function(currPath, offset) {
        var path = new BranchSection();
        var addIndex = Math.max(0, this.node.sections.indexOf(currPath) + offset);
        this.node.sections.splice(addIndex, 0, path);
    };

    ctor.prototype.removePath = function(Path){
        var that = this;
        dialog.showMessage('Are you sure you want to remove this path?', 'Remove', ['Yes', 'No']).then(function(result){
            if(result == 'Yes'){
                that.node.sections.remove(Path);
            }
        });
    };

    ctor.prototype.cutPath = function(currPath){
        var index = this.node.sections.indexOf(currPath);
        var removed = this.node.sections.splice(index, 1);
        deepCopy = false;
        this.pathClipboard(removed[0]);
    };

    ctor.prototype.copyPath = function(currPath){
        deepCopy = true;
        this.pathClipboard(currPath);
    };

    ctor.prototype.pastePathBefore = function(currPath){
        var index = this.node.sections.indexOf(currPath);

        var obj = ctor.pathClipboard();
        var newObj = deepCopy ? NodeEditor.DeepCopy(obj) : obj;

        this.node.sections.splice(index, 0, newObj);

        ctor.pathClipboard(null);
    };

    ctor.prototype.pastePathAfter = function(currPath){
        var index = this.node.sections.indexOf(currPath);

        var obj = ctor.pathClipboard();
        var newObj = deepCopy ? NodeEditor.DeepCopy(obj) : obj;

        this.node.sections.splice(index + 1, 0, newObj);

        ctor.pathClipboard(null);
    };

    ctor.pathClipboard = ko.observable();

    return ctor;
});
