define(function (require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.target = attributes.target || 'money';

        // The following attributes are unused
        this.useArticle = attributes.useArticle || false;
        this.includeText = attributes.includeText || false;
        this.text = attributes.text || '';
    };

    ctor.type = 'variables.count';
    ctor.prototype.displayName = 'Count';

    // This is unused as nothing calls text
    /*
    ctor.prototype.localize = function (context) {
        if(this.includeText) {
            context.addLocalizationEntry(this.text, this.text)
        }
    };
    */

    ctor.prototype.getDescription = function(){
        var that = this;

        var desc = "Target: ";

        if ('money' == this.target) {
            desc += 'Money';
        } else {
            var prop = assetDatabase.props.lookup[that.target];
            // If we couldn't find a user-friendly name
            // (ex: that prop was deleted)
            // then at least return the ID.
            desc += (prop ? prop.name : this.target);
        }

        if (this.includeText) {
            desc += " Text: " + this.text;

            // This is unused 
            /*
            if (this.useArticle) {
                desc += " (Use Article)";
            }
            */
        }

        return desc;
    }

    return ctor;
});