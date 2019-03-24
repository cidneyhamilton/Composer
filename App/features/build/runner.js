define(function(require){
    var path = requireNode('path'),
        WorkIndicator = require('infrastructure/workIndicator'),
        fileSystem = require('infrastructure/fileSystem'),
        dialog = require('plugins/dialog'),
        system = require('durandal/system'),
        selectedGame = require('features/projectSelector/index');

    function cleanDirs(context) {

        context.indicator.message = 'Initializing...';

        return system.defer(function(task) {

            // Can't blindly clean these directories, beccause there are
            // checked-in, non-generated files mixed in with the generated ones.

            // These have Music, Vignette, etc. files
            //fileSystem.clearDirectory(context.dataOutputDirectory);

            // These have non-generate .cs (C#) files
            //fileSystem.clearDirectory(context.codeOutputDirectory);
            //fileSystem.clearDirectory(context.editorOutputDirectory);

            // This contains Unity .meta file(s).
            //fileSystem.clearDirectory(context.localizationOutputDirectory);

            // These should only contain generated data, but apparently they don't.
            // And this causes issues on some systems?
            // Commenting out.
            //fileSystem.clearDirectory(context.dataOutputDirectory + "/scripts");
            //fileSystem.clearDirectory(context.internalDocOutputDirectory);

            //fileSystem.clearDirectory(context.reportsOutputDirectory);

            if(fileSystem.exists(context.doneFile)) {
                fileSystem.remove(context.doneFile);
            }

            // These directories / files are autogenerated (not checked in).
            // If they don't currently exist, create them.
            fileSystem.makeDirectory(context.internalDocOutputDirectory);
            fileSystem.makeDirectory(context.reportsOutputDirectory);

            setTimeout(function() { task.resolve(); }, 100);
        });
    }

    function runner(id, context, data1, data2, data3){
        return function(){
            return system.acquire(id).then(function(task){
                return task.run(context, data1, data2, data3);
            });
        }
    }

    function codeId(project, name){
        return 'features/build/' + project.build.targetPlatform + '/' + project.build.targetLanguage + '/' + name;
    }

    return {
        // This is the thing that actually does the build!
        run:function(project, mode){
            var indicator = new WorkIndicator();
            dialog.show(indicator);

            var completed = [];
            var context = {
                startTime: new Date(),
                completed: completed,
                project:project,
                mode: mode,
                indicator:indicator,
                game: selectedGame.activeProject,
                dataOutputDirectory:path.resolve(selectedGame.activeProject.dir, project.build.dataOutputDirectory),
                codeOutputDirectory:path.resolve(selectedGame.activeProject.dir, project.build.codeOutputDirectory),
                codeGenOutputDirectory:path.resolve(selectedGame.activeProject.dir, project.build.codeGenOutputDirectory),
                editorOutputDirectory:path.resolve(selectedGame.activeProject.dir, project.build.editorOutputDirectory),
                localizationOutputDirectory:path.resolve(selectedGame.activeProject.dir, project.build.localizationOutputDirectory),
                translationOutputDirectory:path.resolve(selectedGame.activeProject.dir, project.build.translationOutputDirectory),
                internalDocOutputDirectory:path.resolve(selectedGame.activeProject.dir, project.build.internalDocOutputDirectory),
                inkOutputDirectory:path.resolve(selectedGame.activeProject.dir, project.build.inkOutputDirectory),
                reportsOutputDirectory: path.join(path.resolve(selectedGame.activeProject.dir, project.build.internalDocOutputDirectory), 'Reports'),
                doneFile: path.join(path.resolve(selectedGame.activeProject.dir, project.build.internalDocOutputDirectory), 'buildDone.txt'),
                getJsonSpacing:function(){
                    return this.mode == 'debug' ? 4 : undefined
                }
            };

            return cleanDirs(context)
                .then(runner('features/build/data/generateAddlOutput', context))
                .then(runner('features/build/data/buildDone', context, 1))
                .then(function(){
                    // Try to wait for files to be written.
                    // Node doesn't offer a flush() command so there's no way
                    // to guess when the files will actually be committed to disk.
                    // This is a hacky method in hopes that Node will write in FIFO order
                    // and that the last file will be created only when all of the others are completed.
                    while (!fileSystem.exists(context.doneFile)) {
                        setTimeout(function() { }, 500);
                    }
                    // Here is where we close the build indicator.
                    dialog.close(indicator);

                    // BATCH MODE CHECK!
                    // In batch builds we want to shutdown after the build.
                    var myArgs = require('nw.gui').App.argv;
                    if(myArgs.indexOf('batchBuild') > -1)
                    {
                        // Shutdown at some point in the future giving lots of time
                        // for data to flush to disk! This is a problem as we don't
                        // know when all data has fully flushed to the HD.
                        setTimeout(function() {  window.close(true); }, 30000);
                    }
                });
        }
    };
});
