define(function(require) {
    var fs = requireNode('fs'),
        system = require('durandal/system');

    function exists(fileName) {
        return fs.existsSync(fileName);
    }

    function makeDirectory(path) {
        try {
            fs.mkdirSync(path, { recursive: true});
        } catch (err) {
            // If the error wasn't just "this directory already existed",
            // show the error.
            if ( err.code != 'EEXIST' ) {
                system.error("Directory Create failed: " + err);
            }
        }
    }

    function read(path) {
        try {
            return fs.readFileSync(path).toString('utf8').replace(/^\uFEFF/, '');
        } catch (err) {
            system.error("Read failed: " + err);
            return;
        }
    }

    function readDir(path) {
        try {
            return fs.readdirSync(path);
        } catch (err) {
            system.error("Directory Read failed: " + err);
            return;
        }
    }

    function write(fileName, data) {
        try {
            data = data.toString('utf8').replace(/^\uFEFF/, '');
            // Only write if the file either doesn't exist, or has been updated
            if (!exists(fileName) || data != String(read(fileName))) {
                fs.writeFileSync(fileName, data);
            }
        } catch (err) {
            system.error("Write failed: " + err);
        }
    }

    function remove(fileName) {
        try {
            fs.unlinkSync(fileName);
        } catch (err) {
            // If the error wasn't just "this file already deleted",
            // show the error.
            if ( err.code != 'ENOENT' ) {
                system.error("Delete failed: " + err);
            }
        }
    }

    function clearDirectory(path) {
        try {
            if (exists(path)) {
                readDir(path).forEach(function(file,index){
                    var curPath = path + "/" + file;
                    if (isDirectory(curPath)) {
                        clearDirectory(curPath);
                    } else {
                        remove(curPath);
                    }
                });
            } else {
                makeDirectory(path);
            }
        } catch (err) {
            system.error("Clear Directory failed: " + err);
        }
    }

    function copyDirectory(src, dest) {
        try {
            if (!exists(dest)) {
                makeDirectory(dest);
            }
            readDir(src).forEach(function(file,index){
                var srcPath = src + "/" + file;
                var destPath = dest + "/" + file;
                if (fs.lstatSync(srcPath).isDirectory()) {
                    copyDirectory(srcPath, destPath);
                } else {
                    write(destPath, read(srcPath));
                }
            });
        } catch (err) {
            system.error("Copy Directory failed: " + err);
        }
    }

    function isDirectory(file) {
        return fs.lstatSync(file).isDirectory();
    }

    return {
        exists: function(fileName) {
            return exists(fileName);
        },
        makeDirectory: function(path) {
            makeDirectory(path);
        },
        read: function(path) {
            return read(path);
        },
        readDir: function(path) {
            return readDir(path);
        },
        write: function(fileName, data) {
            write(fileName, data);
        },
        remove: function(fileName) {
            remove(fileName);
        },
        clearDirectory: function(path) {
            clearDirectory(path);
        },
        copyDirectory: function(src, dest) {
            copyDirectory(src, dest);
        }
    };
});