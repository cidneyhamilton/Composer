define(function (require) {
    var assetDatabase = require('infrastructure/assetDatabase');
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.actorId = attributes.actorId || null;
    };

    ctor.type = 'variables.killCount';
    ctor.prototype.displayName = 'killCount';

    ctor.prototype.getDescription = function() {
    	var desc = "Actor";
        if (this.actorId == null) {
            return "No Actor";
        }

        var that = this;
	      var results = assetDatabase.actors.entries.filter(function(item){
                return item.id == that.actorId;
            });

        return results[0].displayName;
    }

    return ctor;
});