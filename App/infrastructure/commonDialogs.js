define(function(require){
    var system = require('durandal/system'),
        $ = require('jquery');

    function choose(attr) {
        return system.defer(function(dfd){
            var ele  = $('<input style="display: none" type="file" ' + attr + ' />');
            $('body').append(ele);

            ele.change(function() {
                ele.remove();
                dfd.resolve(ele.val());
            });

            ele.trigger('click');
        }).promise();
    }

    return {
        chooseDirectory:function(){
            return choose('nwdirectory');
        }
    };
});