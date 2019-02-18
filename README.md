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
1. App/features/projectSelector/index.js (for default configurations / so other designres can configure it)
2. App/shell/toolbar.js (for the build)
3. Composer.bat (for the build)

All games should have a Composer subdirectory.

## Automated Builds

To run composer in automated builds, it's much like the same process, except you pass the game name in as a parameter.  (It will default to "heroU", aka "Rogue to Redemption").

ex: 
```
Composer.bat batchBuild heroU
```

The "valid" options are:
* [heroU](https://github.com/Transolar/Hero-U)
* [summerDaze](https://github.com/Transolar/SummerDaze)
* [r2rDemo](https://github.com/Transolar/R2R-Demo)
* [wizardsWay](https://github.com/Transolar/WizardWay)

### Open Source Licenses

* The JSON Serializer/Deserializer is an altered version of [fastJSON](http://www.codeproject.com/Articles/159450/fastJSON). License found [here](http://www.codeproject.com/info/cpol10.aspx)
* The CSV reader uses [A Fast CSV Reader](http://www.codeproject.com/Articles/9258/A-Fast-CSV-Reader). The license can be found [here](http://opensource.org/licenses/mit-license.php).
* The English language pluralization features come from [Inflector](https://github.com/srkirkland/Inflector). The license can be found [here](https://github.com/srkirkland/Inflector/blob/master/LICENSE.txt).
