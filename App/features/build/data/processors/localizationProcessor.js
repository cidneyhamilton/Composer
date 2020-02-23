define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'),
        baseWriter = require('features/build/baseWriter'),
        path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system'),
        CSVWriter = require('features/build/csvWriter'),
        papaParse = require('papaparse'),
        reporter = require('features/build/data/report');

    var ctor = function () {
        baseProcessor.call(this);
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        this.localizationDupes = {};
        this.localizationTable = {};
        this.translationTable = {};
        this.translationTableKeys = [];        
    };

    ctor.prototype.localize = function(context, asset, friendlyId) {
        var that = this;
        var clone = serializer.deserialize(serializer.serialize(asset));
        if (friendlyId) {
            clone.friendlyId = (friendlyId == null ? clone.name : friendlyId);
        }
        clone.localize(that);
    };

    ctor.prototype.addLocalizationEntry = function(id, text, notes, speaker) {
        // If the text was undefined, treat it as empty.
        if (text == undefined) {
            text = '';
        }
        var that = this;
        // If a localizationTable entry has been defined multiple times for different values...
        if (that.localizationTable.hasOwnProperty(id) && that.localizationTable[id][1] != text) {
            if (!that.localizationDupes[id]) {
                that.localizationDupes[id] = [];
                that.localizationDupes[id].push(that.localizationTable[id][1]);
            }
            that.localizationDupes[id].push(text);
        }
        that.localizationTable[id] = [id,text];

        // The translationTable is basically a reverse lookup of the localizationTable,
        // as the same text could be defined for multiple ids.
        if (!that.translationTable[text]) {
            that.translationTableKeys.push(text);
            that.translationTable[text] = { 0: text, translations : [], speakers : [], notes : [], ids : [] };
        }
        if (speaker) {
            that.translationTable[text].speakers.push(speaker);
        }
        if (notes) {
            that.translationTable[text].notes.push(notes);
        }
        that.translationTable[text].ids.push(id);
    };

    ctor.prototype.generateOutput = function(context) {
        // This will be used to parse labels with {x} input params
        var labelWithParamInputRegex = /{\d+}(?=)/g;

        // Generate the English translation master file
        var translationsDir = path.join(context.translationOutputDirectory, 'Translations');

        if (!fileSystem.exists(translationsDir)) {
            fileSystem.makeDirectory(translationsDir);
        }

        var enUsTranslationFileDir = path.join(translationsDir, 'en-US');

        if (!fileSystem.exists(enUsTranslationFileDir)) {
            fileSystem.makeDirectory(enUsTranslationFileDir);
        }

        var enUsTranslationFile = path.join(enUsTranslationFileDir, 'translation.csv');
        var translationGoldFileWriter = CSVWriter.createFileWriter(enUsTranslationFile);
        var translationHeaders = [ { 0: 'Original Text', 1: 'Translation', 2 : 'Speaker (DO NOT TRANSLATE)',  3: 'Translation Notes (DO NOT TRANSLATE)', 4: 'Keys (DO NOT TRANSLATE OR DELETE)' }]
        translationGoldFileWriter.writeRecord(translationHeaders);

        // Ensure the translation file rows are always in the same order (by default, it's just "wherever Composer chooses to order them")
        this.translationTableKeys.sort();

        for (var keyIndex in this.translationTableKeys) {
            var key = this.translationTableKeys[keyIndex];
            // Remove duplicate values for the same text, and ensure the speakers + ids are in sorted order for better translation consistency
            this.translationTable[key].speakers = this.translationTable[key].speakers.filter(function(item, i, ar){ return ar.indexOf(item) === i; }).sort();
            this.translationTable[key].notes = this.translationTable[key].notes.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
            this.translationTable[key].ids = this.translationTable[key].ids.filter(function(item, i, ar){ return ar.indexOf(item) === i; }).sort();
            translationGoldFileWriter.writeRecord([this.translationTable[key]]);
        }
        translationGoldFileWriter.end();

        // Generate the English game_text file; after that's done, copy over all the localized game output files
        var localizedGoldFilesDir = path.join(context.translationOutputDirectory, 'Locales');

        if (!fileSystem.exists(localizedGoldFilesDir)) {
            fileSystem.makeDirectory(localizedGoldFilesDir);
        }

        // var localizedLanguageListWriter = baseWriter.createFileWriter(path.join(localizedGoldFilesDir, 'supportedLanguages.txt'));

        var enUsGoldFileDir = path.join(localizedGoldFilesDir, 'en-US');

        if (!fileSystem.exists(enUsGoldFileDir)) {
            fileSystem.makeDirectory(enUsGoldFileDir);
        }

        var enUsGoldFile = path.join(enUsGoldFileDir, 'game_text.txt');
        var enUsGoldFileWriter = CSVWriter.createFileWriter(enUsGoldFile, function() {
            fileSystem.copyDirectory(localizedGoldFilesDir, context.localizationOutputDirectory);
        });

        // Persist the keys and their order from the gold file
        var localizationGoldKeys = {};
        var localizationGoldKeyOrder = [];
        for(var key in this.localizationTable){
            localizationGoldKeys[key] = false;
            localizationGoldKeyOrder.push(key);
        }

        // Sort the keys for easier comparison
        localizationGoldKeyOrder.sort();

        // Set up the translation error report
        var translationErrors = reporter.create('badTranslations');

        // Convert data from the translation format into the localization format

        fileSystem.readDir(translationsDir).forEach(function(language,index){
            // localizedLanguageListWriter.write(language +  "\r\n");

            // Skip the English one, it's generated by translationGoldFileWriter
            if ("en-US" == language) {
                return;
            }

            var toBeLocalizedDir = path.join(localizedGoldFilesDir, language);
            if (!fileSystem.exists(toBeLocalizedDir)) {
                fileSystem.makeDirectory(toBeLocalizedDir);
            }

            var translatedLanguageFile = path.join(translationsDir, language, "translation.csv");
            var toBeLocalizedFile = path.join(toBeLocalizedDir, "game_text.txt");
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

            // This will track labels that were not localized (added or updated since the translation file was sent)
            var missingLocalizedLabels = [];

            // These are the default indexes we want to look up;
            // however, they may be different if the translator inserted columns in the middle.
            // We'll parse the headers and get the correct values in a bit.
            var englishTextIndex = 0;
            var translatedTextIndex = 1;
            var guidIndex = 4;

            var isHeader = true;

            // For each line in the translation.csv file...
            translatedText.data.forEach(function(entry) {
                if (isHeader) {
                    // Get the indexes for the required columns from the header
                    englishTextIndex = entry.indexOf(translationHeaders[0][englishTextIndex]);
                    translatedTextIndex= entry.indexOf(translationHeaders[0][translatedTextIndex]);
                    guidIndex = entry.indexOf(translationHeaders[0][guidIndex]);
                    isHeader = false;
                    return;
                }

                // Get the GUIDs
                if (! entry[guidIndex]) {
                    // If the guids are null, there's an issue with this line in the translation file.
                    translationErrors.log(language, 'No GUIDs defined for the following English text - issue with translation file', entry[englishTextIndex]);
                    return;
                }
                var guids = entry[guidIndex].split(",");

                // For each guid, generate a localized label for that entry in the expected format
                guids.forEach(function(guid) {

                    // Check if the key appears as a localizationGoldKey
                    if (localizationGoldKeys[guid] != undefined) {
                        // If the key has already been seen, log that as a dupe
                        if(localizationGoldKeys[guid]) {
                            translationErrors.log(language, 'Duplicate GUID(s) (more than one entry for the same GUID in the translation.csv file)', guid);
                        }

                        // If the original label has been updated since the translation was sent, flag it for re-translation.
                        // NOTE: the translation could have a different newline char, so we standardize the newlines
                        if (this.localizationTable[guid][1].replace(/\s+/g, ' ').trim() !== entry[englishTextIndex].replace(/\s+/g, ' ').trim()) {
                            missingLocalizedLabels.push(guid);
                            translationErrors.log(language, 'Potential Translation Mismatch (English label has changed since last translation)  - see Proofread/MissingTranslations/' + language + '/translations.csv for translation file', guid);
                        }

                        // If the original label had a parameter (ex: {0}), make sure the translated label does too.
                        var originalLabelParams = entry[englishTextIndex].match(labelWithParamInputRegex);
                        if(originalLabelParams != null) {
                            originalLabelParams.sort();
                            var localizedlabelParams = entry[translatedTextIndex].match(labelWithParamInputRegex);
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
                                translationErrors.log(language, 'Mistranslated label - missing or unknown format params.  Expected the following params: ' + originalLabelParams, entry[translatedTextIndex] + " [Original: " + entry[englishTextIndex] + "]");
                            }
                        }

                        localizationGoldKeys[guid] = true;
                        toBeLocalized[guid] = [guid, entry[translatedTextIndex]];
                    } else {
                        // If this key is not a localization gold key...
                        translationErrors.log(language, 'Unknown GUID(s) - possibly removed from English master', guid);
                    }

                }, this);
            }, this);

            // Once we've built a table with all of the localized rows, 
            // write them to the localized file with the same ordering as the English file.
            for (var lgkIndex in localizationGoldKeyOrder) {
                var lgk = localizationGoldKeyOrder[lgkIndex];
                // If the key was missing in this language, add it to the list of missing keys
                if (! localizationGoldKeys[lgk]) {
                    missingLocalizedLabels.push(lgk);
                    translationErrors.log(language, 'Missing (untranslated) GUID(s) - see Proofread/MissingTranslations/' + language + '/translations.csv for translation file', lgk);
                }  else {
                    toBeLocalizedFileWriter.writeRecord([toBeLocalized[lgk]]);
                }
                // Reset the value for the next language
                localizationGoldKeys[lgk] = false;
            }
            toBeLocalizedFileWriter.end();

            // If there are missing localized labels, generate a mini translation file for them.
            if (missingLocalizedLabels.length > 0) {
                var missingTranslationsDir = path.join(context.internalDocOutputDirectory, 'MissingTranslations', language);
                fileSystem.makeDirectory(missingTranslationsDir);
                var missingTranslationsFile = path.join(missingTranslationsDir, 'translation.csv');
                var missingTranslationsWriter = CSVWriter.createFileWriter(missingTranslationsFile);
                missingTranslationsWriter.writeRecord(translationHeaders);

                var knownMissingText = {};

                for (var missingIndex in missingLocalizedLabels) {
                    // get the guid from missingLocalizedLabels
                    var missingGuid = missingLocalizedLabels[missingIndex];
                    // localizationTable uses [guid] as its index, returns [guid, text]
                    var missingVal = this.localizationTable[missingGuid];
                    // Get the text entry
                    var missingText = missingVal[1];
                    // Only add it to the table if we haven't seen it before, to avoid duplicate entries
                    if (! knownMissingText[missingText]) {
                        knownMissingText[missingText] = true;
                        // translationTable uses [text] as its index
                        missingTranslationsWriter.writeRecord([this.translationTable[missingText]]);
                    }
                }
                missingTranslationsWriter.end();
            }
        }, this);

        // Write the list of localized languages
        // localizedLanguageListWriter.end();

        translationErrors.write(context.reportsOutputDirectory);

        // Writing the gold file at the end so the copy will hopefully only kickoff after everything else has been written
        for (var lgkIndex in localizationGoldKeyOrder) {
            var lgk = localizationGoldKeyOrder[lgkIndex];
            enUsGoldFileWriter.writeRecord([this.localizationTable[lgk]]);
        }

        enUsGoldFileWriter.end();
    };

    ctor.prototype.parseLocalizationGroup = function(context, idMap, localizationGroup) {
        localizationGroup.entries.forEach(function(locEntry) {
            this.addLocalizationEntry(locEntry.id, locEntry.value, locEntry.notes);
        }, this);
    };

    ctor.prototype.parseScene = function(context, idMap, scene) {
        this.localize(context, scene, null);
    };

    ctor.prototype.parseActor = function(context, idMap, actor) {
        this.localize(context, actor, null);
    };
    
    ctor.prototype.parseStoryEvent = function(context, idMap, storyEvent) {
        this.localize(context, storyEvent, null);
    };
    
    ctor.prototype.parseProp = function(context, idMap, prop) {
        var friendlyIdOverride;
        if (prop.sceneId && null != prop.sceneId && '' != prop.sceneId) {
            friendlyIdOverride = idMap[prop.sceneId];
        } else {
            friendlyIdOverride =  'undefined';
        }
        friendlyIdOverride +=  '/' + prop.name;
        this.localize(context, prop, friendlyIdOverride, true);
    };
    
    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {
        this.localize(context, script);
    };

    ctor.prototype.finish = function(context, idMap) {
        this.generateOutput(context);
    };

    return new ctor();
});
