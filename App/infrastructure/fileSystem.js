define(function(require) {
    var fs = requireNode('fs'),
        path = requireNode('path'),
        system = require('durandal/system'),
        baseWriter = require('features/build/baseWriter');

    function exists(fileName) {
        return fs.existsSync(fileName);
    }

    function makeDirectory(dir) {
        // Composer currently uses node-webkit v8
        // They added options to fs.mkdirSync in v10, but it broke Composer's css styling
        // (since Durandal apparently was only designed with an older Node version in mind)
        // In node-webkit v13, they removed the toolbar, so we can't upgrade past that 
        // No idea what versions of Node our Mac / Linux devs are running,
        // so...  we're just going to *sigh* reinvent the wheel here
        // and roll our own stupid recursive mkdir

        // If the dir exists, return.
        if (exists(dir)) {
            return;
        }

        // Check if the dir's parent exists
        var parentDir = path.join(dir, '../');
        if (!exists(parentDir)) {
            makeDirectory(parentDir);
        }

        try {
            fs.mkdirSync(dir);
        } catch (err) {
            // If the error wasn't just "this directory already existed",
            // show the error.
            if ( err.code != 'EEXIST' ) {
                system.error("Directory Create failed: " + err);
            }
        }
    }

    function read(dir) {
        try {
            return fs.readFileSync(dir).toString('utf8').replace(/^\uFEFF/, '');
        } catch (err) {
            system.error("Read failed: " + err);
            return;
        }
    }

    function readDir(dir) {
        try {
            return fs.readdirSync(dir);
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
                // fs.writeFileSync doesn't support callbacks or guarantee flush,
                // so using baseWriter / writeFileStream so we can track the (theoretical) flush
                var writer = baseWriter.createFileWriter(fileName);
                writer.write(data);
                writer.end();
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

    function clearDirectory(dir) {
        try {
            if (exists(dir)) {
                readDir(dir).forEach(function(file,index){
                    var curDir = dir + "/" + file;
                    if (isDirectory(curDir)) {
                        clearDirectory(curDir);
                    } else {
                        remove(curDir);
                    }
                });
            } else {
                makeDirectory(dir);
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
        makeDirectory: function(dir) {
            makeDirectory(dir);
        },
        read: function(dir) {
            return read(dir);
        },
        readDir: function(dir) {
            return readDir(dir);
        },
        write: function(fileName, data) {
            write(fileName, data);
        },
        remove: function(fileName) {
            remove(fileName);
        },
        clearDirectory: function(dir) {
            clearDirectory(dir);
        },
        copyDirectory: function(src, dest) {
            copyDirectory(src, dest);
        }
    };
});