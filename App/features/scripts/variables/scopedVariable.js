define(function (require) {

    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || '';
        this.scope = attributes.scope || 'script';
        this.scopeId = attributes.scopeId;
        this.sceneId = attributes.sceneId;
    };

    ctor.type = 'variables.scopedVariable';
    ctor.prototype.displayName = 'Variable Value';

    ctor.prototype.getDescription = function(){
    	var desc = "Variable value: '" + this.name + "'";			
				
		var that = this;
				
        if (this.scope == 'prop') 
		{
			desc += " from prop ";
            if (that.scopeId == null) 
			{
                desc += "Undefined";
            } 
			else 
			{
                var results = assetDatabase.props.entries.filter(function(item){
                    return item.id == that.scopeId;
                });

                desc += '(' + results[0].name + ')';

                if (that.sceneId == null) {
                    desc += " in Undefined"
                } else {
                    var results = assetDatabase.scenes.entries.filter(function(item){
                        return item.id == that.sceneId;
                    });

                    desc += ' in (' + results[0].name + ')';
                }
            }
        }
		else
		{
			desc += '(' + this.scope + 'scope )';
		}
		
        return desc;
    }

    return ctor;
});