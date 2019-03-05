define(function(require){
    var path = requireNode('path'),
        NestedReportWriter = require('features/build/nestedReportWriter');

    var ctor = function (fileName) {
    	this.filename = fileName;
        this.WithParamsMap = {}; // Map[Usage, List[Parameters]] to display the usage names in a consistent order
        this.FullMap = {};       // Map of [Usage][Parameters][Source]
        this.UsageList = [];     // List of [Usage] used to display the Usage in a consistent order 
    }

    ctor.prototype.log = function(lvl1, lvl2, lvl3) {
        if (!this.FullMap[lvl1]) {
            this.FullMap[lvl1] = {};
            this.WithParamsMap[lvl1] = [];
            this.UsageList.push(lvl1);
        }
        if (!this.FullMap[lvl1][lvl2]) {
            this.FullMap[lvl1][lvl2] = {};
            this.WithParamsMap[lvl1].push(lvl2);
        }
        if (lvl3 ) {
            if (!this.FullMap[lvl1][lvl2][lvl3]) {
                this.FullMap[lvl1][lvl2][lvl3] = true;
            }
        }
    };

    ctor.prototype.write = function(directory) {
        this.UsageList.sort();

        var writer = NestedReportWriter.createFileWriter(path.join(directory, this.filename + '.txt'));

        for(var i in this.UsageList){
            var usage = this.UsageList[i];
            this.WithParamsMap[usage].sort();
            writer.writeReport(usage, this.WithParamsMap[usage], this.FullMap[usage]);
        }

        writer.end();
    };

    ctor.create = function(filename) {
        return new ctor(filename);
    };

    return ctor;
});