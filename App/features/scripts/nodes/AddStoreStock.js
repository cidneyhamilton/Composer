define(function(require) {
    var system = require('durandal/system');

   var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.qty = attributes.qty || 0;
        this.buyPrice = attributes.buyPrice || 0;
        this.sellPrice = attributes.sellPrice || 0;
        this.restock = attributes.restock || false;
        this.availability = attributes.availability || "1+";
        this.category = attributes.category || 0;
        this.onLookField = attributes.onLookField || "On Look Description";
        this.onPurchaseField = attributes.onPurchaseField || "On Purchase Description";
    };

    ctor.type = 'nodes.addStoreStock';
    ctor.displayName = 'Add Store Stock';

    ctor.prototype.localize = function(context){
        // If it's the default onlook / onPurchase, don't translate it.  Just return blank.
        context.addLocalizationEntry(this.propId + "_OnLook", ("On Look Description" == this.onLookField ? "" : this.onLookField));
        delete this.onLookField;

        context.addLocalizationEntry(this.propId + "_OnPurchase", ("On Purchase Description" == this.onPurchaseField ? "" : this.onPurchaseField));
        delete this.onPurchaseField;
    };

    return ctor;
});