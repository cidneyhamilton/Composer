define(function(require) {
    var AssetIndex = require('./assetIndex'),
        ContentIndex = require('./ContentIndex'),
        ScriptEntry = require('./scriptEntry'),
        PropEntry = require('./propEntry'),
        Script = require('features/scripts/script'),
        Scene = require('features/scenes/scene'),
        Prop = require('features/props/prop'),
        StoryEvent = require('features/storyEvents/storyEvent'),
        Actor = require('features/actors/actor'),
        LocalizationGroup = require('features/localization/group'),
        Constant = require('features/constants/constant'),
        $ = require('jquery');

    return {
        musicTracks: new ContentIndex("Music"),
        movies : new ContentIndex("Movies"),
        vignettes: new ContentIndex("vignettes"),
        soundEffects: new ContentIndex("SoundEffects"),
	voiceClips: new ContentIndex("VoiceClips"),
        closeUps : new ContentIndex("CloseUps"),
        scenes: new AssetIndex("Scenes", Scene),
        actors: new AssetIndex("Actors", Actor),
        props: new AssetIndex("Props", Prop, PropEntry),
        storyEvents: new AssetIndex("Events", StoryEvent, null, 'StoryEvents', 'storyEvent'),
        scripts: new AssetIndex("Scripts", Script.New, ScriptEntry),
        localizationGroups: new AssetIndex("Localization Groups", LocalizationGroup),
        constants: new AssetIndex("Constants", Constant),
        load: function() {
            return $.when(
                this.musicTracks.load(),
                this.movies.load(),
                this.scenes.load(),
                this.actors.load(),
                this.props.load(),
                this.storyEvents.load(),
                this.scripts.load(),
                this.localizationGroups.load(),
                this.constants.load(),
                this.vignettes.load(),
                this.soundEffects.load(),
		this.voiceClips.load(),
                this.closeUps.load()
            );
        }
    };
});
