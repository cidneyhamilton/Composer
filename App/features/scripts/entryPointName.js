define(function(require){
    var dialog = require('plugins/dialog');

    var Modal = function(){
        this.name = 'New Entry Point';
    };

    Modal.prototype.ok = function(){
        dialog.close(this, this.name);
    };

    Modal.prototype.cancel = function(){
        dialog.close(this);
    };

    Modal.show = function(){
        return dialog.show(new Modal());
    };

    return Modal;
});