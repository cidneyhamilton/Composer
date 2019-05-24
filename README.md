# Composer

Composer is (now) a standalone(ish) frontend for Hero-U game design, built on Durandal.

Release and testing platforms: Windows, Mac, Linux

## Dependencies

These will need to be installed for everything else to work.

On Mac:
* [Node-Webkit](https://github.com/rogerwang/node-webkit/wiki/Downloads-of-old-versions) version 0.10.4 to run Composer on a Mac.

On Windows:
*  Node-Webkit version v0.8.0-rc1 is automatically provided by this repo (see; Platforms/Windows/nw.pak)

### Version Control

We use Git for version control and Github to host the code. You'll need to have LFS enabled for larger files.

On Mac:

1. Install [Homebrew](https://brew.sh/)
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
2. Install Git and Git LFS.
```
brew install git git-lfs
```

On Windows, download the LFS installer from the [official website](https://git-lfs.github.com/) and run it. Afterwards, run `git lfs install` in your git bash to activate it.

## Project Roadmap

We use [Github Issues](https://github.com/Transolar/Composer/issues) for bug tracking.

Technical discussions take place in the official [Slack channel](http://hero-u.slack.com), over email, and at weekly meetings.

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

These are stored in subdirectories of the `Internal Translation Directory` listed in your game's Composer `Build Settings`. To support a new language:

1. Create a new folder / subdirectory in the `Internal Translation Directory`.
2. Name your new folder with the [IETF-compliant language tag](https://www.w3.org/International/questions/qa-choosing-language-tags) for your language.  (ex: Your new folder should be named `es` for Spanish, or `es-419` for Latin American Spanish.) 
3. Add the `translation.csv` file containing the translations for that language into your new directory
4. Reload your game in Composer
5. Rebuild Composer (this should generate the Unity-supported text for your new language).

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
* [r2rDemo](https://github.com/Transolar/R2R-Demo)
* [wizardsWay](https://github.com/Transolar/WizardWay)

## Generating more code / documentation

The majority of the Composer "Build" logic is in App/features/build.  The runner is in runner.js, the configuration (default output directory configuration) is in buildConfig.js, although the per-user overrides are in Composer/Data/project.json.  

If you want to generate new code / data, take a look at App/features/build/data/generateAddlOutput (which lists all of the "processors" currently generating data") and at the App/features/build/data/processors subdirectory (which contains the "processing" logic for one or more files.  baseProcessor is the lowest-level object; take a look at the others for examples of how to extend them.  All c# template files are currently in features/build/unity3d/csharp.)

### Open Source Licenses

* The JSON Serializer/Deserializer is an altered version of [fastJSON](http://www.codeproject.com/Articles/159450/fastJSON). License found [here](http://www.codeproject.com/info/cpol10.aspx)
* The CSV reader uses [A Fast CSV Reader](http://www.codeproject.com/Articles/9258/A-Fast-CSV-Reader). The license can be found [here](http://opensource.org/licenses/mit-license.php).
* The English language pluralization features come from [Inflector](https://github.com/srkirkland/Inflector). The license can be found [here](https://github.com/srkirkland/Inflector/blob/master/LICENSE.txt).
