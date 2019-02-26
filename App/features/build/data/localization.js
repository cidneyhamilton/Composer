define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system'),
        db = require('infrastructure/assetDatabase'),
        CSVWriter = require('infrastructure/csvWriter'),
        papaParse = require('papaparse'),
        reporter = require('features/build/data/report')
        ;

    function processEntry(entry, context){
        entry.open();
        var group = entry.item;

        group.entries.forEach(function(locEntry){
            context.addLocalizationEntry(locEntry.id, locEntry.value, locEntry.notes);
        });

        entry.close();
    }

    return {
        run:function(context, localizationTable, translationTable, translationTableKeys){
            context.indicator.message = 'Creating localization file...';

            return system.defer(function(dfd){
                var i = -1;
                var len = db.localizationGroups.entries.length;
                var current;

                function next(){
                    i++;

                    if(i < len){
                        current = db.localizationGroups.entries[i];
                        processEntry(current, context);
                        next();
                    } else {
                        // This will be used to parse labels with {x} input params
                        var labelWithParamInputRegex = /{\d+}(?=)/g;

                        // Generate the English translation master file
                        var translationsDir = path.join(context.translationOutputDirectory, '/Translations');

                        if (!fileSystem.exists(translationsDir)) {
                            fileSystem.makeDirectory(translationsDir);
                        }

                        var enUsTranslationFileDir = path.join(translationsDir, '/en-US');

                        if (!fileSystem.exists(enUsTranslationFileDir)) {
                            fileSystem.makeDirectory(enUsTranslationFileDir);
                        }

                        var enUsTranslationFile = path.join(enUsTranslationFileDir, '/translation.csv');
                        var translationGoldFileWriter = CSVWriter.createFileWriter(enUsTranslationFile);
                        var translationHeaders = [ { 0: 'Original Text', 1: 'Translation', 2 : 'Speaker (DO NOT TRANSLATE)',  3: 'Translation Notes (DO NOT TRANSLATE)', 4: 'Keys (DO NOT TRANSLATE OR DELETE)' }]
                        translationGoldFileWriter.writeRecord(translationHeaders);

                        // Ensure the translation file rows are always in the same order (by default, it's just "wherever Composer chooses to order them")
                        translationTableKeys.sort();

                        for (var keyIndex in translationTableKeys) {
                            var key = translationTableKeys[keyIndex];
                            // Remove duplicate values for the same text, and ensure the speakers + ids are in sorted order for better translation consistency
                            translationTable[key].speakers = translationTable[key].speakers.filter(function(item, i, ar){ return ar.indexOf(item) === i; }).sort();
                            translationTable[key].notes = translationTable[key].notes.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
                            translationTable[key].ids = translationTable[key].ids.filter(function(item, i, ar){ return ar.indexOf(item) === i; }).sort();
                            translationGoldFileWriter.writeRecord([translationTable[key]]);
                        }
                        translationGoldFileWriter.end();

                        // Generate the English game_text file; after that's done, copy over all the localized game output files
                        var localizedGoldFilesDir = path.join(context.translationOutputDirectory, '/Locales');

                        if (!fileSystem.exists(localizedGoldFilesDir)) {
                            fileSystem.makeDirectory(localizedGoldFilesDir);
                        }

                        var enUsGoldFileDir = path.join(localizedGoldFilesDir, '/en-US');

                        if (!fileSystem.exists(enUsGoldFileDir)) {
                            fileSystem.makeDirectory(enUsGoldFileDir);
                        }

                        var enUsGoldFile = path.join(enUsGoldFileDir, '/game_text.txt');
                        var enUsGoldFileWriter = CSVWriter.createFileWriter(enUsGoldFile, function() {
                            fileSystem.copyDirectory(localizedGoldFilesDir, context.localizationOutputDirectory);

                            context.completed.push('features/build/data/localization');
                        });

                        // Persist the keys and their order from the gold file
                        var localizationGoldKeys = {};
                        var localizationGoldKeyOrder = [];
                        for(var key in localizationTable){
                            localizationGoldKeys[key] = false;
                            localizationGoldKeyOrder.push(key);
                        }

                        // Sort the keys for easier comparison
                        localizationGoldKeyOrder.sort();

                        // Set up the translation error report
                        var translationErrors = reporter.create('badTranslations');

                        // Convert data from the translation format into the localization format

                        fileSystem.readDir(translationsDir).forEach(function(language,index){
                            // Skip the English one, it's generated by translationGoldFileWriter
                            if ("en-US" == language) {
                                return;
                            }

                            var translatedLanguageFile = path.join(translationsDir, "/" + language + "/translation.csv");
                            var toBeLocalizedFile = path.join(localizedGoldFilesDir, "/" + language + "/game_text.txt");
                            var toBeLocalizedFileWriter = CSVWriter.createFileWriter(toBeLocalizedFile);
                            var toBeLocalized = {};

                            // Format: (see "var translationHeaders" above).  We are interested in 1 (Translation) and 4 (Keys).
                            var translatedText = papaParse.parse(fileSystem.read(translatedLanguageFile), { skipEmptyLines: true });                           

                            // If there were errors during parsing, add them to the error doc
                            translatedText.errors.forEach(function(err) {
                                /** papaParse.errors format, from https://www.papaparse.com/docs#errors
                                    {
                                        type: "",     // A generalization of the error
                                        code: "",     // Standardized error code
                                        message: "",  // Human-readable details
                                        row: 0,       // Row index of parsed data where error is
                                    }
                                **/
                                var errText = "Row: [" + err.row + "] Code:[" + err.code + "] Type: [" + err.type + "] message: [" + err.message + "]";
                                translationErrors.log(language, 'Parsing error(s)', errText);
                            });

                            // For each line in the translation.csv file...
                            translatedText.data.forEach(function(entry) {
                                // Ignore the header
                                if (translationHeaders[0][0] == entry[0]) {
                                    return;
                                }

                                // Get the GUIDs
                                var guids = entry[4].split(",");

                                // For each guid, generate a localized label for that entry in the expected format
                                guids.forEach(function(guid) {

                                    // Check if the key appears as a localizationGoldKey
                                    if (localizationGoldKeys[guid] != undefined) {
                                        // If the key has already been seen, log that as a dupe
                                        if(localizationGoldKeys[guid]) {
                                            translationErrors.log(language, 'Duplicate GUID(s) (more than one entry for the same GUID in the translation.csv file)', guid);
                                        }
                                        // If the original label had a parameter (ex: {0}), make sure the translated label does too.
                                        var originalLabelParams = localizationTable[guid][1].match(labelWithParamInputRegex);
                                        if(originalLabelParams != null) {
                                            originalLabelParams.sort();
                                            var localizedlabelParams = entry[0].match(labelWithParamInputRegex);
                                            var missingLocalizedLabelParams = [];
                                            var badLocalizedLabelParams = [];
                                            if (null == localizedlabelParams) {
                                                // If there were no label params in the localized label, they're all missing.
                                                missingLocalizedLabelParams = originalLabelParams;
                                            } else {
                                                // The ordering of the params may be different between languages (due to language grammer),
                                                // we just want to ensure they're all present.
                                                badLocalizedLabelParams = localizedlabelParams.slice(0);
                                                originalLabelParams.forEach(function(labelParam) {
                                                    if (localizedlabelParams.indexOf(labelParam) == -1) {
                                                        missingLocalizedLabelParams.push(labelParam);
                                                    } else {
                                                        badLocalizedLabelParams.splice(badLocalizedLabelParams.indexOf(labelParam), 1);
                                                    }
                                                });
                                            }

                                            // If the params were missing, or there are unexpected label params in the localized label, log an error.
                                            if (missingLocalizedLabelParams.length > 0 || badLocalizedLabelParams.length > 0) {
                                                translationErrors.log(language, 'Mistranslated label - missing or unknown format params.  Expected the following params: ' + originalLabelParams, entry[0]);
                                            }
                                        }

                                        localizationGoldKeys[guid] = true;
                                        toBeLocalized[guid] = [guid, entry[0]];
                                    } else {
                                        // If this key is not a localization gold key...
                                        translationErrors.log(language, 'Unknown GUID(s) - possibly removed from English master', guid);
                                    }

                                });
                            });

                            // Once we've built a table with all of the localized rows, 
                            // write them to the localized file with the same ordering as the English file.
                            for (var lgkIndex in localizationGoldKeyOrder) {
                                var lgk = localizationGoldKeyOrder[lgkIndex];
                                // If the key was missing in this language, add it to the list of missing keys
                                if (! localizationGoldKeys[lgk]) {
                                    translationErrors.log(language, 'Missing (untranslated) GUID(s)', lgk);
                                }  else {
                                    toBeLocalizedFileWriter.writeRecord([toBeLocalized[lgk]]);
                                }
                                // Reset the value for the next language
                                localizationGoldKeys[lgk] = false;
                            }
                            toBeLocalizedFileWriter.end();
                        });

                        translationErrors.write(context.reportsOutputDirectory);

                        // Writing the gold file at the end so the copy will hopefully only kickoff after everything else has been written
                        for (var lgkIndex in localizationGoldKeyOrder) {
                            var lgk = localizationGoldKeyOrder[lgkIndex];
                            enUsGoldFileWriter.writeRecord([localizationTable[lgk]]);
                        }

                        enUsGoldFileWriter.end();

                        dfd.resolve();
                    }
                }

                next();
            }).promise();
        }
    };
});