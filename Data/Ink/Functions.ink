// ************************************************************************
// System: Actors
// ************************************************************************

// Potential emotions for talkers
LIST Moods = neutral, happy, sad, angry, surprised

// Cast of Characters
LIST Actors = Nobody, Terk, Gerhard, Silvia, Tilly, Mooella, Rodrigo, Fritz, Max, Kitty, Sitari, Ewe, Kalbin, Gregor

// Set some variables about the interlocutor
VAR speaker = Nobody
VAR speakerMood = neutral
VAR showSpeaker = false
VAR player = Tilly

// Keep track of the last character the player has meet, for Dining Hall events
VAR MetLast = Nobody
VAR MetPrev = Nobody

=== function Meet(Actor) ===
{
    - MetPrev != Actor && MetLast != Actor:
        ~ MetPrev = MetLast
        ~ MetLast = Actor
}

=== function ShowActor(name, mood) ===
		~ showSpeaker = true
    ~ speakerMood = mood
    ~ speaker = name
    >>> SHOWACTOR: {name}


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

=== function ShowJournalDetail(name) ===
		~ JournalCharacter = name
		~ JournalDetailOpen = 1

=== function HideJournalDetail(name) ===
		~ JournalDetailOpen = 0

// ************************************************************************
// System: Props
// ************************************************************************

// TODO: Generate this from the game
LIST Props = LibraryChair, SummerTable, WinterTable

=== function ShowProp(name) ===
		>>> SHOW: {name}


=== function HideProp(name) ===
		>>> HIDE: {name}

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

=== function AddReputation(ref reputation, amount) ===
    ~ reputation = reputation + amount

=== function RemoveReputation(ref reputation, amount) ===
    ~ reputation = reputation - amount

// ************************************************************************
// System: Rooms
// ************************************************************************

// In-Game Locations
LIST Rooms = _None, _Outside, Beach, Bedroom, Courtyard, DiningHall, ExerciseRoom, FestivalGrounds, Garden, Infirmary, Kitchen, Library, MagicClass, Overlook, PracticeField, RecRoom, RogueClass, Store, TillyBedroom, TowerGarden, WineCellar, Workshop

// The current location of the player. IMPORTANT; observed.
VAR currentRoom = _Outside

// Changes the scene. Corresponds to the node in Composer.
=== function ChangeScene(newScene) ===
    ~ currentRoom = newScene
    >>> CHANGESCENE

// ************************************************************************
// System: Skills
// ************************************************************************

VAR Smarts = 5
VAR Fitness = 4
VAR Charm = 6
VAR Skills = 5

=== function ImproveSkill(ref skill, amount) ===
	~ skill = skill + amount

// ************************************************************************
// System: Sound and Music
// ************************************************************************


// TODO: Read these from the game Resource folder
LIST MusicTracks = Silence, DiningHallTheme, Incidental2, MagicClassTheme, MiddleEastern, RogueClassTheme, SchoolBreak, StoreTheme, TowerGardenTheme, WIP5, WIP9, WIP12, WIP17, WIP19

LIST SoundClips = CardDeal, CardShuffleAndDeal, Click, DinnerBell, Placeholder, PoobahBet, PoobahFold, PoobahRaise, SleepStinger

VAR BackgroundMusicTrack = SchoolBreak

=== function PlayMusic(musicClip) ===
~ BackgroundMusicTrack = musicClip

=== function PlaySound(soundClip) ===
>>> SOUND: {soundClip}


// ************************************************************************
// System: Time
// ************************************************************************

LIST timeslots = Morning, Afternoon, Dinnertime, Evening, Bedtime

VAR day = 1
VAR time = Morning 

=== function AdvanceTime() ===
{ 
	- time == Morning:
	  ~ time = Afternoon
	- time == Afternoon:
	  ~ time = Evening
	- time == Evening:
		~ time = Bedtime
	- time == Bedtime:
	  ~ time = Morning
	  ~ day++
}