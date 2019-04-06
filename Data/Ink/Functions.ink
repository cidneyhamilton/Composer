// ************************************************************************
// System: Actors
// ************************************************************************

// Potential emotions for talkers
LIST Moods = neutral, happy, sad, angry, surprised

// Cast of Characters
LIST Actors = Nobody, Terk, Gerhard, Silvia, Ifeyo, Tilly, Mooella, Rodrigo, Fritz, Max, Kitty, Sitari, Ewe, Kalbin, Gregor

// Set some variables about the interlocutor
VAR speaker = Nobody
VAR speakerMood = neutral
VAR showSpeaker = false

=== function ShowActor(name, mood) ===
    ~ showSpeaker = true
    ~ speakerMood = mood
    ~ speaker = name

=== function HideActor(name) ===
    ~ showSpeaker = false
    ~ speaker = Nobody

// ************************************************************************
// System: Journal
// ************************************************************************

VAR JournalOpen = 0
VAR JournalDetailOpen = 0
VAR JournalCharacter = Nobody
VAR JournalButtonVisible = 0

=== function EnableJournalButton() ===
		~ JournalButtonVisible = 1

=== function ShowJournal() ===
		~ JournalOpen = 1

=== function HideJournal() ===
		~ JournalOpen = 0

=== function ShowJournalDetail(name) ==
		~ JournalCharacter = name
		~ JournalDetailOpen = 1

=== function HideJournalDetail(name) ==
		~ JournalDetailOpen = 0

// ************************************************************************
// System: Reputation
// ************************************************************************

VAR MooellaReputation = 10
VAR RodrigoReputation = -20
VAR FritzReputation = 50
VAR MaxReputation = 20
VAR KittyReputation = 20
VAR GerhardReputation = 20
VAR TerkReputation = 0
VAR SitariReputation = 20
VAR EweReputation = 20

=== function AddReputation(reputation, amount) ===
    ~ reputation = reputation + amount

=== function RemoveReputation(reputation, amount) ===
    ~ reputation = reputation - amount

// ************************************************************************
// System: Rooms
// ************************************************************************

// In-Game Locations
LIST Rooms = _None, _Outside, Beach, Bedroom, Courtyard, DiningHall, ExerciseRoom, FestivalGrounds, Garden, Infirmary, Kitchen, Library, MagicClass, Overlook, PracticeField, RecRoom, RogueClass, Store, TowerGarden, WineCellar, Workshop

// The current location of the player. IMPORTANT; observed.
VAR currentRoom = _Outside

// Changes the scene. Corresponds to the node in Composer.
=== function ChangeScene(newScene) ===
    ~ currentRoom = newScene
    >>> CHANGESCENE

// ************************************************************************
// System: Sound and Music
// ************************************************************************


// TODO: Read these from the game Resource folder
LIST MusicTracks = Silence, DiningHallTheme, Incidental2, MagicClassTheme, MiddleEastern, None, RogueClassTheme, SchoolBreak, StoreTheme, TowerGardenTheme

VAR BackgroundMusicTrack = SchoolBreak

=== function PlayMusic(musicTrack) ===
~ BackgroundMusicTrack = musicTrack


// ************************************************************************
// System: Time
// ************************************************************************

LIST timeslots = Morning, Afternoon, Evening

VAR day = 1
VAR time = Morning 

=== function AdvanceTime() ===
{ 
	- time == Morning:
	    ~ time = Afternoon
	- time == Afternoon:
	    ~ time = Evening
	- time == Evening:
	    ~ time = Morning
	    ~ day++
}