define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    function async(fn) {
        setTimeout(fn, 20);
    }

    function yieldingSelect(items, select, callback) {
        var i = 0, length = items.length, selected = [];
        async(function() {
            //Work on collection for 50ms
            for (var start = +new Date; i < length && ((+new Date) - start < 50); i++) {
                var current = items[i];
                if (select.call(current, current, i)) {
                    selected.push(current);
                }
            }

            // When the 50ms is up, let the UI thread update by defering the
            // rest of the iteration with `async`.
            if (i < length) {
                async(arguments.callee);
            } else {
                callback(selected);
            }
        });
    }

    var ctor = function(owner, filterProperty, filterValue) {
        this.owner = owner;
        this.filterProperty = filterProperty;
        this.filterValue = filterValue;
        this.scripts = [];

        var that = this;
        yieldingSelect(assetDatabase.scripts.entries, function(entry) {
            return entry[filterProperty] === filterValue;
        }, function(filteredData) {
            if (that.displaying) {
                that.scripts = filteredData;
            } else {
                that.filteredScripts = filteredData;
            }
        });
    };

    ctor.prototype.attached = function() {
        this.displaying = true;
        if (this.filteredScripts) {
            this.scripts = this.filteredScripts;
        }
    };

    ctor.prototype.create = function() {
        var that = this;
        this.owner.itemEntry.save(true);
        that.owner.create();
    };

    ctor.prototype.edit = function(entry) {
        this.owner.edit(entry);
    };

    ctor.prototype.remove = function(entry) {
        var that = this;

        return entry.remove().then(function(success) {
            console.log(success);
            
            // HACK(Joshua)
            // Lets refilter the scripts
             if(typeof variable_here === 'undefined' || success == true) {

                console.log("Remove entry");
                that.scripts.remove(entry);

                // Refilter
                var lst = [];
                for(var i in assetDatabase.scripts.entries)
                {
                    var e = assetDatabase.scripts.entries[i];
                    if (e[that.filterProperty] == that.filterValue)
                    {
                        lst.push(e);
                    }
                }
                that.scripts = lst;

            }

            return success;
        });
    };

    return ctor;
});