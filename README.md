# Composer

Composer is a standalone frontend for script writing, built on [Durandal](http://durandaljs.com/)

Release and testing platforms: Windows.

## Dependencies

NW.js . Use wine when running on Mac or Linux.

## Adding a New Game

When adding a new game for Composer loading, please update add the new game name to:
1. App/features/projectSelector/index.js (for default configurations / so other designers can configure it)
2. App/shell/toolbar.js (for the build)
3. Composer.bat (for the build)
4. The "Automated Builds" section below

All games should have a Composer subdirectory.

## Adding Resources for an Existing Game

All game-specific resources (music, movies, vignettes, sound effects, close ups, and languages) should be stored in the game's github repos (not in the standalone Composer's).  

To figure out where they should be placed:
1. Open Composer
2. Load your game in Composer
3. Go to the `Build Settings` tab for your game

### Adding New Music / Movie / Vignette / SoundEffect / CloseUp

These are stored in subdirectores of the `Data Output Directory` listed in your game's Composer `Build Settings`

* Music -> `Music` subdirectory
* Movies -> `Movies` subdirectory
* Vignettes -> `vignettes` subdirectory
* Sound Effects -> `SoundEffects` subdirectory
* Close Ups -> `CloseUps` subdirectory

Once you add the file, please reload your game in Composer.

### Adding a New Language

#### Send Labels out For Translation

The Composer build generates a single `translation.csv` file containing all labels / items which may need translation.  You can find this file by:

1. Do a Composer build for your selected game
2. Open your local computer's File Explorer
3. Go to the `Internal Translation Directory` listed in your game's Composer `Build Settings` (ex: `Hero-U/Translations` for Hero-U)
4. Go to the `Translations/en-US/` subdirectory (ex: `Hero-U/Translations/Translations/en-US` for Hero-U)
5. Send the `translation.csv` file there to a translator.

#### (Optional) Download Translations from Google Drive

If your translator has uploaded the file to Google Drive, you can download them in .csv (comma-separate-value) format:

1. Open the translation file in Google Drive
2. Click on the `File` option
3. Select `Download`
4. Select `Comma-Separated-Values (.csv)`
5. Save the file to a location on your hard drive
6. On your computer, open a file browser and go to the folder where you saved the file
7. Rename the file to `translation.csv`

#### Add the file to Composer

All translation files should be added to in subdirectories of the `Internal Translation Directory` listed in your game's Composer `Build Settings`. To support a new language:

1. Create a new folder / subdirectory in the `Internal Translation Directory` (Ex: `Hero-U\Translations\Translations`)
2. Name your new folder with the [IETF-compliant language tag](https://www.w3.org/International/questions/qa-choosing-language-tags) for your language.  (ex: Your new folder should be named `es` for Spanish, or `es-419` for Latin American Spanish.) 
3. Add the `translation.csv` file containing the translations for that language into your new directory
4. Reload your game in Composer
5. Rebuild Composer (this should generate the Unity-supported text for your new language).
6. Verify there are no errors in the `Proofread\Reports\badTranslations.txt` file
7. `git commit` the `translations.csv` and `game_text.txt` files for your new language

#### Updating labels for a language

If you've already created a translation, but then added new labels, you'll need to:

1. Reload your game in Composer
2. Rebuild Composer (this will generate a file for you in `Proofread\MissingTranslations\<locale>\translations.csv`)
3. Send the mini translations.csv file to your translators
4. Once it's translated, append the contents to the full translation.csv file for that language
5. Rebuild Composer to generate the Unity-supported text
6. Verify there are no errors in the `Proofread\Reports\badTranslations.txt` file
7. `git commit` the updated `translations.csv` and `game_text.txt` files for your language

### Defining Skills and Attributes in a new game

1. In Composer, load your game
1. Create a new 'Constant' object named 'SkillsAndStats'
1 (Optional, but recommended) create 4 entries for 'None', 'All', 'AllSkills', and 'AllStats', with a blank Category
1. Create your Stat / skill entries, updating the Category (to determine whether they should be skills or stats) appropriately.
1. Save
1. Reload Composer

After reloading, your new skills and stats should be accessible from any script / node which requires skills and stats!

### Defining the Inventory, Achievements, and Quests in a new game

1. In Composer, load your game
1. Create a scene named `_Inventory` (it will be picked up as the Inventory scene)
1. Create a scene named `_Achievements` (it will be picked up as the Achievements scene)
1. Create a scene named `_Tasks` (it will be picked up as the Quests scene)
1. Reload Composer

After reloading, all Composer elements (ex: isInInventory, HasQuest, HasAchievement, etc.) will automatically work!

## Automated Builds

To run composer in automated builds, it's much like the same process, except you pass the game name in as a parameter.  (It will default to "heroU", aka "Rogue to Redemption").

ex: 
```
Composer.bat batchBuild heroU
```

The "valid" options are:
* [heroU](https://github.com/Transolar/Hero-U)
* [SummerDazeF](https://github.com/Transolar/SummerDaze)
* [SummerDazeM](https://github.com/Transolar/SummerDaze)
* [wizardsWay](https://github.com/Transolar/WizardWay)

## Generating more code / documentation

The majority of the Composer "Build" logic is in App/features/build.  The runner is in runner.js, the configuration (default output directory configuration) is in buildConfig.js, although the per-user overrides are in Composer/Data/project.json.  

If you want to generate new code / data, take a look at App/features/build/data/generateAddlOutput (which lists all of the "processors" currently generating data") and at the App/features/build/data/processors subdirectory (which contains the "processing" logic for one or more files.  baseProcessor is the lowest-level object; take a look at the others for examples of how to extend them.  All c# template files are currently in features/build/unity3d/csharp.)

### Open Source Licenses

* The JSON Serializer/Deserializer is an altered version of [fastJSON](http://www.codeproject.com/Articles/159450/fastJSON). License found [here](http://www.codeproject.com/info/cpol10.aspx)
* The CSV reader uses [A Fast CSV Reader](http://www.codeproject.com/Articles/9258/A-Fast-CSV-Reader). The license can be found [here](http://opensource.org/licenses/mit-license.php).
* The English language pluralization features come from [Inflector](https://github.com/srkirkland/Inflector). The license can be found [here](https://github.com/srkirkland/Inflector/blob/master/LICENSE.txt).
