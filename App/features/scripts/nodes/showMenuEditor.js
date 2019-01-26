define(function(require) {
    var NodeEditor = require('./nodeEditor'),
        dialog = require('plugins/dialog'),
        ko = require('knockout'),
        textOption = require('./options/textOption');

    var ctor = function() {
        NodeEditor.call(this);
        this.optionClipboard = ctor.optionClipboard;
    };

    var deepCopy = false;

    NodeEditor.baseOn(ctor);

    ctor.prototype.addOptionAfter = function(currOption) {
        this.addOption(currOption, 1);
    };

    ctor.prototype.addOptionBefore = function(currOption) {
        this.addOption(currOption, 0);
    };

    ctor.prototype.addOption = function(currOption, offset) {
        var option = new textOption();
        var addIndex = Math.max(0, this.node.options.indexOf(currOption) + offset);
        this.node.options.splice(addIndex, 0, option);

        // Hack
        if (currentPropId != null)
            option.ignoreChildAvailability = true;
    };

    ctor.prototype.removeOption = function(option){
        var that = this;
        dialog.showMessage('Are you sure you want to remove this option?', 'Remove', ['Yes', 'No']).then(function(result){
            if(result == 'Yes'){
                that.node.options.remove(option);
            }
        });
    };

    ctor.prototype.cutOption = function(currOption){
        var index = this.node.options.indexOf(currOption);
        var removed = this.node.options.splice(index, 1);
        deepCopy = false;
        this.optionClipboard(removed[0]);
    };

    ctor.prototype.copyOption = function(currOption){
        deepCopy = true;
        this.optionClipboard(currOption);
    };

    ctor.prototype.pasteOptionBefore = function(currOption){
        var index = this.node.options.indexOf(currOption);

        var obj = ctor.optionClipboard();
        var newObj = deepCopy ? NodeEditor.DeepCopy(obj) : obj;

        this.node.options.splice(index, 0, newObj);

        ctor.optionClipboard(null);
    };

    ctor.prototype.pasteOptionAfter = function(currOption){
        var index = this.node.options.indexOf(currOption);

        var obj = ctor.optionClipboard();
        var newObj = deepCopy ? NodeEditor.DeepCopy(obj) : obj;

        this.node.options.splice(index + 1, 0, newObj);

        ctor.optionClipboard(null);
    };

    ctor.optionClipboard = ko.observable();

    return ctor;
});

